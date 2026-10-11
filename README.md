# T AIlab — CHINAI AI Learning Operating System (v2.0.0)

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/tranquangthanh3062004/T-AIlab)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.143-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Pytest-14%2F14%20Passing-10B981)](docs/TESTING.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **"Học AI từ số 0. Xây dựng hệ thống AI thực chiến. Cập nhật nhịp đập nghiên cứu toàn cầu."**  
> *"Learn AI from zero. Build real AI systems. Stay current with the global AI ecosystem."*

**T AIlab (CHINAI — AI Learning OS)** is a production-grade AI education platform, professional IDE engineering workspace, and source-grounded AI research intelligence system. Designed to bridge the gap between passive video courses and enterprise AI engineering, it unifies pedagogical scaffolding, interactive mathematical simulations, an AST-firewalled Python execution sandbox, and citation-verified RAG tutoring.

---

## 🏛️ System Architecture

```
                                  ┌─────────────────────────────────────────┐
                                  │       Client Tier (Browser / SPA)       │
                                  │   React 19 + TypeScript + Vite 8.3      │
                                  ├────────────────────┬────────────────────┤
                                  │     Learn Mode     │   Engineer Mode    │
                                  │  - 7 Core Tracks   │  - Monaco Editor   │
                                  │  - Formula Guides  │  - Multi-File Tree │
                                  │  - 2D Simulators   │  - Dataset Inspect │
                                  │  - Quiz & Exercises│  - Experiments Run │
                                  ├────────────────────┴────────────────────┤
                                  │  Shared App Context & i18n Localization │
                                  │  - Streaks 🔥, XP ⚡, Level Tiers 🏆    │
                                  │  - Instant [VI / EN] & Dark Mode Toggle │
                                  └────────────────────┬────────────────────┘
                                                       │ JSON over HTTP (REST)
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │       API Gateway & Application Server  │
                                  │             FastAPI 0.143 + Python 3.13 │
                                  ├─────────────────────────────────────────┤
                                  │  - /api/learn     (Curriculum & Quiz)   │
                                  │  - /api/execution (AST Sandbox Runner)  │
                                  │  - /api/workspace (Projects & Datasets) │
                                  │  - /api/news      (Radar & Ingestion)   │
                                  │  - /api/tutor     (RAG Retrieval)       │
                                  │  - /api/health    (System Telemetry)    │
                                  └───────┬─────────────────────────┬───────┘
                                          │                         │
                                          ▼                         ▼
                  ┌───────────────────────────────┐ ┌───────────────────────────────┐
                  │    Sandboxed Execution Runner │ │      Persistence Layer        │
                  │  - Python AST Static Scanner  │ │  SQLAlchemy ORM + SQLite 3    │
                  │  - Subprocess Watchdog (5.0s) │ │  File: data/platform.db       │
                  │  - Banned Syscall Boundary    │ │  - learner_profiles, progress │
                  │  - Faithful stdout/stderr     │ │  - projects, news, experiments│
                  └───────────────────────────────┘ └───────────────────────────────┘
```

---

## ✨ Core Pillars & Key Features

### 1. 🎓 Pillar 1: Learn Mode (Beginner-Friendly AI Education)
- **7 Comprehensive Curriculum Tracks:**
  1. `Track A`: AI Foundations (Paradigms, Generalization, Overfitting)
  2. `Track B`: Python for AI & Numerical Computing (Vectorization, SIMD)
  3. `Track C`: Mathematics for AI (Vectors, Calculus, Gradient Descent)
  4. `Track D`: Classical Machine Learning (Decision Trees, Shannon Entropy)
  5. `Track E`: Deep Learning & Neural Architectures (Perceptrons, ReLU, Sigmoid, GELU)
  6. `Track F`: LLM Engineering (Embeddings, Vector Search, Cosine Similarity, RAG)
  7. `Track G`: AI Systems & MLOps (P99 Tail Latency, Throughput, Quantization)
- **Mathematical Formula Scaffolding (`FormulaGuide`):** Every equation is unpacked into standardized mathematical notation, intuitive plain-language meaning, an interactive symbol-by-symbol breakdown table, and a concrete numerical walkthrough.
- **Interactive 2D HTML5 Canvas Simulators:** Real-time Perceptron decision boundary explorer and Gradient Descent loss landscape visualizer.
- **Duolingo-Style Gamification:** Daily streaks 🔥, XP points ⚡, 5 progression tiers 🏆, and achievement badges.

### 2. 💻 Pillar 2: Engineer Workspace (Developer IDE)
- **VS Code-Grade Monaco Editor:** Multi-tab file editing, syntax highlighting, dirty-state tracking, automatic light/dark theme synchronization, and keyboard shortcuts (`Ctrl+Enter` to run, `Ctrl+S` to save).
- **Quick ML Code Snippets:** One-click templates for Linear Regression MSE, Shannon Entropy, and Vector Cosine Similarity.
- **AST-Firewalled Python Sandbox:** Static Abstract Syntax Tree (`ast.NodeVisitor`) inspection blocks dangerous imports (`os`, `sys`, `subprocess`, `socket`, `shutil`, `ctypes`) and introspection escapes (`__subclasses__`, `eval`, `exec`) before spawning isolated worker processes with a strict 5.0-second CPU watchdog.
- **Dataset Inspector & Experiment Tracker:** Tabular CSV profiler with column statistics and hyperparameter/metric run logging.

### 3. 📡 Pillar 3: AI News Radar & Context-Grounded AI Tutor
- **Source-Verified Research Intelligence:** Automated RSS/REST ingestion from arXiv (`cs.AI`, `cs.LG`), OpenAI, Google DeepMind, and Hugging Face Daily Papers.
- **Deduplication Pipeline:** Canonical URL normalization (stripping UTM parameters) and deterministic SHA-256 content hashing.
- **Claim Transparency Tags:** Every record is classified as `PEER_REVIEWED`, `PREPRINT`, or `VENDOR_CLAIM`.
- **Citation-Grounded RAG Tutor:** BM25-style retrieval over verified lessons and news records with strict XML prompt-injection boundaries and zero hallucinated external links.

### 4. 🌐 Bilingual UX & Calming Design System
- **Strict Language Separation (`i18n`):** Vietnamese-first interface with instant `[VI / EN]` switching while preserving global technical nomenclature.
- **Educational Pastel Palette & Class-Based Dark Mode:** WCAG 2.1 AA compliant contrast designed for long study sessions.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python:** 3.11+ (Tested on Python 3.13)
- **Node.js:** 18+ LTS & npm

### 1. Start the Backend Server
```bash
cd backend
python -m venv ../venv
# Windows PowerShell:
..\venv\Scripts\pip install -r requirements.txt
$env:PYTHONPATH="."; ..\venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your browser.

---

## 🧪 Running Tests & Verification

### Backend Automated Test Suite (Pytest)
```bash
cd backend
..\venv\Scripts\python -m pytest -o pythonpath=. -v
```
*All 14 unit, integration, and security sandbox tests pass in ~2.6s.*

### Frontend Typecheck & Production Build
```bash
cd frontend
npm run build
```

---

## 📚 Engineering Documentation Suite

All architectural, product, security, and operational specifications are maintained in [`docs/`](docs/):

| Document | Description |
| :--- | :--- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Full system topology, layered architecture, and database ER schema |
| [`docs/PRODUCT_REQUIREMENTS.md`](docs/PRODUCT_REQUIREMENTS.md) | Product Requirements Document (PRD), personas, and functional specs |
| [`docs/SECURITY.md`](docs/SECURITY.md) | STRIDE threat model, AST sandbox rules, and prompt injection defenses |
| [`docs/TESTING.md`](docs/TESTING.md) | Test pyramid, 14 automated test cases, and QA verification commands |
| [`docs/PRODUCTION_READINESS.md`](docs/PRODUCTION_READINESS.md) | Release Gate evaluation (Gates A–H) and production deployment runbook |
| [`docs/COMPETITIVE_BENCHMARK.md`](docs/COMPETITIVE_BENCHMARK.md) | Benchmark against Duolingo, Khan Academy, DeepLearning.AI, HF, Kaggle |
| [`docs/FEATURE_INVENTORY.md`](docs/FEATURE_INVENTORY.md) | Complete inventory of all 29 implemented features and API endpoints |
| [`docs/FEATURE_GAP_MATRIX.md`](docs/FEATURE_GAP_MATRIX.md) | Feature gap analysis and P0/P1/P2 roadmap prioritization |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | 10-phase engineering roadmap from baseline audit to v3.0 cloud scale |
| [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) | Upstream RSS/API feed catalog, deduplication pipeline, and datasets |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Architectural Decision Records (ADR-001 through ADR-008) |
| [`docs/BASELINE_RESULTS.md`](docs/BASELINE_RESULTS.md) | Baseline audit metrics and defect resolution log (Bugs B1–B9) |
| [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md) | Transparent disclosure of sandbox, concurrency, and scope boundaries |

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
