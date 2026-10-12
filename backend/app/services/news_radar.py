import hashlib
import re
import urllib.parse
from datetime import datetime
import feedparser
import httpx
from sqlalchemy.orm import Session
from app.models.entities import NewsArticle
from app.schemas.news import NewsIngestionTriggerResponse

# Authoritative upstream feeds (6 live reputable sources)
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
        "id": "src-arxiv-cl",
        "name": "arXiv Computation & Language (cs.CL)",
        "url": "https://rss.arxiv.org/rss/cs.CL",
        "tier": "Tier 1 (Peer/Preprint)",
        "default_category": "LLMs",
        "default_difficulty": "Deep Research"
    },
    {
        "id": "src-huggingface",
        "name": "Hugging Face Official Blog",
        "url": "https://huggingface.co/blog/feed.xml",
        "tier": "Tier 1 (Open Source Hub)",
        "default_category": "Open Source",
        "default_difficulty": "Applied Engineering"
    },
    {
        "id": "src-openai",
        "name": "OpenAI Official News",
        "url": "https://openai.com/news/rss.xml",
        "tier": "Tier 1 (Frontier Lab)",
        "default_category": "Model Releases",
        "default_difficulty": "Applied Engineering"
    },
    {
        "id": "src-google-ai",
        "name": "Google DeepMind & AI Blog",
        "url": "https://blog.google/technology/ai/rss/",
        "tier": "Tier 1 (Frontier Lab)",
        "default_category": "Model Releases",
        "default_difficulty": "Beginner Friendly"
    }
]

# Verified authoritative research & frontier releases
INITIAL_VERIFIED_NEWS = [
    {
        "id": "news-seed-deepseek-r1",
        "canonical_url": "https://arxiv.org/abs/2501.12948",
        "title": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
        "source": "arXiv cs.CL / DeepSeek-AI",
        "author": "DeepSeek-AI Research Team",
        "published_at": "2025-01-22",
        "category": "LLMs",
        "difficulty": "Deep Research",
        "summary_what": "DeepSeek-R1 demonstrates that pure large-scale Reinforcement Learning (GRPO) without supervised fine-tuning cold-start can spontaneously induce self-verification, reflection, and long chain-of-thought reasoning in LLMs.",
        "summary_new": "Introduces Group Relative Policy Optimization (GRPO) and releases open-weight distilled reasoning models from 1.5B to 70B parameters matching frontier reasoning benchmarks.",
        "summary_impact": "Democratizes test-time compute scaling and open-weight reasoning agents for mathematical, scientific, and software engineering workflows.",
        "summary_action": "Thực hành Lộ trình F (Kỹ thuật LLM & RAG) và Lộ trình G (MLOps) để triển khai các mô hình suy luận mở.",
        "claim_status": "VERIFIED"
    },
    {
        "id": "news-seed-qwen25-coder",
        "canonical_url": "https://arxiv.org/abs/2409.12186",
        "title": "Qwen2.5-Coder Technical Report: Code-Specific Pretraining and Synthetic Scaling",
        "source": "arXiv cs.SE / Alibaba Qwen Team",
        "author": "Binyuan Hui et al.",
        "published_at": "2024-11-12",
        "category": "Open Source",
        "difficulty": "Applied Engineering",
        "summary_what": "Qwen2.5-Coder series (1.5B to 32B) trained on 5.5 trillion tokens of repository-level source code, pull requests, and execution-verified synthetic code datasets.",
        "summary_new": "Achieves state-of-the-art open-weight coding performance on HumanEval, MBPP, and multi-language repo-level repair while preserving general math and RAG capabilities.",
        "summary_impact": "Enables local, privacy-preserving AI coding assistants and automated unit-test generation on single-GPU workstations.",
        "summary_action": "Ứng dụng trong Lộ trình B (Python Vectorization) và thực hành trực tiếp trong Monaco Lab của bài học.",
        "claim_status": "VERIFIED"
    },
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
        "summary_new": "Replaces evolutionary pair representation modules with an updated Pairformer and diffusion generative head, modeling atomic coordinates directly.",
        "summary_impact": "Dramatically accelerates rational drug discovery and molecular interaction modeling across complex cellular targets.",
        "summary_action": "Khám phá Lộ trình E (Deep Learning & Mạng Nơ-ron) để hiểu cơ chế biểu diễn phi tuyến đa tầng.",
        "claim_status": "VERIFIED"
    },
    {
        "id": "news-seed-3",
        "canonical_url": "https://huggingface.co/blog/smollm2",
        "title": "SmolLM2: When Small Language Models Meet High-Quality Curated Data",
        "source": "Hugging Face",
        "author": "Hugging Face Science Team",
        "published_at": "2024-11-04",
        "category": "Open Source",
        "difficulty": "Applied Engineering",
        "summary_what": "Hugging Face released the SmolLM2 family (135M, 360M, and 1.7B parameters), lightweight open-source models optimized for edge devices and fast local inference.",
        "summary_new": "Trained on curated educational web text and specialized math/code datasets (FineMath, Stack-Edu), outperforming prior sub-2B models.",
        "summary_impact": "Enables responsive on-device AI applications in browsers, mobile phones, and embedded systems with minimal RAM requirements.",
        "summary_action": "Xem Lộ trình G (Hệ thống AI & MLOps) để tính toán dung lượng VRAM và lượng tử hóa INT4.",
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
        "summary_what": "Gu and Dao introduced Mamba, a selective state space architecture that scales linearly O(N) with sequence length, addressing Transformer O(N²) attention bottlenecks.",
        "summary_new": "Incorporates input-dependent selection parameters and a hardware-aware parallel scan algorithm on GPU SRAM, achieving 5x throughput over standard Transformers.",
        "summary_impact": "Opens viable pathways for sub-quadratic sequence modeling in genomics, audio, and million-token document processing.",
        "summary_action": "Xem Lộ trình E & G để hiểu về băng thông bộ nhớ GPU (SRAM vs HBM) và độ trễ phục vụ.",
        "claim_status": "VERIFIED"
    }
]

def canonicalize_url(raw_url: str) -> str:
    """Strip tracking queries (utm_*, ref, etc.) and trailing slashes."""
    parsed = urllib.parse.urlparse(raw_url)
    clean_query = urllib.parse.parse_qs(parsed.query)
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
                resp = await client.get(src["url"], headers={"User-Agent": "TAILab-CHINAI-Radar/2.0"})
                if resp.status_code != 200:
                    errors.append(f"Source {src['name']} returned HTTP {resp.status_code}")
                    continue

                feed = feedparser.parse(resp.text)
                for entry in feed.entries[:12]:
                    fetched += 1
                    raw_link = entry.get("link", "")
                    if not raw_link:
                        continue

                    canonical = canonicalize_url(raw_link)
                    existing = db.query(NewsArticle).filter(NewsArticle.canonical_url == canonical).first()
                    if existing:
                        duplicates += 1
                        continue

                    raw_title = re.sub(r"\s+", " ", entry.get("title", "Untitled Research Paper")).strip()
                    raw_summary = entry.get("summary", "") or entry.get("description", "")
                    clean_summary = re.sub(r"<[^>]+>", "", raw_summary).strip()
                    clean_summary = re.sub(r"\s+", " ", clean_summary)
                    if not clean_summary:
                        clean_summary = raw_title

                    # Parse date cleanly into YYYY-MM-DD
                    pub_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
                    if pub_parsed:
                        try:
                            pub_date = f"{pub_parsed.tm_year:04d}-{pub_parsed.tm_mon:02d}-{pub_parsed.tm_mday:02d}"
                        except Exception:
                            pub_date = datetime.utcnow().strftime("%Y-%m-%d")
                    else:
                        pub_date = datetime.utcnow().strftime("%Y-%m-%d")

                    article_id = f"news-{hashlib.md5(canonical.encode()).hexdigest()[:10]}"
                    content_hash = compute_content_hash(raw_title + clean_summary)

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
                        published_at=pub_date,
                        category=src["default_category"],
                        difficulty=src["default_difficulty"],
                        summary_what=clean_summary[:450] + ("..." if len(clean_summary) > 450 else ""),
                        summary_new=f"Cập nhật trực tiếp từ nguồn chính thức {src['name']} ({src['tier']}).",
                        summary_impact="Đóng góp dữ liệu thực nghiệm, kiến trúc mô hình và phương pháp tối ưu hóa mới nhất cho cộng đồng AI.",
                        summary_action="Đối chiếu với các Lộ trình học trên T AIlab hoặc hỏi trực tiếp AI Agent ở góc phải màn hình để giải thích sâu hơn.",
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
