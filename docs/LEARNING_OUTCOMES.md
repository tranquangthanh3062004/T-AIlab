# CHINAI AI Learning OS — Measurable Learning Outcomes & Competency Matrix

## 1. Learning Philosophy & Measurement Principles

Every learning outcome in CHINAI AI Learning OS follows the **Bloom's Revised Taxonomy** and must be empirically verifiable through:
1. **Mathematical Deconstruction**: Computing hand-worked numerical examples through a 4-column formula guide before seeing code.
2. **Empirical Code Execution**: Writing and executing production code in an isolated AST-guarded Python sandbox that passes automated unit assertions.
3. **Active Recall & Spaced Repetition**: Answering deterministic conceptual questions with targeted distractors and self-assessing flashcards.
4. **Mastery Threshold**: Achieving $\ge 70\%$ on active recall quizzes and $100\%$ on code assertion benchmarks.

---

## 2. Track-by-Track Learning Outcomes

### Beginner Core Foundations

#### Track 0: AI Literacy, Thinking & Problem Framing (`track-foundations`)
- **Outcome 0.1**: Differentiate Rule-based Systems, Supervised Learning, Unsupervised Learning, Self-Supervised Learning, and Generative AI using clear boundary criteria.
- **Outcome 0.2**: Compute the Generalization Gap $|L_{\text{train}} - L_{\text{val}}|$ and identify Overfitting, Underfitting, and Good Fit.
- **Outcome 0.3**: Formulate business/research problems into ML tasks (Regression, Binary/Multiclass Classification, Ranking, or Retrieval).

#### Track 1: Python & Vectorization Engineering (`track-python`)
- **Outcome 1.1**: Eliminate Python `for`-loops in array computations using NumPy vectorized broadcasting and BLAS vector operations.
- **Outcome 1.2**: Benchmark speedups between pure Python and SIMD/BLAS vectorization on identical matrix sizes.
- **Outcome 1.3**: Write clean, reproducible Python code adhering to typing, deterministic seeding, and memory-conscious slicing.

#### Track 2: Mathematical Foundations for AI (`track-math`)
- **Outcome 2.1**: Perform tensor dot-products and matrix multiplications, explaining physical coordinate transformations and dimensional compatibility.
- **Outcome 2.2**: Compute analytical partial derivatives and execute manual Gradient Descent updates: $\theta \leftarrow \theta - \eta \nabla L(\theta)$.
- **Outcome 2.3**: Calculate Euclidean and Cosine distances between feature vectors and explain the geometry of high-dimensional unit hyperspheres.

#### Track 3: Data Analysis, EDA & Data Leakage Hygiene (`track-data-science`)
- **Outcome 3.1**: Conduct rigorous Exploratory Data Analysis (EDA) on tabular datasets (distributions, skewness, missingness, correlation).
- **Outcome 3.2**: Detect and prevent the 3 major forms of Data Leakage: Target Leakage, Preprocessing Leakage (fitting scalers on the full dataset before splitting), and Temporal/Lookahead Leakage.
- **Outcome 3.3**: Construct leak-free `sklearn.pipeline.Pipeline` workflows that fit only on train folds during Cross-Validation.

#### Track 4: Classical Machine Learning (`track-ml`)
- **Outcome 4.1**: Compute Shannon Entropy $H(S)$ and Information Gain $IG(S, A)$ for optimal Decision Tree split point selection.
- **Outcome 4.2**: Train, tune, and evaluate Logistic Regression, Random Forests, and Gradient Boosted Decision Trees on real-world tabular benchmarks (UCI Breast Cancer).
- **Outcome 4.3**: Analyze Confusion Matrices, Precision, Recall, F1-Score, and ROC-AUC curves rather than relying solely on raw Accuracy.

---

### Applied AI Engineer & Systems Tracks

#### Track 5: Deep Learning & Neural Networks (`track-dl`)
- **Outcome 5.1**: Derive and manually backpropagate errors through a Multi-Layer Perceptron (MLP) using the Chain Rule.
- **Outcome 5.2**: Select appropriate activation functions (ReLU, GELU, Sigmoid, Softmax) and explain vanishing/exploding gradient phenomena.
- **Outcome 5.3**: Implement Mini-batch SGD, Adam optimization, Weight Decay, and Dropout regularization.

#### Track 6: Computer Vision & Spatial Convolutions (`track-computer-vision`)
- **Outcome 6.1**: Compute 2D spatial convolution outputs with custom kernel weights (Sobel horizontal/vertical edge detection, Gaussian blur).
- **Outcome 6.2**: Design CNN architectures incorporating Conv2D, BatchNorm, ReLU, and MaxPooling layers.
- **Outcome 6.3**: Transfer learn using pre-trained vision backbones (ResNet, ConvNeXt) and apply standard data augmentations.

#### Track 7: NLP, Transformers, LLMs & RAG Systems (`track-llm`)
- **Outcome 7.1**: Calculate Scaled Dot-Product Attention $\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$ by hand on token embeddings.
- **Outcome 7.2**: Build Dense Vector Retrieval pipelines using bi-encoder embeddings and Cosine/Inner-Product similarity search.
- **Outcome 7.3**: Construct Grounded RAG pipelines combining semantic chunking, dense vector retrieval, cross-encoder reranking, and citation provenance.

#### Track 8: Generative AI, Diffusion & Multimodal Systems (`track-generative-multimodal`)
- **Outcome 8.1**: Compute CLIP dual-encoder cosine similarity matrix $\mathbf{S}_{ij} = \mathbf{u}_i^\top \mathbf{v}_j$ and symmetric contrastive loss.
- **Outcome 8.2**: Implement the DDPM linear/cosine forward noise schedule $q(x_t \mid x_0)$ and predict denoised signals.
- **Outcome 8.3**: Evaluate multimodal alignment and generative output quality using CLIP-Score and Fréchet Inception Distance (FID).

#### Track 9: AI Agents, Tool Use & Guardrails (`track-ai-agents`)
- **Outcome 9.1**: Implement deterministic ReAct (Reason + Act) loop execution with structured JSON tool invocation.
- **Outcome 9.2**: Enforce maximum iteration bounds, execution timeout watchdogs, and AST static syntax guards on agent code executors.
- **Outcome 9.3**: Implement Prompt Injection defense, hallucination verification filters, and deterministic fallback circuits.

#### Track 10: AI Engineering, MLOps & Production Serving (`track-mlops`)
- **Outcome 10.1**: Measure and optimize Latency Percentiles (P50, P90, P95, P99) and explain Tail Latency amplification.
- **Outcome 10.2**: Implement Population Stability Index (PSI) and Wasserstein Distance monitoring to detect Data and Concept Drift.
- **Outcome 10.3**: Package AI inference into production-grade FastAPI microservices with healthcheck probes, graceful degradation, and canary deployment rollbacks.

#### Track 11: Responsible AI, Fairness & Governance (`track-responsible-ai-security`)
- **Outcome 11.1**: Calculate the Disparate Impact Ratio (DIR) and verify compliance with the Four-Fifths (80%) Rule across protected demographic attributes.
- **Outcome 11.2**: Identify hidden proxy variables that defeat "Fairness through Unawareness".
- **Outcome 11.3**: Audit open-source datasets and pre-trained weights for SPDX license compliance (distinguishing permissive MIT/Apache-2.0 from restrictive CC BY-NC).

#### Track 12: AI Research Literacy & Ablation Methodology (`track-ai-research`)
- **Outcome 12.1**: Critically read top-tier AI papers (arXiv, NeurIPS, ICML, CVPR) using the 3-pass reading methodology.
- **Outcome 12.2**: Design systematic Ablation Studies isolating the empirical contribution of each individual component or hyperparameter.
- **Outcome 12.3**: Report multi-seed evaluation results with sample mean, standard deviation, and confidence intervals to prevent seed hacking.

#### Track 13: Applied AI Specializations (Time-Series) (`track-applied-specializations`)
- **Outcome 13.1**: Compute Exponentially Weighted Moving Average (EWMA) and dynamic variance bands for real-time streaming telemetry.
- **Outcome 13.2**: Detect multivariate streaming anomalies without lookahead bias on real telemetry benchmarks (NAB).
- **Outcome 13.3**: Formulate domain-specific constraints for industrial, financial, and healthcare AI systems.

#### Track 14: Capstone Projects & Production Portfolio (`track-capstone`)
- **Outcome 14.1**: Build an end-to-end, production-grade AI system fulfilling a complete capstone specification.
- **Outcome 14.2**: Pass the Gate-Guarded Composite Production Evaluator score across Model Quality, Groundedness, Resource Efficiency, P99 SLA, and Security/License compliance.
- **Outcome 14.3**: Author an evidence-based Engineering Report including baseline comparisons, error analysis on at least 10 real failure cases, and a rollback runbook.
