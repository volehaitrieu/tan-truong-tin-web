# Rà soát thiếu sót trang bán hàng (chỉ đọc) — 06/11/2026

Phạm vi: 12 trang bán hàng bản v2 (chạy thử trên máy, dùng chung dữ liệu với web thật), 4 góc nhìn: sẵn sàng mở bán, trải nghiệm điện thoại 375px, dữ liệu sản phẩm, tìm kiếm/SEO/tốc độ.
Cách kiểm: đọc mã, truy vấn chỉ-đọc vào Supabase `ztbwxfzklznpqbofbwlk`, quét 11 trang ở 375px bằng trình duyệt trong ứng dụng. Không ghi dữ liệu, không đặt đơn.
Mức độ: **Chặn mở bán** (sai hoặc gây hại cho khách/shop) · **Quan trọng** (dễ làm khách hiểu sai, tốn công vận hành) · **Nhỏ** (trình bày, nhất quán).

## Chặn mở bán
1. **Chưa từng chạy một đơn thật từ đầu đến cuối, và shop không có thông báo đơn mới.** Bằng chứng: bảng `orders` có 0 dòng; trang Cài đặt ghi "Thông báo đơn mới qua Telegram — Sắp có". Hậu quả: đơn khách đặt có thể nằm đó không ai biết. Cần: 1 đơn thử rồi hủy (cần chủ shop đồng ý vì dữ liệu dùng chung) + chốt cách báo đơn (Telegram/Zalo/tự mở trang quản trị theo giờ).
2. **Chính sách đổi trả và vận chuyển chưa chốt, khách đang thấy nhãn "Chờ chủ shop".** Bằng chứng: `settings.return_policy` rỗng; trang `/chinh-sach` hiện "đang chờ chủ shop chốt". Vận chuyển ghi tên SPX, GHTK và "phí báo sau" chưa xác nhận. Cần: chủ shop viết/chốt nội dung; em không tự bịa.

## Quan trọng
3. **Tồn kho 114/114 đều "Còn hàng" từ cùng con số 5, và hệ thống không chặn đặt quá tồn.** Bằng chứng: hàm `place_order` không so số lượng với tồn (cho 1–999). Nếu số 5 chỉ là số mẫu, khách đặt hàng shop không có. Cần: kiểm số tồn thật; cân nhắc cảnh báo khi đặt quá tồn.
4. **Hãng và giá của nhóm Ấm siêu tốc có điểm lạ (nguồn từ file Excel gốc).** SHD1415 không có hãng; "Ấm PhiLips 1L" ghi hãng Sunhouse; "Ấm thủy tinh 1.7L Sunhouse" ghi hãng Philips; 13/14 sản phẩm cùng giá nhập 108.000₫; giá lặp 645.688₫ và 794.000₫ (SHD1306 nhựa 794.000₫ trong khi SHD1182 inox 300.000₫). Cần chủ shop đối chiếu hóa đơn nhập.
5. **Ảnh sản phẩm: 112/114 chưa có ảnh thật.** Mọi thẻ dùng ảnh minh họa chung (có nhãn "Ảnh minh họa", trung thực). Hai ảnh thật còn lại, theo ghi chú bàn giao 30/10, là ảnh thử (chụp màn hình), cần xóa trước khi cho khách xem. Tên "Quàn sàn lửng 20in ChingHai FF2399" gõ nhầm "Quạt".
6. **Nội dung thiếu:** 14/14 ấm không có mô tả, thông số, bảo hành; 76/114 sản phẩm không ghi xuất xứ. Cần thông tin thật từ chủ shop/nhà cung cấp.
7. **Tăng lên khoảng 3.500 sản phẩm sẽ chậm và có thể bị cắt.** (a) Trang chủ nhúng cả danh mục vào trang: 114 sản phẩm = 44,6 KB nén (385 KB thô) ≈ 390 byte/sản phẩm; 3.500 sản phẩm ≈ 1,4 MB nén. (b) `getProducts()` xin tối đa 5.000 dòng nhưng Supabase thường giới hạn 1.000 dòng mỗi lần (chưa xác minh cấu hình dự án); quá 1.000 có thể bị cắt âm thầm. Cần: phân trang phía máy chủ. Việc làm trước khi nhập đủ hàng.
8. **Tìm kiếm Google đang tắt có chủ ý và cần đổi ở HAI chỗ khi mở bán:** `app/layout.tsx` (`robots: index false`) và `app/robots.ts` (`Disallow: /`). Web thật hiện trả `Disallow: /` và `noindex`. Chưa có sitemap, canonical, thẻ chia sẻ (OG), dữ liệu có cấu trúc Product; mọi trang dùng chung một mô tả.
9. **Thu email khách nhưng không gửi email nào.** Ô "Email (không bắt buộc)" ở thanh toán; trong mã không có chức năng gửi thư. Hoặc làm thư xác nhận đơn, hoặc bỏ ô để khỏi thu dữ liệu không dùng.
10. **Cần xác minh pháp lý (chưa kết luận):** các nguồn thứ cấp tìm được cho biết website có chức năng đặt hàng trực tuyến phải thông báo với Bộ Công Thương (Nghị định 52/2013/NĐ-CP, sửa đổi bởi 85/2021/NĐ-CP). Em chưa đọc văn bản gốc và chưa xác minh còn hiệu lực. Nên hỏi kế toán hoặc cơ quan quản lý; kiểm cả thông tin người bán hiển thị ở chân trang.
11. **Trang chủ có khối rỗng:** "Sản phẩm đang giảm giá (0) — Hiện chưa có sản phẩm giảm giá". Ẩn khối khi chưa có giảm giá.
12. **Tên danh mục lệch:** web lưu "Gia dụng" (tiêu đề tab, trang danh mục, bảng lọc) nhưng menu trang chủ máy tính ghi "Đồ gia dụng" và file Excel ghi "Đồ gia dụng".

## Nhỏ
13. Nút bấm dưới 44px: 6 chip mục lục trang Chính sách (40px), chip danh mục con Ấm siêu tốc/Quạt (40px), 4 chấm chuyển slide hãng ở trang chủ (rộng 28px).
14. Chữ nhỏ: nhãn "Ảnh minh họa" 10px, tên hãng trên thẻ 11px, nhãn thanh dưới 11px, giờ mở cửa 11,5px.
15. `theme-color` web thật còn xanh `#0d6b45` (bản v2 đã đổi).

## Điểm tốt đã kiểm
- Không có trang nào tràn ngang ở 375px (11/11 trang); mọi ảnh có `alt`; mỗi trang đúng 1 `h1`; `lang="vi"`.
- `place_order` tính giá và phí ở máy chủ (không tin giá từ trình duyệt), chống spam (3 đơn/10 phút/số điện thoại, 30 đơn/phút toàn shop), phí ship nội thành 20.000₫ và miễn phí từ 500.000₫ đang cấu hình.
- Thanh toán chỉ COD, ghi rõ "Shop sẽ gọi xác nhận đơn trước khi giao" (không hứa quá).

## Chưa kiểm
Safari iPhone và bàn phím thật; màn máy tính của 7 trang vừa đổi màu; tốc độ bản chạy thật (Lighthouse); trang cảm ơn khi có đơn thật; email/Zalo thật; trang quản trị; kiểm tra truy cập bằng máy đọc màn hình.
