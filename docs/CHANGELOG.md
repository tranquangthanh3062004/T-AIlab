# Changelog — AI Learning OS

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2026-10-13

### Added
- **15-Track Bilingual Prerequisite DAG Curriculum (`Track 0` to `Track 14`)**:
  - Full parity in Vietnamese (`vi`) and English (`en`) covering Beginner Core (`Tracks 0–4`), Applied AI Engineer (`Tracks 5–9, 11`), Systems & MLOps (`Track 10`), Research Specialization (`Tracks 12–13`), and Production Capstone (`Track 14`).
  - Added Track 8 (Generative AI, Diffusion & Multimodal Systems), Track 11 (Responsible AI, Fairness & License Governance), and Track 13 (Applied AI Specializations: Time-Series EWMA & Streaming Anomaly Detection).
- **16-Section Deep Pedagogical Lesson Schema**:
  - Every lesson enriched with 4-column `FormulaGuide`, grounded `LessonDataset`, `worked_example_code`, `output_analysis`, `when_to_use_and_not_use`, `flashcards`, AST-guarded `code_exercise`, deterministic `quiz`, and `capstone_spec`.
- **21-Source Verified OER & Academic Registry**:
  - Complete provenance cataloging official documentation (Google, PyTorch, Scikit-Learn, Hugging Face), university courses (Stanford CS229/CS231n/CS224n, MIT 6.S191, fast.ai), peer-reviewed papers (Attention, CLIP, DDPM, ResNet), and open textbooks (D2L, Goodfellow Deep Learning, MML).
  - Explicit SPDX license governance and access model demarcation (`FREE_OPEN` vs `FREEMIUM_AUDIT`).
- **Content Governance CLI (`app.cli_content`) & REST Pipeline API**:
  - 7 production CLI commands: `content:validate`, `content:report`, `resources:check`, `content:import --dry-run`, `content:import`, `content:publish`, and `content:rollback`.
  - Automated versioned snapshot backups in `backend/data/backups/` with learner progress preservation.
- **Frontend & UI/UX Architecture Alignment**:
  - Animated SVG brain logo with pulse and gradient glow effects.
  - Persona switcher (`Beginner Core` vs `Applied AI Engineer`) with targeted track recommendations.
  - Interactive Active Recall flashcards with flip-to-reveal animations.
  - Transparent Monaco IDE sandbox security notice (`AST Guard + 5s Timeout Subprocess`).
  - Multi-account Google OAuth integration with avatar preview and primary account switching.

## [1.0.0] - 2026-10-10

### Added
- **Core Architecture & Specifications**: Completed Phase 0 audit and comprehensive documentation.
- **Backend Service (FastAPI)**: Sandboxed code runner, initial curriculum tracks, News Radar, AI Tutor.
- **Frontend SPA (React + TypeScript + Vite + Tailwind CSS v4)**: Dual-mode interface, Monaco editor, interactive widgets.
