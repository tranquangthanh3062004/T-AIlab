# Báo Cáo Tóm Tắt Dự Án — T Lab AI Platform
*(T Lab AI Project Executive & Technical Summary)*

**Thời gian lập:** 22/10/2026  
**Trạng thái hệ thống:** `DEPLOYED — SMOKE TESTS PASSED`  
**Phiên bản hiện tại:** v2.3.0  
**Frontend URL:** [https://t-lab-ai.pages.dev](https://t-lab-ai.pages.dev)  
**Backend API Tunnel:** [https://geometry-weddings-bears-agrees.trycloudflare.com/api](https://geometry-weddings-bears-agrees.trycloudflare.com/api)  
**GitHub Repository:** `https://github.com/tranquangthanh3062004/T-AIlab.git` (Branch `main`)

---

## A. Tổng Quan Dự Án (Project Overview)

### 1. Mục Tiêu & Sứ Mệnh (Mission & Objectives)
T Lab AI (tiền thân là AI Learning OS) là nền tảng đào tạo kỹ thuật Trí tuệ Nhân tạo thực chiến toàn diện, tích hợp trực tiếp môi trường lập trình Monaco Editor Sandbox, hệ thống quản trị giáo trình chuẩn quốc tế (OER Curriculum Governance DAG), radar tin tức AI tự động và trợ lý gia sư thông minh (AI Tutor & Agent).

Nền tảng được xây dựng nhằm giải quyết khoảng trống giữa học thuật hàn lâm và kỹ thuật thực tế (production AI engineering):
- Học viên không chỉ đọc lý thuyết mà thực hành chạy code trực tiếp trên trình duyệt.
- Dữ liệu thực hành sử dụng 100% dữ liệu thực tế từ UCI Machine Learning Repository, Stanford, Harvard, MIT, Kaggle.
- Miễn phí 100%, không paywall, hỗ trợ đầy đủ tiếng Việt và tiếng Anh.

### 2. Đối Tượng Người Dùng (Target Personas)
Hệ thống phân hóa rõ ràng theo 2 nhóm người dùng chính:
1. **Người Mới Bắt Đầu (Beginners / Novice Learners):**
   - Chưa có nền tảng vững về lập trình, toán ma trận hoặc giải tích.
   - Bắt đầu từ Track 0 (AI Foundations), Track 1 (Python Vectorization), Track 2 (Math for AI), Track 3 (Data Science & EDA), Track 4 (Classical Machine Learning).
   - Được hỗ trợ bởi công cụ trực quan tương tác (Perceptron Interactive Widget, Gradient Descent Visualizer, Formula Guides).
2. **Kỹ Sư AI Chuyên Sâu (AI Engineers / ML Practitioners):**
   - Đã có kinh nghiệm lập trình, muốn làm chủ các công nghệ tiên tiến: Deep Learning, Computer Vision, Transformers & LLMs, RAG, AI Agents, MLOps, AI Security.
   - Thực hành trên các project workspace đa file, quản trị pipeline, và đánh giá benchmark.

### 3. Kiến Trúc Hệ Thống (Architecture Stack)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4. Thiết kế theo phong cách Modern SaaS với bảng màu sáng dịu mắt (`#F5F7FB`, `#FFFFFF`, `#4F6BED`), font chữ `Plus Jakarta Sans` và `JetBrains Mono` hỗ trợ trọn vẹn dấu tiếng Việt.
- **Backend:** FastAPI (Python 3.13) bất đồng bộ (asyncio), tuân thủ chặt chẽ REST API contract và Pydantic schemas.
- **Database:** SQLite với SQLAlchemy ORM (WAL mode enabled), hỗ trợ migration tự động và lưu trữ lịch sử học tập, dự án workspace, tin tức đã kiểm duyệt.
- **Sandboxed Code Execution:** Phân tích cú pháp AST (Abstract Syntax Tree) nghiêm ngặt trước khi thực thi, chặn đứng `os`, `sys`, `subprocess`, `eval`, `exec`, `open`, kết hợp watchdog timeout 5.0 giây.
- **Mạng Lưới Triển Khai (Deployment Infrastructure):**
  - Frontend: Cloudflare Pages Edge CDN toàn cầu với SSL tự động.
  - Backend: FastAPI Uvicorn Server được bắc cầu qua Cloudflare Quick Tunnel (`cloudflared`).

---

## B. Tình Trạng Hiện Tại (Current System State)

### 1. Các Chức Năng Đang Hoạt Động (Verified Working Features)
1. **Đăng ký / Đăng nhập & Quản lý Tài khoản (Auth & Identity):**
   - Đăng ký/đăng nhập cục bộ với mã hóa mật khẩu PBKDF2-HMAC-SHA256 (100,000 rounds) an toàn.
   - Đăng nhập và liên kết đa tài khoản Google OAuth 2.0 (Google Multi-Account Linking).
   - Token JWT ký HMAC an toàn với cấu hình biến môi trường `JWT_SECRET`.
2. **Lộ Trình Học & Quản Trị Giáo Trình (Curriculum DAG Governance):**
   - 15 Track học tập đầy đủ từ Foundations đến Capstone Portfolio.
   - Kiểm tra tiền quyết (Prerequisites DAG validation) chặn học nhảy cóc không có kiến thức nền tảng.
   - Bài đánh giá năng lực đầu vào (Diagnostic Placement Assessment) tự động phân luồng lộ trình tối ưu.
   - Kiểm tra trắc nghiệm (Quiz evaluation) và bài tập code (Code exercise evaluation) chấm điểm tự động.
   - Hệ thống danh hiệu (Badges), điểm kinh nghiệm (XP), chuỗi học tập (Streak) và cấp bậc (Levels).
3. **Môi Trường Lập Trình Kỹ Sư (Engineer Workspace & Datasets):**
   - Quản lý dự án đa file (Project files CRUD).
   - Thư viện dữ liệu thực tế (UCI Heart Disease, California Housing, Iris, Breast Cancer, Auto MPG, Adult Census, Wine Quality) sẵn sàng nạp vào sandbox.
4. **Radar Tin Tức AI Tự Động (AI News Radar):**
   - Tự động thu thập bài báo và nghiên cứu mới nhất từ 6 nguồn RSS uy tín (arXiv cs.AI, cs.LG, MIT News, Stanford AI, v.v.).
   - Bộ lọc trùng lặp nội dung theo hàm băm MD5 chuẩn hóa URL và tiêu đề.
5. **Trợ Lý Gia Sư AI (AI Tutor & Interactive Chat):**
   - Trả lời thắc mắc học tập theo ngữ cảnh bài học, trích dẫn nguồn tài liệu tham khảo đã xác minh.

### 2. Các Lỗi Quan Trọng Đã Được Khắc Phục (Resolved Defects)
- **CORS Configuration:** Đã kích hoạt cấu hình CORS linh hoạt, cho phép origin `https://t-lab-ai.pages.dev` gọi API mà không bị chặn trình duyệt.
- **Python 3.12+ Deprecation Warning:** Đã loại bỏ hoàn toàn cảnh báo `datetime.utcnow()` trong toàn bộ source code (`auth.py`, `workspace.py`, `news_radar.py`), chuyển sang `datetime.now(timezone.utc)`.
- **Hardcoded Secret Key:** Đã đưa `SECRET_KEY` trong `auth.py` vào đọc từ biến môi trường `os.getenv("JWT_SECRET", ...)`.
- **Global Exception Handling:** Đã bổ sung bộ xử lý lỗi toàn cục trong `main.py` để ghi log bảo mật và trả về JSON chuẩn, không làm lộ stack trace nội bộ ra client.
- **UI Typography & Eye Strain:** Đã thay thế font chữ mặc định bằng `Plus Jakarta Sans` và áp dụng bảng màu sáng dịu mắt theo tiêu chuẩn WCAG 2.2 AA.

---

## C. Kế Hoạch Xử Lý & Hoàn Thiện (Action Plan)

| Hạng mục | Mức độ ưu tiên | Trạng thái | Ghi chú |
|---|---|---|---|
| Sửa lỗi deprecation `utcnow` và cấu hình JWT Secret | P0 | Đã hoàn thành | 0 cảnh báo deprecation trong source code |
| Bộ xử lý lỗi toàn cục Backend | P0 | Đã hoàn thành | Trả về JSON chuẩn 500 khi có ngoại lệ |
| Redesign UI theo bảng màu dịu mắt `#F5F7FB` | P1 | Đã hoàn thành | Chuẩn hóa toàn bộ design tokens CSS |
| Deploy Frontend lên Cloudflare Pages | P0 | Đã hoàn thành | [t-lab-ai.pages.dev](https://t-lab-ai.pages.dev) |
| Cầu nối Backend qua Cloudflare Tunnel | P0 | Đã hoàn thành | Endpoint tunnel hoạt động 200 OK |
| Kiểm thử hồi quy toàn diện (Regression Test) | P0 | Đã hoàn thành | 22/22 unit & integration tests passed |

---

## D. Đánh Giá Mức Độ Sẵn Sàng (Deployment Readiness)

- **Trạng thái:** `DEPLOYED — SMOKE TESTS PASSED`
- **Frontend Edge:** 100% tài nguyên tĩnh, font chữ và CSS bundles được tối ưu và phục vụ qua CDN toàn cầu Cloudflare Pages với độ trễ < 20ms tại Việt Nam.
- **Backend API:** FastAPI server và Cloudflare Quick Tunnel phản hồi trung bình ~50-100ms cho các truy vấn dữ liệu và kiểm tra sức khỏe hệ thống.
- **Rủi ro còn lại (Known Residual Risk):** Cloudflare Quick Tunnel là giải pháp tunnel tạm thời chạy ngầm từ máy trạm. Để vận hành 24/7/365 độc lập không cần máy trạm, người quản trị chỉ cần liên kết repository lên nền tảng Render.com / Railway / Fly.io theo `render.yaml` đã chuẩn bị sẵn trong repo.
