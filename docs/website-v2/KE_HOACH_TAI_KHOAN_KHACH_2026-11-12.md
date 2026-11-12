# Kế hoạch tài khoản khách — chờ chủ shop duyệt (12/11/2026)

## Chủ shop đã chọn
- Đăng nhập: SĐT hoặc email + mật khẩu; thêm Google và Facebook.
- Chức năng: lịch sử đơn, tự điền thông tin giao hàng, sản phẩm yêu thích, đổi thông tin/mật khẩu.
- Khách không có tài khoản vẫn đặt hàng được.

## Hiện trạng đã kiểm
- Giao diện đăng nhập/đăng ký khách (`CustomerAuth.tsx`, `/tai-khoan`) mới là giao diện, chưa nối hệ thống.
- Quyền DB đều theo vai trò nhân viên (`has_perm` trên bảng `profiles`); không có trigger tạo hồ sơ khi đăng ký → người đăng ký mới không có quyền quản trị.
- Supabase Auth hiện chỉ dùng email (3 tài khoản nhân viên).

## Quyết định an toàn mình đề xuất
- **Lịch sử đơn chỉ gồm đơn đặt khi đã đăng nhập.** Không tự gắn đơn cũ theo SĐT: SĐT không được xác minh, người khác đăng ký bằng SĐT của bạn sẽ xem được đơn của bạn.
- **SĐT + mật khẩu không gửi SMS:** lưu SĐT làm tên đăng nhập. Quên mật khẩu với tài khoản SĐT → liên hệ shop; với email → tự đặt lại qua email.
- Dữ liệu khách tách bảng riêng (`customers`, `customer_favorites`), RLS: mỗi khách chỉ đọc/sửa của mình; nhân viên không tự có quyền mới.
- Tiền, tồn, giá vẫn tính ở máy chủ như hiện tại.

## Phân tích kỹ thuật (bổ sung 12/11, chủ shop chốt không dùng SMS)
- **Đăng nhập SĐT không SMS:** nhân viên đang đăng nhập bằng SĐT → email ảo `{sđt}@{STAFF_EMAIL_DOMAIN}` (`lib/auth.ts`). Khách dùng cùng cách nhưng **miền email ảo riêng** để không trùng tài khoản nhân viên. Email thật thì dùng nguyên email.
- **Chống máy tự động:** Supabase đang bật Turnstile (captcha) cho đăng nhập nhân viên; captcha áp cho mọi lệnh Auth, nên form khách cũng phải gửi mã Turnstile — dùng lại `lib/turnstile.ts`.
- **Xác nhận email:** cài đặt chung của Supabase. Nếu bật, khách email phải bấm link mới đăng nhập được; tài khoản SĐT (email ảo) sẽ không nhận được link → phải tắt xác nhận, hoặc tạo tài khoản SĐT ở máy chủ. Đề xuất: **tắt xác nhận email**; đặt lại mật khẩu vẫn gửi về đúng hộp thư.
- **Khách vào trang quản trị:** không có hồ sơ nhân viên → `requireStaff` chuyển về đăng nhập, RLS chặn (đã kiểm chính sách). Cần thêm kiểm thử tự động cho điều này.
- **Gắn đơn:** `place_order` đang gọi bằng khách vãng lai (anon). Đợt 2 đổi sang gọi kèm phiên đăng nhập nếu có, và hàm DB tự lấy `auth.uid()` — không nhận mã khách từ trình duyệt.
- **Yêu thích:** đang lưu `localStorage` (`FavoriteButton.tsx`); đợt 3 đồng bộ lên bảng khi đăng nhập.
- **Form đăng ký hiện có ô "Sản phẩm cần tìm"** (không bắt buộc) — cần chủ shop quyết giữ hay bỏ.
- **Phiên đăng nhập dùng chung trình duyệt:** nhân viên đăng nhập quản trị rồi mở trang khách sẽ là "người đã đăng nhập" — trang tài khoản khách phải nhận ra đây là nhân viên và không tạo hồ sơ khách.

## Các đợt
1. **Đăng ký/đăng nhập SĐT hoặc email + hồ sơ + đổi mật khẩu.** Migration bảng `customers` + RLS; nối giao diện có sẵn.
2. **Gắn đơn với tài khoản + lịch sử đơn + tự điền thanh toán.** Migration thêm `orders.customer_id`; sửa `place_order` nhận khách đang đăng nhập.
3. **Yêu thích theo tài khoản** (gộp danh sách đang lưu trên máy khi đăng nhập).
4. **Google và Facebook.**

## Chủ shop cần làm
- Supabase → Authentication: bật cho phép đăng ký mới (hiện có thể đang tắt theo danh sách bảo mật). Mình chỉ đường từng bước.
- Đợt 4: tạo ứng dụng Google Cloud và Facebook Developers, dán Client ID/Secret vào Supabase. Mình không nhập khóa thay bạn. Facebook có thể cần xác minh doanh nghiệp/chính sách quyền riêng tư trước khi cho người ngoài dùng.
- Trang chính sách bảo mật cần thêm câu về dữ liệu tài khoản (mình soạn nháp).

## Mỗi đợt
Migration đưa chủ shop xem trước → áp → kiểm RLS bằng tài khoản thử → kiểm 375px → ponytail-review → phát hành khi được đồng ý.

## Chủ shop chốt thêm (12/11)
- Không dùng SMS xác minh.
- Bỏ ô "Sản phẩm cần tìm" khỏi form đăng ký.
- Tắt xác nhận email trong Supabase.
- Email: khách nhập tùy chọn, **không xác minh**, không gửi email; trang tài khoản hiện nhãn "Chưa xác minh". Đăng nhập chỉ bằng SĐT + mật khẩu (email chưa xác minh không dùng để đăng nhập/đặt lại mật khẩu, không bắt buộc duy nhất). Quên mật khẩu: liên hệ shop. Không cần dịch vụ gửi email.
- Sửa (chủ shop): SĐT và email đều **duy nhất**. Trùng thì báo đỏ ngay dưới ô: "Thông tin này đã được sử dụng." Kiểm ở máy chủ khi gửi form (có captcha), DB có ràng buộc duy nhất làm chốt cuối. Email so không phân biệt hoa thường. Email bị người khác chiếm → liên hệ shop.
