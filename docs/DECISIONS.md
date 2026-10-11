# Architectural Decision Records (ADRs) — CHINAI AI Learning OS

**Document Version:** 2.0.0  
**Status:** Approved Architectural Records  
**Lead Architect:** Principal Software Architect  

---

## ADR Index

| ADR ID | Decision Title | Status | Date |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Unified Dual-Mode Architecture (Learn Mode vs Engineer Workspace) | Accepted | Oct 2026 |
| **ADR-002** | Two-Stage Code Execution Security: Static AST Inspection + Subprocess Watchdog | Accepted | Oct 2026 |
| **ADR-003** | Vietnamese-First Localization with Preserved Technical Nomenclature (`i18n.ts`) | Accepted | Oct 2026 |
| **ADR-004** | Structured `FormulaGuide` Scaffolding over Raw Unrendered LaTeX | Accepted | Oct 2026 |
| **ADR-005** | Native 2D HTML5 Canvas Interactive Simulators over Heavy WebGL Engines | Accepted | Oct 2026 |
| **ADR-006** | Portable SQLite Persistence via SQLAlchemy ORM | Accepted | Oct 2026 |
| **ADR-007** | Deterministic Grounded Retrieval & Authenticated Citations for AI Tutor | Accepted | Oct 2026 |
| **ADR-008** | Calming Pastel Design System for Long-Duration Educational Focus | Accepted | Oct 2026 |

---

## ADR-001: Unified Dual-Mode Architecture

### Context
AI learners frequently experience context fragmentation: they learn theory in passive video platforms, practice coding in separate disconnected cloud notebooks, and check research papers on preprint aggregators. This causes high cognitive friction and high dropout rates.

### Decision
Unify beginner-friendly education (**Learn Mode**) and a professional IDE (**Engineer Workspace**) inside a single cohesive application sharing progress, active projects, and user context.

### Consequences
- **Positive:** Learners seamlessly transition from understanding a concept to experimenting with code in Monaco editor.
- **Negative:** Requires careful state management to ensure navigating between modes does not destroy unsaved editor state or active lesson progress.

---

## ADR-002: Two-Stage Code Execution Security

### Context
Allowing learners to execute Python code in the browser introduces severe security risks: arbitrary shell execution, unauthorized file reading, denial of service through infinite loops, and sandbox escaping.

### Decision
Implement a two-stage security defense:
1. **Static AST Analysis:** Inspect the code's Abstract Syntax Tree prior to execution. Reject any code importing unauthorized modules (`os`, `sys`, `subprocess`, `socket`, `shutil`) or invoking dangerous functions (`eval`, `exec`, `open`, `__subclasses__`).
2. **Subprocess Isolation & Watchdog:** Execute accepted code in disposable child processes inside dedicated temporary directories with an enforced 5.0-second CPU watchdog timeout.

### Consequences
- **Positive:** Zero risk of malicious host commands, zero dependency on heavy multi-GB Docker daemon overhead for local development, instant execution (< 300ms).
- **Negative:** Advanced learners cannot run multithreaded networking scripts or arbitrary third-party pip packages directly inside the basic sandbox.

---

## ADR-003: Vietnamese-First Localization with Preserved Technical Nomenclature

### Context
Vietnamese engineering students often struggle with purely English learning platforms or awkwardly machine-translated materials that translate established programming terms into confusing literal phrases (e.g. translating "Bug" or "Backpropagation" literally).

### Decision
Establish a Vietnamese-first user interface with an instantaneous `[VI / EN]` language switcher, while preserving internationally standard technical terms (Backpropagation, Gradient Descent, Vector Embeddings, Loss Function, Overfitting) accompanied by intuitive Vietnamese explanations.

### Consequences
- **Positive:** Welcoming, accessible learning experience for Vietnamese learners without compromising technical fluency for global engineering roles.
- **Negative:** Requires maintaining synchronized translation strings across `i18n.ts`.

---

## ADR-004: Structured `FormulaGuide` Scaffolding

### Context
Raw mathematical equations ($\min_{\theta} \frac{1}{2m} \sum_{i=1}^m (h_\theta(x^{(i)}) - y^{(i)})^2$) cause high cognitive anxiety and drop-off among self-taught software engineers.

### Decision
Every mathematical lesson must provide a structured `FormulaGuide` containing:
1. Standard equation representation
2. Plain-language objective statement
3. Variable symbols breakdown table (Symbol, Name, Meaning)
4. Concrete end-to-end arithmetic walkthrough with realistic numbers

### Consequences
- **Positive:** De-mystifies mathematical notation and builds true intuition before coding.
- **Negative:** Requires deliberate curricular effort to construct symbol tables and step-by-step arithmetic for all quantitative concepts.

---

## ADR-005: Native 2D HTML5 Canvas Interactive Simulators

### Context
Visualizing algorithms (such as decision boundaries and gradient descent convergence) helps learners grasp concepts faster than static charts. However, large 3D frameworks (Three.js, Babylon.js) inflate bundle sizes by hundreds of kilobytes.

### Decision
Implement interactive simulators using pure HTML5 2D Canvas in React components (`PerceptronWidget`, `GradientDescentWidget`) with zero external graphics libraries.

### Consequences
- **Positive:** Microsecond render times, zero external dependencies, 60 FPS slider responsiveness, bundle size remains tiny (< 110 kB gzip).
- **Negative:** Limited to 2D representations; complex 3D manifold visualizers are deferred.

---

## ADR-006: Portable SQLite Persistence via SQLAlchemy ORM

### Context
Requiring a running PostgreSQL or MySQL server prevents zero-friction local installation for individual learners and increases operating costs for free deployments.

### Decision
Use SQLite 3 (`data/platform.db`) managed via SQLAlchemy ORM models.

### Consequences
- **Positive:** Zero external database configuration required, instant local setup, portable single-file backups.
- **Negative:** SQLite write operations are serialized; cloud deployments exceeding 500 concurrent writers will need to configure PostgreSQL.

---

## ADR-007: Deterministic Grounded Retrieval for AI Tutor

### Context
Generative AI tutors often hallucinate nonexistent facts, fabricate incorrect math formulas, or invent broken URLs when unconstrained.

### Decision
Ground AI Tutor responses strictly against platform curriculum lessons and verified news articles using keyword token matching and verified citations. If an answer cannot be grounded, acknowledge uncertainty.

### Consequences
- **Positive:** 100% verifiable citations, zero hallucinated external URLs, completely free to operate with zero third-party API token costs.
- **Negative:** Lacks broad creative conversational capabilities on topics outside the indexed curriculum.

---

## ADR-008: Calming Pastel Design System

### Context
Intense dark themes with high-contrast neon accents cause visual fatigue during multi-hour technical study sessions.

### Decision
Design a soft, educational color scheme utilizing slate-50 backgrounds, sky-blue primary buttons, pastel emerald success badges, subtle slate-200 borders, and generous padding.

### Consequences
- **Positive:** Reduces cognitive fatigue, enhances typographic readability, adheres to WCAG 2.1 AA accessibility standards.
- **Negative:** Less "gamer/hacker" aesthetic, which some users associate with dark terminals (mitigated by retaining dark styling inside Monaco Editor in Engineer Mode).
