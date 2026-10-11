# Curriculum Architecture & Specifications — AI Learning OS

**Version**: 1.0.0  
**Curriculum Version**: `2026.1`  
**Status**: Active  
**Author**: Curriculum Architect & Learning Experience Designer

---

## 1. Curriculum Principles
1. **Intuition First, Formalization Second**: Concepts are introduced with visceral analogies and interactive simulations before presenting rigorous mathematical notations and code.
2. **Deterministic Evaluation**: Knowledge checks and code exercises have concrete, testable expected outputs and rubric criteria.
3. **Prerequisite Integrity**: Lessons explicitly declare dependencies. Advanced material cannot be started without either completing foundational lessons or passing the diagnostic assessment.
4. **Verifiable Practical Outcomes**: Every track ends with a portfolio-grade project executed and verified inside the Engineer Workspace.

---

## 2. Structured Tracks & Syllabus Breakdown

### Track A: AI Foundations (`track-foundations`)
- **Target**: Complete beginners, curious managers, transitioning engineers.
- **Modules**:
  - `mod-foundations-1`: What is AI? The Landscape (AI vs ML vs Deep Learning vs Generative AI)
  - `mod-foundations-2`: The Core Paradigms (Supervised, Unsupervised, Reinforcement Learning)
  - `mod-foundations-3`: Learning Mechanics (Features, Labels, Loss Functions, Generalization, Overfitting & Underfitting)
  - `mod-foundations-4`: Responsible AI & Real-World Limitations (Hallucinations, Bias, Data Provenance, Safety)
- **Interactive Component**: Visual Linear Separator & Overfitting Simulator.
- **Capstone Project**: "AI Concept Explorer & Paradigm Classification System".

### Track B: Python for AI (`track-python`)
- **Target**: Programmers needing modern AI-focused Python idioms.
- **Modules**:
  - `mod-py-1`: Modern Python Essentials (Type hints, Generators, Virtual Environments)
  - `mod-py-2`: NumPy & Vectorized Computation (Broadcasting, Matrix Multiplication, Strides)
  - `mod-py-3`: Pandas for Data Wrangling (Series, DataFrames, GroupBy, Imputation)
  - `mod-py-4`: Clean Code, Debugging & Testing for ML Pipelines
- **Interactive Component**: In-browser Python REPL with automated assertion checks.
- **Capstone Project**: "Robust ETL & Feature Normalization Pipeline".

### Track C: Mathematics for AI (`track-math`)
- **Target**: Building visual intuition for linear algebra, calculus, and probability.
- **Modules**:
  - `mod-math-1`: Linear Algebra (Vectors, Spaces, Dot Products, Matrix Transformations)
  - `mod-math-2`: Calculus & Optimization (Derivatives, Partial Derivatives, Gradients)
  - `mod-math-3`: Gradient Descent Demystified (Learning Rates, Momentum, Loss Landscapes)
  - `mod-math-4`: Probability & Statistics (Distributions, Bayes Rule, Maximum Likelihood)
- **Interactive Component**: Interactive 2D/3D Gradient Descent Simulator with adjustable learning rates.
- **Capstone Project**: "Gradient Descent from Scratch in Pure NumPy".

### Track D: Data Science & Machine Learning (`track-ml`)
- **Target**: End-to-end applied ML engineering.
- **Modules**:
  - `mod-ml-1`: Exploratory Data Analysis & Feature Engineering
  - `mod-ml-2`: Supervised Regression & Classification (Logistic Regression, Decision Trees, Ensembles)
  - `mod-ml-3`: Model Evaluation & Validation (Cross-validation, ROC-AUC, F1, Data Leakage Prevention)
  - `mod-ml-4`: Model Explainability (SHAP, Permutation Importance)
- **Interactive Component**: Interactive Decision Boundary Explorer.
- **Capstone Project**: "Customer Churn Prediction Engine with Model Evaluation Suite".

### Track E: Deep Learning (`track-dl`)
- **Target**: Neural network mechanics from perceptrons to transformers.
- **Modules**:
  - `mod-dl-1`: Artificial Neural Networks & Backpropagation
  - `mod-dl-2`: Convolutional Neural Networks (CNNs) & Computer Vision
  - `mod-dl-3`: Sequence Models & The Attention Mechanism
  - `mod-dl-4`: PyTorch Fundamentals & GPU Acceleration
- **Interactive Component**: Self-Attention Matrix Visualizer.
- **Capstone Project**: "Multi-Class Image & Feature Classifier with PyTorch".

### Track F: LLM Engineering (`track-llm`)
- **Target**: Building production applications on Large Language Models.
- **Modules**:
  - `mod-llm-1`: Tokenization, Embeddings & Vector Semantic Spaces
  - `mod-llm-2`: Prompt Engineering, Structured Outputs & Schema Enforcement
  - `mod-llm-3`: Retrieval-Augmented Generation (RAG) Architecture (Chunking, Reranking, Vector DBs)
  - `mod-llm-4`: AI Agents, Tool Calling, Memory & Safety Guardrails
- **Interactive Component**: Interactive RAG Chunking & Cosine Similarity Inspector.
- **Capstone Project**: "Production RAG Assistant with Strict Citation Verification".

### Track G: AI Systems & MLOps (`track-mlops`)
- **Target**: Deploying, monitoring, and scaling AI services.
- **Modules**:
  - `mod-mlops-1`: Fast Model Serving & REST API Design
  - `mod-mlops-2`: Experiment Tracking & Model Registries
  - `mod-mlops-3`: Observability, Drift Detection & Performance Monitoring
  - `mod-mlops-4`: Cost, Latency Optimization & Security Hardening
- **Interactive Component**: Model Latency & Token Budget Calculator.
- **Capstone Project**: "Production Model Microservice with Automated Regression Tests".
