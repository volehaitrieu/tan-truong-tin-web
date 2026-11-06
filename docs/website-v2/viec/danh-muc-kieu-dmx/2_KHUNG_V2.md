# Danh mục kiểu DMX — 2. Khung bản 2 (ĐÃ DUYỆT 06/11/2026, thay Màn 1 của `2_KHUNG.md`)

Chủ shop yêu cầu làm **y hệt bố cục** tấm Danh mục của dienmayxanh.com (ảnh chủ shop gửi + số đo ở cuối `0_PHAN_TICH_DMX.md`). Màn 2 (trang danh sách mẫu D) giữ nguyên như đã làm.
Không dùng ảnh, logo, chữ của DMX. Màu trung tính/xanh của tấm này được phép theo số đo bên dưới (chủ shop chọn làm giống).

## Mở / đóng
- Trên điện thoại (< md), bấm **"Danh mục" ở thanh đáy** → mở **tấm phủ toàn màn hình** (không chuyển trang). Nút ✕ hoặc phím Esc hoặc nút Quay lại của máy → đóng, trở về trang đang xem.
- Khi mở: khóa cuộn trang nền, đưa tiêu điểm vào tấm, `role="dialog" aria-modal="true" aria-label="Danh mục sản phẩm"`; đóng thì trả tiêu điểm về nút Danh mục.
- Bấm một ô → đóng tấm và đi tới `/danh-muc/{slug danh mục con}`.
- Trang `/danh-muc` trên điện thoại hiển thị cùng nội dung (để link trực tiếp vẫn dùng được); desktop không đổi.

## Bố cục (số đo DMX ở 375px)
- Nền tấm #F2F4F7.
- Thanh đầu: dính trên, cao 48px, nền trắng, padding 12px; "Danh mục sản phẩm" 14px/500 #252A31; bên phải nút ✕ 24px tròn nền xám (#98A2B3, biểu tượng trắng), vùng bấm ≥44px.
- Dưới thanh đầu cách 8px là 2 cột:
  - **Cột tab trái 100px**, cuộn riêng, góc dưới phải bo 16px. Mỗi tab cao 60px, chữ 12px, line-height 18px, padding 12px 8px 12px 16px, tối đa 3 dòng. Tab thường: nền #EAECF0, chữ #101828, kẻ trên 1px #D0D5DD (tab đầu không kẻ). Tab chọn: nền trắng, chữ #2A83E9 đậm, viền trái 2.4px #2A83E9; tab đầu bo góc trên phải 8px.
  - **Khung phải**: cách cột tab 8px, nền trắng, bo góc trên trái 8px, padding 8px, cuộn riêng.
- Trong khung phải, với mỗi **Danh mục** có hàng thuộc ngành đang chọn:
  - Tiêu đề 12px đậm IN HOA, margin 2px 0 8px (khối sau cách khối trước 16px).
  - Lưới 3 cột; mỗi ô cao ~95px: ô ảnh 56×56 nền #EAF3FF bo 12px chứa ảnh ~48px `object-contain`; tên 12px/18px, tối đa 2 dòng, căn giữa, cắt "…".
  - **Ô = Danh mục con** (Quạt, Ấm siêu tốc…). Không hiện Phân loại (đứng/treo/hộp…).

## Dữ liệu
- **Tab = Ngành** (`product.industry`, từ Excel đã nhập). Chỉ hiện ngành có sản phẩm. Thứ tự: theo số sản phẩm giảm dần (hoặc thứ tự sẵn có nếu đã có — ghi rõ).
- **Tiêu đề = Danh mục** (`categories`) có sản phẩm thuộc ngành đó. **Ô = Danh mục con** có sản phẩm thuộc ngành + danh mục đó.
- Sản phẩm thiếu ngành: gom vào tab "Khác" (chỉ khi có), không bỏ mất.
- Ảnh ô: ảnh sản phẩm thật đầu tiên trong danh mục con (bỏ ảnh minh họa chung); không có thì `CategoryIcon`. Không lấy ảnh từ web khác.
- Dữ liệu lấy phía server (đã có `getCategories`, `getProducts`); truyền xuống client bản gọn (tên, slug, ảnh, ngành) — không gửi cả danh sách sản phẩm vào mọi trang nếu tránh được. Ghi cách làm trong bàn giao.
- Trống: "Danh mục đang được cập nhật."

## Hiệu ứng nhẹ (chủ shop yêu cầu)
- Mở tấm: trượt lên 16px + hiện dần, ~220ms, ease-out. Đóng: ngược lại ~160ms.
- Đổi tab: nội dung khung phải hiện dần + trượt 8px ~180ms; vạch xanh/nền tab chuyển màu 150ms.
- Bấm ô: thu nhỏ nhẹ `scale(0.96)` khi nhấn.
- Tôn trọng `prefers-reduced-motion`: tắt trượt, chỉ giữ đổi màu tức thì. Có thể dùng `lib/ui-effects.ts` nếu phù hợp.
- Không hiệu ứng nảy, lắc, lóe sáng.

## Truy cập
Tab: `role="tablist"` dọc, `tab`, `aria-selected`, phím mũi tên/Home/End. Vùng bấm ≥44px. Ảnh `alt=""`. Chữ tiếng Việt.

## Tệp được sửa
- `components/storefront/CategoryDrawer.tsx` (nút thanh đáy → mở tấm)
- `components/storefront/CategoryIndexClient.tsx` (viết lại theo khung này, dùng chung cho tấm và trang `/danh-muc` điện thoại)
- Tệp mới `components/storefront/CategoryOverlay.tsx` nếu cần
- `components/storefront/StoreShell.tsx` và `app/(store)/layout.tsx` chỉ để truyền dữ liệu danh mục gọn cho tấm
- `app/(store)/danh-muc/page.tsx`
- `app/(store)/danh-muc/[slug]/page.tsx` — **được phép** đổi dòng đầu thành "Tên mục · N sản phẩm" (điểm còn treo của lượt trước)
- `lib/catalog.ts` chỉ khi cần hàm dựng cây Ngành → Danh mục → Danh mục con
Cần tệp khác → ghi bàn giao, dừng chờ.

## Không được
Commit, push, ghi Supabase, migration. Đổi giỏ hàng/thanh toán. Thay đổi giao diện ngoài khung mà không gửi mẫu.

## Nghiệm thu
1. 375px trang chủ: bấm "Danh mục" thanh đáy → tấm phủ hiện mượt; thanh đầu, cột tab 100px, khung phải đúng số đo.
2. Tab ngành đúng dữ liệu; tab chọn có vạch xanh trái; đổi tab nội dung đổi kèm hiệu ứng nhẹ.
3. Thấy "ĐỒ GIA DỤNG" với ô Quạt, Ấm siêu tốc; không có đứng/treo/hộp.
4. Bấm Quạt → tấm đóng, tới `/danh-muc/quat` có "Quạt · N sản phẩm".
5. ✕, Esc, nút Quay lại đều đóng tấm; trang nền không cuộn khi tấm mở.
6. Bật giảm chuyển động của máy → không còn trượt.
7. Desktop không đổi. `npx tsc --noEmit`, ESLint các tệp sửa đạt.

## Sửa sau rà (07/11, chủ shop chọn) — Tab = Danh mục
Cột "Ngành" trong dữ liệu đang ghi tên mặt hàng (Quạt, Ấm siêu tốc) nên tab Ngành bị lặp. Đổi cách ghép:
- **Tab trái = Danh mục** có hàng (vd. "Đồ gia dụng"), thứ tự theo số sản phẩm giảm dần.
- **Khung phải**: một tiêu đề IN HOA = tên danh mục đang chọn, dưới là lưới ô **Danh mục con** có hàng (Quạt, Ấm siêu tốc), ảnh/biểu tượng như cũ.
- Không dùng `product.industry` cho tấm này nữa (giữ hàm/kiểu dữ liệu gọn, bỏ phần gom theo ngành nếu không còn dùng).
- Mọi số đo, hiệu ứng, mở/đóng, truy cập giữ nguyên.
