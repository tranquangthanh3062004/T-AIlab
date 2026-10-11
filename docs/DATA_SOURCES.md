# External Data Sources & Ingestion Catalog — CHINAI AI Learning OS

**Document Version:** 2.0.0 (Production Release)  
**Status:** Approved Reference  
**Audience:** Information Retrieval Engineers, Data Engineers, AI Researchers  

---

## 1. Data Ecosystem Overview

CHINAI maintains a source-grounded intelligence network connecting learners and engineers directly to verifiable research preprints, peer-reviewed publications, and official industry releases.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        External Upstream Feeds                         │
│  ┌───────────────┐ ┌────────────────┐ ┌───────────────┐ ┌────────────┐ │
│  │ arXiv AI Feed │ │ OpenAI RSS     │ │ DeepMind RSS  │ │ HF Papers  │ │
│  │ (cs.AI/cs.LG) │ │ (Research Blog)│ │ (Blog / Press)│ │ (Daily API)│ │
│  └───────┬───────┘ └───────┬────────┘ └───────┬───────┘ └─────┬──────┘ │
└──────────┼─────────────────┼──────────────────┼───────────────┼────────┘
           │                 │                  │               │
           ▼                 ▼                  ▼               ▼
┌────────────────────────────────────────────────────────────────────────┐
│               CHINAI News Ingestion & Normalization Pipeline           │
│  1. Ingestion Worker: Async HTTP fetch with 10s timeout & user-agent   │
│  2. URL Canonicalization: Strip tracking parameters (UTM, ref, fbclid) │
│  3. SHA-256 Content Hashing: Hash normalized title + abstract          │
│  4. Deduplication Engine: Reject duplicate URLs or identical hashes    │
│  5. Claim Categorization: Assign PEER_REVIEWED / PREPRINT / CLAIM      │
│  6. Database Persistence: Write to news_articles table in SQLite       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Consumer Subsystems                             │
│  ┌───────────────────────────────────┐ ┌─────────────────────────────┐ │
│  │ Radar tin tức AI (News Radar View)│ │ Gia sư AI (Tutor RAG Corpus)│ │
│  └───────────────────────────────────┘ └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Upstream Feed Inventory

| Source Identifier | Source Organization | Upstream Endpoint / Protocol | Category Tag | Default Claim Classification | Update Frequency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `arxiv-cs-ai` | arXiv.org (Cornell University) | `https://export.arxiv.org/rss/cs.AI` (RSS 2.0) | Nghiên cứu (Research) | `PREPRINT` | Every 6 hours |
| `arxiv-cs-lg` | arXiv.org (Cornell University) | `https://export.arxiv.org/rss/cs.LG` (RSS 2.0) | Nghiên cứu (Research) | `PREPRINT` | Every 6 hours |
| `openai-news` | OpenAI | `https://openai.com/news/rss.xml` (RSS 2.0) | Công nghiệp (Industry) | `VENDOR_CLAIM` | Every 12 hours |
| `deepmind-blog` | Google DeepMind | `https://deepmind.google/blog/rss.xml` (RSS 2.0) | Công nghiệp (Industry) | `VENDOR_CLAIM` | Every 12 hours |
| `hf-papers` | Hugging Face | `https://huggingface.co/api/daily_papers` (REST) | Mã nguồn mở (Open Source) | `PEER_REVIEWED` / `PREPRINT` | Daily |

---

## 3. Data Processing & Pipeline Stages

### 3.1 Stage 1: Resilient Asynchronous Ingestion
- Ingestion occurs asynchronously via `httpx.AsyncClient` with an explicit 10.0-second timeout.
- Failures or timeouts on any single external upstream provider do not interrupt the ingestion of remaining feeds.

### 3.2 Stage 2: Canonical URL Normalization
To prevent duplicate stories from different referrers or tracking parameters:
- Query parameters matching `utm_*`, `ref`, `source`, `fbclid`, `gclid` are stripped.
- Trailing slashes are stripped.
- Scheme and hostname are normalized to lowercase.
- *Verified in `tests/test_news_radar.py::test_canonicalize_url_strips_tracking`*.

### 3.3 Stage 3: Cryptographic Content Hashing (SHA-256)
- Normalized title and content strings are hashed: `hashlib.sha256(f"{norm_title}|{norm_content}".encode('utf-8')).hexdigest()`.
- If an article's canonical URL or content hash exists in the database, the record is discarded as a duplicate.
- *Verified in `tests/test_news_radar.py::test_content_hash_deterministic`*.

### 3.4 Stage 4: Claim Verification & Transparency Tagging
To prevent misinformation, every article is marked with an unambiguous claim tag:
- **`PEER_REVIEWED`**: Formally published in peer-reviewed conferences/journals (NeurIPS, ICML, ICLR, CVPR).
- **`PREPRINT`**: Uploaded to arXiv or open repositories without formal peer review.
- **`VENDOR_CLAIM`**: Published by corporate research labs (OpenAI, DeepMind, Anthropic, Meta) regarding their proprietary models.

---

## 4. Curated Datasets in Engineer Workspace

To ensure beginners can practice exploratory data analysis without uploading large files, the Engineer Workspace includes curated lightweight CSV datasets:

| Dataset Name | Filename | Rows | Columns | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Iris Flower Dataset** | `iris.csv` | 150 | 5 (`sepal_length`, `sepal_width`, `petal_length`, `petal_width`, `species`) | Multiclass classification & feature visualization |
| **Housing Regression** | `california_housing.csv` | 500 | 6 (`MedInc`, `HouseAge`, `AveRooms`, `AveOccup`, `Latitude`, `MedHouseValue`) | Linear regression & metric evaluation |
| **Binary Classification** | `synthetic_binary.csv` | 200 | 3 (`feature_x1`, `feature_x2`, `label`) | Decision boundary & Perceptron testing |

---

## 5. Data Privacy & Retention Policy

1. **No Learner Telemetry Sent to Third Parties:** Student code, quiz scores, and streak data remain entirely inside the local SQLite database.
2. **Zero Commercial Tracking:** Ingested articles strip all tracking beacons and third-party advertising cookies.
3. **Storage Retention:** The `news_articles` table maintains a rolling window of the 1,000 most recent articles to prevent unbounded growth in SQLite.
