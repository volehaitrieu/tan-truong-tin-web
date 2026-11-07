# Nhiều phân loại — 2. Kế hoạch chi tiết (Claude Code, 07/11/2026)

Theo `1_KE_HOACH.md` (chủ shop đã duyệt). Mẫu giao diện: N (đối chiếu Excel), P (trang SP), F (form) — **chờ chủ shop chọn**. Không chạy migration/ghi dữ liệu thật/deploy khi chưa có quyết định riêng.

## A. Dữ liệu (migration dạng tệp, chưa chạy)
1. Bảng `product_classifications(product_id → products on delete cascade, classification_id → categories on delete restrict, primary key (product_id, classification_id))`, chỉ mục `(classification_id, product_id)`.
2. Trigger kiểm `classification_id` là cấp 3 và cha của nó = `products.category_id` (cấp 2); trigger trên `products` chặn đổi `category_id` khi còn liên kết sai cha.
3. RLS: đọc công khai khi sản phẩm được hiển thị (theo policy đọc `products` hiện có); ghi cần `has_perm('edit_products')`. Không service-role.
4. RPC `set_product_classifications(product_id, sub_id, names text[])` security invoker, một giao dịch: khóa dòng SP, tạo loại thiếu dưới `sub_id` (dùng lại theo tên chuẩn hóa, xử lý trùng slug), đổi `category_id`, thay toàn bộ liên kết, ghi `audit_log`.
5. Chuyển dữ liệu: SP đang ở cấp 3 → 1 liên kết + `category_id` về cấp 2. Báo danh sách bất thường, không đoán. Snapshot `category_id` cũ để hoàn tác.

## B. Mã
| Tệp | Đổi |
|---|---|
| `lib/excel/parse-products.ts` | `classification: string \| null` → `classifications: string[] \| null`; tách `;`, trim, bỏ trùng không phân biệt hoa/thường; lỗi dòng: >80 ký tự, >20 loại, ô chỉ có `;`, SKU trùng trong file |
| `app/admin/(shell)/nhap-excel/actions.ts` | đối chiếu tập hợp cũ/mới; mục chờ `classification` lưu payload JSON {sub, old[], new[], newNames[]}; `applyChanges` gọi RPC; SP mới gọi RPC sau khi tạo |
| `ImportClient.tsx`, `ReviewTable.tsx` | hiển thị theo mẫu N đã chọn; hướng dẫn cột Phân loại dùng `;` |
| `lib/admin/product-export.ts` | xuất `Quạt sàn; Quạt công nghiệp` (sắp tiếng Việt) |
| `lib/catalog.ts`, `lib/mock/store.ts` | `classification` → `classifications: string[]` (đọc bảng liên kết) |
| `components/storefront/ProductBrowser.tsx` | nhóm Phân loại: đếm SP duy nhất, khớp nếu giao nhau (HOẶC); URL giữ tên (tương thích link cũ) |
| Trang SP / form quản trị | theo mẫu P, F đã chọn; form sửa tên/giá không đụng liên kết |

## C. Thứ tự
1. Chủ shop chọn N/P/F + trả lời 4 câu phân loại 19 quạt.
2. Viết migration (tệp) + mã + kiểm tsc/ESLint + thử bằng dữ liệu giả (không ghi DB thật).
3. Claude rà (ponytail-review), xem 375px.
4. Xin quyết định riêng: chạy migration trên Supabase → nhập file quạt → deploy.

## D. Kiểm
Theo mục "Kiểm chứng bắt buộc" của `1_KE_HOACH.md` (A/B/C hợp tập, file một/nhiều/trống/lỗi, nhập lại file xuất không đổi, giao dịch lỗi giữa chừng, quyền, form giữ liên kết, không nhân đôi thẻ/giỏ).
