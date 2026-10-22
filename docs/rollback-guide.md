# Hướng Dẫn Khôi Phục Hệ Thống — T Lab AI Platform
*(Production Disaster Recovery & Rollback Guide)*

Tài liệu cung cấp các bước xử lý sự cố khẩn cấp và quy trình khôi phục phiên bản ổn định trước đó (Rollback Runbook) trong trường hợp deployment mới gặp lỗi nghiêm trọng.

---

## 1. Nguyên Tắc Xử Lý Sự Cố (Incident Principles)

1. **Bảo toàn dữ liệu người dùng:** Tuyệt đối không xóa cơ sở dữ liệu `ai_learning.db` khi đang xảy ra lỗi.
2. **Khôi phục trước, điều tra sau (Rollback First, Debug Later):** Nếu lỗi làm gián đoạn người dùng (P0/P1), thực hiện rollback ngay về phiên bản ổn định gần nhất trước khi phân tích nguyên nhân gốc rễ (Root Cause Analysis).
3. **Ghi nhật ký chi tiết:** Lưu lại toàn bộ log lỗi của Uvicorn và console trình duyệt để phục vụ khắc phục lỗi trên môi trường staging.

---

## 2. Quy Trình Khôi Phục Frontend (Cloudflare Pages Rollback)

Cloudflare Pages lưu trữ toàn bộ lịch sử các bản deploy với định danh duy nhất (Deployment ID). Quá trình khôi phục có thể thực hiện tức thì mà không cần build lại mã nguồn.

### Cách 1: Sử dụng Wrangler CLI (Khuyến nghị)
1. **Xem danh sách các bản deployment gần nhất:**
   ```powershell
   npx wrangler pages deployment list --project-name=t-lab-ai
   ```
2. **Xác định bản deployment ổn định trước đó** (Ví dụ: `4c1e8794-6b7d-41a7-8739-1662916b0632`).
3. **Thực hiện kích hoạt lại deployment này:**
   Đăng nhập Cloudflare Dashboard $\rightarrow$ **Workers & Pages** $\rightarrow$ **t-lab-ai** $\rightarrow$ **Deployments** $\rightarrow$ chọn bản deploy ổn định $\rightarrow$ chọn **Rollback to this deployment**.

### Cách 2: Rollback qua Git & Build lại
Nếu không truy cập được web dashboard:
```powershell
# Quay lại commit ổn định trước đó
git checkout HEAD~1
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=t-lab-ai
```

---

## 3. Quy Trình Khôi Phục Backend

### Bước 1: Dừng tiến trình backend bị lỗi
```powershell
# Tìm và tắt tiến trình uvicorn đang chạy trên port 8000
Get-Process python | Where-Object { $_.MainWindowTitle -match "uvicorn" -or $_.CommandLine -match "app.main:app" } | Stop-Process -Force
```

### Bước 2: Khôi phục mã nguồn backend về commit ổn định
```powershell
git checkout <stable-commit-hash> -- backend/
```

### Bước 3: Khôi phục cơ sở dữ liệu (Nếu có nghi vấn hỏng dữ liệu)
Cơ sở dữ liệu SQLite được tự động sao lưu định kỳ vào `backend/data/backup/` hoặc bản sao lưu thủ công `ai_learning.db.bak`:
```powershell
Copy-Item "C:\Users\ADMIN 88\.gemini\antigravity\scratch\ai-learning-os\backend\ai_learning.db.bak" "C:\Users\ADMIN 88\.gemini\antigravity\scratch\ai-learning-os\backend\ai_learning.db" -Force
```

### Bước 4: Khởi động lại Backend Server & Tunnel
```powershell
# Khởi động lại uvicorn
Set-Location "C:\Users\ADMIN 88\.gemini\antigravity\scratch\ai-learning-os\backend"
Start-Process "..\venv\Scripts\python.exe" -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000" -WindowStyle Hidden

# Xác minh tunnel đang kết nối
curl http://127.0.0.1:8000/api/health
```

---

## 4. Xác Minh Sau Khi Khôi Phục (Post-Rollback Verification)

- Kiểm tra phản hồi HTTP từ `https://t-lab-ai.pages.dev`: Status 200.
- Kiểm tra tính năng đăng nhập và nạp danh sách 15 lộ trình bài học.
- Xác nhận các chức năng học viên hoạt động ổn định trở lại.
