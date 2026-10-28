# Mẫu tài liệu

## Mục lục
1. Idea Brief
2. PRD.md
3. DESIGN.md
4. DEV_PLAN.md (task Trigger → Response → Error → Done)
5. PROGRESS.md
6. MENTOR_LOG.md
7. Handoff prompt cho Claude Code

---

## 1. Idea Brief
| Nội dung | Giá trị | Trạng thái |
|---|---|---|
| Tên shop | | chưa chốt / đã chốt |
| Bán gì | (loại SP, số lượng mã) | |
| Khách hàng | (ai, ở đâu, mua qua thiết bị gì) | |
| Vấn đề / lý do cần web | (đang bán Facebook khó quản lý đơn...) | |
| Kênh bán hiện tại | | |
| Người quản trị | (1 người / có nhân viên) | |
| Thanh toán | (COD / chuyển khoản / online) | |
| Vận chuyển | | |
| Phong cách giao diện | | |
| Stack | Next.js + Supabase + Vercel | đã chốt |
| Ngân sách / thời hạn | | |

## 2. PRD.md
```markdown
# PRD — [Tên shop]
## 1. Tổng quan  (1 đoạn: bán gì, cho ai, khác biệt)
## 2. Mục tiêu    (đo được: ví dụ 30 đơn/tháng qua web trong 3 tháng)
## 3. Người dùng & vai trò  (Khách vãng lai, Khách thành viên, Nhân viên, Admin)
## 4. Luồng chính (user flow)  Xem SP → Thêm giỏ → Checkout → Nhận xác nhận → Theo dõi đơn
## 5. Tính năng theo ưu tiên
| ID | Tính năng | Vai trò | Ưu tiên (P0-P3) | Ghi chú |
## 6. Ngoài phạm vi (cố tình chưa làm)
## 7. Yêu cầu phi chức năng  (mobile-first, tốc độ, bảo mật, SEO)
## 8. Chỉ số theo dõi
## 9. Câu hỏi chưa chốt
```

## 3. DESIGN.md
```markdown
# Design Guideline — [Tên shop]
## Tính cách thương hiệu  (3 tính từ)
## Màu  (primary, secondary, nền, chữ, success/warning/error — kèm mã màu)
## Font  (heading, body — Google Fonts có hỗ trợ tiếng Việt, ví dụ Be Vietnam Pro, Inter)
## Spacing & bo góc
## Component chính  (Button, ProductCard, Badge giảm giá, Input, Toast, Bảng admin)
## Trang & bố cục  (trang chủ, danh sách, chi tiết, giỏ, checkout, admin)
## Ảnh sản phẩm  (tỉ lệ, nền, kích thước)
```

## 4. DEV_PLAN.md
```markdown
# Development Plan
## Sprint 1 — [tên]  (mục tiêu sprint)
### Task 1.1 — [tên task]
- Trigger: người dùng làm gì
- Response: hệ thống phản hồi gì
- Error: khi nào lỗi, hiển thị gì
- Done: tiêu chí kiểm tra được (ví dụ "thêm 2 SP vào giỏ, reload vẫn còn")
- Skill dự kiến: ...
```

## 5. PROGRESS.md
```markdown
# Progress
Giai đoạn hiện tại: [số + tên]
| Task | Trạng thái (⬜ chưa / 🔄 đang / ✅ xong / 🟡 lỗi nhỏ / 🔴 hỏng) | Ngày | Ghi chú |
```

## 6. MENTOR_LOG.md
```markdown
# Mentor Log — [Tên shop]

## [YYYY-MM-DD] Giai đoạn X — [tên bước]
- **Đã làm:** ...
- **Skill/công cụ đã dùng:** `skill-a` (để ...), `skill-b` (để ...)
- **Quyết định:** người dùng chọn phương án B vì ...
- **Thay đổi file/DB:** ...
- **Còn treo / rủi ro:** ...
- **Tiếp theo:** ...
```
Mục mới thêm ở cuối file. Ngắn gọn — log để người dùng (và Mentor phiên sau) đọc lại nhanh.

## 7. Handoff prompt cho Claude Code
```markdown
## Bối cảnh
Dự án [tên shop], Next.js App Router + Supabase. Đọc docs/PRD.md, docs/DESIGN.md, docs/DEV_PLAN.md trước.

## Nhiệm vụ: Task [ID] — [tên]
- Trigger: ...
- Response: ...
- Error: ...
- Done: ...

## Phạm vi ĐƯỢC làm
- ...
## KHÔNG làm
- Không thêm tính năng ngoài task này
- Không đổi schema DB / cài thư viện mới nếu chưa hỏi
- Không sửa file ngoài: [danh sách]

## Cách làm
1. Khảo sát repo, tóm tắt cách code hiện tại được tổ chức
2. Đề xuất cách làm, chờ duyệt
3. Làm, chạy thử, báo cáo file đã sửa và cách kiểm tra
```
