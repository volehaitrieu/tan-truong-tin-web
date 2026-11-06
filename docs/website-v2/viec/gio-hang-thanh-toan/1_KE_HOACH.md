# Giỏ hàng + Thanh toán — 1. Kế hoạch (Claude Code, 06/11/2026)

## Hiện trạng (đã đọc mã, chưa chạy thử đơn thật)
- `/gio-hang` (`CartPanel` trong `components/storefront/CartControls.tsx`) và `/thanh-toan` (`components/storefront/CheckoutForm.tsx`) **đã chạy được**. Giỏ lưu trong trình duyệt (`localStorage`, khóa `ttt-cart-v2`), giá lấy lại từ DB qua `cartProducts`.
- Đặt hàng gọi `placeOrder` → hàm Postgres `place_order`: tự tính giá, phí ship, chống spam, kiểm tra họ tên/SĐT/email/địa chỉ. **Phần này đáng tin, việc này không sửa.**
- Chỉ có COD; VietQR hiện "Sắp có".
- Bảng `orders` có 0 dòng: chưa từng chạy một đơn thật.

## Vấn đề tìm thấy
| # | Vấn đề | Bằng chứng | Mức |
|---|---|---|---|
| 1 | Chữ "Giao nội thành · phí báo khi xác nhận" mâu thuẫn với khung tóm tắt (đang hiện 20.000₫ / miễn phí từ 500.000₫ theo cài đặt) | `METHODS` trong `CheckoutForm.tsx` so với `fee` cùng tệp | Quan trọng |
| 2 | Không chặn/cảnh báo khi đặt quá tồn; nút ghi "Đặt trước" nhưng giỏ không nói rõ món nào là đặt trước | `place_order` chỉ giới hạn 1–999; giỏ chỉ có dòng chữ nhỏ màu vàng | Quan trọng |
| 3 | Thu email nhưng không gửi thư nào | Rà soát 06/11 mục 9 | Quan trọng — **cần chủ shop chọn** |
| 4 | Giỏ trên điện thoại: nút "Đặt hàng" nằm dưới cùng danh sách, khách phải cuộn mới thấy | Bố cục `grid lg:grid-cols` — dưới `lg` khung tóm tắt nằm sau danh sách | Quan trọng |
| 5 | Thanh toán trên điện thoại: tổng tiền + nút "Đặt hàng" nằm cuối trang dài | Như trên | Quan trọng |
| 6 | Số lượng trong giỏ không gõ trực tiếp được; không có giới hạn 999 như trang chi tiết | `CartPanel` | Nhỏ |
| 7 | Trạng thái "Đang tải giỏ hàng…" chỉ là dòng chữ, trang nhảy bố cục khi tải xong | `CartPanel`, `CheckoutForm` | Nhỏ |
| 8 | Lỗi từ máy chủ hiện ở khung tóm tắt; trên điện thoại khách có thể không thấy | `serverError` | Nhỏ |
| 9 | `cartProducts` tải toàn bộ sản phẩm rồi lọc — chậm khi lên ~3.500 SP | `app/(store)/actions.ts` | Để sau (việc phân trang riêng) |

## Mục tiêu đợt này
Khách trên điện thoại (375px) mua được 1–5 món trong ≤ 1 phút, luôn thấy tổng tiền và nút bước tiếp, hiểu rõ món nào có sẵn / phải chờ, phí ship nói đúng như hệ thống tính.

## Trong phạm vi (Codex làm giao diện)
Vấn đề 1, 2 (phần hiển thị), 4, 5, 6, 7, 8; vấn đề 3 làm theo lựa chọn của chủ shop.

## Ngoài phạm vi (không đụng)
- Hàm `place_order`, migration, RLS, `app/(store)/actions.ts` (máy chủ). Chặn quá tồn ở máy chủ = việc riêng, cần chủ shop duyệt.
- VietQR, tài khoản khách, email xác nhận, thông báo đơn mới cho shop.
- Trang `/cam-on` (thuộc việc "Tra cứu / Báo giá / Cảm ơn"), chỉ giữ nguyên dữ liệu `ORDER_KEY` đang truyền sang.

## Rủi ro
- Dữ liệu Supabase dùng chung với web thật → **không đặt đơn thử** khi chủ shop chưa đồng ý (khi kiểm tra dùng nút Đặt hàng chỉ đến bước báo lỗi kiểm tra ô).
- `CartControls.tsx` còn chứa `BuyBox`, `AddToCartButton`, `CartCount` dùng ở trang khác → Codex chỉ sửa `CartPanel` và phần dùng riêng cho giỏ.

## Câu hỏi cho chủ shop — ĐÃ TRẢ LỜI 06/11 (1a bỏ email, 2a vẫn cho đặt, 3 đúng 20.000₫; xem `2_KHUNG.md`)
1. **Ô Email:** (a) bỏ hẳn — *đề xuất*, vì chưa gửi thư; (b) giữ nhưng ghi rõ "để shop liên hệ, chưa gửi thư tự động".
2. **Món hết hàng trong giỏ:** (a) vẫn cho đặt, ghi rõ nhãn "Đặt trước — shop gọi báo ngày có hàng" — *đề xuất, giống hiện tại nhưng rõ hơn*; (b) không cho đặt món hết hàng.
3. **Phí giao nội thành:** web đang cài 20.000₫, miễn phí từ 500.000₫. Đúng chưa? Nếu đúng, chữ sẽ đổi thành "20.000₫ · miễn phí từ 500.000₫".

## Tiêu chí nghiệm thu (Claude Code rà ở bước 4)
- Ở 375px: tổng tiền + nút bước tiếp luôn nhìn thấy ở cả giỏ và thanh toán; không tràn ngang; mọi nút ≥ 44px.
- Chữ phí ship khớp đúng cách máy chủ tính cho cả 3 cách nhận.
- Món hết hàng có nhãn rõ trong giỏ và trong tóm tắt thanh toán.
- Lỗi kiểm tra ô: con trỏ nhảy tới ô lỗi đầu tiên, thông báo tiếng Việt; lỗi máy chủ hiện ngay cạnh nút Đặt hàng (nhìn thấy trên điện thoại).
- Không đổi dữ liệu gửi lên `placeOrder` và dữ liệu `ORDER_KEY` sang `/cam-on` (trừ bỏ email nếu chủ shop chọn 1a).
- `npx tsc --noEmit` + ESLint các tệp sửa đạt. Không đổi tệp ngoài danh sách ở `2_KHUNG.md`.
