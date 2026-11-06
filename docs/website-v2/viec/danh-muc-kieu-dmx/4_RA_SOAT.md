# Danh mục kiểu DMX — 4. Rà soát (Claude Code, 06/11/2026) — ĐẠT

Kiểm: đọc `CategoryIndexClient.tsx`, `danh-muc/page.tsx`; `npx tsc --noEmit` đạt; ESLint 3 tệp đạt; xem `localhost:3000` khổ 375px (chỉ đọc, không đặt đơn, không ghi Supabase).

## Đúng khung
- `/danh-muc`: tab nhóm trái (vạch mép trái, ARIA tablist, phím mũi tên), "Xem tất cả Đồ gia dụng · 114", lưới 3 cột chỉ danh mục con (Ấm siêu tốc 14, Quạt 100), không có phân loại. Ấm siêu tốc chưa có ảnh → biểu tượng dự phòng. Desktop giữ nguyên.
- `/danh-muc/quat`: hàng "Lọc" + chip hãng cuộn ngang; bấm ChingHai → `?brand=ChingHai`, "Tìm thấy 24 sản phẩm", nút Lọc hiện "(1)". Bảng lọc có ChingHai đã tích, đáy "Bỏ chọn" / "Xem 24 kết quả".

## Điểm cần chủ shop quyết
1. Dòng "Quạt · N sản phẩm": Codex không sửa vì tệp `[slug]/page.tsx` ngoài danh sách. Hiện trang có tiêu đề "Quạt" và dòng "Tìm thấy 100 sản phẩm" ngay dưới hàng Lọc — Claude Code đề nghị **chấp nhận như hiện tại** (thông tin đủ, khỏi sửa thêm).
2. Ảnh ô "Quạt" lấy từ sản phẩm quạt đầu tiên, nhưng ảnh sản phẩm đó trong dữ liệu là ảnh chụp màn hình, không phải ảnh quạt → ô trông lạ. Lỗi **dữ liệu ảnh**, không phải mã. Cách xử lý: chủ shop thay ảnh sản phẩm đó trong trang quản trị, hoặc cho phép chọn ảnh đại diện riêng cho danh mục con (việc riêng).

## Chưa kiểm
Bàn phím thật, Safari iPhone, build bản chạy thật. Chỉ có 1 nhóm lớn có hàng nên chưa thấy cột tab dài.

# Rà Bản 2 (07/11/2026) — mã ĐẠT, dữ liệu cần chủ shop quyết

Kiểm: tsc đạt; ESLint 7 tệp đạt; trình duyệt 375px (chỉ đọc).
- Bấm "Danh mục" thanh đáy → tấm phủ toàn màn hình, thanh đầu + ✕, cột tab trái, tiêu đề "ĐỒ GIA DỤNG" in hoa, ô lưới 3 cột: khớp số đo. ✔
- Quay lại (history.back) đóng tấm, ở nguyên trang. Esc đóng tấm. Khóa cuộn nền khi mở. ✔
- Bấm ô Quạt → tấm đóng, tới `/danh-muc/quat`, tiêu đề "Quạt · 100 sản phẩm". ✔

## Vấn đề dữ liệu (không phải lỗi mã)
- Cột "Ngành" trong Excel đang ghi **Quạt** và **Ấm siêu tốc** (tên loại hàng), nên tab trái là "Quạt", "Ấm siêu tốc", mỗi tab chỉ có ĐỒ GIA DỤNG → 1 ô trùng tên. Trông lặp.
- Ảnh ô Quạt vẫn là ảnh chụp màn hình của một sản phẩm (dữ liệu ảnh).

## Ghi chú kỹ thuật
- `StoreShell` gọi `getCategoryMenu()` → mọi trang cửa hàng đều tải toàn bộ sản phẩm phía server. Có `cache()` theo lượt tải và trang có làm mới 60 giây; với ~114 sản phẩm chấp nhận được, khi hàng nhiều cần chuyển sang truy vấn gọn.

# Rà Bản 2 — sửa tab (07/11) — ĐẠT
tsc + ESLint đạt. 375px: tab trái "Đồ gia dụng" (chọn, vạch xanh), tiêu đề "ĐỒ GIA DỤNG", ô Ấm siêu tốc (biểu tượng) + Quạt (ảnh). Hết lặp.
Nhỏ: ô xếp Ấm siêu tốc trước Quạt (theo thứ tự danh mục con sẵn có, không theo số lượng). Ảnh ô Quạt vẫn là ảnh dữ liệu sai.

- 07/11: Ô Quạt trong tấm Danh mục dùng ảnh riêng `public/shop/danh-muc/quat.png` (ảnh chủ shop gửi, Claude Code xóa nền). Thêm bảng `SUBCATEGORY_TILE_IMAGES` trong `lib/catalog.ts` (slug → ảnh), ưu tiên hơn ảnh sản phẩm đầu tiên.
