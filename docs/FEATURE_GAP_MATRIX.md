# CHINAI AI Learning OS — Feature Gap Matrix & Prioritization

**Document Version:** 2.0.0  
**Status:** Approved Reference  
**Audience:** Product Engineering, Technical Product Management  

---

## 1. Executive Gap Analysis

This matrix evaluates feature gaps between **CHINAI** and industry-leading platforms (Duolingo, Khan Academy, DeepLearning.AI, Hugging Face, Kaggle, DataCamp), categorizing each capability by implementation feasibility, user impact, and roadmap milestone.

---

## 2. Comprehensive Gap Analysis Matrix

| Feature Domain | Industry Standard Benchmark | Baseline State | CHINAI v2.0 State | Target State (v2.5/v3.0) | Gap Priority | Implementation Rationale / Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Gamification & Habit Loops** | Duolingo: Streaks, XP, Leagues, Gems, Badges | No gamification | Daily Streaks, Total XP, 5 Level Tiers, 6 Badges | Weekly Peer Leagues & Social Leaderboards | P1 (Leagues deferred) | Core habit loop achieved. Peer leagues deferred to avoid premature social backend complexity. |
| **Mathematical Scaffolding** | Khan Academy: Step-by-step arithmetic hints | Raw unrendered LaTeX | Structured `FormulaGuide` with symbol table + concrete arithmetic | Interactive symbol slider with real-time recalculation | P0 (Achieved) | Solves the primary pain point of beginner drop-off in math-heavy AI concepts. |
| **Curriculum Breadth** | DeepLearning.AI: 7+ Specializations | 3 tracks populated | 7 full tracks (Fnd, Python, Math, ML, DL, LLM, MLOps) | 12 tracks (add Vision, RL, Speech, Edge AI) | P0 (Achieved v2.0) | Complete end-to-end foundation from zero to MLOps deployment. |
| **Bilingual Localization** | Duolingo: Multi-language interface | Mixed / English only | Strict Vietnamese-first with instant English toggle (`i18n`) | Full multi-language engine (add French, Japanese) | P0 (Achieved v2.0) | Prioritizes Vietnamese AI engineering learners while preserving global technical terms. |
| **Developer IDE Workspace** | DataCamp / VS Code: Monaco editor | Monaco present, lost state on tab switch | Persistent Monaco tabs, file templates, dirty state | Language Server Protocol (LSP) auto-complete | P1 (LSP deferred) | Editor is stable and stateful. Heavy in-browser LSP deferred to avoid bundle bloat. |
| **Code Execution Sandbox** | Kaggle: Dedicated isolated runtime | Naive banned string matching | AST static inspection + process sandbox + 5s watchdog | Docker container pool / MicroVMs | P1 (Containers deferred) | AST + subprocess isolation is secure and extremely lightweight for single-node deployments. |
| **Visual Simulations** | Hugging Face Spaces: Gradio/Streamlit | 2 basic HTML canvas widgets | Interactive Perceptron & Gradient Descent simulators | Transformer Attention & CNN Filter Visualizers | P1 (Transformers v2.5) | Low latency, zero backend overhead 2D HTML5 canvas interactive widgets. |
| **AI News & Papers** | Hugging Face: Daily Papers & ArXiv feed | Static mockup cards | Real RSS ingestion, URL canonicalization, SHA-256 dedup | Semantic vector search across 50,000+ papers | P1 (Vector search v2.5) | Feed ingestion and deduplication active. Vector embeddings planned for v2.5. |
| **AI Tutor (RAG)** | Khan Academy (Khanmigo): LLM tutor | Mock responses | Context-grounded retrieval over lessons + verified citations | Live Anthropic/OpenAI API fallback with RAG | P1 (Live LLM optional) | Deterministic grounded retrieval guarantees zero hallucination without requiring paid API keys. |
| **Multi-User Auth & RBAC** | Industry Standard: OAuth2 / JWT | Single default profile | SQLite `LearnerProfile` with UUID persistence | Full OAuth2 (Google, GitHub) + Supabase Auth | P1 (OAuth2 v2.5) | Standalone local-first deployment uses persistent SQLite profiles; cloud auth in v2.5. |
| **GPU Cloud Clusters** | Kaggle: 30 hours free GPU (T4/P100) | None | Local CPU AST runner | External Colab / RunPod / Modal integration | P2 (Out of scope) | Dedicated cloud GPU clusters would introduce prohibitive operating costs ($10,000+/mo). |

---

## 3. Prioritization Framework & Status

### Priority P0: Critical Path for Production Release (100% Closed in v2.0)
- ✅ Complete 7-track curriculum with lesson theory, quizzes, and code exercises.
- ✅ Structured `FormulaGuide` resolving obscure mathematical notation.
- ✅ Strict separation between Vietnamese and English interfaces (`i18n.ts`).
- ✅ Soft pastel, high-contrast, calm educational design system.
- ✅ AST static security scanner blocking malicious Python imports and introspections.
- ✅ 14/14 automated backend tests passing + clean Vite production build.

### Priority P1: Near-Term Enhancements (Scheduled for v2.5)
- 🔄 Semantic vector search embeddings for 50,000+ arXiv preprints in News Radar.
- 🔄 Optional live LLM API integration (BYOK: Bring Your Own Key for OpenAI/Anthropic/Gemini) in AI Tutor.
- 🔄 Interactive 2D Transformer Multi-Head Attention visualizer widget.
- 🔄 OAuth2 social sign-in (Google, GitHub) for multi-tenant cloud hosting.

### Priority P2: Long-Term Enterprise Features (Scheduled for v3.0)
- ⏳ Containerized Docker sandbox runner pool with isolated network namespaces.
- ⏳ External cloud GPU provider integration (RunPod / Modal / Google Colab deep links).
- ⏳ Social peer leagues, cohort study groups, and community code sharing.
