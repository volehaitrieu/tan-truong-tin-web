# Trang đăng nhập quản trị: trích xuất phong cách thiết kế (3/11/2026)

Dùng để đưa cho Stitch, Figma và Claude cùng một đặc tả. Chủ shop chốt: lấy **kiểu form** từ ảnh form đăng nhập "Welcome back" (bỏ nền đen), lấy **bảng màu và nền** từ ảnh trang xe đạp Veloretti, nút chính **đen mực**, nền sáng.

## 1. Ảnh cửa hàng thật
- Tệp: `public/shop/mat-tien.webp`, 765x1020, ảnh dọc chụp mặt tiền cửa hàng Tân Trường Tín, đường 2/4, Bắc Nha Trang.
- Bố cục trong ảnh: bảng hiệu chữ vàng nền đen "TÂN TRƯỜNG TÍN" ở khoảng 37–44% chiều cao, mặt tiền kính ở 57–69%; cây xanh che một phần chữ "Â TR"; đường nhựa và vài người đi xe máy ở dưới; trời xanh phía trên. Cột điện trắng bên trái.
- Dùng: phủ kín chiều ngang phần đầu trang, `object-position: 50% 59%`, cao 280–300px trên điện thoại, mờ dần vào nền ở mép dưới bằng mặt nạ (không dùng bộ lọc làm mờ). KHÔNG thay bằng ảnh vẽ/ảnh mạng, KHÔNG đổi tên cửa hàng.

## 2. Bảng màu (từ ảnh xe đạp, lấy mẫu điểm ảnh)
| Tên | Mã | Vai trò |
|---|---|---|
| Ngọc trai | #ECE7E9 | Nền sáng chính, chữ trên nút đen |
| Xám sương | #D5D0D0 | Viền ô nhập, đường kẻ |
| Be xám | #B8B2AB | Icon mờ, viền nút phụ (KHÔNG làm chữ trên nền sáng: 1,7:1) |
| Than | #2F2F2F | Nút khi rê chuột, chữ phụ đậm |
| Đen mực | #181818 | Chữ chính, nút chính |
| Chữ phụ trên nền sáng | #6B655E | 4,7:1 trên ngọc trai |
| Mặt phẳng ô nhập | #F6F2F3 | Sáng hơn nền một bậc |

Không dùng màu nhấn nào khác (không xanh dương, không xanh lá, không đỏ ngoài báo lỗi #B93B1F).

## 3. Nền (CHỦ SHOP CHỌN nền của bản Stitch, 3/11/2026)
Nền rất nhạt, ấm, gần phẳng, dọc từ trên xuống: kem `#F1EDEA` → `#F3F0E9` (khoảng 32%) → `#EFE9E6` → hồng nhạt `#EFE6E4` ở đáy (`#F0E6E5` cuối). Lấy mẫu điểm ảnh từ màn Stitch "Đăng nhập quản trị v2" (xấp xỉ, không có mã gốc vì không xuất được). Ảnh mặt tiền mờ dần vào chính màu nền này. Không có góc be xám đậm như ảnh xe đạp (`#CDBFB5` đã bỏ). Làm bằng một `linear-gradient` CSS, không blur.

## 4. Kiểu form (từ ảnh "Welcome back", bỏ nền đen)
- Một cột, căn giữa, lề hai bên 22px, khoảng cách dọc 14px.
- Đè lên phần dưới của ảnh (nơi ảnh đã mờ vào nền), chỉ MỘT dòng tiêu đề "Đăng nhập quản trị" (28px đậm); KHÔNG có dòng tên cửa hàng "TÂN TRƯỜNG TÍN" (chủ shop bỏ 3/11).
- Ô nhập: cao 52px, bo 16px, có icon đầu dòng (thư, ổ khóa), ô mật khẩu có nút mắt bên phải, viền 1px xám sương, nền mờ trong suốt (xem mục 5).
- Nút chính: viên thuốc cao 52px, đen mực, chữ ngọc trai, bóng đổ mềm; nhấn xuống thu 98%.
- Nút phụ: viên thuốc viền be xám, nền trong suốt.
- Không có chữ nhỏ cuối trang (đã bỏ "Quên mật khẩu? Liên hệ chủ shop", địa chỉ, số điện thoại) và không có dòng phụ đề "Dành cho chủ shop và nhân viên".
- Không có: đăng nhập Google/mạng xã hội, "Đăng ký", logo hình.

## 5. Form "hiện mờ màu của nền" (chủ shop yêu cầu thêm)
Ô nhập, ô xác minh và (nếu có) thẻ chứa form dùng nền bán trong suốt trắng (`rgba(255,255,255,0.7–0.75)` theo bản Stitch) để màu loang của nền thấy xuyên qua, viền trắng mỏng bán trong suốt. Giả hiệu ứng kính bằng độ trong suốt và viền sáng, KHÔNG dùng `backdrop-filter`/blur (nặng máy). Chữ vẫn phải đạt tương phản 4,5:1 trên nền loang.

## 6. Nội dung chữ (tiếng Việt đủ dấu)
"Đăng nhập quản trị" · "Số điện thoại hoặc email" (gợi ý "Số điện thoại của bạn") · "Mật khẩu" · ô xác minh Cloudflare "Xác minh bạn là con người" · "Đăng nhập" · "Về trang bán hàng".

## 7. Quy tắc chung
Điện thoại 390px trước; Be Vietnam Pro; vùng bấm tối thiểu 44px; không cắt chữ; không số liệu bịa; ảnh mặt tiền và tên cửa hàng phải là thật.
