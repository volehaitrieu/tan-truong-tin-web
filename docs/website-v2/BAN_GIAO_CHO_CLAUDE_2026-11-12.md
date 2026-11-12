# Bàn giao cho Claude — Tân Trường Tín, 12/11/2026

Tài liệu này tổng hợp phần việc Codex và chủ shop đã làm từ 08 đến 12/11/2026. **Ưu tiên tài liệu này khi các ghi chú cũ mâu thuẫn về trạng thái hiện hành.** Đây là ghi nhận từ mã cục bộ và nhật ký; lượt bàn giao này không ghi Supabase, không deploy, không commit hoặc push.

## Bắt đầu ở đúng nơi

- Worktree bắt buộc: `C:\Users\Hai Trieu\Documents\tan-truong-tin-web\.claude\worktrees\website-v2`.
- Nhánh: `worktree-website-v2`; không làm trong thư mục dự án gốc/nhánh `main` khi tiếp tục phần giao diện.
- Đọc tiếp: `AGENTS.md`, `CLAUDE.md`, `docs/BAN_GIAO_TIEP_TUC.md`, tài liệu này, cuối `docs/MENTOR_LOG.md`, rồi `node_modules/next/dist/docs/` trước khi sửa Next.js 16.
- Chạy `git status` và xem diff trước khi sửa. Công việc giao diện đang có nhiều tệp chưa commit; không reset, clean, stash hoặc ghi đè.
- Supabase `ztbwxfzklznpqbofbwlk` là DB thật, kể cả khi chạy localhost. Không xem/in `.env.local` hoặc token. Không ghi DB, chạy migration, commit/push, deploy/promote khi chưa có sự đồng ý rõ ràng của chủ shop cho bước đó. Migration phải đưa nội dung cho chủ shop xem trước. Giữ RLS và cách tính tiền/tồn phía máy chủ.
- Không chạy `node --test scripts/*.mjs` vì có script chạm khóa/dữ liệu thật. Bộ kiểm thử an toàn đã dùng là `node --test scripts/check-import-classifications.mjs scripts/check-import-stock.mjs scripts/check-notify-messages.mjs scripts/check-vietqr.mjs scripts/check-compare.mjs` (lần cuối 31/31).

## Trạng thái nhanh, phân biệt rõ môi trường

| Nơi | Trạng thái cuối đã có bằng chứng | Giới hạn của lượt bàn giao này |
| --- | --- | --- |
| `tantruongtin.com` | Ngày 10/11 đã promote bản chuyển khoản trả trước `dpl_1B1BztcnGEVSGAM3D3L1jLPqdsqi`, READY; đã kiểm HTTP, log và giao diện thanh toán 375px. | Không kiểm lại tên miền ngày 12/11. Chưa đưa phong cách mới 11/11 hoặc accordion phẳng 12/11 lên website chính. |
| GitHub | Các ref cục bộ `main`, `origin/main`, `origin/worktree-website-v2` cùng ở `c8d1c8e` (`Ghi nhận phát hành và đồng bộ GitHub`). | Lượt này `gh repo view` không kết nối được GitHub API; không xác minh lại remote hoặc chế độ public bằng mạng. Các sửa giao diện sau commit này vẫn cục bộ. |
| Supabase thật | Migration chuyển khoản trả trước `20261110083306_prepaid_bank_reservations_20261110` đã áp dụng; lần đối chiếu 10/11 cho thấy 114/114 sản phẩm tồn 5. | Không truy vấn lại DB ngày 12/11. Chưa thử chuyển khoản ngân hàng thật sau phát hành. |
| Bản xem thử giao diện | `https://tan-truong-tin-guj9h3ogr-trieuvolehai-2530.vercel.app`, deployment `dpl_AftCfn5YWt57UoKucVftEubqsQwC`, READY ngày 11/11, có bảo vệ Vercel. Đã xem trang chủ và chi tiết sản phẩm ở 375px. | Đây là bản trước thay đổi accordion phẳng ngày 12/11. Chưa promote sang tên miền chính, chưa commit/push. |
| Mã cục bộ hiện tại | Bảng màu trắng/xanh đậm/xanh teal và các thay đổi trang khách đang dở; `ProductInfoAccordion.tsx` đã đổi sang danh sách phẳng theo mẫu chủ shop duyệt. | Cần kiểm trực quan mã **mới nhất** ở 375px rồi mới phát hành. |

## Quyết định của chủ shop còn hiệu lực

- Website hiện phục vụ **buổi thuyết trình phi thương mại cho ban giám khảo**, chưa vận hành bán hàng thương mại. Website công khai cho người xem; khu `/admin` vẫn yêu cầu đăng nhập. `robots.txt` chặn lập chỉ mục (`Disallow: /`) có chủ ý, không chặn người truy cập. Không tự thay SEO/robots.
- Ưu tiên điện thoại 375px, khách vào thấy ngay ngành hàng và sản phẩm, tìm, so sánh, mua dễ. Không cần kể chuyện từng sản phẩm. Giao diện trang khách đang thử hướng sạch và tin cậy với nền trắng, xanh đậm, xanh teal; trang quản trị không đổi màu theo đợt này.
- Lấy tại cửa hàng: 0đ. Giao tận nơi: 15.000đ khi tiền hàng dưới 500.000đ; từ 500.000đ miễn phí. Phương thức thanh toán: COD hoặc chuyển khoản ngân hàng.
- Với **chuyển khoản**, tạo đơn/mã ở trạng thái chờ tiền, hiện QR; chỉ báo đặt hàng thành công khi máy chủ/SePay xác nhận đúng tài khoản, mã và đủ tổng tiền. COD vẫn trả khi nhận. Giữ hàng 30 phút; tiền đến sau đó nhưng trong 24 giờ được tự chấp nhận nếu còn đủ hàng, trường hợp khác để shop kiểm tra. Không coi QR có sẵn là đã thanh toán.
- Ba mục ở chi tiết sản phẩm: **Thông số**, **Mô tả & Bảo hành**, **Hướng dẫn sử dụng**. Chủ shop chốt mở ra **toàn bộ** nội dung, thiếu thông tin ghi “Đang cập nhật”; chỉ một mục mở tại một thời điểm, Thông số mở sẵn. Quyết định mới nhất 12/11: **không khung, không ô, không nền riêng, không góc bo; chỉ có đường ngang phân cách các mục**. Mũi tên đặt bên phải; giữ mở/đóng có hiệu ứng, bàn phím và trợ năng.
- Khuyến mãi, mã giảm giá, tích điểm đang **tạm hoãn**; không tự tiếp tục kế hoạch Đợt 3/5 cũ. Tài khoản khách chưa có nghiệp vụ thật. Danh sách tính năng khảo sát được lưu để bàn sau, chưa được duyệt triển khai.

## Đã làm trong thời gian Codex thay Claude

### 08–09/11: giao diện và nghiệp vụ đang chạy

- Hoàn thành QR VietQR/chính sách nháp, so sánh tối đa ba sản phẩm, thanh so sánh và các sửa lỗi mobile. Có 26 kiểm thử an toàn ban đầu; sau đó bộ kiểm thử mở rộng lên 31. Chính sách còn nội dung chủ shop cần điền, ảnh nhiều sản phẩm vẫn là minh họa.
- Sửa liên thông giỏ → giao nhận → tổng tiền → thanh toán; áp ngưỡng phí giao cả giao diện lẫn `place_order` trên DB, QR lấy đúng tổng gồm phí giao. QR điền sẵn số tiền/nội dung nhưng ứng dụng ngân hàng vẫn có thể cho sửa; webhook chỉ tự nhận nếu dữ liệu tiền vào khớp.
- Tích hợp SePay với HMAC, thời gian gửi, tài khoản, mã đơn và tổng tiền; giao dịch lệch vào diện cần kiểm tra. Trên SePay đã thêm mẫu nhận diện `TTT` + đúng 6 chữ số, giữ mẫu `DH` cũ. Chủ shop quét QR và xác nhận **màn hình ngân hàng** hiện mã `TTT…`; chưa chứng minh ngân hàng chuyển nguyên nội dung tới SePay trong một giao dịch mới.
- Đơn `TTT001067` trị giá 590.000đ đã được chủ shop xác nhận là tiền đúng và ghi `paid` qua quản trị. Bản ghi SePay ban đầu ở `review`, thiếu mã trong nội dung, không được gắn tự động; trạng thái bản ghi này sau 10/11 chưa kiểm lại. Đơn `TTT001066` trước đó tự khớp thành công.
- Thêm nút Quay lại các trang khách, tinh gọn chi tiết sản phẩm/thanh mua, bỏ khối so sánh trực tiếp và báo giá số lượng lớn ở trang chi tiết; các mục chi tiết có hiệu ứng mở/đóng. Thêm xóa nhiều sản phẩm và xóa từng đơn `cancelled` + `unpaid` cho chủ shop với kiểm quyền/điều kiện ở DB. Xem chi tiết và migration trong `docs/MENTOR_LOG.md`.
- Đã từng đưa toàn bộ worktree khi đó lên `tantruongtin.com` để thuyết trình, và fast-forward `main` trên GitHub. Những bản phát hành này đã được thay bởi bản chuyển khoản trả trước ngày 10/11.
- Khảo sát 10 trang bán lẻ Việt Nam và lưu danh sách ưu tiên tại `docs/website-v2/TINH_NANG_THAM_KHAO_2026-11-09.md`; báo cáo ở `reports/Tính năng bán lẻ Việt Nam.md`. **Đây là ghi chú nghiên cứu, chưa phải yêu cầu triển khai.**

### 10/11: tồn kho và chuyển khoản trả trước

- Chủ shop xác nhận tồn thực tế 5 cho toàn bộ sản phẩm; đã chỉnh 16 sản phẩm lệch bằng trang quản trị. Lần kiểm 10/11: 114/114 bằng 5.
- Đã duyệt và áp migration `supabase/migrations/20261110083306_prepaid_bank_reservations_20261110.sql`; thêm trang `/cho-thanh-toan`, trạng thái chờ tiền/cần shop xử lý, giữ hàng và đối soát thủ công có quyền. Thiết kế và giới hạn tại `docs/website-v2/THANH_TOAN_TRUOC_2026-11-10.md`.
- Đã kiểm DB bằng giao dịch mô phỏng **hoàn tác**: giữ hàng, COD, sai/đúng tiền, webhook lặp, tiền đến muộn, tranh tồn. Sau kiểm không còn đơn/giao dịch mô phỏng/hàng giữ. Bản sản xuất được phát hành 10/11; màn 375px với hàng 305.000đ và phí 15.000đ cho tổng 320.000đ, chọn chuyển khoản hiện nút tạo mã. **Chưa có khoản chuyển thật sau phát hành được kiểm từ đầu đến cuối.**
- Commit `44b02dc` và sau đó `c8d1c8e` đã đồng bộ mã phát hành lên `main` và `worktree-website-v2`; Vercel không tự deploy từ GitHub trong cấu hình được ghi nhận.

### 11–12/11: giao diện mới và bản mẫu

- Ngày 11/11 sửa **cục bộ** trang khách: bảng màu trắng/xanh đậm/xanh teal, banner, ngành hàng, thẻ sản phẩm, nút mua và giao diện tài khoản khách. Đổi ba mục chi tiết sang nhóm mở/đóng có toàn bộ nội dung; thiếu thì hiện “Đang cập nhật”. Không thay dữ liệu, thanh toán hoặc quản trị. Tạo bản xem thử Vercel nêu trên; 375px đã xem trang chủ/chi tiết, lưu ảnh `docs/website-v2/preview-product-mobile-2026-11-11.png`.
- Dựng bản mẫu HTML tương tác riêng tại `docs/website-v2/prototypes/ban-mau-2026-11-10/index.html`, có trang chủ/danh mục/chi tiết/so sánh/giỏ/thanh toán **giả lập**. Ảnh/thông tin tham khảo từ Senko, Sunhouse, INAX, TP-Link; INAX và TP-Link **chưa xác nhận shop bán**. Ảnh bên ngoài chỉ để duyệt nội bộ, không đưa mặc nhiên lên website/GitHub công khai. Bản mẫu không tạo đơn hoặc thanh toán.
- Chủ shop sau đó chỉnh lại yêu cầu accordion: ban đầu Codex làm nhầm thành ba ô có góc bo; **đã bỏ bản đó**. Ảnh cuối cùng `docs/website-v2/prototypes/ban-mau-2026-11-10/xem-truoc-thong-tin-san-pham.png` là danh sách phẳng hai đường ngang, không ô/khung/nền riêng. Chủ shop đã nói **“duyệt”**.
- Ngày 12/11 đã áp mẫu này vào mã cục bộ `components/storefront/ProductInfoAccordion.tsx`: bỏ `bg-surface`, border bao, bo góc; giữ `divide-y`, đặt chevron bên phải, canh nội dung theo lề. `npx tsc --noEmit`, ESLint tệp và `git diff --check` đạt. **Chưa xem trực quan mã mới trong trình duyệt, chưa cập nhật bản Vercel thử hoặc website chính.**

## Cây mã đang dở: đừng làm mất

- HEAD cục bộ `c8d1c8e`; lúc lập tài liệu có khoảng 30 mục thay đổi/chưa theo dõi. `git diff --stat` chỉ hiện các tệp đã theo dõi, **không hiện tệp mới**.
- Nhóm sửa giao diện cần giữ: `app/(store)/page.tsx`, `app/(store)/san-pham/[sku]/page.tsx`, `app/globals.css`, `components/storefront/{ShopBanner,StoreShell,ProductCard,ProductInfoAccordion,...}.tsx`, `components/brand/Logo.tsx`, `lib/catalog.ts`, `.vercelignore`. `ProductInfoAccordion.tsx` hiện **untracked nhưng được trang sản phẩm import**; khi đóng gói phải tính cả tệp này.
- Các mục khác chưa theo dõi/không nên gom bừa vào phát hành: `.superpowers/`, `app/(store)/kiem-tra-phi-ship/` (route thử; bản deploy trước loại ra), `supabase/.temp/cli-latest`, ảnh/bản mẫu/nghiên cứu và báo cáo. Rà từng tệp trước mọi commit/deploy; không xóa các mục này thay chủ shop.
- `docs/MENTOR_LOG.md` và `docs/website-v2/BAN_GIAO_2026-11-08.md` đã có thay đổi cục bộ. Những dòng cũ nói “chưa deploy/chưa commit” là **lịch sử tại thời điểm ghi**; dùng bảng trạng thái đầu tài liệu này để phân biệt.

## Việc Claude nên làm tiếp

1. Xem lại `git status`/diff và xác nhận bản sửa accordion phẳng cùng toàn bộ thay đổi giao diện vẫn nguyên vẹn; không tự ghép nhầm bản mẫu tĩnh với mã sản xuất.
2. Kiểm **mã mới nhất** ở điện thoại 375px (thêm 360/390px nếu thuận tiện): ba mục không có khung, nội dung dài, mở/đóng, mũi tên, bàn phím, không tràn ngang; kiểm các trang chủ/danh mục/giỏ/thanh toán vì chúng cũng có WIP giao diện. Bản xem thử 11/11 không chứa sửa accordion 12/11.
3. Hỏi chủ shop chọn bước phát hành **bản xem thử** hay **tên miền chính**. Codex đã hỏi câu này và chưa nhận trả lời trước khi bàn giao. Theo quy tắc dự án, phải có chấp thuận rõ cho deploy/promote/commit/push; đừng coi việc “duyệt” thiết kế là đồng nghĩa đã duyệt phát hành production.
4. Nếu chủ shop muốn phát hành, kiểm lại gói `.vercelignore`, build/kiểm HTTP, xác minh đúng dự án Vercel và tránh đưa bản mẫu ảnh bên ngoài, tài liệu nội bộ, route thử, `.env.local` lên web. Tách rõ việc cập nhật GitHub và việc promote tên miền: Vercel không tự nối GitHub theo nhật ký.
5. Với thanh toán, chỉ thử giao dịch ngân hàng thật khi chủ shop chủ động phối hợp. Kiểm kết quả SePay/webhook và luồng QR → tiền về → trạng thái thành công; đừng đánh dấu đã trả tiền chỉ dựa vào màn QR. Đối chiếu bản ghi `TTT001067` còn `review` trước khi sửa.
6. Các việc vẫn treo để chủ shop quyết: ảnh sản phẩm thật và dữ liệu thiếu, chính sách, tài khoản nhân viên, SEO, tính năng khuyến mãi/tích điểm, tính năng khảo sát. Không tự bật thương mại hoặc đổi robots.

## Bằng chứng kiểm thử và giới hạn

- Đợt chuyển khoản trả trước: 31 kiểm thử an toàn, TypeScript/ESLint, build Webpack và thử DB hoàn tác đã đạt theo `docs/MENTOR_LOG.md`; checkout production 375px đã xem. Chưa thử tiền thật sau phát hành.
- Giao diện mới 11/11: TypeScript/ESLint/31 kiểm thử và diff-check đạt; bản Vercel thử có HTTP 200 ở các trang chính, nhưng chưa thử đặt hàng thật. Ảnh 375px có sẵn.
- Accordion phẳng 12/11: TypeScript, ESLint tệp và diff-check đạt; **chưa có ảnh chụp từ ứng dụng thật sau sửa**. Ảnh PNG là bản mẫu thiết kế, không phải screenshot sản xuất.
- Lượt viết bàn giao 12/11 chỉ kiểm tệp Git cục bộ. GitHub API không kết nối được; không tái kiểm Vercel, Supabase hoặc giao dịch tiền.
