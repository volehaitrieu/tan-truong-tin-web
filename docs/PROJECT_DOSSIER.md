# Hồ sơ tổng hợp dự án Tân Trường Tín

**Ngày tổng hợp:** 26-10-2026  
**Trạng thái:** hồ sơ bàn giao; một số dữ kiện vận hành và production cần chủ dự án xác minh lại.  
**Phạm vi:** sản phẩm, vận hành, thiết kế, kiến trúc, bảo mật, tiến độ, việc còn mở và đề xuất công cụ điều phối AI. Không chứa mật khẩu, API key, token, file môi trường hoặc dữ liệu khách hàng.

## 1. Tóm tắt điều hành

Tân Trường Tín là cửa hàng điện nước, kim khí, dụng cụ, quạt và gia dụng tại Bắc Nha Trang, Khánh Hòa. Hệ thống gồm storefront bán hàng và khu quản trị kho/đơn hàng, dùng Next.js và Supabase. PRD và thiết kế cửa hàng đã được duyệt; báo cáo ngày 24-10 ghi nhận TypeScript/build đạt. Nhật ký ghi site đã được triển khai trên Vercel ngày 23-10, trong khi một báo cáo hoàn thành cùng ngày còn ghi “bản chạy thử trên máy”. Vì tài liệu khác nhau về thời điểm/trạng thái, cần kiểm tra trạng thái URL, HTTPS, môi trường và dữ liệu production trước khi coi đây là trạng thái hiện tại.

Chủ shop đã chốt bố cục trang chủ v3 và cho phép bắt đầu nâng cấp trang chủ/khu khám phá sản phẩm trên desktop; mobile chỉ làm sau khi chủ shop duyệt desktop. Hướng thị giác tuân thủ `docs/DESIGN.md`, dùng Hallmark và Taste, hiệu ứng nhẹ. Phạm vi được phép bắt đầu nhưng chi tiết hình ảnh của bản render vẫn cần chủ shop xem/duyệt trước khi làm mobile hoặc phát hành. Thứ tự tiếp theo nằm trong `docs/HUONG_DAN_BAT_DAU_VA_CAC_QUYET_DINH.md` và task `AI-001` trong `docs/AI_TASK_BOARD.md`.

## 2. Cửa hàng và mục tiêu

- **Loại hình:** điện nước, kim khí, dụng cụ, quạt, gia dụng; cửa hàng thật ở Bắc Nha Trang.
- **Liên hệ theo tài liệu dự án:** 379 Đường 2/4, số 0948 732 064. Tài liệu chủ shop cần chuẩn bị yêu cầu kiểm tra lại địa chỉ, số điện thoại, giờ mở cửa, Zalo/Facebook/Maps; xem đây là dữ liệu đã ghi nhận, chưa xác minh hiện hành.
- **Mục tiêu:** bán online, nhận đơn đầu tiên, đưa mã hàng đủ điều kiện lên web, và để nhân viên xử lý đơn/kho không cần mở Supabase hoặc Excel.
- **Nguồn chân lý nghiệp vụ:** `docs/PRD.md` (v1.0, đã duyệt 21-10-2026).
- **Quy mô danh mục trong tài liệu:** khoảng 3.575 mã hàng. Import kiểm tra ghi 1.374 dòng xếp được danh mục, 2.189 dòng chưa rõ danh mục, 12 lỗi; một tệp quạt có 93 dòng thiếu SKU. Đây là kết quả cũ, không đại diện số liệu hiện thời.
- **Dữ liệu seed được báo cáo:** 90 sản phẩm ban đầu, tồn kho bằng 0. Phải xác minh DB trước khi nhập/bật bán dữ liệu thực.

## 3. Người dùng và quy tắc nghiệp vụ đã chốt

- **Khách:** xem/tìm/lọc sản phẩm, giỏ hàng lưu trình duyệt, đặt không cần tài khoản, tra cứu đơn bằng mã đơn và số điện thoại; không xem giá nhập, số tồn chính xác hoặc đơn người khác.
- **Chủ shop:** toàn quyền.
- **Nhân viên kho:** theo PRD chỉ xem dữ liệu, chưa được sửa tồn, giá hay sản phẩm.
- **Nhân viên đơn:** xử lý đơn và xác nhận thanh toán theo quyền; không hủy đơn, không giảm giá, không xem giá nhập.
- Giá tiền lưu số nguyên VND; tổng đơn và phí cần tính/phê chuẩn phía server; tồn trừ khi đơn được xác nhận và hoàn lại khi hủy theo luồng đã mô tả.
- Hết hàng hiển thị “Liên hệ” nhưng khách vẫn có thể gửi yêu cầu đặt; nhân viên xác nhận thời gian có hàng.
- COD là phương thức chính; VietQR được mô tả trong PRD nhưng trạng thái tích hợp production phải xác minh.
- Phí giao tỉnh, chính sách đổi trả/bảo hành, ảnh thật, chương trình khuyến mãi và một số dữ liệu vận hành vẫn là đầu việc chủ shop cần cung cấp/chốt.

## 4. Thiết kế đã duyệt và định hướng đang chờ

`docs/DESIGN.md` v1.0 là chuẩn hiện hành: sáng, tin cậy, gần gũi; màu thương hiệu xanh `#0D6B45`, nhấn vàng `#F2B705`, chữ Be Vietnam Pro; nền phân tầng, không dùng gradient lớn, glow hay hiệu ứng nặng. Trang chủ v3 theo chuỗi: thông tin cửa hàng → header → menu/banner/dịch vụ → danh mục → nhóm nhu cầu → hàng sản phẩm/khuyến mãi → toàn bộ sản phẩm và bộ lọc → thương hiệu → cách mua → cửa hàng → footer.

Điểm duyệt ở các cuộc trao đổi gần đây: bố cục v3 đã chốt; bắt đầu desktop; làm trang chủ và khu khám phá sản phẩm trước; dừng để chủ shop duyệt desktop trước khi làm mobile. Lazy loading ảnh được chấp thuận. Ảnh đầu trang/LCP không nên lazy-load; ảnh ngoài vùng nhìn có thể lazy-load. Hiệu ứng nên nhẹ (CSS transform/opacity, ít blur, tôn trọng `prefers-reduced-motion`) và không trái quy tắc thương hiệu đã duyệt nếu chưa được chủ shop duyệt thay đổi guideline.

Tham khảo được yêu cầu: mô hình danh mục Điện Máy Xanh và cách hiển thị mặt hàng Nguyễn Kim, dựa trên ảnh người dùng gửi. Đây là tham khảo cấu trúc/hành vi, không sao chép nhận diện, nội dung, hình ảnh hay mã của các nhà bán lẻ.

## 5. Kiến trúc và triển khai đã ghi nhận

- Next.js 16.4.2 App Router, React 19, Tailwind CSS 4.
- Supabase: PostgreSQL/Auth/Storage; dự án ghi trong tài liệu có ID `ztbwxfzklznpqbofbwlk`, region Singapore (`ap-southeast-1`), PostgreSQL 17.11. Không đưa credentials vào hồ sơ.
- Lưu mã trên GitHub; lịch sử dự án ghi triển khai Vercel ở region `sin1` và URL `https://tan-truong-tin-web.vercel.app`.
- Nhật ký ghi tên miền `tantruongtin.com` đã xác minh trên Vercel nhưng HTTPS từng chờ chứng chỉ; cần kiểm tra lại trạng thái chứng chỉ và DNS.
- Các script package gồm dev/build/start/lint. Có script rà bảo mật `scripts/kiem-thu-bao-mat.mjs` và kiểm tra tấn công thử `scripts/tan-cong-thu.mjs`.
- Migration mới nhất trong danh sách hiện có: `supabase/migrations/20261023001000_inventory_location.sql`; trạng thái đã áp dụng ở production chưa được xác minh trong lần tổng hợp này.
- Báo cáo lịch sử ghi 47/47 kiểm tra phân quyền/RLS và 35/35 kiểm tra bảo mật sau vá. Đây là kết quả ở thời điểm ghi, không phải xác nhận hiện trạng.
- `.env.local` tồn tại trong workspace và đã được loại trừ hoàn toàn khỏi bản bàn giao. Không sao chép mật khẩu/API key từ chat, log hoặc file cấu hình vào bất cứ gói chia sẻ nào. Nên luân chuyển mật khẩu từng được dán trong cuộc hội thoại.

## 6. Lịch sử và trạng thái công việc

- 20–21-10: hoàn thiện PRD và guideline thiết kế v1 được duyệt.
- 23-10: kết nối các trang quản trị tới dữ liệu thật; xử lý import Excel, sản phẩm, tồn kho, đơn hàng, kiểm tra phân quyền/bảo mật; triển khai Vercel theo nhật ký.
- 24-10: chỉnh giao diện mobile quản trị, commit/push theo nhật ký; TypeScript/build đạt sau đợt dọn dự án.
- 25-10 trở đi: yêu cầu khảo sát và nâng cấp storefront, lấy tham khảo danh mục Điện Máy Xanh và sản phẩm Nguyễn Kim; desktop trước, mobile sau khi được duyệt.
- Trạng thái git đầu phiên tổng hợp trước đây được ghi là branch `main`, HEAD trùng `origin/main` ở `696105a`, cùng stash `before storefront redesign 2026-10-25`. Trạng thái này chưa được xem lại ngay lúc tạo hồ sơ, nên kiểm tra Git trước khi tiếp tục.
- Phạm vi desktop đã được chủ shop cho phép bắt đầu; chưa có bản code/render desktop được chủ shop duyệt. Bản định hướng nằm trong `docs/superpowers/specs/2026-10-26-desktop-storefront-design.md`.
- Task đầu tiên đã tạo ở `docs/AI_TASK_BOARD.md`: Claude Code chỉ khảo sát và lập plan, chưa sửa code; chờ chủ shop duyệt plan trước khi giao Antigravity thực hiện.

## 7. Các việc còn cần chủ shop xác minh/chốt

Tham chiếu danh sách chi tiết tại `docs/CHU_SHOP_CAN_CHUAN_BI.md`. Tóm tắt:

1. Trạng thái production hiện tại: Vercel URL, tên miền, chứng chỉ HTTPS, biến môi trường, robots/noindex và luồng đơn test.
2. Trạng thái migrations và dữ liệu Supabase: migration nào đã áp dụng, dữ liệu thật/seed, bản sao lưu.
3. Phí giao nội thành/đi tỉnh, chính sách trả hàng/bảo hành, giờ mở cửa và kênh hỗ trợ.
4. Danh sách sản phẩm, danh mục, tồn kho, ảnh thật, SKU thiếu và cách phân loại 2.189 mã chưa rõ trong báo cáo import cũ.
5. Trạng thái VietQR, Telegram, tài khoản nhân viên và quyền được bật.
6. Quyết định duyệt bản desktop storefront hiện tại trước khi chuyển sang mobile.

## 8. Đề xuất hội đồng AI — chưa xây

Mục tiêu mong muốn: giao diện quản lý ba công cụ/đại lý — ChatGPT/OpenAI cho rà soát bảo mật phòng thủ, Antigravity cho thiết kế và chỉnh sửa UI nhẹ, Claude Code làm điều phối/kế hoạch và code chuyên sâu. Báo cáo tư vấn chi tiết nằm ở `reports/Công cụ hội đồng AI.md` và ghi chú nghiên cứu ở `research_notes/Công cụ hội đồng AI/`.

Hướng an toàn được đề xuất: local-first MVP; một task board và sổ sự kiện; tích hợp qua API/CLI/SDK chính thức; tác nhân làm trên branch/worktree tách biệt; quyền mặc định đọc; security scan trên repo/staging được ủy quyền; người dùng duyệt plan, quyền ghi, diff, merge và deploy. Không cấp cho “hacker agent” quyền xâm nhập mục tiêu tùy ý, tự ghi DB production, tự vá production hay tự triển khai.

Gói skills đi kèm là bản tham khảo riêng, không phải phần mềm điều phối và không đồng nghĩa các AI có thể tự gọi lẫn nhau. Cần chốt chi phí, lưu trữ dữ liệu, phạm vi bảo mật và quyền từng agent trước khi lập kế hoạch xây.

## 9. Mục lục tài liệu dự án

| Tài liệu | Vai trò |
|---|---|
| `docs/PRD.md` | Nhu cầu, người dùng, luồng nghiệp vụ và ưu tiên tính năng đã duyệt |
| `docs/DESIGN.md` | Quy chuẩn thương hiệu và thiết kế storefront/admin |
| `docs/DEV_PLAN.md` | Kế hoạch phát triển theo chặng |
| `docs/GIAO_DIEN_BAN_GIAO.md` | Bàn giao các màn giao diện và hành vi |
| `docs/BAO_CAO_HOAN_THANH.md` | Báo cáo triển khai/kiểm tra tại thời điểm viết; có điểm cần đối chiếu với log |
| `docs/CHU_SHOP_CAN_CHUAN_BI.md` | Các thông tin và thao tác còn cần chủ shop |
| `docs/MENTOR_LOG.md` | Nhật ký tiến độ lịch sử |
| `docs/AI_TASK_BOARD.md` | Task hiện tại, trạng thái và chuyển giao giữa các AI |
| `docs/HUONG_DAN_BAT_DAU_VA_CAC_QUYET_DINH.md` | Các quyết định giao diện đã chốt và cách tiếp tục theo từng bước |
| `docs/superpowers/specs/2026-10-26-desktop-storefront-design.md` | Phạm vi redesign desktop được cho phép bắt đầu |
| `reports/Công cụ hội đồng AI.md` | Tư vấn kiến trúc, chi phí, rủi ro cho công cụ AI mong muốn |
| `research_notes/Công cụ hội đồng AI/` | Ghi chú nguồn và nghiên cứu chi tiết |
| `exports/ttt-ai-skills-pack.zip` | Bản nén skills có manifest và hướng dẫn |

## 10. Cách dùng hồ sơ này

Đây là ảnh chụp tri thức dự án tại ngày ghi trên đầu tài liệu, không thay thế việc đọc PRD/thiết kế và xác minh trạng thái hệ thống. Khi có thay đổi, cập nhật `docs/MENTOR_LOG.md`, kiểm tra lại các trạng thái production/database và tạo bản hồ sơ mới hoặc cập nhật mục tương ứng. Trước khi chia sẻ, không đính kèm `.env.local`, database dump, dữ liệu khách hàng, token hay mật khẩu.
