# Nhập Excel đọc cột Tồn — trạng thái 06/11/2026

Đã hoàn tất mã trên nhánh `feature/nhap-excel-ton-kho`.

- ReviewTable: nhãn Tồn kho (đặt đúng số này).
- ImportClient: thêm Tồn vào mẫu, hướng dẫn, file lỗi, xem trước và kết quả nhập.
- product-export: xuất cột Tồn theo mẫu chuẩn, bỏ Tồn kho dư.
- parse-products: không làm tròn tồn lẻ; báo lỗi số không nguyên.
- Migration: `supabase/migrations/20261106084208_import_changes_qty.sql` đã chạy trên Supabase và kiểm lại constraint có qty ngày 06/11/2026.
- Kiểm tra: `npx next typegen`, `npx tsc --noEmit` đạt; `npx eslint` 0 lỗi, 4 cảnh báo cũ ngoài phạm vi. `node --test scripts/check-import-stock.mjs` đạt 3/3 nhóm ca với dòng giả, không dùng Excel/giá nhập thật.
- Build trên Vercel đã đạt (npm run build, 153 trang), deployment dpl_9jnuLWbGfHWT8bLoCGGXu8tJhA5c trạng thái READY. Chưa thử nhập/ghi kho thật hoặc giao diện trình duyệt.

Quyết định nghiệp vụ: sản phẩm đã có cần tick xác nhận tồn mới; ô trống giữ nguyên; 0 đặt hết hàng; sản phẩm mới dùng tồn đầu kỳ. Tồn ghi qua `adjust_stock`, cần quyền chỉnh tồn; không cập nhật trực tiếp `inventory.qty`.

Đã promote sau khi chủ shop xác nhận rõ. tantruongtin.com đang trỏ deployment dpl_9jnuLWbGfHWT8bLoCGGXu8tJhA5c (READY). Kiểm trang chủ HTTP 200, trang nhập Excel chuyển 307 tới đăng nhập. Còn lại: thử file nhỏ trong phiên quản trị và kiểm lịch sử kho; chưa ghi dữ liệu thử. Giới hạn đã chấp nhận trong bàn giao: đơn hàng đồng thời giữa lúc đọc tồn và chỉnh tồn có thể gây lệch.

Bàn giao gốc: `origin/worktree-website-v2:docs/website-v2/BAN_GIAO_2026-11-06.md`, mục 0 và 3. Chi tiết đợt này ở `docs/MENTOR_LOG.md`.
