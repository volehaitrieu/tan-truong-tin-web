# Tân Trường Tín: bảng màu và khung bố cục từng trang (4/11/2026)

Tài liệu để đưa cho công cụ thiết kế ảnh thứ ba. Ưu tiên **điện thoại 375px**; máy tính ghi ở mục 7. Mọi chữ tiếng Việt đủ dấu. Mục nào đã dựng thật hoặc đã có ảnh mẫu được đánh dấu **[đã có]**; mục chưa vẽ là **[đề xuất]** và chủ shop chưa duyệt.

## 1. Bảng màu

| Tên | Mã | Dùng cho |
|---|---|---|
| Nền kem | `#FFFBF7` | Nền trang (phẳng, trang bán hàng không dùng gradient) |
| Ngọc trai | `#ECE7E9` | Ô sản phẩm, ô tùy chọn chưa chọn, nút phụ |
| Xám sương | `#D5D0D0` | Ô sản phẩm, thẻ tóm tắt đơn, nền chân trang, đường nối tiến trình chưa xong |
| Be xám | `#B8B2AB` | Ô sản phẩm đậm nhất, viền vòng tiến trình chưa tới. **Không dùng làm chữ** |
| Ô nhập | `#EBE6E8` | Nền ô nhập liệu (kèm viền `#918B85`) |
| Viền ô nhập | `#918B85` | Viền ô nhập, tương phản 3,27:1 trên nền kem |
| Than | `#2F2F2F` | Hình vẽ trên ô màu, nút khi rê chuột, chữ phụ đậm |
| Đen mực | `#181818` | Chữ chính |
| Nút chính | `#1B1B1B` | Nút viên thuốc, ô đang chọn, chấm "trang hiện tại" |
| Chữ phụ | `#6B655E` | Ghi chú, "(không bắt buộc)", placeholder |
| Xanh lá nhẹ | `#3E9B6A` | **Chỉ** cho tiến trình đã xong (vòng, đường nối, dấu tick) |
| Đỏ báo lỗi | `#B93B1F` | **Chỉ** cho lỗi và viền ô lỗi |

Tương phản đã tính: đen mực / kem 17,2:1; chữ phụ / kem 5,6:1; chữ phụ / ngọc trai 4,7:1; đen mực / be xám 8,5:1; trắng / nút chính 17,2:1; đỏ lỗi / kem 5,5:1. Xanh lá chỉ 3,3:1 trên kem: dùng cho hình, **không dùng cho chữ nhỏ**.

Không dùng: xanh dương (cobalt cũ), vàng cho điểm nhấn, tím, bất kỳ màu nào ngoài bảng. Không gradient, không bóng đổ, không viền mảnh ngoài ô nhập, không làm mờ nền kiểu kính.

## 2. Chữ và kích thước

Font **Be Vietnam Pro**, 400/500/600/700. Năm cỡ, không thêm cỡ thứ sáu:

| Cỡ | Dùng cho |
|---|---|
| 32px, đậm 700, giãn chữ -0.03em, dòng 1.1 | Tiêu đề trang (tối đa 2 dòng) |
| 22px, đậm 700 | Tiêu đề từng khối |
| 17px, vừa 500 | Tên sản phẩm, tên lựa chọn |
| 15px, 400/600 | Chữ thường, nút, nhãn ô |
| 13px | Ghi chú, "(không bắt buộc)", tên mục thanh dưới |

## 3. Khung chung (điện thoại 375px)

- Lề hai bên **20px**. Khoảng cách giữa các khối lớn **64px**; trong một khối 10–22px.
- Một độ bo cho mọi ô và thẻ: **20px**. Nút là **viên thuốc** (bo tròn hết). Phần đáy trang và tấm nền đè lên ảnh bo góc trên **28px**.
- Vùng bấm tối thiểu **44px**; nút và ô nhập cao **52px**.
- Ô sản phẩm vuông (tỷ lệ 1:1); ô đầu của lưới có thể gấp đôi chiều ngang (2:1.15). Màu ô xoay vòng: ngọc trai, xám sương, be xám.
- Hình trong ô là một món đứng một mình, cùng cỡ (khoảng 62% bề ngang ô), chữ dưới ô: tên 17px, giá 15px đậm.

## 4. Các thành phần dùng lại

1. **Đầu trang** [đã có]: chữ "Tân Trường Tín" đậm 20px bên trái (không logo ảnh), bên phải hai nút tròn 44px: tài khoản, giỏ hàng (chấm số đen). Dưới là ô tìm kiếm 52px nền `#EBE6E8`, viền `#918B85`, bo 20px, biểu tượng kính lúp.
2. **Thanh dưới cố định** [đã có]: 4 mục Trang chủ, Danh mục, Tra cứu đơn, Tài khoản; icon nét mảnh 24px, chữ 12px; mục hiện tại đậm đen, các mục khác chữ phụ.
3. **Nút chính**: viên thuốc `#1B1B1B`, chữ trắng 15px đậm, cao 52px. **Nút liên kết phụ**: chữ đậm gạch chân, không viền.
4. **Chip lọc**: viên thuốc cao 36px, ngọc trai; đang chọn đen mực chữ trắng.
5. **Ô nhập**: xem bảng màu; nhãn trên ô đậm 14px, "(không bắt buộc)" chữ phụ 12px; lỗi: viền và dòng chữ đỏ `#B93B1F`.
6. **Ô lựa chọn** (cách nhận hàng, thanh toán): cao tối thiểu 60px, bo 20px, ngọc trai; ô đang chọn đen mực, chữ trắng, chấm tròn trắng bên trái; ô chưa có (VietQR) mờ 60%.
7. **Thẻ tóm tắt đơn**: nền xám sương, bo 20px, đệm 22px.
8. **Tiến trình**: vòng 28px nối ngang bằng đường 3px; đang làm viền đen; chưa tới viền be xám; xong xanh lá kèm dấu tick trắng.
9. **Chân trang** [đã có]: nền xám sương, bo góc trên 28px; chữ **T T T** xếp từ 3 khối đen mực cao khác nhau, đáy thẳng hàng, chữ xám sương trong khối; dưới là lưới 2 cột liên kết (Đổi trả, Bảo hành, Vận chuyển, Thanh toán, Bảo mật, Giới thiệu), cuối là địa chỉ và số điện thoại.

## 5. Bố cục từng trang (điện thoại, từ trên xuống)

**1. Trang chủ [đã có ảnh mẫu]**
1. Đầu trang + ô tìm kiếm.
2. Tiêu đề 32px: "Quạt, ấm siêu tốc, đồ gia dụng". Dưới: "Cửa hàng ở 379 đường 2/4, Nha Trang. Đặt hàng không cần tài khoản, đến lấy hoặc nhận giao tận nơi." Hàng nút: **Xem sản phẩm** (nút chính) + liên kết gạch chân "Gọi 0948 732 064".
3. Ảnh mặt tiền thật bo 20px, tỷ lệ 4:5, lề 20px.
4. "Danh mục" + liên kết "Tất cả": hai ô lớn tỷ lệ 4:5 cạnh nhau (Quạt, 100 sản phẩm, ngọc trai; Ấm siêu tốc, 14 sản phẩm, be xám), tên góc trên trái, hình món góc dưới phải.
5. "Sản phẩm" + "Xem tất cả": lưới 2 cột; ô đầu gấp đôi; 8 sản phẩm mỗi lượt, nút **Xem thêm N sản phẩm**.
6. Khối "Ghé cửa hàng": thẻ ngọc trai, địa chỉ, "Mở cửa 7:45 – 20:30", nút "Gọi 0948 732 064" rộng hết thẻ.
7. Chân trang, thanh dưới.

**2. Danh mục [đã có ảnh mẫu]**: đầu trang + tìm kiếm; tiêu đề tên danh mục + dòng "N sản phẩm" (chữ phụ); hàng chip lọc (Tất cả, thương hiệu, sắp xếp giá); lưới 2 cột; "Xem thêm N sản phẩm"; chân trang.

**3. Tìm kiếm [đề xuất]**: giống Danh mục; tiêu đề "Kết quả cho \"…\""; nếu không có: câu báo tiếng Việt + liên kết "Gửi yêu cầu báo giá".

**4. Chi tiết sản phẩm [đề xuất]**: đầu trang; ô ảnh lớn 1:1 màu phẳng, hình món ở giữa (nếu có nhiều ảnh: chấm chuyển ảnh bên dưới); tên 22px, thương hiệu và mã hàng chữ phụ; giá 32px đậm kèm "/ cái"; ô số lượng (nút − và + 44px); nút chính "Thêm vào giỏ" rộng hết bề ngang; liên kết "Gọi hỏi hàng". Thông số chỉ ghi những gì có trong dữ liệu. Cuối: "Sản phẩm khác" lưới 2 cột; chân trang. Thanh nút "Thêm vào giỏ" cố định đáy thay cho thanh dưới.

**5. Giỏ hàng [đề xuất]**: tiêu đề "Giỏ hàng"; mỗi dòng: ô ảnh vuông 72px (màu phẳng) + tên 17px + giá + ô số lượng + liên kết "Xóa"; dưới cùng thẻ xám sương: Tiền hàng, Phí ship (chữ phụ "báo khi xác nhận"), Tạm tính đậm; nút chính **Đặt hàng**. Giỏ trống: một câu + nút "Xem sản phẩm".

**6. Thanh toán [đã có ảnh mẫu]**: tiêu đề "Đặt hàng" + "Không cần tài khoản. Shop sẽ gọi xác nhận trước khi giao."; ô Họ tên, Số điện thoại, Email (không bắt buộc); "Cách nhận hàng" 3 ô lựa chọn (Đến cửa hàng lấy 0₫ · 379 đường 2/4; Giao nội thành; Gửi đi tỉnh); nếu không phải đến lấy: thêm Tỉnh/Thành, Phường/Xã, Số nhà tên đường; ô Ghi chú (không bắt buộc); "Thanh toán": Trả tiền mặt khi nhận hàng (đang chọn), Chuyển khoản VietQR (mờ, "Sắp có"); thẻ tóm tắt đơn; nút chính **Đặt hàng**.

**7. Cảm ơn (sau khi đặt) [đề xuất]**: dấu tick xanh lá lớn; tiêu đề "Cảm ơn bạn đã đặt hàng!"; "Mã đơn hàng của bạn" + mã đơn lớn (ví dụ TTT001024) + "Hãy lưu lại mã này để tra cứu đơn."; câu tổng tiền hàng và phí ship; thẻ "Trạng thái đơn" gồm 4 bước theo thứ tự dọc trên điện thoại: Chờ xác nhận, Đã xác nhận, Đang giao / Sẵn sàng lấy, Hoàn thành (bước đã qua xanh lá có tick, bước hiện tại viền xanh lá, bước chưa tới viền be xám) rồi danh sách món; thẻ "Chuyển khoản VietQR · Sắp có"; nút chính "Tra cứu đơn", liên kết "Tiếp tục mua".

**Lưu ý đánh số:** các khung trong file Figma đánh số khác danh sách này (1 Trang chủ, 2 Danh mục, 3 Thanh toán, 4 Giỏ hàng, 5 Chi tiết sản phẩm, 6 Tra cứu đơn, 7 Cảm ơn, 8 Báo giá, 9 Tài khoản, 10 Chính sách). Chưa vẽ trong Figma: Tìm kiếm, Đăng nhập/Đăng ký khách, Đăng nhập quản trị.

**8. Tra cứu đơn [đề xuất]**: tiêu đề "Tra cứu đơn hàng" + "Nhập mã đơn và số điện thoại bạn dùng khi đặt hàng."; ô Mã đơn (gợi ý TTT001024), ô Số điện thoại; nút chính **Tra cứu**; kết quả: thẻ xám sương gồm mã đơn, cách nhận hàng, tiến trình 4 bước (xanh lá), danh sách món, Tiền hàng, Phí ship, Mã vận đơn, Tổng cộng.

**9. Báo giá [đề xuất]**: tiêu đề "Báo giá số lượng lớn" + "Ghi danh sách món cần mua và số điện thoại — shop sẽ gọi báo giá trong giờ mở cửa." (chữ thật của trang hiện tại); ô nhiều dòng 5 dòng "Danh sách món cần báo giá" (gợi ý "Ống PVC Bình Minh Φ21 × 50 cây"); ô Số điện thoại; nút chính **Gửi yêu cầu báo giá**; trạng thái xong: dấu tick xanh lá + "Shop đã nhận yêu cầu báo giá" + "Shop sẽ gọi số … trong giờ mở cửa (7:45 – 20:30)".

**10. Tài khoản [đề xuất]**: tiêu đề "Tài khoản của bạn" + "Theo dõi đơn hàng và lưu thông tin nhận hàng tại một nơi."; thẻ "Đăng nhập hoặc tạo tài khoản" (câu "Giao diện tài khoản đang được chuẩn bị. Bạn vẫn đặt hàng và tra cứu đơn không cần tài khoản."), nút chính **Đăng nhập**, liên kết gạch chân **Tạo tài khoản mới**; hai thẻ phụ "Lịch sử đơn hàng" và "Địa chỉ nhận hàng"; liên kết "Tra cứu đơn hiện tại". Bỏ dòng nhỏ phía trên tiêu đề ("Khu vực khách hàng") của trang cũ.

**11. Đăng nhập / Đăng ký khách [đã dựng thật]**: ảnh mặt tiền thật cao 270px, mép dưới rõ nét, nút "Quay lại" viên thuốc trắng góc trên trái; tấm nền kem `#FFFBF7` bo góc trên 28px đè lên ảnh 28px; tiêu đề căn trái 26px ("Đăng nhập" / "Đăng ký tài khoản"); với Đăng ký: dòng "Đã xong n trên 6 bước" + 6 vòng đánh số nối ngang; các ô đánh số "1. Họ tên", "2. Số điện thoại", "3. Email (không bắt buộc)", "4. Mật khẩu", "5. Nhập lại mật khẩu", "6. Sản phẩm anh chị cần tìm là gì? (không bắt buộc)"; nút chính "Tạo tài khoản" hoặc "Đăng nhập"; nút Google trắng viền xám nhạt (chưa bật); liên kết gạch chân "Tôi đã có tài khoản" / "Tạo tài khoản mới"; trang Đăng nhập thêm "Quên mật khẩu? Gọi shop 0948 732 064". Trang này đứng riêng, không đầu trang, không chân trang.

**12. Chính sách [đề xuất]**: tiêu đề "Chính sách & giới thiệu"; hàng chip 6 mục (Đổi trả, Bảo hành, Vận chuyển, Thanh toán, Bảo mật, Giới thiệu); mỗi mục là một khối: tiêu đề 22px + đoạn 15px chữ đen mực, dòng không quá 65 ký tự; chân trang.

**13. Đăng nhập quản trị [đã dựng thật]**: ảnh mặt tiền thật cao 340px mờ dần vào nền kem-hồng bằng mặt nạ (trang này vẫn dùng nền loang kem→hồng nhạt `#F1EDEA → #F3F0E9 → #EFE9E6 → #EFE6E4`), tiêu đề giữa "Đăng nhập quản trị", hai ô nhập nửa trong suốt, nút đen mực, nút phụ "Về trang bán hàng".

## 6. Dữ liệu và ảnh thật (không bịa)

- Cửa hàng: Tân Trường Tín, **379 đường 2/4, Nha Trang**, điện thoại **0948 732 064**, mở cửa **7:45 – 20:30**.
- Ảnh mặt tiền thật: `public/shop/mat-tien.webp` (765×1020, dọc). Biển hiệu chữ vàng trên nền đen "TÂN TRƯỜNG TÍN" nằm khoảng 37–44% chiều cao ảnh; cắt giữ vùng 50% ngang, 59% dọc.
- Hiện có 114 sản phẩm: **Quạt 100**, **Ấm siêu tốc 14**. Ví dụ tên và giá thật: "Ấm siêu tốc Inox 2 lớp 3L Sunhouse SHD1365" 794.000₫; "Ấm siêu tốc inox Sunhouse SHD1182" 300.000₫.
- **Sản phẩm chưa có ảnh riêng** (đang dùng chung ảnh minh họa). Hình ấm và quạt trong ảnh mẫu là hình vẽ tạm, cần thay bằng ảnh thật của shop trên nền trắng hoặc trong.
- Không dùng logo hình của cửa hàng, không đổi tên cửa hàng. Logo hãng (ChingHai, Lifan, Senko) đang có sẵn nhưng chưa chốt có giữ ở trang chủ hay không.
- Không bịa số liệu, đánh giá, thông số kỹ thuật, tên khách hàng.

## 7. Máy tính (làm sau điện thoại)

Chiều rộng tối đa 1240px, lề đều hai bên. Đầu trang có ô tìm kiếm cùng hàng với chữ "Tân Trường Tín", "Tra cứu đơn", tài khoản, giỏ hàng; không còn thanh dưới. Lưới sản phẩm 4 cột (6 cột cho ô danh mục). Thanh toán chia 2 cột: form bên trái, thẻ tóm tắt cố định bên phải (360px). Trang Đăng nhập / Đăng ký: thẻ rộng 460px đặt giữa màn hình, nền loang kem→hồng nhạt quanh thẻ.

## 8. Đoạn mô tả có thể dán thẳng cho công cụ thiết kế

> Thiết kế giao diện điện thoại 375px cho cửa hàng điện máy gia dụng "Tân Trường Tín" (Nha Trang). Phong cách: ấm, sáng, tối giản, kiểu catalogue: mỗi sản phẩm đứng một mình trên ô màu phẳng (ngọc trai #ECE7E9, xám sương #D5D0D0, be xám #B8B2AB), nền kem #FFFBF7, chữ đen mực #181818, nút viên thuốc đen #1B1B1B, ô nhập xám #EBE6E8 viền #918B85 bo 20px cao 52px. Font Be Vietnam Pro, tiêu đề đậm 32px. Không gradient, không bóng đổ, không viền mảnh, không icon trong ô màu, không logo hình, không emoji. Xanh lá #3E9B6A chỉ cho tiến trình đã xong; đỏ #B93B1F chỉ cho lỗi. Lề 20px, bo 20px, khối cách nhau 64px, vùng bấm tối thiểu 44px. Tiếng Việt đủ dấu, dùng đúng tên, giá và ảnh mặt tiền thật đã cho.
