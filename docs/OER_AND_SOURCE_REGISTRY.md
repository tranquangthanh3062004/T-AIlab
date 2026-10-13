# CHINAI AI LEARNING OS — PHASE 1: AUTHORITATIVE OER, UNIVERSITY, GITHUB & LEARNING SCIENCE REGISTRY

**Last Verified Date:** 2026-10-12  
**Governance Policy:** Every external educational resource, dataset, textbook, and repository referenced in CHINAI (`T AIlab`) is tracked with an explicit **Lifecycle Status**, **License & Usage Rights Matrix**, and **Curriculum Mapping**. No proprietary or copyrighted course content is copied without permission; CHINAI authors original bilingual pedagogical explanations, mathematical walkthroughs, and sandbox exercises grounded in verified primary sources.

---

## 1. Resource Lifecycle Taxonomy

Every resource in CHINAI's Content Governance Pipeline transitions through strict, auditable states:

1. `DISCOVERED`: Candidate resource identified via authoritative institution, university syllabus, or GitHub search.
2. `METADATA_VERIFIED`: Title, authors, canonical URL, organization, and publication/update date verified.
3. `SOURCE_ACCESSED`: Primary URL accessed and technical scope inspected.
4. `CONTENT_INGESTED`: Only permitted metadata, open-licensed datasets, or short fair-use citations ingested.
5. `CONTENT_PARSED`: Concepts, prerequisites, and learning outcomes mapped into structured schema.
6. `CONTENT_REVIEWED`: Evaluated against the 13-criterion CHINAI Quality Rubric.
7. `CURRICULUM_MAPPED`: Linked to specific CHINAI `track_id`, `module_id`, and `lesson_id` nodes.
8. `PUBLISHED`: Approved for display to learners with full attribution and license provenance.
9. `NEEDS_REVIEW`: Flagged for version drift, broken link, or pedagogical ambiguity.
10. `ARCHIVED`: Deprecated due to outdated APIs or superseded scientific findings.

---

## 2. Foundational AI/ML Documentation & Platform Sources (Section IV.A)

| Resource ID | Title & Organization | Canonical URL | License & Reuse Policy | Lifecycle Status | Mapped CHINAI Tracks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `oer-google-mlcc` | **Google Machine Learning Crash Course** (Google Developers) | `https://developers.google.com/machine-learning/crash-course` | Text: `CC BY 4.0`; Code: `Apache-2.0`. Attribution required; commercial/educational adaptation permitted with credit. | `PUBLISHED` | `track-ai-foundations`, `track-classical-ml`, `track-deep-learning` |
| `oer-google-ai-dev` | **Google AI for Developers Documentation** (Google) | `https://ai.google.dev/` | Text: `CC BY 4.0`; Code samples: `Apache-2.0`. Used as reference for structured outputs, function calling, and safety settings. | `PUBLISHED` | `track-llm-engineering`, `track-ai-agents` |
| `oer-hf-learn` | **Hugging Face Learn (NLP, Audio, CV, Agents Courses)** (Hugging Face) | `https://huggingface.co/learn` | `Apache-2.0` / `CC BY 4.0` (see course repo licenses). Used for tokenization, dense embeddings, MTEB benchmarks, and ReAct tool agents. | `PUBLISHED` | `track-llm-engineering`, `track-ai-agents`, `track-computer-vision` |
| `oer-fastai-course` | **Practical Deep Learning for Coders** (fast.ai — Jeremy Howard) | `https://course.fast.ai/` | Course notebooks `GPL-3.0` / `Apache-2.0`. Referenced for top-down "whole-game" pedagogy and validation set hygiene; no GPL code copied into CHINAI core. | `CURRICULUM_MAPPED` | `track-data-science`, `track-deep-learning`, `track-computer-vision` |
| `oer-deeplearning-ai` | **DeepLearning.AI Short Courses & Specializations Catalog** (DeepLearning.AI) | `https://www.deeplearning.ai/` | **Proprietary / All Rights Reserved** on platform videos & quizzes. **Policy:** Metadata and external link reference only (`SOURCE_ACCESSED` / `CURRICULUM_MAPPED`); zero content copied. | `CURRICULUM_MAPPED` | `track-ai-foundations`, `track-llm-engineering`, `track-ai-agents` |
| `oer-pytorch-tutorials` | **PyTorch Official Tutorials & Documentation** (Linux Foundation / PyTorch) | `https://pytorch.org/tutorials/` | `BSD-3-Clause`. Permitted for code patterns, tensor memory layout, autograd mechanics, and checkpointing workflows with attribution. | `PUBLISHED` | `track-python-for-ai`, `track-deep-learning`, `track-computer-vision` |
| `oer-sklearn-guide` | **scikit-learn User Guide (v1.5+)** (scikit-learn Developers / Inria) | `https://scikit-learn.org/stable/user_guide.html` | `BSD-3-Clause`. Reference standard for `Pipeline`, cross-validation, data leakage prevention, decision trees, and calibration. | `PUBLISHED` | `track-data-science`, `track-classical-ml` |
| `oer-numpy-docs` | **NumPy Reference & User Guide** (NumPy Developers) | `https://numpy.org/doc/` | `BSD-3-Clause`. Authoritative reference for `ndarray` C-contiguous memory strides, broadcasting, and BLAS/SIMD vectorization. | `PUBLISHED` | `track-python-for-ai`, `track-math-for-ai` |
| `oer-pandas-docs` | **pandas User Guide** (NumFOCUS / pandas) | `https://pandas.pydata.org/docs/` | `BSD-3-Clause`. Reference for tabular data cleaning, missing-value semantics, and time-series indexing. | `PUBLISHED` | `track-data-science` |
| `oer-python3-docs` | **Python 3.13 Standard Library Documentation** (Python Software Foundation) | `https://docs.python.org/3/` | `PSF License v2`. Reference for data structures, `ast` inspection, typing, and unit testing. | `PUBLISHED` | `track-python-for-ai` |

---

## 3. University Courses & Open Textbooks (Section IV.B)

| Resource ID | Title & Institution | Canonical URL | License & Usage Policy | Lifecycle Status | Mapped CHINAI Tracks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `oer-d2l-book` | **Dive into Deep Learning (D2L.ai)** (Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola) | `https://d2l.ai/` | Text: `CC BY-SA 4.0`; Code: `Apache-2.0`. Open textbook used for mathematical notation alignment in backpropagation, CNNs, and attention. | `PUBLISHED` | `track-deep-learning`, `track-computer-vision`, `track-llm-engineering` |
| `oer-mml-book` | **Mathematics for Machine Learning** (Deisenroth, Faisal, Ong — Cambridge University Press) | `https://mml-book.github.io/` | PDF publicly readable; `CC BY-NC-ND 4.0` / Cambridge University Press copyright. **Policy:** No text/figures copied (`ND` restriction); linked as external further reading with page/chapter citations. | `CURRICULUM_MAPPED` | `track-math-for-ai`, `track-classical-ml` |
| `oer-mit-6036` | **MIT 6.036: Introduction to Machine Learning** (MIT OpenCourseWare) | `https://ocw.mit.edu/courses/6-036-introduction-to-machine-learning-fall-2020/` | `CC BY-NC-SA 4.0`. Referenced for Perceptron convergence geometry, margin maximization, and regularization problem sets. | `CURRICULUM_MAPPED` | `track-ai-foundations`, `track-classical-ml` |
| `oer-stanford-cs229` | **Stanford CS229: Machine Learning Lecture Notes** (Stanford University) | `https://cs229.stanford.edu/` | University copyright (public syllabus & notes). Linked for external mathematical derivations of GLMs, EM, and bias-variance trade-off. | `CURRICULUM_MAPPED` | `track-math-for-ai`, `track-classical-ml` |
| `oer-stanford-cs231n` | **Stanford CS231n: Deep Learning for Computer Vision** (Stanford University) | `https://cs231n.stanford.edu/` | University copyright (public syllabus). Linked for receptive field arithmetic, CNN architectures, and detection metrics (IoU, mAP). | `CURRICULUM_MAPPED` | `track-computer-vision`, `track-deep-learning` |
| `oer-berkeley-cs188` | **UC Berkeley CS188: Introduction to Artificial Intelligence** (UC Berkeley) | `https://inst.eecs.berkeley.edu/~cs188/` | Academic public course materials. Referenced for search, planning, Markov Decision Processes, and rational agent foundations. | `CURRICULUM_MAPPED` | `track-ai-foundations`, `track-ai-agents` |

---

## 4. Curated GitHub Educational Repositories (10-Factor Evaluation Matrix — Section IV.C)

Repositories are evaluated across 10 engineering and pedagogical dimensions rather than raw star counts:
1. **Pedagogical Clarity**, 2. **Structural Modularity**, 3. **README & Setup Quality**, 4. **Worked Example Completeness**, 5. **Code Hygiene**, 6. **Reproducibility**, 7. **Maintenance Activity**, 8. **SPDX License Compliance**, 9. **Persona Fit (`beginner` vs `engineer`)**, 10. **Curriculum Graph Linkage**.

| Repo ID | Repository | Canonical URL | SPDX License | 10-Factor Score | Lifecycle Status | Curriculum Linkage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `gh-karpathy-micrograd` | `karpathy/micrograd` (Andrej Karpathy) | `https://github.com/karpathy/micrograd` | `MIT` | **9.8 / 10** (Minimalist 100-line scalar autograd engine; unmatched intuition for chain rule & backpropagation) | `PUBLISHED` | `track-math-for-ai`, `track-deep-learning` |
| `gh-karpathy-nanogpt` | `karpathy/nanoGPT` (Andrej Karpathy) | `https://github.com/karpathy/nanoGPT` | `MIT` | **9.6 / 10** (Clean, readable GPT-2 training/inference implementation in ~300 lines of PyTorch) | `PUBLISHED` | `track-deep-learning`, `track-llm-engineering` |
| `gh-rasbt-llms-from-scratch` | `rasbt/LLMs-from-scratch` (Sebastian Raschka) | `https://github.com/rasbt/LLMs-from-scratch` | `Apache-2.0` | **9.7 / 10** (Step-by-step tokenization, multi-head attention, pretraining, and instruction fine-tuning) | `PUBLISHED` | `track-llm-engineering`, `track-research-engineering` |
| `gh-microsoft-ml-beginners` | `microsoft/ML-For-Beginners` (Microsoft Cloud Advocates) | `https://github.com/microsoft/ML-For-Beginners` | `MIT` | **9.3 / 10** (Structured 12-week classical ML lessons with scikit-learn and quizzes) | `PUBLISHED` | `track-ai-foundations`, `track-classical-ml` |
| `gh-madewithml` | `GokuMohandas/Made-With-ML` (Goku Mohandas) | `https://github.com/GokuMohandas/Made-With-ML` | `MIT` | **9.5 / 10** (Production MLOps lifecycle: data preprocessing, experiment tracking, serving, CI/CD, and drift monitoring) | `PUBLISHED` | `track-mlops-systems`, `track-capstone-portfolio` |

---

## 5. Open Datasets Provenance & License Registry

Every dataset embedded inside CHINAI lessons (`lesson.real_dataset`) is a real, verifiable open dataset with explicit citation and license:

1. **UCI Iris Botanical Dataset** (R.A. Fisher, 1936) — `https://archive.ics.uci.edu/dataset/53/iris` — License: `CC BY 4.0`.
2. **UCI Wine Quality Physicochemical Dataset** (Cortez et al., 2009) — `https://archive.ics.uci.edu/dataset/186/wine+quality` — License: `CC BY 4.0`.
3. **California Housing 1990 Census Dataset** (Pace & Barry, 1997 / CMU StatLib) — `https://lib.stat.cmu.edu/datasets/houses.zip` — License: `Public Domain / Open Academic`.
4. **UCI Auto MPG Engineering Dataset** (R. Quinlan, 1993) — `https://archive.ics.uci.edu/dataset/9/auto+mpg` — License: `CC BY 4.0`.
5. **UCI Titanic / OpenML Tabular Leakage Benchmark (OpenML ID: 40945)** — `https://www.openml.org/d/40945` — License: `Public Domain / CC BY 4.0`.
6. **UCI Breast Cancer Wisconsin Diagnostic Dataset** (Wolberg, Street, Mangasarian, 1995) — `https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic` — License: `CC BY 4.0`.
7. **Zalando Fashion-MNIST Benchmark** (Xiao, Rasul, Vollgraf, 2017) — `https://github.com/zalandoresearch/fashion-mnist` — License: `MIT`.
8. **COCO 2017 Object Detection Validation Telemetry** (Lin et al., 2014 / COCO Consortium) — `https://cocodataset.org/` — License: `CC BY 4.0` (Annotations).
9. **Hugging Face MTEB & Microsoft MS MARCO Passage Ranking** (Bajaj et al., 2016; Muennighoff et al., 2023) — `https://huggingface.co/spaces/mteb/leaderboard` — License: `Apache-2.0` / `MIT`.
10. **Berkeley Function-Calling Leaderboard (BFCL) Telemetry** (Gorilla LLM / UC Berkeley, 2024) — `https://gorilla.cs.berkeley.edu/leaderboard.html` — License: `Apache-2.0`.
11. **MLPerf Inference v4.1 Datacenter Benchmark** (MLCommons Consortium, 2024) — `https://mlcommons.org/benchmarks/inference-datacenter/` — License: `Apache-2.0`.
12. **Papers with Code Reproducibility & CIFAR-10 ResNet Ablation Telemetry** (He et al., 2016) — `https://arxiv.org/abs/1512.03385` — License: `Open Access / arXiv`.

---

## 6. Learning Science & Pedagogical Principles Applied (Section IV.E)

CHINAI's lesson architecture and recommendation engine operationalize 6 peer-reviewed Learning Science mechanisms:

1. **Cognitive Load Management & Worked Examples (Sweller, 1988):** Every mathematical formula is decomposed into a 4-column **Symbol Table** (`Ký hiệu`, `Tên gọi`, `Ý nghĩa thực tế`, `Giá trị mẫu`) followed by step-by-step arithmetic before presenting code.
2. **Active Recall & Retrieval Practice (Roediger & Karpicke, 2006):** Every lesson concludes with deterministic retrieval questions (`QuizQuestion`) and an AST-verified Python coding exercise (`CodeExercise`).
3. **Elaborative Interrogation & Misconception Inoculation:** Every lesson includes a dedicated `common_misconceptions` block addressing frequent conceptual traps (e.g., fitting `StandardScaler` before train/test split, or assuming multi-agent loops always outperform deterministic workflows).
4. **Spaced Practice & Error-Driven Review (Cepeda et al., 2006):** Learners who score $< 100\%$ on a quiz or fail a code assertion on their first attempt have that concept scheduled in the Spaced Review Queue (`SpacedReviewItem`).
5. **Mastery Learning with Multi-Dimensional Separation (Bloom, 1968):** CHINAI strictly separates **Completion Rate**, **Assessment Performance**, **Estimated Mastery (with explicit confidence bounds)**, and **Demonstrated Project Skill**.
