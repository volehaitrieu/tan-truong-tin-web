# Nhiều phân loại — 3. Đã làm (Claude Code, 07/11/2026 tối)

Chủ shop chọn N2 (đối chiếu Cũ/Mới), P1 (trang SP không hiện), F1 (form chỉ xem + hướng dẫn). Chưa chạy migration, chưa ghi Supabase, chưa commit.

## Mã
- `supabase/migrations/20261107000100_product_classifications.sql` (CHƯA CHẠY): bảng `product_classifications` + RLS (đọc theo SP hiển thị, ghi cần `edit_products`), trigger chặn loại sai cha và chặn đổi Danh mục con khi còn loại cũ, hàm `set_product_classifications` (security invoker, một giao dịch), thêm trường `classifications` vào `import_changes`, chuyển dữ liệu cũ cấp 3 → cấp 2 + liên kết (lưu bản chụp `private.classification_backfill_20261107`, có lệnh hoàn tác trong chú thích).
- `lib/excel/parse-products.ts`: `splitClassifications` (dấu `;`, bỏ trùng, ô trống = giữ nguyên); lỗi dòng: chỉ có `;`, >20 loại, >80 ký tự, thiếu Danh mục con.
- `lib/admin/classifications.ts` (mới): tạo loại thiếu qua RLS, gọi hàm DB, đọc payload; báo rõ khi hệ thống chưa cập nhật.
- `nhap-excel/actions.ts`: SP mới → gắn loại ngay; SP cũ → dòng chờ "Phân loại" (so như tập hợp); đổi Danh mục con mà ô Phân loại trống trong khi SP đang có loại → bỏ qua và báo. Xác nhận → tạo loại thiếu + thay toàn bộ trong một giao dịch, xóa dòng chờ Danh mục con đi kèm.
- `nhap-excel/page.tsx`, `ReviewTable.tsx` (mẫu N2 + nhãn "x loại mới"), `ImportClient.tsx` (hướng dẫn cột, báo dòng bị bỏ qua).
- `lib/admin/product-export.ts`: xuất "A; B" để nhập lại được.
- `lib/catalog.ts`, `lib/mock/store.ts`, `ProductBrowser.tsx`: `classifications[]`, đếm mỗi SP một lần, lọc HOẶC. Chưa có bảng → tự lùi về cách cũ (đã thử: trang Quạt 100 SP).
- `lib/admin/products.ts`, `ProductForm.tsx`: F1; ô Danh mục bỏ các Phân loại cấp 3.

## Kiểm
- `npx tsc --noEmit`, ESLint các tệp sửa: đạt. `node --test scripts/check-import-classifications.mjs scripts/check-import-stock.mjs`: 6/6 đạt (dòng giả).
- Tự rà (ponytail-review): sửa thêm việc xóa dòng chờ Danh mục con khi đã áp Phân loại.
- Chưa kiểm: trang quản trị (cần đăng nhập), migration trên DB thử, nhập/xác nhận thật.

## Dữ liệu — `Downloads/Kho-App-Quat-cuoi-2026-11-07.xlsx`
- Bộ 8 Phân loại theo cách hãng/Điện Máy Xanh/meta.vn đặt tên: Quạt đứng, Quạt lửng, Quạt bàn, Quạt hộp, Quạt sàn, Quạt treo tường, Quạt đảo trần, Quạt công nghiệp (cộng thêm). Không dùng "Quạt lỡ nhựa / lỡ công nghiệp" (không nơi nào dùng làm danh mục; "quạt lỡ" = quạt lửng, đưa vào mô tả/SEO).
- 100/100 dòng có "Điều khiển:" trong Thông số; 18 dòng "Đang cập nhật" (tô cam) vì không nguồn nào ghi.
- Chỉ nhập sau khi migration đã chạy (web sẽ từ chối trước đó).

## Việc tiếp (cần chủ shop cho phép riêng)
Chạy migration trên Supabase → deploy mã → nhập file cuối → tick xác nhận.
