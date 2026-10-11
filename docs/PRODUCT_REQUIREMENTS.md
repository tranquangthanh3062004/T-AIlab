# Product Requirements Document (PRD) — CHINAI AI Learning OS

**Product Name:** CHINAI — AI Learning Operating System  
**Product Version:** 2.0.0 (Production Release)  
**Status:** Approved for Production Deployment  
**Audience:** Engineering, Instructional Design, Product Management, DevOps  

---

## 1. Product Vision & Core Mission

### 1.1 Core Promise
> **"Học AI từ số không. Xây dựng hệ thống AI thực chiến. Cập nhật nhịp đập nghiên cứu toàn cầu."**  
> *"Learn AI from zero. Build real AI systems. Stay current with the global AI ecosystem."*

CHINAI is an integrated AI Learning Operating System engineered to bridge the critical divide between passive, surface-level online video courses and the intimidating complexity of enterprise machine learning engineering.

### 1.2 The Three Interconnected Pillars
1. **Beginner-Friendly AI Education (Học tập tương tác):** Structured 7-track curriculum with Duolingo-inspired habit loops, Khan Academy-grade mathematical formula guides, and interactive visual simulators.
2. **Professional Engineer Workspace (Không gian kỹ sư):** VS Code-inspired Monaco IDE with stateful file management, dataset inspection, experiment tracking, and an AST-firewalled local Python sandbox.
3. **AI News Radar & Grounded Tutor (Radar tin tức & Gia sư AI):** Source-verified research intelligence from arXiv, OpenAI, Google DeepMind, and Hugging Face, paired with a context-grounded AI Tutor providing verifiable citations.

---

## 2. Target Personas & User Journeys

### Persona A: Người mới bắt đầu (Curious Beginners & Transitioning Students)
- **Profile:** Software developers or STEM students with no formal AI/ML background.
- **Pain Points:** Overwhelmed by dense academic papers and opaque mathematical symbols ($\sum, \nabla, \mathbb{E}, \mathbf{W}^T$).
- **User Journey:**
  1. Complete the 4-question **Đánh giá năng lực (Diagnostic Assessment)** to establish their recommended entry point.
  2. Progress through Track A (Nền tảng AI) and Track C (Toán học cho AI).
  3. Study formulas using **Hướng dẫn công thức chi tiết (Formula Guide)** with clear symbol breakdown tables and concrete arithmetic walkthroughs.
  4. Experiment with interactive 2D canvas widgets (Perceptron boundary, Gradient Descent parabola).
  5. Earn daily streaks 🔥, XP ⚡, and level tier badges 🏆.

### Persona B: Kỹ sư AI thực chiến (Practicing AI Engineers & Developers)
- **Profile:** Software engineers transitioning into Machine Learning, Deep Learning, and LLM Engineering.
- **Pain Points:** Need hands-on code execution, dataset inspection, and rapid prototyping without maintaining complex local environments.
- **User Journey:**
  1. Switch seamlessly to **Không gian kỹ sư (Engineer Workspace)**.
  2. Create multi-file projects (`main.py`, `train.py`, `dataset.csv`).
  3. Execute algorithmic scripts against the AST-firewalled Python runner with real-time stdout/stderr console feedback.
  4. Inspect tabular datasets in the **Thanh tra dữ liệu (Dataset Inspector)**.
  5. Log and compare hyperparameters in the **Theo dõi thử nghiệm (Experiment Tracker)**.

### Persona C: Nhà nghiên cứu & Tech Leads (AI Researchers & Team Leads)
- **Profile:** Researchers and engineering managers tracking cutting-edge breakthroughs.
- **Pain Points:** Information overload, vendor hype, unverified AI claims.
- **User Journey:**
  1. Monitor **Radar tin tức AI (News Radar)** for daily canonicalized papers from arXiv AI, OpenAI, and DeepMind.
  2. Filter by category, difficulty level, and verified claim status (`PEER_REVIEWED` vs `PREPRINT` vs `VENDOR_CLAIM`).
  3. Query the **Gia sư AI (AI Tutor)** in Engineer Mode for concise technical summaries with direct citations.
  4. Bookmark critical articles for offline study.

---

## 3. Detailed Functional Requirements

### 3.1 Pillar 1: Learn Mode (AI Education)
- **FR 1.1 — Complete 7-Track Curriculum Hierarchy:**
  - Track 1: Nền tảng AI (`fnd`) — Định nghĩa, Vòng đời ML, Học có giám sát vs Không giám sát vs RL, Overfitting, AI có trách nhiệm.
  - Track 2: Python cho AI (`py`) — Primitives, Cấu trúc dữ liệu, Thư viện NumPy, Pandas, Vector hóa.
  - Track 3: Toán học cho AI (`mth`) — Vectors, Ma trận, Đạo hàm & Gradient Descent, Xác suất thống kê.
  - Track 4: Học máy thực hành (`ml`) — Tiền xử lý dữ liệu, Hồi quy tuyến tính, Logistic, Cây quyết định, Đánh giá mô hình.
  - Track 5: Học sâu (`dl`) — Perceptron, Lan truyền ngược (Backpropagation), PyTorch, CNNs, Transformers cơ bản.
  - Track 6: Kỹ thuật LLM (`llm`) — Tokenization, Embeddings, Prompt Engineering, RAG, Tool Calling, Vector Search.
  - Track 7: Hệ thống AI & MLOps (`ops`) — Model Serving, Độ trễ, Giám sát Data Drift, Tối ưu hóa chi phí.
- **FR 1.2 — Mathematical Formula Scaffolding (`FormulaGuide`):**
  - Every math-heavy lesson must render a structured `FormulaGuide` card.
  - Must define: Formula equation, core objective, variable symbols table (symbol, name, meaning), and step-by-step arithmetic walkthrough with sample numbers.
  - Zero raw, unrendered or cryptic mathematical syntax.
- **FR 1.3 — Interactive Visual Widgets:**
  - Canvas-based Perceptron boundary simulator with real-time weight sliders ($w_1, w_2, b$).
  - Canvas-based Gradient Descent simulator with learning rate slider ($\eta$) and iteration steps.
- **FR 1.4 — Quiz & Exercise Engine:**
  - Multiple-choice questions with deterministic scoring (70% passing grade).
  - Practical code exercises validated via AST sandbox assertion tests.
- **FR 1.5 — Diagnostic Placement:**
  - 4-question adaptive placement test recommending Foundations, Intermediate, or Advanced tracks.
- **FR 1.6 — Gamification Mechanics:**
  - Daily Streak Counter 🔥 (persisted in SQLite).
  - Total XP points ⚡.
  - 5 Level Tiers 🏆 (Khám phá, Đồng, Bạc, Vàng, Kim cương).
  - 6 Achievement Badges (Bước chân đầu tiên, Thần tốc toán học, Thợ săn bug, Bậc thầy học máy, Nhà kiến trúc LLM, Kỷ luật thép).

### 3.2 Pillar 2: Engineer Workspace (Developer IDE)
- **FR 2.1 — Monaco Editor Integration:**
  - High-density code editor with syntax highlighting, line numbers, and active tab management.
  - Preserves dirty-state and open tabs across view navigation.
- **FR 2.2 — Multi-File Project Management:**
  - Create, view, edit, and switch files with extension-sensitive default templates (`.py`, `.csv`, `.json`).
- **FR 2.3 — AST-Firewalled Execution Runner:**
  - Static AST security inspection rejecting banned modules (`os`, `subprocess`, `sys`, `socket`, `shutil`, `ctypes`, `eval`, `exec`).
  - Disposable worker subprocess with 5-second execution watchdog timeout.
  - True stdout/stderr stream capture with zero fabricated outputs.
- **FR 2.4 — Tabular Dataset Inspector:**
  - Preview CSV datasets with column data types, row counts, and summary statistics.
- **FR 2.5 — ML Experiment Tracker:**
  - Table view of experiment runs recording hyperparameters, epochs, learning rates, loss, and validation scores.

### 3.3 Pillar 3: AI News Radar (Intelligence Hub)
- **FR 3.1 — Upstream Source Connectors:**
  - Automated feed ingestion from arXiv AI (`cs.AI`, `cs.LG`), OpenAI, Google DeepMind, and Hugging Face.
- **FR 3.2 — Deduplication Pipeline:**
  - Canonical URL normalization (stripping tracking queries and trailing slashes).
  - SHA-256 content hash deduplication.
- **FR 3.3 — Structured Analytical Summaries:**
  - Summaries structured into: What happened? What is new? Why does it matter? Who should care?
  - Claim validation tags: `PEER_REVIEWED`, `PREPRINT`, `VENDOR_CLAIM`.
- **FR 3.4 — Filtering & Bookmarking:**
  - Filter by category and difficulty (Beginner vs Deep Technical).
  - Persistent bookmarking stored in database.

### 3.4 Pillar 4: AI Tutor (Knowledge Retrieval)
- **FR 4.1 — Grounded Retrieval:**
  - BM25-style keyword search over verified curriculum lessons and news records.
- **FR 4.2 — Verifiable Citations Guarantee:**
  - All responses include authenticated citations linking to platform lesson IDs or news IDs. Zero hallucinated external links.
- **FR 4.3 — Dual-Mode Tone:**
  - Beginner Mode (approachable metaphors, gentle guidance) vs Engineer Mode (concise code, architecture tradeoffs).
- **FR 4.4 — Prompt Injection Firewall:**
  - Strict XML boundaries preventing user queries from hijacking system prompts.

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Localization & Language Separation
- **NFR 1.1 — Vietnamese-First UX:** Default interface in clear, natural Vietnamese.
- **NFR 1.2 — Instant Language Switcher:** Header toggle `[VI / EN]` switches all UI labels immediately without page reload.
- **NFR 1.3 — Preserved Technical Terminology:** Keep universal AI terms (Backpropagation, Gradient Descent, Vector Embeddings, Loss Function) alongside Vietnamese explanations.

### 4.2 Design System & Aesthetics
- **NFR 2.1 — Calming Pastel Palette:** Soft slate-50 backgrounds, sky-blue primary actions, pastel emerald success badges.
- **NFR 2.2 — High Legibility:** Generous whitespace, clean typographic hierarchy, avoidance of harsh high-contrast neon or black blocks.
- **NFR 2.3 — Responsive Layout:** Adaptive layouts supporting desktop and tablet screen widths.

### 4.3 Performance & Reliability
- **NFR 3.1 — Low Latency:** API endpoints respond in < 50ms p95.
- **NFR 3.2 — Lightweight Bundle:** Frontend production bundle < 400 kB uncompressed (< 120 kB gzip).
- **NFR 3.3 — Instant Health Check:** `GET /api/health` returns HTTP 200 within 5ms.

### 4.4 Security & Privacy
- **NFR 4.1 — AST Sandboxing:** 100% rejection of unauthorized system calls before execution.
- **NFR 4.2 — Process Isolation:** Subprocesses terminated strictly after 5 seconds to prevent CPU exhaustion.
- **NFR 4.3 — Zero Secret Leakage:** No client-side storage of secret tokens or backend administrative keys.
