# CHINAI AI Learning OS (`T AIlab`) — Kế Hoạch Triển Khai Production Trên Server Miễn Phí (Zero-Cost Production Deployment Plan)

**Dự án:** CHINAI AI Learning OS (`T AIlab`)  
**Repository:** `https://github.com/tranquangthanh3062004/T-AIlab.git`  
**Chi phí vận hành:** **$0 / tháng (100% Free Forever)**  
**Mục tiêu:** Đưa toàn bộ hệ thống (Frontend SPA, Backend FastAPI, Sandboxed Code Execution, AI Tutor, News Radar) lên môi trường trực tuyến với độ tin cậy cao, SSL HTTPS tự động, CI/CD tự động khi push code.

---

## 1. Ma Trận Kiến Trúc Triển Khai Miễn Phí (Cloud Architecture Options)

Hệ thống bao gồm 2 thành phần độc lập: **Frontend SPA (React/Vite)** và **Backend API (FastAPI + Python Sandbox)**. Dưới đây là 3 phương án kiến trúc miễn phí tối ưu nhất:

| Thành phần | Lựa chọn Khuyên dùng (Phương án A) | Lựa chọn AI/ML Chuyên dụng (Phương án B) | Lựa chọn VPS Tự quản trị (Phương án C) |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** (Hobby Free) | **Cloudflare Pages** (Free Unlimited) | **Nginx trên VPS** |
| **Backend API** | **Render.com** (Free Web Service) | **Hugging Face Spaces** (Docker 16GB RAM) | **Oracle Cloud Always Free VPS** |
| **Database** | **Render SQLite / Neon.tech PostgreSQL** | **SQLite Persistent Storage** | **PostgreSQL / SQLite trên VPS** |
| **Keep-Alive (Chống ngủ)** | **UptimeRobot / cron-job.org** (Ping 10m) | Không cần (chạy liên tục) | Không cần (VPS chạy 24/7) |
| **Chi phí** | **$0** (Không cần thẻ tín dụng) | **$0** (Không cần thẻ tín dụng) | **$0** (Cần thẻ xác minh $1 hoàn lại) |
| **Ưu điểm** | Setup siêu nhanh, giao diện trực quan, CI/CD tự động | 16GB RAM, 2 vCPU, tối ưu cho AI & Sandbox code | Toàn quyền kiểm soát, không bị giới hạn sleep |

> [!TIP]
> **Khuyến nghị triển khai Phương án A (Vercel + Render + Neon/SQLite)** vì đây là combo tiêu chuẩn ngành, dễ cấu hình nhất, kết nối trực tiếp với GitHub repo và tự động deploy mỗi khi bạn push code vào nhánh `main`.

---

## 2. Kế Hoạch Triển Khai Chi Tiết Từng Giai Đoạn

### Giai đoạn 1: Chuẩn bị Codebase & Cấu hình Repository
1. Thêm file cấu hình chuyển hướng `frontend/vercel.json` để hỗ trợ SPA Routing và Reverse Proxy `/api`.
2. Linh hoạt hóa biến `API_BASE` trong `frontend/src/services/api.ts` để nhận `VITE_API_URL` từ môi trường.
3. Thêm `Dockerfile` cho Backend phục vụ Render hoặc Hugging Face Spaces.
4. Cấu hình `backend/render.yaml` để tự động hóa hạ tầng (Infrastructure as Code).

---

### Giai đoạn 2: Triển khai Backend API lên Render.com

#### Bước 2.1: Đăng ký & Kết nối GitHub
1. Truy cập [render.com](https://render.com) và đăng ký bằng tài khoản **GitHub**.
2. Nhấp vào **New +** > chọn **Web Service**.
3. Chọn kết nối với repository **`tranquangthanh3062004/T-AIlab`**.

#### Bước 2.2: Thiết lập thông số Web Service
- **Name:** `t-ailab-backend` (hoặc tên bạn chọn).
- **Region:** `Singapore` (để tối ưu độ trễ cho người dùng Việt Nam) hoặc `Oregon`.
- **Branch:** `main`.
- **Root Directory:** `backend`.
- **Runtime:** `Python 3`.
- **Build Command:**
  ```bash
  pip install --upgrade pip && pip install -r requirements.txt
  ```
- **Start Command:**
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
- **Instance Type:** `Free` (512 MB RAM, 0.1 vCPU).

#### Bước 2.3: Cấu hình Biến Môi trường (Environment Variables)
Trong tab **Environment**, thêm các cặp Key/Value:
- `PYTHONPATH`: `.`
- `PROJECT_NAME`: `CHINAI AI Learning OS`
- `CORS_ORIGINS`: `https://t-ailab.vercel.app,https://*.vercel.app,http://localhost:5173`
- *(Tùy chọn)* `DATABASE_URL`: Để mặc định để dùng SQLite, hoặc dán chuỗi kết nối PostgreSQL từ **Neon.tech** (miễn phí) nếu muốn database vĩnh viễn không mất dữ liệu.

#### Bước 2.4: Deploy & Lấy URL Backend
- Nhấp **Create Web Service**. Render sẽ bắt đầu build và khởi chạy.
- Sau 2-3 phút, bạn sẽ nhận được URL công khai dạng:
  `https://t-ailab-backend.onrender.com`
- Kiểm tra bằng cách mở trình duyệt vào: `https://t-ailab-backend.onrender.com/api/health`  
  Kết quả trả về JSON: `{"status":"healthy","service":"chinai","version":"2.0.0"}` là thành công!

---

### Giai đoạn 3: Triển khai Frontend SPA lên Vercel

#### Bước 3.1: Đăng ký & Import Project trên Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản **GitHub**.
2. Nhấp **Add New...** > **Project**.
3. Tìm và chọn repository **`T-AIlab`**, bấm **Import**.

#### Bước 3.2: Cấu hình Build & Root Directory
- **Framework Preset:** `Vite` (Vercel tự động nhận diện).
- **Root Directory:** Bấm **Edit** và chọn thư mục `frontend`.
- **Build Command:** `npm run build`.
- **Output Directory:** `dist`.
- **Install Command:** `npm ci` (hoặc `npm install`).

#### Bước 3.3: Cấu hình Biến Môi trường Frontend
Trong mục **Environment Variables**, thêm:
- **Key:** `VITE_API_URL`
- **Value:** `https://t-ailab-backend.onrender.com/api` (Thay bằng URL Render thật của bạn từ Giai đoạn 2).

#### Bước 3.4: Deploy & Kiểm tra
- Bấm **Deploy**. Vercel sẽ biên dịch TypeScript và đóng gói trong vòng ~45-60 giây.
- Bạn sẽ nhận được URL production dạng:
  `https://t-ailab.vercel.app` (hoặc `https://t-ailab-*.vercel.app`).

---

### Giai đoạn 4: Kỹ thuật Khắc Phục Các Giới Hạn Của Server Miễn Phí (Crucial Free-Tier Workarounds)

#### 1. Xử lý "Ngủ đông" trên Render (Spin Down after 15 minutes of inactivity)
- **Vấn đề:** Gói Free của Render sẽ tự tắt server sau 15 phút không có lượt truy cập. Lần gọi lại tiếp theo sẽ mất 30-50 giây (Cold Start).
- **Giải pháp MIỄN PHÍ:**
  1. Đăng ký tài khoản miễn phí tại [UptimeRobot.com](https://uptimerobot.com) hoặc [cron-job.org](https://cron-job.org).
  2. Tạo một **Monitor (HTTP)** mới:
     - **URL:** `https://t-ailab-backend.onrender.com/api/health`
     - **Monitoring Interval:** `10 minutes` (10 phút / lần).
  3. **Kết quả:** UptimeRobot sẽ tự động gửi request "đánh thức" server 10 phút một lần, giữ cho Backend luôn ở trạng thái Online 24/7 và loại bỏ hoàn toàn hiện tượng Cold Start!

#### 2. Xử lý Dữ liệu Bền vững (Persistent Storage cho SQLite)
- **Vấn đề:** Trên Render gói Free, file SQLite `backend/data/platform.db` nằm trên ổ đĩa tạm (Ephemeral), sẽ bị reset nếu service khởi động lại do deploy phiên bản mới.
- **Giải pháp MIỄN PHÍ:**
  - **Cách 1 (Khuyên dùng cho Production):** Đăng ký tài khoản miễn phí tại [Neon.tech](https://neon.tech) (PostgreSQL Serverless Free 500MB). Tạo 1 database, copy connection string dán vào biến môi trường `DATABASE_URL` trên Render. SQLAlchemy trong backend sẽ tự động kết nối và dữ liệu tài khoản/tiến độ học tập sẽ được lưu trữ vĩnh viễn an toàn!
  - **Cách 2:** Sử dụng **Hugging Face Spaces (Phương án B)** có hỗ trợ Persistent Storage miễn phí.

---

### Giai đoạn 5: Checklist Nghiệm Thu Sau Triển Khai (Post-Deployment Verification)

Sau khi deploy thành công, thực hiện kiểm tra 8 tính năng cốt lõi:
1. [ ] **Trang chủ & Giao diện:** Truy cập `https://t-ailab.vercel.app`, kiểm tra logo hoạt họa SVG, Dark/Light Mode và chuyển đổi ngôn ngữ Việt/Anh.
2. [ ] **Đăng ký & Đăng nhập:** Tạo tài khoản mới, kiểm tra lưu JWT token và liên kết Google Account.
3. [ ] **Lộ trình học tập (Curriculum):** Mở `Track 0` đến `Track 14`, kiểm tra hiển thị công thức `FormulaGuide` và bộ dữ liệu `LessonDataset`.
4. [ ] **Thẻ nhớ Flashcards:** Bấm lật thẻ Active Recall, kiểm tra hiệu ứng hiển thị câu trả lời.
5. [ ] **Lập trình Monaco Sandbox:** Mở bài tập thực hành, bấm "Chạy & Xác thực mã", kiểm tra code Python thực thi và trả về kết quả trong vòng < 2 giây.
6. [ ] **Trắc nghiệm (Quiz):** Làm bài trắc nghiệm và kiểm tra hệ thống tính điểm, mở khóa bài học tiếp theo.
7. [ ] **AI News Radar:** Kiểm tra tab Tin tức AI tải các bài báo mới nhất từ RSS feeds.
8. [ ] **Trợ lý AI Gia sư (Socratic Tutor):** Đặt câu hỏi trong chatbox góc phải màn hình, kiểm tra phản hồi gợi mở có trích dẫn nguồn.

---

## 3. Lịch Trình Thực Hiện (Timeline)

| Bước | Nội dung công việc | Thời gian dự kiến | Người thực hiện |
| :---: | :--- | :---: | :---: |
| **1** | Cập nhật cấu hình codebase (`vercel.json`, `render.yaml`, `api.ts`) & push lên GitHub | 10 phút | Antigravity AI |
| **2** | Đăng ký & cấu hình Web Service Backend trên Render.com | 10 phút | Người dùng |
| **3** | Đăng ký & deploy Frontend trên Vercel | 5 phút | Người dùng |
| **4** | Thiết lập UptimeRobot ping chống ngủ đông | 5 phút | Người dùng |
| **5** | Kiểm thử End-to-End toàn bộ hệ thống | 10 phút | Cả hai |
| **Tổng** | **Sẵn sàng vận hành Production toàn cầu** | **~40 phút** | **Zero Cost** |
