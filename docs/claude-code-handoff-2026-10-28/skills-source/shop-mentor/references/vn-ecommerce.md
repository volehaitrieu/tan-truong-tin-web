# Đặc thù bán hàng online tại Việt Nam

Thông tin dịch vụ (phí, điều kiện đăng ký, API) thay đổi thường xuyên. Khi người dùng chuẩn bị tích hợp thật, **tra tài liệu chính thức mới nhất** (WebSearch/WebFetch) và nói rõ với họ là đã kiểm tra hay chưa.

## Thanh toán — so sánh để đưa lựa chọn
| Phương án | Phù hợp | Ưu | Nhược |
|---|---|---|---|
| COD (thu hộ khi giao) | Mọi shop mới | Không cần tích hợp, khách VN quen dùng | Rủi ro bom hàng, tiền về chậm |
| Chuyển khoản VietQR (tạo mã QR theo số tiền + nội dung = mã đơn) | Shop nhỏ, cá nhân | Miễn phí, dễ làm (ảnh QR từ img.vietqr.io) | Phải tự đối soát nếu không có webhook |
| PayOS | Cá nhân/hộ kinh doanh muốn tự động xác nhận chuyển khoản | Webhook báo đã thanh toán, SDK Node | Cần tài khoản ngân hàng liên kết |
| VNPay / MoMo / ZaloPay | Shop có pháp nhân | Thẻ, ví, phổ biến | Cần hồ sơ doanh nghiệp, ký hợp đồng |
| Stripe | Bán ra nước ngoài | Tài liệu tốt | Hạn chế với tài khoản VN |

Gợi ý mặc định cho MVP: **COD + VietQR**, nâng lên PayOS khi số đơn tăng.
Bảo mật: luôn xác minh chữ ký webhook (checksum/HMAC) phía server; cập nhật `payment_status` chỉ từ webhook đã xác minh, không từ redirect của trình duyệt.

## Vận chuyển
- Giai đoạn đầu: phí ship cố định hoặc theo vùng (nội thành / ngoại thành / tỉnh), miễn phí trên ngưỡng.
- Sau đó: tích hợp GHN, GHTK, Viettel Post, J&T để tính phí và tạo vận đơn tự động.
- Địa chỉ 3 cấp Tỉnh/Thành → Quận/Huyện → Phường/Xã. Lưu ý đơn vị hành chính VN đã sắp xếp lại từ 2025 (bỏ cấp huyện ở nhiều nơi) — kiểm tra nguồn dữ liệu địa giới mới nhất trước khi làm form.

## Thông báo đơn hàng
- **Telegram Bot**: dễ nhất cho chủ shop nhận thông báo đơn mới (gọi từ Server Action hoặc Edge Function).
- **Email**: Resend / Supabase SMTP cho xác nhận đơn gửi khách.
- **Zalo OA / ZNS**: khách VN đọc nhiều, nhưng cần đăng ký OA và duyệt mẫu tin.

## Thói quen khách hàng
- Đa số mua bằng điện thoại → mobile-first, nút bấm to, checkout ít trường.
- Hay hỏi trước khi mua → nút Chat Zalo / Messenger nổi.
- Tin vào đánh giá, ảnh thật, chính sách đổi trả rõ ràng.
- Số điện thoại quan trọng hơn email → bắt buộc SĐT, email tùy chọn.
- Giá hiển thị dạng `199.000₫` (dùng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`).

## Pháp lý (nhắc người dùng tự kiểm tra, Mentor không tư vấn pháp lý)
- Website TMĐT bán hàng cần thông báo với Bộ Công Thương (online.gov.vn).
- Trang chính sách: bảo mật thông tin, đổi trả, vận chuyển, thanh toán; thông tin chủ shop.
- Hóa đơn điện tử nếu là doanh nghiệp/hộ kinh doanh theo quy định thuế hiện hành.
- Dữ liệu cá nhân khách: tuân thủ quy định bảo vệ dữ liệu cá nhân (Nghị định 13/2023 và luật mới nếu có) — chỉ thu thập thông tin cần thiết.
