# CHINAI AI Learning OS — Engineering & Product Roadmap

**Document Version:** 2.0.0  
**Status:** Approved Reference  
**Audience:** Product Engineering, Executive Leadership, Community Contributors  

---

## 1. Roadmap Overview & Timeline

The CHINAI engineering roadmap is organized into 10 structured execution phases. Phases 1 through 7 represent the production-ready foundation delivered in **CHINAI 2.0.0**, while Phases 8 through 10 outline the subsequent evolutionary milestones.

```
2026 Q3 - Q4 (COMPLETED - v2.0)                2027 Q1 (PLANNED - v2.5)       2027 Q2-Q3 (FUTURE - v3.0)
┌────────────────────────────────────────┐     ┌──────────────────────┐      ┌─────────────────────────┐
│ Phase 1: Baseline Audit & Triage       │ ──> │ Phase 8:             │ ───> │ Phase 10:               │
│ Phase 2: Bug Resolution (B1-B9)        │     │ - Vector DB Search   │      │ - MicroVM Sandboxes     │
│ Phase 3: 7-Track Curriculum & Math     │     │ - Optional Live LLM  │      │ - Multi-Tenant Cloud    │
│ Phase 4: Formula Guide Scaffolding     │     │ - Transformer Widget │      │ - Enterprise Dashboards │
│ Phase 5: Bilingual i18n Separation     │     │ - OAuth2 Social Auth │      └─────────────────────────┘
│ Phase 6: Soft Educational Design       │     └──────────────────────┘
│ Phase 7: Test Hardening (14/14 Pytest) │
└────────────────────────────────────────┘
```

---

## 2. Completed Phases (CHINAI 2.0.0 Production Release)

### ✅ Phase 1: Baseline Repository Audit & Benchmark
- **Delivered:** Full code inspection of backend routers, services, schemas, and React components. Uncovered 9 bugs and architectural gaps documented in `docs/BASELINE_RESULTS.md`.
- **Exit Criteria Met:** Baseline metrics established, reproduction steps cataloged.

### ✅ Phase 2: Defect Triage & Resolution
- **Delivered:** Resolved 9 critical defects including asynchronous RSS ingestion failure (B1), code runner UI freeze (B2), CSV template corruption (B3), state loss on tab switch (B4), silent blank screen failures (B5, B6), and database UTC evaluation (B7).
- **Exit Criteria Met:** All 9 bugs verified fixed with regression tests.

### ✅ Phase 3: Complete 7-Track AI Curriculum
- **Delivered:** Implemented comprehensive lessons, quizzes, and code exercises across all 7 tracks: AI Foundations, Python for AI, Math for AI, Machine Learning, Deep Learning, LLM Engineering, and MLOps.
- **Exit Criteria Met:** All tracks loaded dynamically via `GET /api/learn/tracks`.

### ✅ Phase 4: Mathematical Formula Scaffolding (`FormulaGuide`)
- **Delivered:** Built dedicated `FormulaGuide` architecture decomposing dense mathematical equations into symbol tables, plain-language variable descriptions, and step-by-step arithmetic walkthroughs with concrete numbers.
- **Exit Criteria Met:** Formula guides verified across math-heavy lessons via `test_curriculum_formula_guides`.

### ✅ Phase 5: Bilingual Localization Separation
- **Delivered:** Built typed internationalization engine (`services/i18n.ts`) offering strict Vietnamese-first defaults with instant English toggling (`[VI / EN]`) and persistent preference storage in `localStorage`.
- **Exit Criteria Met:** Zero mixed-language UI strings; verified across all 8 views.

### ✅ Phase 6: Educational Pastel Design System
- **Delivered:** Styled platform with calming slate-50 backgrounds, soft sky-blue primary actions, pastel emerald success badges, and generous whitespace. Eliminated harsh high-contrast black blocks.
- **Exit Criteria Met:** Visual design complies with WCAG 2.1 AA contrast requirements.

### ✅ Phase 7: Test Hardening & Production Builds
- **Delivered:** Expanded pytest suite from 7 to 14 automated tests covering AST security, introspection escapes, quiz evaluation, diagnostic placement, and URL deduplication. Verified frontend Vite production build in < 1 second.
- **Exit Criteria Met:** 14/14 tests passing; clean compilation with 0 warnings or errors.

---

## 3. Near-Term Roadmap: CHINAI v2.5 (2027 Q1)

### Phase 8: Advanced Retrieval & Intelligence Capabilities
- **Target Date:** February – March 2027
- **Key Milestones:**
  1. **Vector Embeddings for News Radar:** Integrate a lightweight local vector store (e.g., ChromaDB or SQLite-vec) to provide semantic similarity search across 50,000+ indexed arXiv AI research papers.
  2. **Bring-Your-Own-Key (BYOK) AI Tutor Fallback:** Allow learners to configure personal API keys (OpenAI, Anthropic Claude, Google Gemini) to power conversational reasoning while preserving local deterministic RAG as the zero-cost default.
  3. **Interactive Transformer Attention Widget:** Build a 2D interactive attention matrix visualization allowing learners to explore query, key, and value dot-product weights in real time.
  4. **OAuth2 Social Sign-In:** Implement Google and GitHub sign-in alongside SQLite profiles for optional cloud synchronization.

---

## 4. Long-Term Roadmap: CHINAI v3.0 (2027 Q2 – Q3)

### Phase 9: Community & Ecosystem Expansion
- **Target Date:** May 2027
- **Key Milestones:**
  1. **One-Click GitHub & Hugging Face Export:** Allow students to publish their Engineer Workspace projects directly to GitHub repositories or Hugging Face Spaces.
  2. **Spoken Audio Pronunciation Guide:** Add native audio clips pronouncing universal AI terminology in English and Vietnamese to reinforce phonetics for global engineering communication.
  3. **Peer Study Cohorts & Discussion Threads:** Opt-in discussion threads scoped to specific lessons, enabling collaborative problem-solving.

### Phase 10: Enterprise Cloud & Sandboxing Scale
- **Target Date:** August 2027
- **Key Milestones:**
  1. **MicroVM / Firecracker Sandbox Pool:** Upgrade code execution runner to containerized MicroVMs with strict memory and network isolation for enterprise multi-tenancy.
  2. **University & Corporate Team Dashboards:** Instructor portal with cohort progress tracking, automated assignment grading, and skill gap heatmaps.
  3. **SOC 2 Type II & FERPA Compliance Audit:** Formal compliance verification for institutional deployment.
