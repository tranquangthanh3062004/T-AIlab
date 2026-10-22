# Hướng Dẫn Triển Khai Hệ Thống — T Lab AI Platform
*(Production Server Deployment Guide & Runbook)*

Tài liệu hướng dẫn chi tiết quy trình triển khai toàn bộ hệ thống **T Lab AI** lên môi trường Production miễn phí và độ ổn định cao.

---

## 1. Kiến Trúc Môi Trường Triển Khai

- **Frontend:** Triển khai tĩnh trên **Cloudflare Pages Edge CDN**.
  - Tự động phân phối qua hơn 300 trung tâm dữ liệu toàn cầu của Cloudflare.
  - Tích hợp sẵn chứng chỉ SSL/TLS miễn phí, HTTP/2 và HTTP/3.
  - Tên miền chính: `https://t-lab-ai.pages.dev`
- **Backend:** Triển khai **FastAPI ASGI Server** kết hợp giải pháp kết nối:
  - *Phương án A (Hiện tại - Đã kích hoạt):* **Cloudflare Quick Tunnel (`cloudflared`)** chuyển tiếp lưu lượng an toàn từ port 8000 ra Internet.
  - *Phương án B (Lâu dài - Không cần máy chủ cá nhân):* Triển khai lên **Render.com Web Service Free Tier** hoặc **Railway / Fly.io / VPS Ubuntu**.

---

## 2. Quy Trình Triển Khai Frontend (Cloudflare Pages)

### Bước 2.1. Chuẩn bị biến môi trường Production
Tạo hoặc cập nhật file `frontend/.env.production`:
```env
VITE_API_URL=https://geometry-weddings-bears-agrees.trycloudflare.com/api
```
*(Nếu chuyển sang Render.com, đổi thành `https://t-lab-ai-backend.onrender.com/api`)*

### Bước 2.2. Kiểm tra và đóng gói (Build Artifacts)
```powershell
Set-Location "C:\Users\ADMIN 88\.gemini\antigravity\scratch\ai-learning-os\frontend"
npm install
npm run build
```
Quá trình build sẽ tạo thư mục `frontend/dist/` chứa các tệp HTML, CSS, JavaScript và assets.

### Bước 2.3. Deploy lên Cloudflare Pages qua Wrangler CLI
```powershell
npx wrangler pages deploy dist --project-name=t-lab-ai
```
Kết quả hiển thị:
```
✨ Success! Uploaded files
✨ Deployment complete! Take a peek over at https://t-lab-ai.pages.dev
```

---

## 3. Quy Trình Triển Khai Backend

### Phương Án A: Sử Dụng Cloudflare Quick Tunnel (Đang Hoạt Động)

1. **Khởi động FastAPI Server cục bộ:**
   ```powershell
   Set-Location "C:\Users\ADMIN 88\.gemini\antigravity\scratch\ai-learning-os\backend"
   ..\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
2. **Khởi động Cloudflare Tunnel daemon:**
   ```powershell
   cloudflared tunnel --url http://127.0.0.1:8000
   ```
   Lấy URL sinh ra từ Cloudflare (ví dụ: `https://geometry-weddings-bears-agrees.trycloudflare.com`) và cập nhật vào `frontend/.env.production`.

---

### Phương Án B: Triển Khai Độc Lập Lên Render.com (Miễn Phí 24/7)

Hệ thống đã có sẵn cấu hình `render.yaml` trong thư mục gốc của repository.

1. Đăng nhập vào [dashboard.render.com](https://dashboard.render.com).
2. Chọn **New +** $\rightarrow$ **Blueprint**.
3. Kết nối với GitHub repository: `https://github.com/tranquangthanh3062004/T-AIlab.git`.
4. Render sẽ tự động phát hiện `render.yaml` và thiết lập:
   - **Service Name:** `t-lab-ai-backend`
   - **Environment:** `python`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/api/health`
5. Thêm biến môi trường:
   - `JWT_SECRET`: Chuỗi ký tự ngẫu nhiên bảo mật 32 ký tự.
   - `PYTHON_VERSION`: `3.11.8` hoặc `3.12.0`.
6. Nhấn **Apply**. Sau khoảng 2-3 phút, backend sẽ có URL cố định dạng `https://t-lab-ai-backend.onrender.com`.

---

## 4. Kiểm Tra Sau Khi Triển Khai (Post-Deployment Verification)

1. **Kiểm tra Health API:**
   ```powershell
   curl -I https://geometry-weddings-bears-agrees.trycloudflare.com/api/health
   ```
   Yêu cầu: HTTP Status 200 OK.
2. **Kiểm tra Frontend:**
   Truy cập `https://t-lab-ai.pages.dev` trên trình duyệt:
   - Mở Developer Tools $\rightarrow$ Console: Không có lỗi đỏ CORS hoặc lỗi cú pháp.
   - Kiểm tra tab "Bài học & Lộ trình": 15 Tracks hiển thị đầy đủ.
   - Thử chạy 1 bài tập trong sandbox Python: Kết quả trả về sau < 1 giây.
