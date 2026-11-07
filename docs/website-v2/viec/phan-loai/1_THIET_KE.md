# Cột Phân loại + Xuất Excel chọn cột — 1. Thiết kế (ĐÃ DUYỆT 07/11/2026)

Nguồn: file chủ shop `Kho-App-Quat-xuat-2026-11-06.xlsx` (100 quạt, cột Phân loại 7 giá trị: Quạt treo tường 27, Quạt đứng 25, Quạt sàn 20, Quạt lửng 17, Quạt bàn 5, Quạt trần 4, Quạt hộp 2).

## Quyết định chủ shop
- Phân loại chưa có → **tự tạo** dưới đúng Danh mục con.
- Trang Sản phẩm quản trị: **không** thêm cột/ô Phân loại.
- Xuất file: xuất được theo SP đã tick; hiện bảng tick chọn cột đưa vào Excel.
- Cột **Mã hàng hóa luôn có, khóa không cho bỏ** (để file nhập lại được).

## 1. Dữ liệu
Phân loại = danh mục cấp 3 trong bảng `categories` (Danh mục › Danh mục con › Phân loại). Không thêm cột DB. `lib/catalog.ts` `toProduct` đã suy `classification` từ cấp này.

## 2. Nhập Excel
- Đọc cột "Phân loại". Tên chưa có → tạo danh mục con của Danh mục con tương ứng.
- Ô trống = giữ nguyên phân loại hiện tại.
- SP đã có mà đổi phân loại → hiện trong bảng chờ xác nhận như các thay đổi khác.

## 3. File mẫu + hướng dẫn
Thêm cột "Phân loại" ngay sau "Danh mục con"; sheet Hướng dẫn thêm 1 dòng giải thích.

## 4. Xuất Excel
- Không tick: xuất theo bộ lọc (như cũ). Có tick: nút Xuất Excel trên thanh "Đã chọn N" → chỉ SP đã tick.
- Bảng chọn cột: mọi cột (gồm Phân loại); Mã hàng hóa tick sẵn + khóa; Chọn tất cả / Bỏ hết; nhớ lần chọn trước trên máy (localStorage).
- Cột giá nhập vẫn chỉ chủ shop xuất được (kiểm ở server).
- Server kiểm danh sách id/cột nhận từ client (giới hạn số id, chỉ cột hợp lệ); vẫn ghi nhật ký xuất.

## 5. Web cho khách
Mục có SP mang phân loại → bộ lọc có nhóm **"Phân loại"** (thay nhóm "Loại quạt"), áp dụng mọi mục.

## Thứ tự
1. Gộp `feature/nhap-excel-ton-kho` vào `worktree-website-v2` (chủ shop duyệt 07/11).
2. Gửi 2–3 mẫu bảng chọn cột + bộ lọc → chủ shop chọn.
3. Viết mã, kiểm trên máy.
4. Chủ shop tự nhập lại file quạt trên web thật để gắn phân loại 100 quạt.

## Không được
Ghi Supabase, migration, deploy, gộp `main` khi chủ shop chưa đồng ý riêng.
