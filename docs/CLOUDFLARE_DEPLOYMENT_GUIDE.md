# T Lab AI — Kế Hoạch & Hướng Dẫn Triển Khai Production Trên Cloudflare Hoàn Toàn Miễn Phí ($0/Tháng)

Tài liệu này hướng dẫn chi tiết quy trình triển khai toàn bộ hệ thống **T Lab AI** lên hạ tầng **Cloudflare Pages** kết hợp Backend API miễn phí với chi phí vận hành **0 VNĐ / $0 trọn đời**, tốc độ Edge CDN toàn cầu siêu tốc (<50ms), tự động cấp chứng chỉ SSL/TLS và CI/CD tự động khi push code lên GitHub.

---

## 1. Kiến Trúc Hệ Thống Trên Cloudflare ($0 Cost Architecture)

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   Cloudflare Edge CDN                   │
                    │               (300+ Data Centers Toàn Cầu)             │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     │                                                     │
                     ▼                                                     ▼
     ┌───────────────────────────────┐                     ┌───────────────────────────────┐
     │    Cloudflare Pages (SPA)     │                     │   Pages Proxy (_redirects)    │
     │  - React 19 + Vite 8 + TS     │                     │   /api/*  ───►  Backend API   │
     │  - Băng thông KHÔNG GIỚI HẠN  │                     │   - Triệt tiêu hoàn toàn CORS │
     │  - Miễn phí SSL & Edge Cache  │                     │   - Tăng tốc phản hồi qua CDN │
     └───────────────────────────────┘                     └───────────────┬───────────────┘
                                                                           │
                                                                           ▼
                                                           ┌───────────────────────────────┐
                                                           │   Python FastAPI Backend      │
                                                           │   (Render.com / HF Spaces)    │
                                                           │   - AST Code Sandbox          │
                                                           │   - 15 Tracks Curriculum      │
                                                           │   - AI News & RAG Tutor       │
                                                           └───────────────┬───────────────┘
                                                                           │
                                                                           ▼
                                                           ┌───────────────────────────────┐
                                                           │ Keep-Alive Liveness Pinger    │
                                                           │ (Cron-job.org / UptimeRobot)  │
                                                           │ - Ping mỗi 10 phút (Chống ngủ)│
                                                           └───────────────────────────────┘
```

### Tại sao kiến trúc Cloudflare Pages là lựa chọn số 1?
1. **Băng thông không giới hạn (Unlimited Bandwidth):** Khác với Vercel (giới hạn 100GB/tháng ở gói Free), Cloudflare Pages cung cấp băng thông truyền tải dữ liệu hoàn toàn miễn phí không giới hạn.
2. **Không có độ trễ khởi động (Zero Cold Start):** Frontend là Static Single Page App (SPA) được lưu trữ trực tiếp trên mạng lưới máy chủ biên Edge của Cloudflare tại hơn 300 thành phố (bao gồm Hà Nội và TP.HCM).
3. **Bảo mật chuẩn Doanh nghiệp:** Chống tấn công DDoS miễn phí, tự động kích hoạt HTTP/3, TLS 1.3 và nén dữ liệu Brotli/Gzip.
4. **Proxy ngược thông minh (`_redirects`):** Frontend gửi request tới `/api/...`, Cloudflare tự động chuyển tiếp đến máy chủ backend, người dùng không bao giờ gặp lỗi CORS trình duyệt.

---

## 2. Hướng Dẫn Từng Bước Triển Khai Cloudflare Pages (Frontend)

### Bước 1: Chuẩn bị Repository trên GitHub
Repository hiện tại của dự án:
`https://github.com/tranquangthanh3062004/T-AIlab.git` (nhánh `main`)

Đảm bảo mã nguồn đã được push các commit mới nhất chứa cấu hình Cloudflare:
- File `frontend/public/_redirects`: Định tuyến SPA và proxy API.
- File `frontend/public/_headers`: Tối ưu cache và bảo mật.

### Bước 2: Đăng nhập Cloudflare Dashboard
1. Truy cập [https://dash.cloudflare.com/](https://dash.cloudflare.com/) và đăng nhập (hoặc đăng ký tài khoản miễn phí).
2. Tại thanh điều hướng bên trái, chọn **Workers & Pages**.
3. Nhấp vào nút **Create Application** (Tạo ứng dụng) ➔ Chọn tab **Pages** ➔ Chọn **Connect to Git**.

### Bước 3: Liên kết GitHub và Cấu hình Build
1. Chọn tài khoản GitHub của bạn và chọn repository `T-AIlab` (hoặc tên repo bạn đặt).
2. Điền thông số cấu hình chính xác như sau:
   - **Project name:** `t-lab-ai` (hoặc tên bạn muốn, URL sẽ là `https://t-lab-ai.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** `Vite`
   - **Root directory:** `frontend` *(RẤT QUAN TRỌNG: Phải điền `frontend`, không để trống)*
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Nhấp vào mục **Environment variables (advanced)** và thêm:
   - `NODE_VERSION` = `20`
4. Nhấp nút **Save and Deploy**.

Cloudflare Pages sẽ bắt đầu clone code, cài đặt dependencies và build trong khoảng 45–60 giây. Sau khi hoàn thành, bạn sẽ nhận được đường link truy cập trực tiếp:
👉 `https://t-lab-ai.pages.dev`

### Bước 4: Cấu hình Tên Miền Riêng Miễn Phí (Custom Domain - Tùy chọn)
Nếu bạn có tên miền riêng (ví dụ: `tlabai.com`, `tlabai.vn`):
1. Trong trang dự án Cloudflare Pages, chọn tab **Custom domains**.
2. Nhấp **Set up a custom domain** và nhập tên miền của bạn.
3. Nếu tên miền đã trỏ nameservers về Cloudflare, hệ thống sẽ tự động cấu hình bản ghi DNS CNAME và cấp chứng chỉ SSL trong vòng 60 giây.

---

## 3. Triển Khai Backend Miễn Phí ($0 Backend Options)

Do tính năng chạy code Python thực nghiệm trong phòng Lab (Monaco IDE Sandbox) yêu cầu môi trường thực thi Python subprocess an toàn với bộ lọc AST, Backend cần chạy trên một container máy chủ miễn phí.

### Phương án A: Render.com (Khuyến nghị số 1)
Dự án đã có sẵn file cấu hình `render.yaml` chuẩn hóa:
1. Đăng ký tài khoản miễn phí tại [https://render.com](https://render.com).
2. Nhấp **New +** ➔ Chọn **Blueprint** ➔ Kết nối repo GitHub của bạn.
3. Render sẽ tự động đọc `render.yaml` và triển khai Web Service:
   - **Name:** `t-lab-ai-backend`
   - **Region:** `Singapore` (độ trễ thấp nhất cho người dùng Việt Nam)
   - **Plan:** `Free`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Sau khi deploy xong, bạn nhận được URL dạng: `https://t-lab-ai-backend.onrender.com`.

### Phương án B: Hugging Face Spaces (Docker miễn phí, 16GB RAM)
1. Đăng nhập [https://huggingface.co/spaces](https://huggingface.co/spaces).
2. Tạo Space mới: SDK chọn **Docker**, cấu hình Free Tier (2 vCPU, 16GB RAM).
3. Push mã nguồn thư mục `backend/` lên Space.

---

## 4. Chống Ngủ Cho Backend Miễn Phí (Keep-Alive Automation)

Các dịch vụ miễn phí như Render sẽ tạm ngủ sau 15 phút không có lượt truy cập. Để hệ thống hoạt động tức thì 24/7 không có độ trễ:

1. Đăng ký tài khoản miễn phí tại [https://cron-job.org](https://cron-job.org) hoặc [https://uptimerobot.com](https://uptimerobot.com).
2. Tạo 1 tác vụ giám sát mới (Monitor / Cronjob):
   - **URL:** `https://t-lab-ai-backend.onrender.com/api/health`
   - **Tần suất (Schedule):** Mỗi 10 phút một lần (`*/10 * * * *`).
   - **Phương thức:** `GET`
3. **Kết quả:** Backend luôn ở trạng thái nóng (warm state), phản hồi API dưới 100ms mọi lúc cho học viên!

---

## 5. Kết Nối Cloudflare Pages & Backend Hoàn Hảo

File `frontend/public/_redirects` của dự án đã được cài đặt sẵn:
```nginx
/api/* https://t-lab-ai-backend.onrender.com/api/:splat 200
/* /index.html 200
```

Khi bạn deploy lên Render, nếu URL backend của bạn là `https://ten-backend-cua-ban.onrender.com`, bạn chỉ cần chỉnh lại dòng đầu tiên trong `frontend/public/_redirects` tương ứng và git push, Cloudflare Pages sẽ tự động cập nhật ngay lập tức!

---

## 6. Kiểm Thử Hệ Thống Sau Khi Triển Khai

| Tiêu chí | Lệnh / Thao tác kiểm thử | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Edge Cache & SSL** | Truy cập `https://t-lab-ai.pages.dev` | Khóa SSL màu xanh, nạp trang < 0.8 giây |
| **Client Routing (SPA)** | Refresh F5 tại trang bất kỳ | Không bị lỗi 404, giữ nguyên màn hình |
| **Backend API Health** | `curl https://t-lab-ai.pages.dev/api/health` | `{"status":"healthy","service":"t_lab_ai"}` |
| **Monaco Python Sandbox** | Chạy mã Python thử nghiệm trong bài học | Output trả về kết quả chuẩn trong 1.5s |
| **Google Sync** | Đăng nhập tài khoản Google | Lưu profile và streak vào LocalStorage |
