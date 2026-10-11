import hashlib
import re
import urllib.parse
from datetime import datetime
import feedparser
import httpx
from sqlalchemy.orm import Session
from app.models.entities import NewsArticle
from app.schemas.news import NewsArticleSchema, NewsIngestionTriggerResponse

# Authoritative upstream feeds
SOURCE_REGISTRY = [
    {
        "id": "src-arxiv-ai",
        "name": "arXiv AI (cs.AI)",
        "url": "https://rss.arxiv.org/rss/cs.AI",
        "tier": "Tier 1 (Peer/Preprint)",
        "default_category": "Research Breakthroughs",
        "default_difficulty": "Deep Research"
    },
    {
        "id": "src-arxiv-lg",
        "name": "arXiv Machine Learning (cs.LG)",
        "url": "https://rss.arxiv.org/rss/cs.LG",
        "tier": "Tier 1 (Peer/Preprint)",
        "default_category": "Research Breakthroughs",
        "default_difficulty": "Deep Research"
    },
    {
        "id": "src-huggingface",
        "name": "Hugging Face Blog",
        "url": "https://huggingface.co/blog/feed.xml",
        "tier": "Tier 1 (Ecosystem Hub)",
        "default_category": "Open Source",
        "default_difficulty": "Applied Engineering"
    }
]

# Verified baseline seed records to guarantee rich, source-grounded intelligence out of the box
INITIAL_VERIFIED_NEWS = [
    {
        "id": "news-seed-1",
        "canonical_url": "https://deepmind.google/discover/blog/alphafold-3-predicts-structure-and-interactions-of-all-lifes-molecules",
        "title": "AlphaFold 3 Predicts the Structure and Interactions of All Life's Molecules",
        "source": "Google DeepMind",
        "author": "DeepMind Biomolecular Research Team",
        "published_at": "2024-05-08",
        "category": "Research Breakthroughs",
        "difficulty": "Deep Research",
        "summary_what": "Google DeepMind and Isomorphic Labs announced AlphaFold 3, a diffusion-based model capable of predicting joint 3D structures of proteins, DNA, RNA, ligands, and chemical modifications.",
        "summary_new": "Replaces evolutionary pair representation modules with an updated Pairformer and diffusion generative head, modeling atomic coordinates directly instead of rotational frames.",
        "summary_impact": "Dramatically accelerates rational drug discovery and molecular interaction modeling across complex cellular targets.",
        "summary_action": "Explore Track E (Deep Learning: Sequence Models & Attention Mechanisms) to understand the underlying Pairformer architecture.",
        "claim_status": "VERIFIED"
    },
    {
        "id": "news-seed-2",
        "canonical_url": "https://openai.com/index/introducing-openai-o1",
        "title": "Learning to Reason with LLMs: Introduction to OpenAI o1",
        "source": "OpenAI",
        "author": "OpenAI Reasoning Research Team",
        "published_at": "2024-09-12",
        "category": "Model Releases",
        "difficulty": "Applied Engineering",
        "summary_what": "OpenAI released o1, a frontier model series trained with large-scale reinforcement learning to produce long internal chains of thought before outputting final answers.",
        "summary_new": "Shifts compute scaling from pre-training tokens to inference-time test compute. The model generates internal exploration, backtracking, and error correction steps.",
        "summary_impact": "Significantly outperforms prior models on competitive coding (Codeforces), Olympiad mathematics (AIME), and complex multi-step reasoning tasks.",
        "summary_action": "Study Track F (LLM Engineering: Prompting & Agent Workflows) to understand test-time compute scaling and reasoning traces.",
        "claim_status": "VENDOR_CLAIM"
    },
    {
        "id": "news-seed-3",
        "canonical_url": "https://huggingface.co/blog/smollm2",
        "title": "SmolLM2: When Small Language Models Meet High-Quality Synthetic Data",
        "source": "Hugging Face",
        "author": "Hugging Face Science Team",
        "published_at": "2024-11-04",
        "category": "Open Source",
        "difficulty": "Applied Engineering",
        "summary_what": "Hugging Face released the SmolLM2 family (135M, 360M, and 1.7B parameters), lightweight open-source models optimized for edge devices and fast local inference.",
        "summary_new": "Trained on heavily curated synthetic datasets and filtered educational web text, achieving benchmark parity with models 3x their parameter count.",
        "summary_impact": "Enables responsive on-device AI applications in browsers, mobile phones, and embedded robots with minimal RAM requirements.",
        "summary_action": "Check out Track G (AI Systems & MLOps: Serving & Latency Optimization) to test local quantization techniques.",
        "claim_status": "VERIFIED"
    },
    {
        "id": "news-seed-4",
        "canonical_url": "https://arxiv.org/abs/2312.00752",
        "title": "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
        "source": "arXiv cs.LG",
        "author": "Albert Gu, Tri Dao",
        "published_at": "2023-12-01",
        "category": "Research Breakthroughs",
        "difficulty": "Deep Research",
        "summary_what": "Gu and Dao introduced Mamba, a selective state space architecture that scales linearly \\(O(N)\\) with sequence length, addressing Transformer \\(O(N^2)\\) attention bottlenecks.",
        "summary_new": "Incorporates input-dependent selection parameters and a hardware-aware parallel scan algorithm on SRAM, achieving 5x throughput over standard Transformers on long contexts.",
        "summary_impact": "Opens viable pathways for sub-quadratic sequence modeling in genomics, audio, and ultra-long document processing.",
        "summary_action": "Review Track E (Deep Learning: Sequence Models & Attention Mechanisms) to compare quadratic attention vs linear recurrence.",
        "claim_status": "VERIFIED"
    }
]

def canonicalize_url(raw_url: str) -> str:
    """Strip tracking queries (utm_*, ref, etc.) and trailing slashes."""
    parsed = urllib.parse.urlparse(raw_url)
    clean_query = urllib.parse.parse_qs(parsed.query)
    # Remove tracking keys
    for k in list(clean_query.keys()):
        if k.startswith("utm_") or k in {"ref", "fbclid", "gclid", "source"}:
            del clean_query[k]

    new_query = urllib.parse.urlencode(clean_query, doseq=True)
    clean_path = parsed.path.rstrip("/")
    return urllib.parse.urlunparse((parsed.scheme, parsed.netloc.lower(), clean_path, parsed.params, new_query, ""))

def compute_content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def seed_verified_news(db: Session):
    for item in INITIAL_VERIFIED_NEWS:
        canonical_url = canonicalize_url(item["canonical_url"])
        existing = db.query(NewsArticle).filter(NewsArticle.canonical_url == canonical_url).first()
        if not existing:
            article = NewsArticle(
                id=item["id"],
                canonical_url=canonical_url,
                title=item["title"],
                source=item["source"],
                author=item["author"],
                published_at=item["published_at"],
                category=item["category"],
                difficulty=item["difficulty"],
                summary_what=item["summary_what"],
                summary_new=item["summary_new"],
                summary_impact=item["summary_impact"],
                summary_action=item["summary_action"],
                claim_status=item["claim_status"],
                content_hash=compute_content_hash(item["title"] + item["summary_what"]),
                bookmarked=False
            )
            db.add(article)
    db.commit()

async def ingest_upstream_feeds(db: Session) -> NewsIngestionTriggerResponse:
    fetched = 0
    persisted = 0
    duplicates = 0
    errors = []

    for src in SOURCE_REGISTRY:
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                resp = await client.get(src["url"], headers={"User-Agent": "AILearningOS-Ingestor/1.0"})
                if resp.status_code != 200:
                    errors.append(f"Source {src['name']} returned HTTP {resp.status_code}")
                    continue

                feed = feedparser.parse(resp.text)
                for entry in feed.entries[:10]:  # Inspect top 10 items per feed
                    fetched += 1
                    raw_link = entry.get("link", "")
                    if not raw_link:
                        continue

                    canonical = canonicalize_url(raw_link)
                    # Check URL deduplication
                    existing = db.query(NewsArticle).filter(NewsArticle.canonical_url == canonical).first()
                    if existing:
                        duplicates += 1
                        continue

                    raw_title = entry.get("title", "Untitled Research Paper")
                    raw_summary = entry.get("summary", "")
                    # Strip HTML tags from summary
                    clean_summary = re.sub(r"<[^>]+>", "", raw_summary).strip()
                    if not clean_summary:
                        clean_summary = raw_title

                    # Date normalization
                    pub_date = entry.get("published", "") or datetime.utcnow().strftime("%Y-%m-%d")

                    article_id = f"news-{hashlib.md5(canonical.encode()).hexdigest()[:10]}"
                    content_hash = compute_content_hash(raw_title + clean_summary)

                    # Deduplication by content hash
                    hash_existing = db.query(NewsArticle).filter(NewsArticle.content_hash == content_hash).first()
                    if hash_existing:
                        duplicates += 1
                        continue

                    new_record = NewsArticle(
                        id=article_id,
                        canonical_url=canonical,
                        title=raw_title,
                        source=src["name"],
                        author=entry.get("author", src["name"]),
                        published_at=pub_date[:10],
                        category=src["default_category"],
                        difficulty=src["default_difficulty"],
                        summary_what=clean_summary[:400] + ("..." if len(clean_summary) > 400 else ""),
                        summary_new="New preprint/release ingested directly from official feed.",
                        summary_impact="Contributes to advancing models and applied engineering methodologies.",
                        summary_action="Reference relevant platform curriculum tracks to test or build on these concepts.",
                        claim_status="VERIFIED" if "arxiv" in src["id"] else "VENDOR_CLAIM",
                        content_hash=content_hash,
                        bookmarked=False
                    )
                    db.add(new_record)
                    persisted += 1

                db.commit()

        except Exception as e:
            errors.append(f"Failed to fetch {src['name']}: {str(e)}")

    return NewsIngestionTriggerResponse(
        articles_fetched=fetched,
        new_articles_persisted=persisted,
        duplicates_skipped=duplicates,
        sources_polled=len(SOURCE_REGISTRY),
        errors=errors
    )
