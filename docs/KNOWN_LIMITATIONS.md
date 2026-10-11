# Known Limitations & Architectural Boundaries — CHINAI AI Learning OS

**Document Version:** 2.0.0 (Production Release)  
**Status:** Approved Reference  
**Audience:** System Architects, Operations, Product Management  

---

## 1. Scope & Transparency Statement

Production excellence requires complete honesty regarding architectural boundaries, deliberate trade-offs, and known technical limitations. This document records all known boundaries in **CHINAI 2.0.0** to guide operators, educators, and future contributors.

---

## 2. Code Execution Sandbox Boundaries

### 2.1 Single-Script Pure Python Computation
- **Limitation:** The execution sandbox executes single-file Python scripts (`main.py`). It is designed for algorithmic learning, mathematical derivations, NumPy/data structures logic, and model training simulations.
- **Design Trade-Off:** Arbitrary bash execution (`pip install`, `apt-get`, `curl`) and root filesystem modifications are strictly forbidden by our AST security scanner.
- **Guidance for Users:** Users who wish to train massive multi-billion parameter foundation models or use multi-node GPU clusters should export their project code to Google Colab, RunPod, or local GPU workstations.

### 2.2 CPU-Only Local Execution (No Hardware GPU Acceleration)
- **Limitation:** Subprocess execution utilizes host CPU cores. There is no direct CUDA/GPU passthrough into the sandbox process.
- **Design Trade-Off:** Prevents runaway GPU memory allocation, cuda driver crashes, and prohibitive cloud infrastructure costs for free tier learners.
- **Guidance for Users:** All 7 curriculum tracks are calibrated to run lightweight numerical simulations (e.g. 50-epoch perceptrons or 100-step gradient descent) that complete in under 500ms on modern CPUs.

### 2.3 Strict Execution Watchdog (5.0s Timeout)
- **Limitation:** Any process running longer than 5.0 seconds is terminated by `process.kill()`.
- **Design Trade-Off:** Necessary to prevent infinite loops (`while True: pass`) from exhausting host CPU cycles.

---

## 3. AI Tutor & Retrieval Boundaries

### 3.1 Lexical & Keyword Grounding (BM25-Style)
- **Limitation:** The default out-of-the-box AI Tutor utilizes deterministic token and keyword matching against the platform curriculum and news database rather than heavy 1536-dimensional semantic vector embeddings.
- **Design Trade-Off:** Eliminates the requirement for heavy vector database daemons (Milvus, Qdrant) and external embedding API costs, ensuring the platform runs self-contained on low-cost hardware.
- **Guidance for Users:** Semantic vector search with local ChromaDB is scheduled for release v2.5.

### 3.2 Citation Boundary
- **Limitation:** The AI Tutor only cites internally verified lesson IDs and news records. If a user asks general questions completely outside computer science and AI (e.g. world history or baking recipes), the tutor declines to answer or flags low confidence.
- **Design Trade-Off:** Deliberate anti-hallucination guardrail prioritizing accuracy over unbounded chatter.

---

## 4. Persistence & Database Concurrency Boundaries

### 4.1 SQLite Single-Writer Lock Concurrency
- **Limitation:** The persistence layer runs on SQLite (`data/platform.db`). SQLite supports unlimited concurrent readers via WAL mode, but only one concurrent writer process.
- **Design Trade-Off:** Zero installation complexity and instant portability across developer laptops and lightweight VPS instances.
- **Guidance for Operators:** For deployments supporting > 500 concurrent active users writing simultaneously, operators should point SQLAlchemy's connection string to PostgreSQL (`postgresql+asyncpg://...`).

### 4.2 Authentication Scoping
- **Limitation:** CHINAI 2.0 defaults to a single-tenant local-first profile (`default-learner`) synchronized across browser sessions via UUID.
- **Design Trade-Off:** Allows immediate, frictionless onboarding with zero sign-up barrier or password requirements.
- **Guidance for Operators:** Full OAuth2 social sign-in (Google, GitHub) is scheduled for release v2.5.

---

## 5. Viewport & Responsive Design Boundaries

### 5.1 Engineer Workspace Screen Dimensions
- **Limitation:** While Learn Mode, News Radar, Diagnostic Assessment, and Tutor are fully responsive down to mobile viewports (375px), the Engineer Workspace (Monaco Editor + File Tree + Execution Console) is optimized for viewport widths $\ge 768\text{px}$ (tablets and desktops).
- **Design Trade-Off:** Professional IDE ergonomics (side-by-side file trees, code editors, and terminal consoles) cannot be compressed into narrow phone screens without destroying usability.
- **Guidance for Users:** Mobile users are encouraged to study lessons, review formulas, and complete quizzes in Learn Mode, while reserving practical coding for tablet or laptop screens.
