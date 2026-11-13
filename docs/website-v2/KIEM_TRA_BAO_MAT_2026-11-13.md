# Kiểm tra website và bản vá — 13/11/2026

## Kết luận và phạm vi

Đã rà soát mã các luồng tài khoản, quyền quản trị, đặt/tra cứu đơn, báo giá, thanh toán SePay, giỏ hàng, yêu thích, mô tả HTML; đối chiếu quyền và định nghĩa hàm trên Supabase thật. Kiểm tra giao diện bằng trình duyệt riêng trên tantruongtin.com và bản thử. Giả định tải của một cửa hàng, không thực hiện tấn công gây tải hoặc thử mật khẩu hàng loạt.

**Bản vá chỉ nằm trên máy. Chưa commit, push, deploy hay áp migration.** Không tạo đơn, tài khoản hoặc giao dịch thật; không đọc khóa bí mật. Đây không phải chứng nhận không còn lỗ hổng. Các phần cần quyền và môi trường thử được liệt kê bên dưới.

## Phát hiện và xử lý

| Mức | Vấn đề, tình huống cụ thể | Xử lý / trạng thái |
|---|---|---|
| Cao có điều kiện | `lib/auth.ts` lưu quyền nhân viên trong Map dùng chung 30 giây. Nếu một nhân viên từng có `manage_staff` bị khóa/thu hồi quyền từ tiến trình khác, `addStaff` có thể tiếp tục dùng khóa máy chủ để tạo người dùng trước khi cache hết hạn. RLS không kiểm lại Auth Admin. | Bỏ cache giữa các request; vẫn dùng React cache trong một request. Test tái hiện quyền cũ trước vá, trả null sau vá. Chưa phát hành. |
| Trung bình — riêng tư | `registerCustomer` gọi `customer_identifiers_taken` trước Supabase kiểm captcha. Hàm DB còn được cấp EXECUTE cho anon/authenticated nên có thể dò SĐT/email đã tồn tại qua RPC. | Bỏ bước dò trước captcha trong app. Bản migration thu hồi EXECUTE đã soạn, **chưa áp dụng**; đường gọi trực tiếp vẫn tồn tại trên web thật. Ràng buộc unique vẫn giữ chống trùng. |
| Cao — khả dụng | Đơn chuyển khoản giữ tồn 30 phút; API đặt đơn gọi trực tiếp được, không có captcha. Giới hạn đếm hiện hữu có thể bị vượt khi nhiều request đồng thời vì chưa khóa trước phép đếm. Báo giá có cùng mẫu count-then-insert. | Dự thảo migration tuần tự hóa kiểm tra/ghi và giới hạn 3 đơn bank còn giữ hàng/SĐT. Chưa chạy hoặc kiểm tải. Đây **chưa phải** giải pháp chống bot hoàn chỉnh; xoay SĐT vẫn là rủi ro. |
| Trung bình — riêng tư | Danh sách yêu thích của A còn trong trình duyệt sau đăng xuất, rồi có thể bị gộp vào tài khoản B trên cùng máy. Phản hồi đồng bộ đang chờ cũng có thể ghi lại danh sách vừa xóa. | Nút đăng xuất xóa localStorage, hủy hiệu lực phản hồi đồng bộ cũ, nhận sự kiện xóa từ tab khác. Test phản hồi đến muộn đạt. Chưa thử hai tài khoản thật. |
| Thấp — kiểm soát phát hành | Facebook bị ẩn bằng cờ ở giao diện nhưng server action `oauthLogin` chưa kiểm cờ, gọi trực tiếp vẫn khởi động OAuth. Không đồng nghĩa chiếm tài khoản hoặc vượt chính sách nhà cung cấp. | Server kiểm cờ tương ứng Google/Facebook trước khi gọi OAuth. Test provider tắt đạt. |
| Lỗi chức năng | Giỏ hàng đọc JSON rồi ép kiểu; `null`, object hoặc item sai cấu trúc có thể làm nút thêm hàng/trang giỏ lỗi. | Kiểm cấu trúc, SKU, số lượng; bỏ dữ liệu sai, gộp SKU và chặn số lượng vượt 999 / quá 50 dòng. Test `null` đạt. |
| Lỗi chức năng | Turnstile báo lỗi nhưng nút gửi vẫn mở; callback lỗi không báo rõ cho khách. | Khóa gửi đến khi có mã; hiển thị lỗi tải/xác minh. Áp cả đăng nhập, đăng ký và đổi mật khẩu. Supabase vẫn là nơi kiểm mã thật. |
| Lỗi chức năng | Tra cứu/báo giá không bắt lỗi mạng, khiến nút kẹt ở trạng thái chờ. | Bắt lỗi, thông báo tiếng Việt, luôn mở lại nút trong finally. Test hai luồng đạt; tra cứu đã thử trình duyệt chặn POST để giả lập mất mạng. |
| Trung bình — công cụ phát triển | npm audit đầy đủ báo minimatch 10.2.6 và 6 gói phụ thuộc liên quan; không thuộc bộ thư viện runtime bán hàng. | Override riêng minimatch của typescript-estree lên 11.0.1, cập nhật lockfile. npm install/audit lại: 0 vulnerabilities. Lint/build đạt. [Thông báo bảo mật](https://github.com/advisories/GHSA-g3hv-75wg-m249). |
| Lỗi cấu hình | Build báo metadataBase dùng localhost cho URL ảnh chia sẻ. | Đặt metadataBase https://tantruongtin.com; build sau vá hết cảnh báo này. |

## Bằng chứng đã kiểm

- 31 test nghiệp vụ có sẵn + 8 test mới `scripts/check-security.mjs`: **39/39 đạt**. Test mới chạy mã thật với dịch vụ giả lập, không gọi DB.
- `npx --no-install tsc --noEmit`: đạt. `npm run lint`: 0 lỗi, 5 cảnh báo có sẵn ở ProductImageManager/check-vietqr. `npm run build`: đạt, sinh 153 trang (bao gồm route thử đang có trên máy).
- DB: transaction **read only**, role authenticated với UUID giả không tồn tại: đọc được 0 orders/customers/product_costs/profiles/sepay_transactions; customer_orders trả []; manage_staff/settings = false. Rollback xong. Không giả mạo UUID khách thật để xem dữ liệu.
- Đọc RLS/grants và mã RPC thực tế. Hàm legacy đặt hàng/POS/thay trạng thái bị thu hồi quyền gọi trực tiếp của anon/authenticated. Hàm SECURITY DEFINER có cảnh báo advisor không tự động là lỗ hổng; phải đọc kiểm quyền bên trong.
- 110 sản phẩm công khai: không có SKU sai quy tắc URL, không có giá âm. Không xác minh thủ công thông số/ảnh của cả 110 sản phẩm.
- Web chính: trang chủ, danh mục, chi tiết sản phẩm mẫu, giỏ hàng, thanh toán, so sánh, tài khoản, đăng nhập/đăng ký, tra cứu, báo giá, chính sách mở được. `/admin`, xuất báo cáo, in đơn chuyển khách chưa đăng nhập về đăng nhập.
- `/.env.local`, `/.git/config`: 404; sản phẩm không tồn tại: 404. GET webhook: 405; POST webhook không chữ ký: 401. Không gửi giao dịch giả có chữ ký hợp lệ.
- Chuỗi `<script>alert(1)</script>` trong tìm kiếm hiển thị thành chữ trong tiêu đề; không coi một chuỗi thử là chứng minh chống mọi XSS. Mô tả sản phẩm đi qua sanitizeHtml trong catalog/preview.
- Bản thử: thêm giỏ và hiển thị giá 305.000đ của sản phẩm mẫu; form checkout/báo giá/tra cứu trống báo lỗi; tra cứu khi mất mạng cho thử lại. Chưa bấm gửi đơn hợp lệ.
- Tìm kiếm dùng tham số `query`, so sánh dùng `sku`; đã đi qua nút tìm kiếm và link quản lý lựa chọn để xác minh sản phẩm xuất hiện. Điều hướng trực tiếp `/so-sanh` không có SKU chủ đích hiển thị rỗng.
- Trang chủ không tràn ngang ở 360/768/1440 px; thanh toán ở 390 px không tràn ngang. Đây là giả lập kích thước trình duyệt, chưa phải thử thiết bị iPhone/Android thật.
- Các tiêu đề bảo mật hiện có: CSP, DENY framing, nosniff, Referrer-Policy, Permissions-Policy, HSTS trên production.

## Còn mở, không được tuyên bố đã vá xong

1. **Chống bot đặt hàng/tra cứu/báo giá:** cần xác minh Turnstile phía server và khóa đường gọi RPC trực tiếp. Chỉ đặt widget trên UI không đủ. Cần cấu hình khóa Turnstile phía máy chủ và thiết kế bằng chứng xác minh mà DB kiểm được, không mở service-role để né RLS. Luồng trang chờ thanh toán đang polling tra cứu phải được giữ hoạt động (nên dùng quyền tra cứu ngắn hạn gắn với đúng đơn sau khi captcha/đặt đơn thành công). Phải kiểm replay, hết hạn, hostname/action sai và gọi RPC không qua web.
2. **Migration dự thảo:** `supabase/migrations/20261112180823_security_audit_hardening.sql`. Chưa chạy, chưa kiểm syntax/behavior trên PostgreSQL riêng, chưa thử đồng thời. Không áp thẳng chỉ vì test TypeScript đạt. Timestamp do CLI tạo theo UTC đứng trước vài migration cũ đặt giờ địa phương; áp đích danh sau customer migrations, không `db push` cả lịch sử. Cần chủ shop duyệt trước kiểm migration trong transaction rollback hoặc môi trường riêng, rồi mới áp dụng thật.
3. **Lỗi hydration trên web chính:** trình duyệt ghi React #418 khi mở trang chủ. Bản dev và bản build chạy localhost không tái hiện trong cùng cách thử. Chưa xác định gốc lỗi, chưa khẳng định sửa xong; cần kiểm lại sau triển khai và đối chiếu cache/deployment nếu còn. Không tắt cảnh báo để che lỗi.
4. **Auth advisor:** bảo vệ mật khẩu bị lộ đang tắt. Cần kiểm khả năng của gói Supabase và cấu hình riêng; không tự đổi gói hay thay chính sách xác thực. [Hướng dẫn](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
5. **Luồng tài khoản/đặt đơn thật:** chưa tạo tài khoản mới, chưa đăng nhập Google/Facebook bằng tài khoản chủ shop, chưa tạo/hủy đơn COD hoặc chuyển tiền, chưa thử vai trò nhân viên thật. Cần tài khoản thử và cho phép tạo dữ liệu thử; rollback place_order vẫn tiêu số đơn.
6. Chưa kiểm tấn công tải lớn, hạ tầng Vercel/Cloudflare ở mức tài khoản, khôi phục backup, thiết bị thật hay toàn bộ file import/ảnh bằng dữ liệu độc hại. Không chạy các script tạo dữ liệu/tấn công cũ trên DB thật.

## Bước tiếp theo có thể duyệt

- Kiểm migration trên môi trường riêng hoặc giao dịch rollback có kiểm chứng; nếu gọi place_order, mã đơn có thể nhảy dù rollback.
- Phát hành bản vá app trước hoặc cùng đợt thu hồi RPC dò tài khoản (phiên app cũ còn gọi RPC này sẽ cần tải lại).
- Áp migration đã kiểm; kiểm lại grants/RLS/giới hạn đồng thời bằng tài khoản thử.
- Thử một đơn COD tài khoản thử, kiểm lịch sử, hủy đúng đơn thử; không chuyển tiền hay gửi thông báo ngoài phạm vi được duyệt.
- Triển khai captcha cho API công khai sau khi có cấu hình và kiểm đầy đủ đường đi DB. Không coi bản giới hạn SĐT là hoàn tất mục này.

Giữ nguyên các thay đổi/tệp có sẵn từ Claude, gồm `supabase/.temp/cli-latest`, `.superpowers`, route thử phí ship, prototype, reports và research_notes. Không gom chúng vào commit bản vá.
