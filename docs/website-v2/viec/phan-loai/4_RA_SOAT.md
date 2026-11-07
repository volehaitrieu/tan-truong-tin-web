# Cột Phân loại + Xuất Excel chọn cột — 4. Rà soát (Claude Code, 07/11/2026)

Kiểm: đọc toàn bộ diff 10 tệp + `ExportColumnsDialog.tsx` mới; `npx tsc --noEmit` đạt; ESLint 10 tệp đạt. Không ghi Supabase.

## Đúng bàn giao
- Nhập: đọc cột Phân loại (mẫu chuẩn), lỗi dòng khi thiếu Danh mục con; tự tạo Phân loại dưới đúng Danh mục con qua RLS (không service-role), xử lý trùng slug; ô trống giữ nguyên Phân loại cùng Danh mục con; thay đổi lưu dạng "Quạt > Quạt treo tường", `applyChanges` tìm theo đường dẫn, không tìm được thì báo lỗi SP đó.
- File mẫu: cột Phân loại sau Danh mục con, dòng ví dụ + hướng dẫn.
- Xuất: nhóm Cơ bản luôn có (server cũng ép), nhóm Giá nhập chỉ chủ shop (server kiểm), ids ≤ 5.000 kiểm kiểu; nhật ký ghi `by_ids`, `groups`. Có nút Xuất trên thanh "Đã chọn" (máy tính + điện thoại).
- Bảng chọn cột: dialog, Esc, khóa cuộn, trả tiêu điểm, bẫy Tab, 3 mẫu nhanh, nhớ lựa chọn (localStorage có try/catch).
- Web: nhóm "Phân loại" chung mọi danh sách; hàng chip nhanh khi ≥2 phân loại, bỏ tiền tố trùng tên Danh mục con, đồng bộ URL `classification`.

## Lưu ý (không chặn)
- Phân loại mới được tạo trước khi ghi SP; nếu bước sau lỗi thì Phân loại vẫn còn (vô hại, dùng lại lần sau).
- Quyền: chủ shop có đủ quyền (`has_perm` trả đúng cho owner). Nhân viên thiếu `edit_products` mà file có Phân loại mới → cả lần nhập bị từ chối với thông báo rõ.
- Thanh "Đã chọn" điện thoại thêm nút → có thể xuống 2 hàng (đã `flex-wrap`); cần xem bằng mắt.

## Chưa kiểm
Giao diện 375px (trang Quạt, bảng chọn cột, thanh Đã chọn) — máy chủ thử cổng 3000 (PID 20076, do lần chạy trước bật) bị treo khi khởi động; Claude Code không được phép tắt tiến trình. Chưa nhập thật lên Supabase.
