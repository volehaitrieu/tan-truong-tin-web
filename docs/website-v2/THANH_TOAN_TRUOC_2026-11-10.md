# Chuyển khoản trước khi báo đặt hàng thành công — đã phát hành

## Quyết định của chủ shop

- Chỉ chuyển khoản phải chờ tiền được xác nhận trước khi báo đặt hàng thành công. COD vẫn thanh toán lúc nhận.
- Tạo mã đơn chờ thanh toán, hiển thị QR với số tiền và mã đơn từ dữ liệu máy chủ. SePay chỉ tự nhận giao dịch đúng tài khoản, đúng mã, đúng tổng tiền.
- Giữ hàng tối đa 30 phút. Giao dịch đến sau 30 phút được tự chấp nhận trong 24 giờ tính từ lúc tạo mã nếu còn đủ hàng; sau 24 giờ cần shop xử lý.
- Tiền đã nhận nhưng hàng không đủ phải hiện “Đã nhận tiền · cần shop xử lý”, không báo đơn thành công.

## Đã triển khai

- Migration đã áp dụng: supabase/migrations/20261110083306_prepaid_bank_reservations_20261110.sql. Supabase thật đã ghi nhận migration 20261110083306; website đã phát hành bản production dpl_1B1BztcnGEVSGAM3D3L1jLPqdsqi.
- Trang /cho-thanh-toan là bước QR và tự kiểm tra mỗi 5 giây. Trang /cam-on chỉ hiển thị thành công sau khi đọc được trạng thái đã nhận tiền và chấp nhận đơn từ DB. Trang Tra cứu đơn cho mở lại QR khi hàng còn được giữ.
- Hàm cơ sở dữ liệu khóa từng dòng tồn theo mã sản phẩm để chống hai giao dịch giành cùng hàng; kiểm tra cả bán tại quầy và xác nhận đơn. Hàng giữ hết hạn tự hết hiệu lực trong phép tính, không cần tác vụ định kỳ.
- Chủ shop có biểu mẫu gắn giao dịch SePay cần kiểm tra vào đơn sau khi đối chiếu. Hàm DB kiểm lại tài khoản nhận, số tiền, mã đơn, quyền chủ shop và tồn kho. Với đơn cũ đã được xác nhận tiền, biểu mẫu chỉ liên kết bản ghi giao dịch; không cộng tiền hay trừ kho lần nữa.
- Phí giao của đơn chuyển khoản mới không đổi sau khi đã phát QR; nhân viên vẫn nhập được mã vận đơn.

## Cần kiểm trước khi phát hành

1. Đơn COD vẫn đặt được, không hiện QR.
2. Đơn chuyển khoản: trước khi tiền về chỉ thấy “Chờ thanh toán”; /cam-on không báo thành công.
3. Đúng tiền, tài khoản, mã trong 30 phút: SePay tự nhận một lần, mở trang thành công.
4. Tiền đến sau 30 phút, trước 24 giờ: đủ hàng thì tự nhận; thiếu hàng thì ghi đã nhận tiền và cần shop xử lý.
5. Tiền đến sau 24 giờ: ghi đã nhận tiền và cần shop đối chiếu.
6. Sai tiền, sai tài khoản, thiếu mã, mã không khớp, webhook lặp: không tự chấp nhận.
7. Hai đơn tranh món tồn cuối: chỉ một được giữ; bán tại quầy không lấy hàng đang giữ.
8. Nhân viên không xác nhận đơn chuyển khoản chưa thanh toán; hủy đơn chờ tiền trả lại phần giữ hàng.
9. Chủ shop gắn giao dịch cần kiểm tra vào đúng đơn, kiểm quyền và kiểm trùng; thử bổ sung hàng rồi chấp nhận đơn đã nhận tiền.
10. Thử ở điện thoại 375px, quét QR bằng app ngân hàng và một khoản thanh toán thử thật có hoàn tác phù hợp.

## Giới hạn đã biết

- Ngân hàng vẫn có thể cho khách sửa tiền hoặc nội dung sau khi quét; hệ thống chỉ tự nhận khi dữ liệu nhận về đúng.
- Đơn COD đang chờ nhân viên xác nhận không giữ hàng vô thời hạn. Nếu nhiều đơn COD tranh cùng món, đơn sau có thể bị từ chối ở bước nhân viên xác nhận; không cho trừ kho âm.
- Chưa có quy trình hoàn tiền tự động. Khi đã nhận tiền nhưng thiếu hàng hoặc đơn cần hủy, shop phải xử lý với khách và ngân hàng thủ công.
- Migration đã chạy thành công; đã xác minh cấu trúc, phân quyền và 114/114 tồn kho vẫn bằng 5. Đã kiểm giao diện thanh toán ở 375px: 305.000đ + 15.000đ giao hàng = 320.000đ, nút chuyển khoản dẫn đến bước tạo mã. Bản dựng Webpack qua; Turbopack trên Windows gặp lỗi tiến trình xử lý CSS. Đã thử đối soát bằng dữ liệu mô phỏng hoàn tác; chưa thử bằng khoản chuyển khoản ngân hàng thật sau phát hành.
