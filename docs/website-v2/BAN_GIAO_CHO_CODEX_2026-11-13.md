# Bàn giao cho Codex — Tân Trường Tín, 13/11/2026

Tổng hợp việc Claude làm từ 12/11 đến 13/11/2026. **Ưu tiên tài liệu này khi ghi chú cũ mâu thuẫn về trạng thái hiện hành.** Chi tiết từng bước, kèm bằng chứng kiểm thử, nằm trong `docs/MENTOR_LOG.md` (các mục 12/11–13/11).

## 1. Bắt đầu ở đúng nơi

- Worktree: `C:\Users\Hai Trieu\Documents\tan-truong-tin-web\.claude\worktrees\website-v2`, nhánh `worktree-website-v2`.
- Lúc bàn giao, **`main` = `worktree-website-v2` = website chính**, cùng commit `c8996af` hoặc commit bàn giao ngay sau đó. Không còn thay đổi mã chỉ nằm trên máy.
- Đọc trước: `AGENTS.md`, `CLAUDE.md`, tài liệu này, cuối `docs/MENTOR_LOG.md`, rồi `node_modules/next/dist/docs/` trước khi sửa Next.js 16.
- **Supabase `ztbwxfzklznpqbofbwlk` là DB thật**, kể cả khi chạy localhost.
  - Không in hay sao chép `.env.local` hoặc khóa.
  - Mọi migration phải đưa chủ shop xem trước khi chạy.
  - Không ghi DB, deploy hay push khi chưa được chủ shop đồng ý cho đúng bước đó.
- Kiểm thử an toàn: `node --test scripts/check-import-classifications.mjs scripts/check-import-stock.mjs scripts/check-notify-messages.mjs scripts/check-vietqr.mjs scripts/check-compare.mjs`. Không chạy `scripts/*.mjs` hàng loạt.
- **Thử quyền DB:** dùng giao dịch `begin … rollback` với `set local role authenticated` và `request.jwt.claims` giả. Lưu ý: mỗi lần gọi `place_order` thử sẽ tiêu một số trong chuỗi mã đơn, kể cả khi hoàn tác. Đã nhảy số TTT001074–1075.
- Các mục chưa theo dõi, **không gom vào commit**: `.superpowers/`, `app/(store)/kiem-tra-phi-ship/` (route thử, `.vercelignore` đã loại), `docs/website-v2/prototypes/` (có ảnh hãng khác), ảnh xem trước, `reports/`, `research_notes/`, `supabase/.temp/cli-latest`.

## 2. Trạng thái môi trường (đã kiểm chứng 12–13/11)

| Nơi | Trạng thái |
|---|---|
| tantruongtin.com | Bản mới nhất có: giao diện mới 11–12/11, accordion phẳng, nút nổi Messenger + Zalo, ảnh minh họa SVG, trang Giao dịch gọn, tài khoản khách đợt 1–4 (Google bật; Facebook **chưa bật**). robots vẫn `Disallow: /` (cố ý). |
| Vercel production env | Có `NEXT_PUBLIC_GOOGLE_LOGIN=1`. **Chưa có** `NEXT_PUBLIC_FACEBOOK_LOGIN`. |
| `.env.local` (máy chủ shop) | Có cờ Google; đã thêm `NEXT_PUBLIC_FACEBOOK_LOGIN=1` để thử Facebook trên localhost. |
| Supabase Auth | Đăng ký mở; **tắt xác nhận email**; captcha Turnstile bật; Site URL `https://tantruongtin.com`; Redirect URLs: `https://tantruongtin.com/auth/callback`, `http://localhost:3000/auth/callback`; Google ENABLED; Facebook ENABLED + "Allow users without an email". |
| Cloudflare Turnstile | Widget "TTT dang nhap quan tri", chế độ Managed, hostname `localhost` + `tantruongtin.com`. Mã dùng `appearance: "interaction-only"`. |
| Google Cloud | Dự án `tan-truong-tin-web`, branding "Tân Trường Tín", External, OAuth client Web, redirect `https://ztbwxfzklznpqbofbwlk.supabase.co/auth/v1/callback`. |
| Facebook | App "Tan Truong Tin" (ID 1442189881358664), use case Facebook Login + quyền email, App Domains (supabase.co, tantruongtin.com), Privacy URL `/chinh-sach`. **Chế độ phát triển** — chỉ chủ shop đăng nhập được. |

## 3. Đã làm 12–13/11 (tóm tắt)

**Giao diện và nội dung**
- Giỏ hàng trên điện thoại bỏ lặp nút và phí. Thanh toán đánh số bước theo cách nhận hàng, có ảnh nhỏ và hàng nút Sửa giỏ / Thu gọn.
- Nút nổi nhỏ hơn: Messenger (`https://www.facebook.com/trieu.vo.697369`, trang cá nhân) + Zalo.
- 8 ảnh minh họa SVG theo loại sản phẩm trong `public/minh-hoa/`. 114 → 110 SP đã gán; ảnh chữ sai của Airport B439 đã thay. Airport còn 2 dòng ảnh trùng `quat-ban.svg`.
- Xóa vĩnh viễn 4 ấm chưa có model; tạo file Excel mới trong Tải xuống.
- Chính sách đổi hàng đã lên web (`settings.return_policy`). Bản gốc: `docs/website-v2/NHAP_CHINH_SACH_DOI_TRA_2026-11-12.md`.

**Thanh toán và quản trị**
- Admin › Giao dịch: thẻ gọn, khoản Cần kiểm tra lên đầu, nút **Gắn vào đơn / Bỏ qua**. Migration `20261112120000_sepay_ignore_review`.
- 3 khoản SePay `review` đã giải thích. Chủ shop **chưa xác nhận** đã xử lý trong Admin.

**Tài khoản khách** (kế hoạch: `docs/website-v2/KE_HOACH_TAI_KHOAN_KHACH_2026-11-12.md`)
- **Đợt 1** `20261112150000_customer_accounts`: SĐT/email + mật khẩu. SĐT đăng nhập qua email ảo `{sđt}@khach.tantruongtin.vn`. Email không xác minh, nhãn "Chưa xác minh". SĐT và email không trùng, báo đỏ dưới ô. Bảng `customers` + RLS.
- **Đợt 2** `20261112170000_customer_orders`: `orders.customer_id`. `place_order` gắn khách bằng `auth.uid()`, logic tiền/tồn giữ nguyên. Có `customer_orders()`, địa chỉ, và thanh toán tự điền. Đơn cũ **không** gắn theo SĐT (có chủ đích).
- **Đợt 3** `20261112190000_customer_favorites`: yêu thích theo tài khoản, gộp danh sách localStorage khi đăng nhập, tối đa 200.
- **Đợt 4** `20261112210000_customer_oauth_register`:
  - Google/Facebook qua `oauthLogin` → `app/auth/callback/route.ts`.
  - Lần đầu khách phải nhập SĐT ở Hoàn tất hồ sơ.
  - Nhận biết nhân viên bằng bảng `profiles` (`getCustomerUser`), không theo tên miền email.
- **Sửa lỗi:** `proxy.ts` làm mới phiên cho `/tai-khoan` và `/thanh-toan`. Trước đó khách có thể bị đăng xuất sau 1 giờ.
- **Thử thật trên Chrome** (localhost, DB thật) đã đạt: đăng ký, trùng, đăng nhập, chặn /admin, đăng xuất, địa chỉ, tự điền, yêu thích, Google, Facebook. Tài khoản thử đã xóa.

## 4. Việc tiếp theo cho Codex (theo thứ tự đề xuất)

1. **Xóa danh sách yêu thích khỏi máy khi khách đăng xuất.** Key `localStorage` là `ttt-favorite-products`; nút đăng xuất là form server trong `app/(store)/tai-khoan/page.tsx`. Việc nhỏ, chưa làm.
2. **Thử đặt đơn khi đã đăng nhập trên web chính** (nhận tại cửa hàng, COD) → đơn hiện trong "Đơn hàng của bạn" → hủy trong Admin. Phần này mới kiểm trong DB. Cần chủ shop đồng ý vì tạo đơn thật.
3. **Captcha cho Đặt hàng, Tra cứu đơn, Báo giá** và giới hạn số đơn chuyển khoản đang chờ theo SĐT.
   - Lý do: đơn chuyển khoản giữ hàng 30 phút, nên máy có thể đặt liên tục để khóa tồn kho.
   - Cần khóa bí mật Turnstile trong Vercel (chủ shop tự dán). Phải kiểm mã ở máy chủ qua siteverify.
   - Phân tích và trình chủ shop trước khi làm.
4. **Trang Admin xem danh sách khách hàng:** chưa có. Nếu làm, cần RLS cho `customers` theo `has_perm` và đưa chủ shop duyệt.
5. **Form đăng ký khi captcha báo lỗi:** nút vẫn bấm được nhưng không có mã, Supabase từ chối. Nên báo rõ "Xác minh lỗi, tải lại trang" thay vì để khách bấm.
6. Dọn 2 dòng ảnh trùng của QUATBAN-16-AIRPORT-B4 khi có ảnh thật.

## 5. Việc của chủ shop — ghi lại để khỏi quên

| Việc | Ghi chú |
|---|---|
| **Xóa/thay 24 sản phẩm mẫu** | Thêm 13/11 để thiết kế, hiển thị như hàng thật. Danh sách: `docs/website-v2/SAN_PHAM_MAU_2026-11-13.md`. Phải xử lý TRƯỚC khi mở lại đặt hàng. |
| **Thông báo website với Bộ Công Thương (online.gov.vn)** | **Đặt hàng trực tuyến đang TẠM NGƯNG** từ 13/11 (giao diện + DB). Mở lại sau khi thông báo xong: grant execute `place_order` cho anon/authenticated, đặt `NEXT_PUBLIC_ORDERING_OPEN=1` trên Vercel, phát hành lại. Hỏi chuyên môn về nghĩa vụ và mức phạt. |
| **Facebook: xác minh doanh nghiệp + App Review** | developers.facebook.com → app Tan Truong Tin. Cần giấy đăng ký kinh doanh. Duyệt xong → thêm `NEXT_PUBLIC_FACEBOOK_LOGIN=1` vào Vercel production rồi phát hành. Có thể cần **Data deletion instructions URL** — trang chính sách hiện chưa có hướng dẫn xóa dữ liệu, cần soạn. |
| **Ảnh thật sản phẩm** | Đang dùng ảnh minh họa. Gửi dần, ưu tiên mẫu bán chạy và mẫu thuyết trình. |
| **Hỏi chuyên môn về "không trả hàng, không hoàn tiền"** | Có thể trái Luật Bảo vệ quyền lợi người tiêu dùng; Claude chưa đối chiếu điều luật. |
| **Xử lý 3 khoản SePay "Cần kiểm tra"** | 590.000đ → gắn `TTT001067`; 100.000đ và 75.000đ → Bỏ qua. |
| **Thử 1 lần chuyển khoản thật** | QR → tiền về → đơn tự xác nhận. Chưa kiểm từ đầu đến cuối sau phát hành. Chuyển từ app ngân hàng, không qua ví. |
| **Tài khoản ngân hàng riêng cho shop** | Hiện dùng chung với chuyển khoản cá nhân → thêm dòng "Cần kiểm tra" và lộ nội dung cá nhân trong Admin. |
| **Fanpage Facebook** | Có thì đổi `MESSENGER_URL` trong `components/storefront/FloatActions.tsx` sang `m.me/...`. |
| **Thử trên điện thoại thật** | Đăng nhập Google, các trang khách. |
| Để sau | Tài khoản nhân viên; SEO/robots (chỉ mở khi bán thật); khuyến mãi/tích điểm; logo; thêm ngành hàng (điện nước, kim khí, dụng cụ); SMS OTP (đã bỏ — báo giá ~500–800đ/tin nếu cần lại). |

## 6. Bài học khi làm trên môi trường này

- Máy chủ thử (`preview_start` tên `web`) bị app tự dừng khi khung trình duyệt chuyển trang. Gặp `ERR_CONNECTION_REFUSED` thì khởi động lại.
- Trình duyệt tự động trong app thường không qua được Turnstile; Chrome thật thì qua ngầm. Không được tự giải captcha; nhờ chủ shop tích ô.
- Chrome của chủ shop có tự điền SĐT/mật khẩu: kiểm giá trị ô trước khi gửi form.
- Facebook Developers: ô dạng thẻ (App Domains, Redirect URIs) **phải bấm vào gợi ý** mới thành thẻ; Enter không lưu.
- Supabase providers: chủ shop dễ dán nhầm khóa Google vào ô Facebook. Kiểm định dạng (Facebook ID là dãy số; secret 32 hex), không đọc giá trị secret.
- Đổi cài đặt Auth bằng tự động có thể bị bộ kiểm tra an toàn chặn; khi đó nhờ chủ shop bấm.
