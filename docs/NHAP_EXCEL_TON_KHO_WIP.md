# Nhập Excel đọc cột Tồn — việc đang làm dở (nhánh `feature/nhap-excel-ton-kho`, cắt từ `main` 05becd5)

**Nhánh này CHƯA chạy được `tsc`: ĐỪNG deploy.** Hướng dẫn đầy đủ nằm ở nhánh `worktree-website-v2`: `docs/website-v2/BAN_GIAO_2026-11-06.md` (mục 0 quy tắc, mục 3 việc dở). Tóm tắt:

Quyết định chủ shop: SP đã có → số Tồn trong file là tồn MỚI; hiện "cũ → mới" ở bảng "Thay đổi chờ xác nhận" để tick; ô trống = giữ nguyên; ghi lịch sử nhập kho; SP mới → tồn đầu kỳ. Đặt tồn qua hàm DB `adjust_stock` (đòi quyền `adjust_stock`), không ghi thẳng bảng `inventory`.

Đã sửa: `lib/excel/parse-products.ts`, `app/admin/(shell)/nhap-excel/actions.ts`.
Còn lại: (1) `ReviewTable.tsx` thêm nhãn `qty`; (2) `ImportClient.tsx` (độ rộng cột, 2 dòng ví dụ thêm Tồn trước Tồn tối thiểu, hướng dẫn, `downloadErrors`, cột xem trước, câu "Số tồn không thay đổi.", thông báo kết quả `stockSet/stockFailed/stockIgnored`); (3) `lib/admin/product-export.ts` (bỏ "Tồn kho" khỏi `EXTRA_COLUMNS`, thêm khóa "Tồn"); (4) tạo `supabase/migrations/20261106000100_import_changes_qty.sql` nới `import_changes_field_check` thêm `'qty'` (KHÔNG chạy khi chưa hỏi chủ shop; chạy migration TRƯỚC rồi mới deploy mã; sau khi `apply_migration` đổi tên tệp cho khớp phiên bản hệ thống trả về); (5) `npx tsc --noEmit`, `npx eslint`, `npm run build`, thử bộ đọc với file Excel có cột Tồn. Chủ shop tự deploy: `npx vercel deploy --prod --yes`.
