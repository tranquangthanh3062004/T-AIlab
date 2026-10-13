# CHINAI AI LEARNING OS — PHASE 0: COMPREHENSIVE CURRICULUM & EDUCATIONAL DATA AUDIT

**Audit Date:** 2026-10-12  
**Repository:** `T-AIlab` (`ai-learning-os`)  
**Scope:** End-to-end inspection of curriculum tracks, modules, lessons, mathematical formula guides, code exercises, unit test assertions, open datasets, OER provenance, database entities, mastery tracking, and API endpoints.

---

## 1. Executive Summary

Prior to expanding the curriculum to the full 12-track prerequisite graph and building the automated Content Governance & Adaptive Mastery Pipeline, we inspected every source file in `backend/app/` and `frontend/src/`.

### Key Baseline Metrics Observed
* **Existing Tracks:** 7 tracks (`track-ai-foundations`, `track-python-for-ai`, `track-math-for-ai`, `track-classical-ml`, `track-deep-learning`, `track-llm-engineering`, `track-mlops-systems`) in `backend/app/services/curriculum.py`.
* **Existing Lessons:** 8 full lessons in both Vietnamese (`CURRICULUM_TRACKS_VI`) and English (`CURRICULUM_TRACKS_EN`), each containing `FormulaGuide`, `LessonDataset` (real open datasets), `worked_example_code`, `CodeExercise` with AST-sandboxed unit tests, and deterministic `QuizQuestion` items.
* **Database Entities (`backend/app/models/entities.py`):** 7 SQLAlchemy tables (`user_accounts`, `user_progress`, `learner_profiles`, `workspace_projects`, `project_files`, `news_articles`, `experiment_runs`).
* **Identified Gaps vs. Master Curriculum Architecture:**
  1. Missing 5 core tracks required for a complete AI Engineering & Research curriculum: **Data Science & Data Leakage Prevention**, **Computer Vision**, **AI Agents & Workflow Engineering**, **AI Research Engineering**, and **Capstone & Portfolio Engineering**.
  2. Lesson schema (`backend/app/schemas/curriculum.py`) lacked explicit fields for `why_this_matters`, `guided_practice`, `mastery_criteria`, `further_reading`, `source_references`, `content_version`, `review_status`, `last_verified_date`, and `license_provenance`.
  3. Database and API conflated `completed` boolean and `quiz_score` without separating the 4 Learning Science dimensions: **Completion**, **Assessment Performance**, **Estimated Mastery (with confidence bounds)**, and **Demonstrated Project Skill**.
  4. No automated **13-Criterion Content Quality Rubric Validator** or **OER Lifecycle State Machine** (`DISCOVERED` → `PUBLISHED`) existed in the backend.

---

## 2. Detailed Audit Matrix by Component

| Component / Entity | Evidence (File & Lines) | Classification | Findings & Remediation Plan |
| :--- | :--- | :--- | :--- |
| **Track A: AI Foundations** (`lesson-foundations-what-is-ai`, `lesson-foundations-generalization`) | `backend/app/services/curriculum.py#L14-L450` | `VERIFIED AND COMPLETE` | Bilingual (VI/EN), includes Perceptron & Bias-Variance `FormulaGuide`, real UCI Iris & UCI Wine Quality datasets, working Python exercises, and deterministic quizzes. Enhance with 24-field provenance metadata. |
| **Track B: Python for AI** (`lesson-python-vectorization`) | `backend/app/services/curriculum.py#L451-L650` | `VERIFIED AND COMPLETE` | Covers C-contiguous memory layout, SIMD dot product, and California Housing dataset (StatLib). Enhance with 24-field provenance metadata. |
| **Track C: Math for AI** (`lesson-math-gradient-descent`) | `backend/app/services/curriculum.py#L651-L860` | `VERIFIED AND COMPLETE` | Covers partial derivatives, learning rate $\alpha$, interactive Gradient Descent widget, and UCI Auto MPG dataset. |
| **Track D: Classical ML** (`lesson-ml-decision-trees`) | `backend/app/services/curriculum.py#L861-L1060` | `VERIFIED AND COMPLETE` | Covers Shannon Entropy, Information Gain, and UCI Wisconsin Breast Cancer dataset. |
| **Track E: Deep Learning** (`lesson-dl-neural-activations`) | `backend/app/services/curriculum.py#L1061-L1260` | `VERIFIED AND COMPLETE` | Covers vanishing gradients, ReLU/Sigmoid/GELU, and Zalando Fashion-MNIST 10-layer activation telemetry. |
| **Track F: LLM & RAG Engineering** (`lesson-llm-embeddings-vector-search`) | `backend/app/services/curriculum.py#L1261-L1460` | `VERIFIED AND COMPLETE` | Covers dense embeddings, Cosine Similarity, and Hugging Face MTEB / MS MARCO retrieval dataset. |
| **Track G: MLOps & AI Systems** (`lesson-mlops-latency-profiling`) | `backend/app/services/curriculum.py#L1461-L1660` | `VERIFIED AND COMPLETE` | Covers P99 tail latency, Little's Law, AWQ INT4 quantization, and MLCommons MLPerf v4.1 dataset. |
| **Track: Data Science, EDA & Data Leakage** | `backend/app/services/curriculum.py` | `MISSING` | **Gap:** Learners jump from NumPy to Classical ML without a dedicated lesson on EDA, missing-value imputation, train/test split hygiene, and **Data Leakage prevention**. **Action:** Implement `track-data-science` (`lesson-ds-eda-and-data-leakage`). |
| **Track: Computer Vision (CNNs, IoU & Transfer Learning)** | `backend/app/services/curriculum.py` | `MISSING` | **Gap:** No dedicated Computer Vision track covering spatial convolution, receptive fields, Intersection over Union (IoU), and transfer learning. **Action:** Implement `track-computer-vision` (`lesson-cv-cnn-and-iou`). |
| **Track: AI Agents, Tool Calling & Safety Guardrails** | `backend/app/services/curriculum.py` | `MISSING` | **Gap:** No curriculum module teaching deterministic tool schemas, ReAct loop termination, idempotency, prompt injection defense, and when *not* to use multi-agent systems. **Action:** Implement `track-ai-agents` (`lesson-agents-tool-calling-and-guardrails`). |
| **Track: AI Research Engineering & Reproducibility** | `backend/app/services/curriculum.py` | `MISSING` | **Gap:** No module teaching paper reading, ablation study design, seed variance, and statistical significance ($p$-values / confidence intervals). **Action:** Implement `track-research-engineering` (`lesson-research-ablation-and-reproducibility`). |
| **Track: Capstone Projects & Portfolio Rubrics** | `backend/app/services/curriculum.py` | `MISSING` | **Gap:** No structured multi-level Capstone Track with explicit baselines, multi-metric evaluation rubrics, error analysis, and deployment checklists. **Action:** Implement `track-capstone-portfolio` (`lesson-capstone-end-to-end-rag-system`). |
| **24-Field Lesson Schema & Provenance** | `backend/app/schemas/curriculum.py#L57-L79` | `PRESENT BUT INCOMPLETE` | Missing `why_this_matters`, `guided_practice`, `mastery_criteria`, `further_reading`, `source_references`, `content_version`, `review_status`, `last_verified_date`, `license_provenance`. **Action:** Upgrade `Lesson` schema and populate across all lessons. |
| **OER Resource Lifecycle & License Governance** | `backend/app/models/entities.py` | `MISSING` | No entity or service tracking OER lifecycle states (`DISCOVERED`, `METADATA_VERIFIED`, `SOURCE_ACCESSED`, `CONTENT_INGESTED`, `CONTENT_PARSED`, `CONTENT_REVIEWED`, `CURRICULUM_MAPPED`, `PUBLISHED`, `NEEDS_REVIEW`, `ARCHIVED`). **Action:** Add `EducationalResourceRecord` and `curriculum_governance.py`. |
| **13-Criterion Quality Rubric & Gatekeeper** | `backend/tests/test_curriculum.py` | `PRESENT BUT INCOMPLETE` | Existing tests check basic track/quiz integrity, but do not run a 13-criterion rubric validator or prerequisite DAG cycle check. **Action:** Implement `evaluate_lesson_rubric()` and automated tests in `test_curriculum_governance.py`. |
| **4-Dimensional Mastery & Explainable Recommendations** | `backend/app/api/learn.py#L208-L246` | `PRESENT BUT INCOMPLETE` | Progress endpoint returns `completed_lesson_ids` and `quiz_scores`, but does not separate Completion, Assessment Performance, Estimated Mastery (with confidence bounds), and Demonstrated Project Skill, nor provide explainable recommendations. **Action:** Implement `/api/learn/recommendations` and `/api/learn/mastery`. |
