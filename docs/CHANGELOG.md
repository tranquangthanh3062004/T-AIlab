# Changelog — AI Learning OS

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-10

### Added
- **Core Architecture & Specifications**: Completed Phase 0 audit and comprehensive documentation (`PROJECT_AUDIT`, `PRODUCT_REQUIREMENTS`, `ARCHITECTURE`, `INFORMATION_ARCHITECTURE`, `DESIGN_SYSTEM`, `CURRICULUM`, `CODE_EXECUTION_SECURITY`, `NEWS_RADAR`, `AI_TUTOR`, `SECURITY`, `TESTING`, `DEPLOYMENT`, `OBSERVABILITY`, `KNOWN_LIMITATIONS`).
- **Backend Service (FastAPI)**:
  - Sandboxed Python AST code execution runner with timeout and output capture.
  - Curriculum engine with 7 structured tracks, modules, lessons, and deterministic quiz evaluation.
  - News Radar ingestion pipeline with RSS connectors (arXiv, OpenAI, Google DeepMind, Hugging Face), URL canonicalization, deduplication, and structured summaries.
  - AI Tutor knowledge retrieval engine with citation verification and offline fallback.
  - Engineer workspace project and file management service.
- **Frontend SPA (React + TypeScript + Vite + Tailwind CSS v4)**:
  - Dual-mode interface supporting Learn Mode (light educational theme) and Engineer Mode (dark multi-panel IDE).
  - Monaco editor code editing with syntax highlighting, file tree, tabs, and real console output.
  - Interactive educational widgets (Gradient Descent, Perceptron, Attention, etc.).
  - AI News Radar interactive feed with search, category filtering, and source links.
  - Diagnostic Placement assessment with adaptive track recommendations.
