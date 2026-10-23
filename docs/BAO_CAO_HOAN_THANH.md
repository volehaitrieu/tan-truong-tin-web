# Báo cáo hoàn thành — Web Tân Trường Tín (bản chạy thử trên máy)

_Ngày 23/10/2026. Mã nguồn: kho GitHub riêng tư `volehaitrieu/tan-truong-tin-web` (nhánh `main`). Dữ liệu: Supabase `ztbwxfzklznpqbofbwlk` (gói miễn phí)._

## 1. Đã làm xong

**Trang bán hàng (khách)** — trang chủ, danh mục + bộ lọc (thông số riêng của quạt), tìm kiếm không dấu có gợi ý, chi tiết sản phẩm, giỏ hàng, đặt hàng (COD; VietQR "Sắp có"), cảm ơn, tra cứu đơn (mã + SĐT), chính sách, báo giá số lượng lớn, trang 404. Dùng tốt trên iPhone (440px) và máy tính (1440px).

**Trang quản trị** — đăng nhập bằng SĐT, menu theo quyền, và 19 màn đều chạy với dữ liệu thật:
Tổng quan · Đơn hàng (xác nhận / giao / hủy / phí ship / đã thu tiền / in phiếu) · Bán tại quầy · Sản phẩm + sửa SP · Nhập Excel (DMHH + file quạt, xem trước lỗi từng dòng) · Ảnh thông tin SP (tải PNG gửi Zalo) · Tồn kho + điều chỉnh · Kiểm kho + đếm trên điện thoại · Danh mục & thương hiệu · Khuyến mãi · Báo cáo + xuất Excel · Nhân viên & bảng quyền · Nhật ký thao tác · Cài đặt (phí ship, đổi trả…).

**Dữ liệu thử** — 90 sản phẩm lấy từ file của anh/chị (KHO XHD sheet DMHH ~4 SP/danh mục con + 14 quạt có đủ thông số). Tồn = 0 (chưa đọc sheet TON KHO) nên web hiện "Liên hệ / Đặt trước".

## 2. Kiểm thử

| Bài | Kết quả |
|---|---|
| Phân quyền + RLS (`scripts/kiem-thu-bao-mat.mjs`) | **47/47 đạt** |
| Đóng vai kẻ tấn công (`scripts/tan-cong-thu.mjs`) | **35/35 an toàn** (sau khi vá) |
| Đóng vai khách: xem hàng → giỏ → đặt → tra cứu; mọi trang ở 440px và 1440px | Không lỗi, không tràn ngang |
| Đóng vai NV đơn / NV kho / chủ shop | Đúng quyền từng người |

## 3. Lỗi và lỗ hổng đã tìm ra và vá

1. **Chủ shop không sửa được sản phẩm** — trigger ghi nhật ký viết sai → mọi lần sửa SP/giá nhập/quyền đều lỗi. Đã sửa.
2. **Trang quản trị chỉ ẩn menu** — gõ thẳng đường dẫn vẫn vào được trang không có quyền. Đã chặn ở từng trang (và trong cơ sở dữ liệu).
3. **Tra cứu đơn khách vãng lai** — đơn tại quầy không có SĐT có thể bị đoán mã để xem. Đã chặn.
4. **Spam báo giá bằng nhiều SĐT** — trước lọt 25/25 yêu cầu. Đã giới hạn 20 yêu cầu/10 phút toàn shop.
5. **Thiếu header bảo mật** (chống nhúng trang, nosniff, CSP, referrer, lộ "Next.js"). Đã thêm.
6. **Quyền gọi hàm `my_permissions` mở cho khách** — đã thu lại.
7. Lỗi giao diện: danh mục Quạt hiện 0 SP, ảnh minh họa sai nhóm, form bị xóa trắng khi nhập sai, đăng nhập sai mất SĐT đã gõ, tràn ngang Nhật ký, bộ lọc Đơn hàng sai… — đã sửa.

Chặn sẵn từ đầu: khách sửa giá/số lượng trong trình duyệt (server tự tính tiền), số lượng âm/9999, NV đơn đọc giá nhập, NV kho sửa giá, nhân viên tự nâng quyền, bấm xác nhận đơn 2 lần (chỉ trừ tồn 1 lần), chèn mã độc (XSS/SQL), khóa bí mật lọt ra trình duyệt.

## 4. Việc anh/chị cần làm (xem thêm `docs/CHU_SHOP_CAN_CHUAN_BI.md`)

1. **Tắt tự đăng ký tài khoản** trong Supabase: Authentication → Sign In / Providers → tắt "Allow new users to sign up". (Tài khoản tự đăng ký không có quyền gì, nhưng nên tắt.)
2. **Tạo khóa bí mật mới** (Settings → API Keys → Secret key) và dán vào `.env.local` thay khóa `service_role` cũ trước khi đưa web lên mạng.
3. **Đổi mật khẩu tài khoản chủ shop** (đăng nhập bằng 0948 732 064 — mật khẩu tạm ở `.env.local`, dòng `TEST_OWNER_PASSWORD`).
4. Chốt **phí ship nội thành** + **chính sách đổi trả** → nhập ở Admin › Cài đặt.
5. **Phân loại hàng**: DMHH có 2.189 dòng chưa rõ danh mục; file quạt có 93 dòng thiếu SKU. Có thể nhập dần qua Admin › Nhập Excel (chọn danh mục cho dòng chưa phân loại).
6. **Tồn kho thật**: nhập tồn bằng Tồn kho › Điều chỉnh, hoặc tạo đợt Kiểm kho rồi chốt.
7. Ảnh sản phẩm thật, tài khoản VietQR, bot Telegram — khi có.

## 5. Chưa làm (để sau)

Mã giảm giá · VietQR · báo đơn qua Telegram · ảnh sản phẩm tải lên · đưa web lên mạng (Vercel + tên miền) · thanh giỏ hàng dính đáy ở màn Bán tại quầy trên điện thoại.

## 6. Cách chạy lại kiểm thử

```
node --env-file=.env.local scripts/kiem-thu-bao-mat.mjs
node --env-file=.env.local scripts/tan-cong-thu.mjs
```
