# Báo cáo theo dõi Claude và đối chiếu thiết kế Stitch

_Cập nhật lần đầu: 2026-10-22; nguồn mới nhất lúc lập báo cáo: Claude ghi nhận 01:50 (Asia/Saigon). Báo cáo này được cập nhật khi có ghi nhận mới từ Claude. Người dùng yêu cầu chỉ theo dõi qua Claude, không theo dõi trực tiếp Stitch và không can thiệp phiên Claude._

## Phạm vi và cách đối chiếu

- Nguồn theo dõi: ghi chú/quan sát Claude trong claude-mem, `docs/OVERNIGHT_PLAN.md`, và các mục mới nhất trong `docs/MENTOR_LOG.md`.
- Chuẩn đối chiếu: các quyết định của chủ shop trong lịch sử Claude và checklist dự án; tính năng phải thuộc PRD, kể cả P1/P2; tính năng Stitch tự thêm ngoài phạm vi cần loại và ghi vào `design/stitch/DA_LOAI_BO.md`.
- Không truy cập Stitch để kiểm tra ảnh/trạng thái. Do đó, các kết luận về màn hình hiện dựa trên báo cáo của Claude, chưa phải xác minh hình ảnh độc lập.
- Mỗi lượt cập nhật cần ghi thời điểm, nguồn, thay đổi mới, điểm khớp/chưa khớp và việc cần Claude làm tiếp. Khi không có ghi nhận mới, tiếp tục chờ theo chu kỳ 10 phút; không gửi báo cáo cho chủ shop cho đến khi được yêu cầu.

## Các thống nhất cần dùng làm chuẩn

- Thứ tự công việc: thiết kế Admin → thiết kế Bán hàng → backend; được toàn quyền thao tác, chỉ hỏi chủ shop khi giao diện và backend hoàn tất.
- Admin phải có bản điện thoại cho mọi màn theo lựa chọn B, mục tiêu iPhone 17 Pro Max (440×956); menu điều chỉnh cho điện thoại, bảng thành thẻ, nút chạm tối thiểu 44px.
- Chỉ giữ tính năng có trong PRD (bao gồm P1/P2); loại tính năng Stitch tự thêm không thuộc phạm vi. Ghi rõ nội dung bị loại trong `design/stitch/DA_LOAI_BO.md`.
- Thông tin thương hiệu và chữ tiếng Việt của cửa hàng Tân Trường Tín; quyền xem giá nhập và lãi gộp chỉ dành cho chủ shop.
- Việc chưa chốt (đổi trả, phí giao hàng nội thành) gắn nhãn “chờ chủ shop”; VietQR ghi “sắp có”; AI gợi ý làm giao diện trước.
- Bán hàng: địa chỉ chọn Tỉnh → Phường/Xã, COD mặc định; dùng thông tin liên hệ thật theo thiết kế đã duyệt.
- Chuyển động nhẹ, CSS transition không quá 200ms và tôn trọng `prefers-reduced-motion`.

## Trạng thái theo ghi nhận Claude

- Admin desktop: Báo cáo hoàn tất; Nhân viên & quyền hoàn tất theo ghi nhận Claude. Trước đó các màn Tổng quan, Sản phẩm, Nhập Excel, Tồn kho, Kiểm kho, Danh mục, Đơn hàng, Bán tại quầy và Khuyến mãi đã được ghi là xong.
- Nhật ký thao tác: Claude ghi nhận chưa gửi thành công. Lần thử trước điều hướng nhầm menu tài khoản Google; sau đó phiên đăng nhập Stitch mất và hiện lỗi “Sorry, we hit a snag”/yêu cầu Sign in.
- Chưa làm: Cài đặt, Đăng nhập; toàn bộ bản Admin điện thoại; tải mã và lọc Admin; thiết kế/tải/lọc Bán hàng; code Next.js và backend.
- Điểm cần Claude xác minh: `OVERNIGHT_PLAN.md` hiện đánh dấu “Nhật ký thao tác — đã gửi Stitch” [x], nhưng `MENTOR_LOG.md` lúc 01:50 và ghi nhận Claude [630] nói màn này chưa gửi do mất đăng nhập. Tạm coi trạng thái là **chưa gửi**, cho đến khi có bằng chứng cập nhật mới từ Claude.

## Đối chiếu hiện tại và các điểm cần lưu ý

| Hạng mục | Đối chiếu | Kết luận / việc tiếp theo |
|---|---|---|
| Báo cáo | Claude báo đã hoàn tất; yêu cầu gồm doanh thu, sản phẩm bán chạy, lãi gộp chỉ chủ shop, xuất Excel | Khớp theo mô tả; chưa xem trực tiếp hình |
| Nhân viên & quyền | Claude báo hoàn tất; 4 vai trò, bảng 12 quyền; chủ shop khóa bật; giá nhập/lãi gộp owner-only | Khớp theo mô tả; chưa xem trực tiếp hình |
| Nhật ký thao tác | MENTOR_LOG và ghi nhận Claude nói chưa gửi; checklist lại ghi đã gửi | Không khớp giữa hồ sơ tiến độ; chờ Claude sửa/xác nhận |
| Mobile Admin | Quyết định B yêu cầu bản điện thoại cho mọi màn | Chưa bắt đầu theo checklist |
| Tổng quan và tính năng P1 | Ghi nhớ Claude trước đây chỉ ra doanh thu và biểu đồ 7 ngày là P1, ngoài batch 1 ban đầu; sau đó chủ shop yêu cầu thiết kế đầy đủ cả luồng tương lai và chỉ lọc tính năng ngoài PRD | Chỉ đánh dấu lỗi nếu ngoài PRD; không coi P1 tự thân là ngoài phạm vi. Cần rà soát mọi phần Stitch tự thêm theo PRD khi lấy mã |
| Gửi Zalo OA | Claude từng ghi Stitch tự thêm nút này trên thẻ thông tin sản phẩm | Đã có chỉ dẫn loại nếu không nằm trong PRD; cần đối chiếu lại lúc tải mã |

## Nhật ký cập nhật

### 2026-10-22 — Khởi tạo
- Đọc phần lịch sử Claude/ghi chú dự án liên quan các quyết định thiết kế và các lượt overnight; đọc checklist và phần cuối mentor log.
- Claude báo Nhật ký thao tác bị chặn bởi mất đăng nhập Stitch, nhưng checklist hiện ghi đã gửi. Ghi nhận mâu thuẫn và để chờ Claude xác nhận.
- Người dùng đổi phạm vi: không theo dõi Stitch; theo dõi cập nhật qua Claude, kiểm tra mỗi 10 phút, không gửi báo cáo cho đến khi được yêu cầu.

### 2026-10-22 — Cập nhật sau khi theo dõi Claude (log đến 02:05)
- Claude ghi chủ shop đã đăng nhập lại; Nhật ký thao tác được gửi lúc 01:55 và xác nhận hoàn tất lúc 02:00. Mâu thuẫn checklist/log ở bản khởi tạo đã được giải quyết bởi các cập nhật mới: checklist và mentor log hiện cùng đánh dấu hoàn tất.
- Cài đặt được gửi lúc 02:00, xác nhận hoàn tất lúc 02:05. Mô tả gồm thông tin shop thật, phí giao hàng nội thành “Chờ chủ shop”, COD và VietQR “Sắp có”, Telegram, đổi trả “Chờ chủ shop” — khớp các điều kiện đã chốt.
- Đăng nhập Admin còn lại ở giai đoạn A. Claude ghi hạn mức 5 giờ 91% nên tạm dừng đến khoảng 04:00; không đánh giá các bước còn lại là lỗi thiết kế.
- Cần theo dõi chênh lệch lịch hẹn trong ghi chú Claude: một bản tóm tắt nêu 03:04 dù cũng nói chờ reset lúc 04:00; mentor log mới nhất ghi chờ khoảng 04:00. Chờ log tiếp theo làm rõ.
- Chưa có xác minh hình ảnh độc lập; trạng thái trên đây phản ánh cập nhật Claude và checklist/log mới nhất, theo yêu cầu chỉ theo dõi qua Claude.
