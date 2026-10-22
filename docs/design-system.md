# Hệ Thống Thiết Kế — T Lab AI Design System (v2.3)
*(T Lab AI Modern SaaS Design System & Design Tokens)*

Hệ thống thiết kế chuẩn hóa cho toàn bộ ứng dụng **T Lab AI**, đảm bảo tính nhất quán trên mọi giao diện, thành phần và thiết bị.

---

## 1. Design Tokens

### 1.1. Color Tokens (Light-First & Dark Mode)

```css
:root {
  /* Surface & Background */
  --bg-primary: #F5F7FB;         /* Nền chính trang web, dịu mắt, chống chói */
  --bg-surface: #FFFFFF;         /* Nền card, modal, editor container */
  --bg-surface-elevated: #F0F4FC;/* Nền phụ nâng cao, tab active */

  /* Borders & Dividers */
  --border-subtle: #E4E8F0;      /* Viền thẻ bài học, divider nhẹ */
  --border-strong: #CBD5E1;      /* Viền input focus, thanh cuộn */

  /* Typography Colors */
  --text-primary: #202938;       /* Chữ chính, tiêu đề, độ tương phản cao */
  --text-secondary: #667085;     /* Chữ phụ, mô tả ngắn, meta tags */
  --text-muted: #94A3B8;         /* Chú thích mờ, placeholder */

  /* Brand & Actions */
  --accent-primary: #4F6BED;     /* Màu thương hiệu T Lab AI, nút CTA chính */
  --accent-hover: #3D56D6;       /* Trạng thái hover nút chính */
  --accent-surface: #E8EDFF;     /* Nền sáng cho badge, icon background */

  /* Semantic Feedback */
  --success: #16845B;            /* Thành công, kiểm thử pass, hoàn thành */
  --warning: #A8640A;            /* Cảnh báo, cần ôn tập */
  --error: #C43D4B;              /* Lỗi cú pháp, sai kết quả, nguy hiểm */
  --info: #2673B8;               /* Thông tin bổ sung, tài liệu OER */
}

.dark {
  --bg-primary: #0F172A;
  --bg-surface: #1E293B;
  --bg-surface-elevated: #283548;
  --border-subtle: #334155;
  --border-strong: #475569;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  --accent-primary: #637EF7;
  --accent-hover: #8198FA;
  --accent-surface: rgba(99, 126, 247, 0.15);
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #38BDF8;
}
```

---

### 1.2. Typography Tokens

- **Font Family Chính (Sans-Serif):** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Hỗ trợ toàn diện Tiếng Việt có dấu, không lỗi font trên mọi hệ điều hành.
- **Font Family Code (Monospace):** `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
  - Tối ưu cho Monaco Editor, terminal output và các biểu thức toán học.
- **Font Scale & Line Heights:**
  - `Display / Hero`: 32px / 40px (Bold 800)
  - `H1 / Page Title`: 24px / 32px (Bold 700)
  - `H2 / Section`: 20px / 28px (SemiBold 600)
  - `H3 / Card Title`: 16px / 24px (SemiBold 600)
  - `Body Regular`: 14px / 22px (Regular 400 & Medium 500)
  - `Caption / Meta`: 12px / 18px (Medium 500)
  - `Micro`: 10px / 14px (SemiBold 600)

---

### 1.3. Spacing & Border Radius Tokens

- **Border Radius:**
  - `Rounded-sm`: 6px (Tag nhỏ, badges nội dòng)
  - `Rounded-md`: 8px (Nút bấm phụ, ô nhập dữ liệu)
  - `Rounded-lg`: 12px (Nút bấm chính, selector)
  - `Rounded-xl`: 16px (Card bài học, dropdown menu)
  - `Rounded-2xl`: 20px (Modal container, header navigation pill)
  - `Rounded-3xl`: 24px (Hero cards, floating widgets)
  - `Rounded-full`: 9999px (Avatars, status pills)

- **Spacing Scale:**
  - `2 (8px)`: Khoảng cách giữa icon và label
  - `3 (12px)`: Padding bên trong nút bấm nhỏ
  - `4 (16px)`: Padding thẻ bài học tiêu chuẩn
  - `6 (24px)`: Khoảng cách giữa các khối nội dung
  - `8 (32px)`: Khoảng cách giữa các section chính

---

## 2. Quy Chuẩn Thành Phần Giao Diện (Component Guidelines)

### 2.1. Nút Bấm (Buttons)
- **Primary Button:** Nền `#4F6BED`, chữ trắng, bo góc `12px`, padding `10px 20px`. Hover: `#3D56D6`. Hiệu ứng active scale nhẹ `98%`.
- **Secondary Button:** Nền `#E8EDFF`, chữ `#4F6BED`, bo góc `12px`. Hover: nền đậm hơn một chút.
- **Ghost / Icon Button:** Nền trong suốt, viền mỏng hoặc không viền, hiển thị tooltip hoặc có `aria-label` tường minh.

### 2.2. Thẻ Nội Dung (Cards)
- Nền `#FFFFFF` (nền tối `#1E293B`), viền `1px solid #E4E8F0`, bóng đổ nhẹ `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05)`.
- Khi hover: Viền chuyển sang màu nhạt của primary (`#4F6BED` với độ mờ 40%), nâng card nhẹ lên `translateY(-2px)`.

### 2.3. Trạng Thái Phản Hồi (States)
- **Loading State:** Sử dụng Skeleton Shimmer với nền `#E4E8F0` thay vì vòng quay cứng nhắc.
- **Empty State:** Hiển thị minh họa rõ ràng, tiêu đề giải thích lý do không có dữ liệu và nút bấm hành động cụ thể để bắt đầu.
- **Error State:** Hộp thông báo màu nền đỏ nhạt (`#FEE2E2`), chữ `#C43D4B`, có nút "Thử lại" (Retry).
