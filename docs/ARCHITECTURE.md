# System Architecture Document — CHINAI AI Learning OS

**Document Version:** 2.0.0 (Production Release)  
**Status:** Approved Architectural Blueprint  
**Lead Architect:** Principal Software Architect & Senior Full-Stack Engineer  

---

## 1. System Topology Overview

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
                                  │  - Instant [VI / EN] Language Switcher  │
                                  └────────────────────┬────────────────────┘
                                                       │ JSON over HTTP (REST)
                                                       ▼ Vite Proxy :5173 → :8000
                                  ┌─────────────────────────────────────────┐
                                  │       API Gateway & Application Server  │
                                  │             FastAPI 0.143 + Python 3.13 │
                                  ├─────────────────────────────────────────┤
                                  │  5 Modular API Routers:                 │
                                  │  - /api/learn     (Curriculum & Quiz)   │
                                  │  - /api/execution (AST Sandbox Runner)  │
                                  │  - /api/workspace (Projects & Datasets) │
                                  │  - /api/news      (Radar & Ingestion)   │
                                  │  - /api/tutor     (RAG Retrieval)       │
                                  │  - /api/health    (System Telemetry)    │
                                  ├─────────────────────────────────────────┤
                                  │  Service Business Logic Layer:          │
                                  │  - CurriculumService (Pedagogy & Math)  │
                                  │  - ExecutionService (AST Inspection)    │
                                  │  - NewsRadarService (Deduplication)     │
                                  │  - TutorService (Citations & Guardrails)│
                                  │  - WorkspaceService (File Templates)    │
                                  └───────┬─────────────────────────┬───────┘
                                          │                         │
                                          ▼                         ▼
                  ┌───────────────────────────────┐ ┌───────────────────────────────┐
                  │    Sandboxed Execution Runner │ │      Persistence Layer        │
                  │  - Python AST Scanner         │ │  SQLAlchemy ORM + SQLite 3    │
                  │  - Subprocess Watchdog (5s)   │ │  File: data/platform.db       │
                  │  - Banned Syscall Boundary    │ │  - learner_profiles           │
                  │  - Temp Directory Sandbox     │ │  - user_progress              │
                  │  - Faithful stdout/stderr     │ │  - workspace_projects         │
                  └───────────────────────────────┘ │  - project_files              │
                                                    │  - news_articles              │
                                                    │  - experiment_runs            │
                                                    └───────────────────────────────┘
```

---

## 2. Frontend Layer Architecture (`frontend/src/`)

### 2.1 Component & View Hierarchy
- **`App.tsx`:** Top-level view router and provider wrapper. Renders `Header` and the active view according to state (`home`, `learn`, `lesson`, `diagnostic`, `workspace`, `datasets`, `news`, `tutor`).
- **`Header.tsx`:** Persistent navigation bar with:
  - CHINAI 2.0 branding and subtitle
  - Mode navigation buttons (Học tập, Không gian kỹ sư, Thanh tra dữ liệu, Radar tin tức, Gia sư AI)
  - Gamification metrics widget (Daily Streak 🔥, Total XP ⚡, Level Tier badge 🏆)
  - Language toggle pill `[VI / EN]`
- **`FormulaGuide.tsx`:** Modular pedagogical component that renders mathematical equations broken down into equation badges, objective statements, variable tables, and step-by-step arithmetic walkthroughs.
- **`PerceptronWidget.tsx` & `GradientDescentWidget.tsx`:** 2D HTML5 canvas interactive visual simulation engines with zero external heavy dependencies.
- **`WorkspaceView.tsx`:** Monaco editor integration with project tabs, extension-aware file creation, and execution console.

### 2.2 Localization & State Architecture
- **`services/i18n.ts`:** Strongly typed dictionary for Vietnamese (`vi`) and English (`en`). Contains exact translations for all UI keys, descriptions, formula headers, and gamification tiers.
- **`context/AppContext.tsx`:** React Context managing:
  - Active language (`vi` / `en`) with automatic synchronization to `localStorage('chinai_lang')`.
  - Translation helper `t(key, params)`.
  - User profile, streak counters, XP points, and level badges.
  - Active lesson selection and workspace file state preservation across tab navigation.

---

## 3. Backend Layer Architecture (`backend/app/`)

### 3.1 API Routing Layer (`backend/app/api/`)
All API endpoints follow RESTful design and validate payloads through strict Pydantic schemas:
- **`/api/health`:** Liveness and readiness probe returning service name, status, and version.
- **`/api/learn/`:**
  - `GET /tracks`: Returns 7 curriculum tracks with module and lesson trees.
  - `GET /lessons/{lesson_id}`: Returns complete lesson theory, prerequisites, formula guide, and practice quiz.
  - `POST /quiz/submit`: Scores student quiz responses deterministically and updates XP/streak.
  - `POST /exercise/pass`: Validates code exercise completion against hidden assertion test cases.
  - `GET /progress`: Retrieves user progress, completed lesson IDs, XP, and streak.
  - `GET /diagnostic/questions` & `POST /diagnostic/submit`: Placement testing.
- **`/api/execution/run`:** Executes arbitrary Python code within the AST sandbox runner.
- **`/api/workspace/`:** Project and file listing, CSV dataset summary stats, and experiment runs.
- **`/api/news/`:** Articles listing, bookmarking, and upstream feed ingestion.
- **`/api/tutor/query`:** Context-grounded RAG query answering with verified citations.

### 3.2 Service Layer & Core Business Logic (`backend/app/services/`)
- **`curriculum.py`:**
  - Defines the 7 curriculum tracks: Foundations, Python, Math, Machine Learning, Deep Learning, LLM Engineering, MLOps.
  - Enriches every mathematical lesson with a structured `FormulaGuide` object containing equations, objectives, symbol tables, and arithmetic walkthroughs.
  - Implements streak logic: checks `last_active_date`, increments streak if consecutive day, resets if broken, awards XP bonuses.
- **`execution.py`:**
  - Implements `SafeExecutionService` with two-stage security:
    1. **Static AST Analysis (`SecurityScanner`):** Walks the Python Abstract Syntax Tree to reject banned modules (`os`, `sys`, `subprocess`, `socket`, `shutil`, `ctypes`, `builtins`), dynamic execution calls (`eval`, `exec`), and class introspection exploits (`__subclasses__`).
    2. **Isolated Subprocess Execution:** Spawns a temporary isolated worker process with a 5.0-second CPU watchdog timeout and 64 KB output buffer.
- **`news_radar.py`:**
  - Ingests feeds from arXiv AI, OpenAI, DeepMind, and Hugging Face.
  - Normalizes URLs (removes UTM parameters, lowercase canonicalization) and hashes content via SHA-256 for duplicate elimination.
  - Tags articles with verified claim status (`PEER_REVIEWED`, `PREPRINT`, `VENDOR_CLAIM`).
- **`tutor.py`:**
  - Indexes all curriculum lessons and verified news articles using keyword tokenization.
  - Formats grounding context with strict XML tags (`<retrieved_context>`) to eliminate prompt injection risks.
  - Formulates bilingual responses in Beginner mode (intuitive) or Engineer mode (technical).

---

## 4. Persistence Architecture & Database Schema

The persistence layer uses SQLAlchemy ORM backed by SQLite (`data/platform.db`):

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        learner_profiles         │       │          user_progress          │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id: String (PK)                 │───┐   │ id: Integer (PK, Auto)          │
│ username: String                │   └──>│ user_id: String (FK)            │
│ current_level: String           │       │ lesson_id: String               │
│ xp_points: Integer              │       │ completed: Boolean              │
│ streak_days: Integer            │       │ quiz_score: Float               │
│ last_active_date: String        │       │ completed_at: DateTime          │
└─────────────────────────────────┘       └─────────────────────────────────┘

┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│       workspace_projects        │       │          project_files          │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id: String (PK)                 │───┐   │ id: String (PK)                 │
│ user_id: String                 │   └──>│ project_id: String (FK)         │
│ name: String                    │       │ filename: String                │
│ description: Text               │       │ content: Text                   │
│ updated_at: DateTime            │       │ language: String                │
└─────────────────────────────────┘       └─────────────────────────────────┘

┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│          news_articles          │       │         experiment_runs         │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id: String (PK)                 │       │ id: String (PK)                 │
│ title: String                   │       │ project_id: String              │
│ canonical_url: String (Unique)  │       │ model_name: String              │
│ content_hash: String (Unique)   │       │ hyperparameters: Text (JSON)    │
│ source_org: String              │       │ metrics: Text (JSON)            │
│ claim_status: String            │       │ status: String                  │
│ bookmarked: Boolean             │       │ created_at: DateTime            │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 5. Security & Isolation Architecture

1. **AST AST-Firewall:** Before code reaches any execution process, the Python AST is parsed and inspected by `SecurityScanner(ast.NodeVisitor)`. Any `ast.Import`, `ast.ImportFrom`, or `ast.Call` referencing prohibited symbols throws an immediate `SecurityViolationError`.
2. **Watchdog Subprocess:** Python execution is isolated to a temporary child process with strict environment stripping (`PYTHONPATH` sanitized, minimal `PATH`), working inside a dedicated temporary directory.
3. **Execution Timeout:** The execution service executes `process.communicate(timeout=5.0)`. If a student writes `while True: pass`, the watchdog terminates the process via `process.kill()` and reports a clean `Execution timed out after 5.0 seconds` message.
4. **Input Validation:** All incoming HTTP requests are validated against typed Pydantic models with maximum length constraints and strict typing.

---

## 6. Technology Stack Justification

| Layer | Selected Technology | Version | Architectural Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + TypeScript | 19.x / 5.x | Declarative component tree, typed API contracts, broad ecosystem. |
| **Bundler & Dev Server** | Vite | 8.3.x | Sub-second cold starts, fast HMR, production build in < 1 second. |
| **Code Editor** | Monaco Editor | 0.52.x | Industry standard VS Code editor engine with syntax highlighting and tabs. |
| **Backend Framework** | FastAPI | 0.143.x | Asynchronous performance, automatic OpenAPI documentation, typed Pydantic schemas. |
| **Language Runtime** | Python | 3.13.x | Native AI/ML ecosystem compatibility, modern AST parsing capabilities. |
| **ORM & Database** | SQLAlchemy + SQLite 3 | 2.0.x | Zero-configuration local persistence, transactional integrity, portability. |
| **Test Framework** | Pytest | 9.1.x | Async test support, fixtures, detailed assertion introspection. |
