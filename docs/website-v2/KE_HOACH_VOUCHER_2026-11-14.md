# Kế hoạch Voucher (tạm hoãn 14/11/2026)

Chủ shop cho tạm hoãn. Khi làm lại, bắt đầu từ các quyết định đã chốt dưới đây, không hỏi lại những mục này.

## Đã chốt
- Giai đoạn 1: chỉ làm **trang quản trị** trước. Phần cho khách (trang /voucher, ô nhập mã ở thanh toán) làm khi được mở lại đặt hàng online.
- Loại giảm: **số tiền**, **%** (bắt buộc nhập mức giảm tối đa), và **miễn phí giao hàng**.
- Được dùng chung với hàng đang giảm giá.
- Chỉ **chủ shop** tạo và quản lý mã (kiểm tra quyền ở máy chủ/RLS).
- Tên mã: chủ shop tự gõ (chữ in hoa và số, không dấu), có nút tạo ngẫu nhiên.
- Phạm vi: **toàn shop**.
- **1 mã mỗi đơn.**
- Giới hạn mỗi khách: **chỉ khách có tài khoản** mới dùng được mã.
- Đơn tối thiểu và tiền giảm tính trên **tổng đơn gồm phí ship**.
- Đơn bị hủy: **trả lại lượt** cho mã và khách (nếu mã còn hạn).
- Hiển thị: **tùy từng mã** (ô "Đăng công khai"); mã ẩn gửi riêng qua Zalo.
- Thống kê mỗi mã: số lượt đã dùng / còn lại, tổng tiền đã giảm.
- Mã đã có người dùng: **chỉ được tắt, kết thúc sớm, nới hạn, thêm lượt**; không sửa mức giảm/điều kiện, không xóa.

## Còn phải hỏi
1. Giới hạn chung tiền giảm tối đa 50% giá trị đơn: chặn mọi mã / chặn trừ mã miễn phí ship / không chặn / ô riêng từng mã. (Chủ shop cần kiểm tra quy định khuyến mại, Nghị định 81/2018/NĐ-CP, với Sở Công Thương.)
2. Mã miễn phí giao hàng: trừ toàn bộ phí ship hay tối đa một số tiền đặt trước.

## Ghi chú kỹ thuật
- Tiền giảm phải tính lại ở máy chủ (RPC đặt hàng), không tin số từ trình duyệt; đơn lưu mã và số tiền giảm.
- Lượt dùng cần khóa chống dùng vượt khi nhiều đơn cùng lúc.
- Tham khảo cách làm: Điện Máy Xanh (phiếu 100.000đ cho đơn từ 500.000đ, hạn 72 giờ; mã 3–5% tối đa 200.000đ), CellphoneS (kho voucher, áp ở bước thanh toán).
