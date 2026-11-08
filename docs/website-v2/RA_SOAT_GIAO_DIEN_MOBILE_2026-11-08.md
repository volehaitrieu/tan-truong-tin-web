# Rà soát giao diện bán hàng trên điện thoại (375px) — 08/11/2026

Phạm vi: web thật tantruongtin.com, 12 trang (trang chủ, danh mục, Quạt, sản phẩm, giỏ hàng, thanh toán, tra cứu, chính sách, báo giá, tìm kiếm, tài khoản, 404). Chỉ đọc: quét số liệu bằng trình duyệt (tràn ngang, nút nhỏ, chữ nhỏ, ảnh, tiêu đề), xem ảnh chụp, đọc cấu hình mã. Không đặt đơn, không ghi dữ liệu.

## Điểm tốt
- 12/12 trang không tràn ngang ở 375px; mỗi trang có tiêu đề chính (h1); ô nhập ≥16px ở thanh toán (iOS không tự phóng to); trang 404 tiếng Việt; font Be Vietnam Pro; phản hồi máy chủ nhanh.

## 1. Khách thấy ngay và dễ mất tin (nên sửa trước)
1. **Ảnh sản phẩm sai/không đúng hàng**: ảnh chính của Quạt bàn Airport APQ B439 là ảnh dòng chữ "You are half of my soul"; FF2399 là ảnh chụp màn hình trò chơi; mọi quạt/ấm còn lại dùng chung một ảnh minh họa chậu cây + bóng đèn (không phải quạt, không phải ấm).
2. **Lời hứa chưa thực hiện**: trang sản phẩm ghi "COD · VietQR sắp có"; trang Chính sách còn nhãn "Chờ chủ shop"; trang Tài khoản ghi "Giao diện tài khoản đang được chuẩn bị" nhưng vẫn mở được từ đầu trang.
3. **Khối rỗng ở trang chủ**: "Sản phẩm đang giảm giá (0) — chưa có".

## 2. Chưa đạt mục tiêu "thấy ngành hàng, thấy sản phẩm, so sánh, đặt dễ"
4. Trang chủ màn đầu chỉ có ảnh mặt tiền + 2 ô ngành hàng nhỏ; sản phẩm phải cuộn qua khối rỗng mới thấy. "Tất cả sản phẩm (114)" xếp theo tên nên Ấm siêu tốc (14 món) đứng đầu dù Quạt có 100 món.
5. **Chưa có so sánh sản phẩm.**
6. Trang chủ nặng ~406 KB (nhúng cả 114 sản phẩm); trang Quạt ~364 KB; sẽ chậm khi tăng sản phẩm hoặc mạng yếu.
7. Thẻ sản phẩm chưa hiện thông số quyết định (Điều khiển, công suất, sải cánh) nên khách phải mở từng trang.

## 3. "Chưa mượt" (cảm giác)
8. Không có màn chờ (loading) cho trang bán hàng: bấm sang trang là đứng im đến khi máy chủ trả về. Chỉ trang quản trị có loading.
9. Không có hiệu ứng chuyển trang; không có trang báo lỗi riêng cho khu bán hàng (chỉ có trang 404).
10. Ảnh sản phẩm hiện đột ngột (đã có khung chờ nhưng chưa làm mờ dần theo ảnh thật).

## 4. Chi tiết trình bày
11. Chữ dưới 12px: 20 chỗ ở trang chủ/danh mục (nhãn "Ảnh minh họa" 10px, tên hãng 11px, chữ thanh dưới 11px, giờ mở cửa 11,5px).
12. Vùng bấm dưới 40px: ô tìm ở đầu trang (16×42, thu gọn), chấm chuyển nhóm thương hiệu (28×44), liên kết đường dẫn "Danh mục / Đồ gia dụng" (20px cao), nút Xóa ở giỏ.
13. Hai thẻ h1 trên /danh-muc (bản điện thoại + máy tính cùng có trong trang).
14. Màu/tông: chỉ có đen–kem–xám, chưa có màu nhấn của thương hiệu; cảm giác trung tính, dễ giống mẫu chung. Cần chốt bảng màu và bộ hình dạng thống nhất khi làm giao diện mới.

## 5. Nội dung/SEO (đã ghi ở RA_SOAT_2026-11-08.md)
Mô tả meta trang sản phẩm là câu chung; chưa có sitemap, dữ liệu cấu trúc, thẻ chia sẻ; `robots.txt` chặn công cụ tìm kiếm.

## Đề xuất thứ tự khi làm giao diện mới
A. Chốt hướng bố cục (trang chủ, thẻ sản phẩm, so sánh) và bảng màu bằng mẫu.
B. Nền tảng mượt: màn chờ theo trang, chuyển trang, phản hồi khi bấm, ảnh hiện mượt.
C. Trang chủ mới (ngành hàng + sản phẩm + tìm nhanh), thẻ sản phẩm có thông số chính.
D. Tính năng so sánh (chọn 2–3 món, màn so sánh).
E. Dọn các lời hứa chưa có (VietQR, tài khoản) và khối rỗng; thay ảnh thật.
F. Giỏ hàng/thanh toán gọn lại theo bộ mới; kiểm lại cỡ chữ và vùng bấm.
