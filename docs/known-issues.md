# Danh Sách Các Vấn Đề Đang Tồn Tại & Kế Hoạch Xử Lý — T Lab AI Platform
*(Known Limitations & Technical Debt Registry)*

**Ngày cập nhật:** 22/10/2026  
**Phiên bản hệ thống:** v2.3.0  
**Phân loại:** P0 (Chặn vận hành), P1 (Nghiêm trọng), P2 (Trung bình), P3 (Thấp/Thẩm mỹ)

---

## 1. Bảng Tổng Hợp Vấn Đề

| ID | Tiêu đề vấn đề | Mức độ | Phạm vi ảnh hưởng | Giải pháp tạm thời (Workaround) | Kế hoạch xử lý triệt để |
|---|---|---|---|---|---|
| ISSUE-01 | Cloudflare Quick Tunnel phụ thuộc vào tiến trình máy trạm | P1 | Backend Availability | Duy trì background daemon `cloudflared` | Chuyển backend lên Render.com / VPS độc lập |
| ISSUE-02 | Starlette TestClient cảnh báo `httpx` deprecation | P3 | Testing Log | Bỏ qua cảnh báo (0 ảnh hưởng tới production) | Chờ bản cập nhật FastAPI/Starlette hỗ trợ `httpx2` |
| ISSUE-03 | Cơ sở dữ liệu SQLite giới hạn ghi song song phân tán | P2 | Scalability (>50k req/ngày) | Sử dụng WAL mode (Write-Ahead Logging) | Chuyển sang PostgreSQL khi mở rộng quy mô lớn |
| ISSUE-04 | Monaco Editor tải gói ngôn ngữ nặng trên mạng chậm | P3 | Lần đầu mở LessonView | Hiển thị Skeleton loading mượt mà | Tích hợp Monaco Web Worker qua CDN Cloudflare |

---

## 2. Chi Tiết Từng Vấn Đề

### ISSUE-01 (P1): Cloudflare Quick Tunnel phụ thuộc vào tiến trình máy trạm
- **Mô tả:** Quick Tunnel (`geometry-weddings-bears-agrees.trycloudflare.com`) là giải pháp cầu nối miễn phí tuyệt vời để đưa server local lên Internet mà không cần mở port router. Tuy nhiên, nếu máy trạm tắt hoặc khởi động lại, tunnel sẽ tự động sinh một URL ngẫu nhiên mới.
- **Tác động:** Nếu URL tunnel thay đổi, frontend trên Cloudflare Pages cần được build lại với URL tunnel mới.
- **Giải pháp xử lý:** Người quản trị chỉ cần liên kết repository lên [Render.com](https://dashboard.render.com) theo tệp `render.yaml` đã được chúng tôi kiểm tra và cấu hình sẵn trong repository. Khi đó backend sẽ có một URL cố định vĩnh viễn (ví dụ: `https://t-lab-ai-backend.onrender.com`).

---

### ISSUE-02 (P3): Cảnh báo `httpx` trong test suite của Starlette TestClient
- **Mô tả:** Khi chạy `pytest tests/`, thư viện `fastapi.testclient` hiển thị cảnh báo:
  `StarletteDeprecationWarning: Using httpx with starlette.testclient is deprecated; install httpx2 instead.`
- **Tác động:** Không có tác động nào lên ứng dụng thực tế. Toàn bộ 22 bài test vẫn chạy và pass 100%.
- **Giải pháp:** Tiếp tục theo dõi các bản cập nhật mới nhất từ nhóm phát triển FastAPI.

---

### ISSUE-03 (P2): Cơ sở dữ liệu SQLite cục bộ
- **Mô tả:** Hệ thống hiện tại lưu trữ lịch sử học tập, dự án và tin tức trong file `ai_learning.db`. Với lưu lượng người dùng hiện tại, SQLite kết hợp WAL mode phản hồi cực nhanh (< 5ms) và ổn định.
- **Tác động:** Khi hệ thống có hàng nghìn học viên đồng thời nộp bài thi hoặc ghi dự án cùng một giây, có thể phát sinh hiện tượng hàng đợi khóa ghi (write lock wait).
- **Giải pháp:** Database adapter trong `backend/app/core/database.py` được thiết kế theo chuẩn SQLAlchemy, sẵn sàng chuyển đổi sang chuỗi kết nối `postgresql://...` chỉ bằng việc thay đổi một biến môi trường `DATABASE_URL`.
