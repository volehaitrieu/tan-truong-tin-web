# Danh mục kiểu DMX — 2. Khung (ĐÃ DUYỆT 06/11/2026)

Nguồn: `0_PHAN_TICH_DMX.md`. Chủ shop chọn: Danh mục **mẫu A**, trang danh sách **mẫu D**.
Chỉ học **bố cục**; dùng màu/chữ/ảnh của Tân Trường Tín theo `docs/DESIGN.md`. Không thêm sao, "Đã bán", banner khuyến mãi.

## Màn 1 — `/danh-muc` trên điện thoại (< md), thay `CategoryIndexClient`
- Giữ là **trang** (tab "Danh mục" ở thanh đáy vẫn dẫn tới `/danh-muc`), không làm tấm phủ.
- Bố cục 2 cột, chiếm chiều cao còn lại giữa đầu trang và thanh đáy:
  - **Cột trái ~96px**: mỗi nhóm lớn (`categories`) một tab cao ≥56px, chữ 12–13px tối đa 3 dòng. Nền `sunk`; tab chọn nền `surface`, chữ màu nhấn, vạch 3px mép trái (không bo góc). Cột trái cuộn riêng nếu dài.
  - **Bên phải**: dòng đầu "Xem tất cả {nhóm} ›" (link `/danh-muc/{slug nhóm}`, kèm số sản phẩm). Dưới là **lưới 3 cột** danh mục con (`subcategories`): ảnh ~56px trong ô nền nhạt bo tròn + tên tối đa 2 dòng (cắt "…") + số lượng nhỏ. Bấm → `/danh-muc/{slug con}`.
  - **Chỉ một cấp**: không hiện Phân loại (đứng/treo/hộp…) và không cần tiêu đề nhóm con.
- Ảnh ô: ảnh **một sản phẩm thật** trong danh mục con đó (sản phẩm đầu tiên có ảnh). Không có thì dùng `CategoryIcon` của nhóm. Không lấy ảnh từ web khác.
- Mặc định chọn nhóm đầu tiên; nhớ tab đang chọn qua `?nhom=` hoặc state (Codex chọn, ghi lý do).
- Nhóm không có danh mục con: bên phải chỉ có nút "Xem tất cả".
- Trống: giữ câu "Danh mục đang được cập nhật."
- Truy cập: tab trái dùng `role="tablist"`/`tab` + `aria-selected`, phím mũi tên; vùng bấm ≥44px; tên ảnh `alt=""` (tên đã có chữ).
- Desktop (`md+`): **không đổi** (vẫn `CatalogBrowserShell`).

## Màn 2 — trang danh sách `/danh-muc/[slug]` (mẫu D)
- Dòng đầu: tên mục + "· N sản phẩm".
- Ngay dưới: **một hàng cuộn ngang**: nút "Lọc" (mở bảng lọc đang có) + chip **thương hiệu** có trong danh sách. Bấm chip = bật/tắt lọc hãng đó (cùng trạng thái với bộ lọc Thương hiệu trong bảng). Chip đang bật có nền màu nhấn nhạt.
- Phân loại (đứng/treo/hộp) **ở trong bảng Lọc** như hiện nay, không đưa ra ngoài.
- Bảng Lọc: đáy dính 2 nút **"Bỏ chọn"** và **"Xem N kết quả"** (N tính theo bộ lọc đang chọn). Nếu đã có thì giữ, chỉ kiểm câu chữ.
- Lưới sản phẩm giữ nguyên (2 cột điện thoại). Không thêm chip thông số nếu dữ liệu không có.

## Tệp được sửa
- `components/storefront/CategoryIndexClient.tsx` (viết lại)
- `app/(store)/danh-muc/page.tsx` (chỉ nếu cần truyền thêm ảnh/sản phẩm cho Màn 1)
- `components/storefront/ProductBrowser.tsx` (hàng Lọc + chip hãng, nút "Xem N kết quả")
- `lib/catalog.ts` chỉ khi cần hàm lấy ảnh đại diện danh mục con — ghi rõ trong bàn giao.
Cần sửa tệp khác → ghi vào bàn giao, chờ Claude Code xem.

## Không được
Ghi Supabase, migration, push, commit. Đổi luồng giỏ hàng/thanh toán. Thay đổi giao diện ngoài khung này mà không gửi mẫu cho chủ shop.

## Nghiệm thu
1. 375px: thấy cột tab trái + lưới 3 cột; bấm "Đồ gia dụng" thấy Quạt, Ấm siêu tốc có ảnh và số lượng; không thấy Đứng/Treo/Hộp.
2. Bấm Quạt → trang Quạt "· 100 sản phẩm" (hoặc số thật), hàng Lọc + chip hãng; bấm Lifan lọc đúng, bấm lại bỏ lọc.
3. Bảng Lọc có "Bỏ chọn" và "Xem N kết quả" đúng số.
4. Desktop `/danh-muc` không đổi.
5. `npx tsc --noEmit` và ESLint các tệp đã sửa đạt.
