# Dự án và trạng thái tiếp quản

## 1. Mục tiêu và chủ dự án

Xây website bán hàng và trang quản trị cho cửa hàng Tân Trường Tín, ngành điện nước, kim khí, dụng cụ, quạt, gia dụng ở Nha Trang. Không phải sàn nhiều người bán. Website phục vụ khách mua; admin phục vụ chủ shop và nhân viên quản lý sản phẩm, đơn, kho, bán tại quầy và báo cáo.

Chủ shop dùng tiếng Việt, không chuyên lập trình, muốn thao tác được trên desktop và điện thoại (đã yêu cầu xem iPhone 17 Pro Max). Thông tin cửa hàng ghi trong dự án: 379 đường 2/4, phường Bắc Nha Trang, Khánh Hòa; 0948 732 064; giờ 7:45–20:30. Đây là thông tin dự án, không phải lần xác minh địa chỉ mới.

## 2. Môi trường và kiến trúc

Repo: `C:\Users\Hai Trieu\Documents\tan-truong-tin-web`.

| Thành phần | Quan sát |
|---|---|
| Next.js | 16.4.2, App Router, Turbopack; đọc `node_modules/next/dist/docs/` trước khi viết code |
| React / TypeScript | React 19.3.0; TypeScript ^5 |
| CSS / icon | Tailwind 4; lucide-react ^0.468.0; style chính `app/globals.css` |
| Supabase | `@supabase/ssr` ^0.12.7; `@supabase/supabase-js` ^2.118.0; Postgres/Auth/RLS |
| Project DB | `ztbwxfzklznpqbofbwlk`; không chứa khóa truy cập trong hồ sơ này |
| Hosting | Vercel, region sin1 theo `vercel.json`; lịch sử tên miền tantruongtin.com |
| Git | branch `codex/desktop-storefront-upgrade`, HEAD `696105a`; working tree chưa sạch |
| Shell | Windows PowerShell; dùng `-LiteralPath` với đường dẫn chứa `[id]`, `[sku]` |

Production, HTTPS, phiên bản deploy và trạng thái kết nối GitHub–Vercel chưa xác minh lại. Bàn giao cũ có thông tin mâu thuẫn về auto-deploy; không suy ra push là deploy hoặc ngược lại.

Client Supabase:
- `lib/supabase/server.ts`: phiên đăng nhập qua cookie, chịu RLS.
- `lib/supabase/public.ts`: khách ẩn danh đọc catalog.
- `lib/supabase/admin.ts`: server-only, khóa đặc quyền; không dùng để né quyền của nhân viên.
- `lib/supabase/client.ts`: mới thêm cho upload trình duyệt bằng publishable key và phiên hiện tại.
- `proxy.ts`: xử lý phiên; không đổi về `middleware.ts` theo mẫu Next cũ.

Biến môi trường cần thiết: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; `SUPABASE_SECRET_KEY` chỉ server. Script test lịch sử có TEST_* credentials. Đọc cấu hình tại máy khi cần, không in giá trị vào chat/log hoặc sao chép sang ZIP. PyYAML không phải dependency runtime của website.

## 3. Nghiệp vụ phải giữ

- Tiền là số nguyên VND. Giá nhập lưu riêng trong `product_costs`; chỉ `view_cost` được đọc. Công thức đã chốt: giá vốn tính lãi = giá nhập + 10%.
- Không tin giá/tổng tiền từ trình duyệt; nghiệp vụ đơn, tồn, phân quyền phải được bảo vệ phía server/DB.
- Vai trò: `owner`, `order_staff`, `stock_staff`; quyền chi tiết đọc từ DB. 15 quyền liệt kê trong `lib/permissions.ts`; không giả định tên vai trò đồng nghĩa mọi quyền.
- Tồn thực nằm trong `inventory`; cờ `products.in_stock` theo trigger. Thay đổi số lượng cần lịch sử; không tự sửa qty hoặc nạp lại dữ liệu thử.
- Khách có thể đặt không cần tài khoản và tra cứu bằng mã đơn + số điện thoại. COD là luồng chính theo tài liệu; VietQR và Telegram chưa xác nhận tích hợp.
- Hết hàng có thể cho khách liên hệ/đặt trước; không hứa thời gian có hàng khi chưa được shop xác nhận.
- Excel: sản phẩm mới được thêm; SKU đã có đưa thay đổi vào `import_changes` để chủ shop duyệt, ô trống không được tự ghi đè dữ liệu có sẵn.
- Xóa sản phẩm có dữ liệu đơn hàng phải bị chặn; thông báo/confirmation trước khi xóa. Xóa sản phẩm cũ toàn hệ thống là yêu cầu lịch sử đã xử lý, **không phải lệnh cần thực hiện lại**.

## 4. Ngành hàng, Danh mục, Danh mục con, Phân loại

Đây là yêu cầu quan trọng nhất dễ bị hiểu sai:

| Khái niệm | Ví dụ nguồn Excel | Hành vi yêu cầu |
|---|---|---|
| Ngành hàng | Quạt; Ấm siêu tốc | Khối thẻ trang chủ lấy các giá trị từ Excel đã nhập; bấm xem sản phẩm có ngành tương ứng; ngành mới xuất hiện theo dữ liệu |
| Danh mục | Đồ gia dụng | Menu dọc trái hiện duy nhất danh mục này ở giai đoạn hiện tại; bấm tên mở tất cả sản phẩm thuộc danh mục |
| Danh mục con | Quạt; Ấm siêu tốc | Rê chuột/focus vào Đồ gia dụng mở panel dạng thẻ; thẻ con lọc theo danh mục con |
| Phân loại | Quạt treo, Quạt lửng, Quạt sàn… | Không hiển thị tiền tố `Quạt >`; không đồng nhất cột này với ngành hàng |

Trong workbook user gửi, G/H/I/J lần lượt được mô tả là Ngành hàng/Danh mục/Danh mục con/Phân loại. Nhưng **mẫu Excel chuẩn hiện tại trong code có J=Thương hiệu và không có cột Phân loại**. Phải dùng tên header để đối chiếu từng mẫu, không hardcode vị trí cột theo một workbook. Đây là điểm cần Claude rà lại, không phải dữ liệu đã đồng bộ hoàn toàn.

Quyết định ban đầu dùng danh sách ngành hàng cố định đã bị thay thế bằng yêu cầu lấy động từ cột Ngành hàng trong Excel nhập lên. Không quay lại danh sách cố định Quạt/Ấm siêu tốc như nguồn chân lý.

## 5. Bản đồ source và trạng thái

“Có code” nghĩa là nhìn thấy implementation, không đồng nghĩa được test end-to-end hoặc đã chạy production.

| Mảng | File chính | Trạng thái |
|---|---|---|
| Trang chủ, menu, ngành hàng | `app/(store)/page.tsx`, `lib/catalog.ts` | Có code ngành động, hover menu, danh mục gia dụng; còn vấn đề trộn ngành với danh mục con, xem NEXT_STEPS |
| Danh mục/tìm kiếm | `app/(store)/danh-muc/`, `tim-kiem/`, `ProductBrowser.tsx` | Có route/filter theo industry; cần rà semantics theo dữ liệu thật |
| Lưới trang chủ | `ProductBrowser.tsx`, `ProductBrowserShell.tsx`, `ProductCard.tsx` | Có hai khoảng giá độc lập, số trong ngoặc, grid desktop 5 cột, nút xem thêm |
| Yêu thích | `FavoriteButton.tsx` | localStorage `ttt-favorite-products`; chưa gắn tài khoản/đồng bộ nhiều máy |
| Tài khoản khách | `app/(store)/tai-khoan/page.tsx` | Bản xem trước, nút Tiếp tục disabled; chưa gửi OTP/tạo tài khoản |
| Thương hiệu | `BrandCarousel.tsx`, `public/brand-logos`, `docs/brand-logo-sources.md` | Có marquee và logo; chưa đủ hãng, có URL ngoài; user hoãn sửa tiếp |
| Giỏ/đặt/tra cứu/báo giá | `app/(store)/actions.ts`, routes và components storefront | Có luồng nền theo tài liệu; chưa kiểm lại trong lượt bàn giao |
| Admin sản phẩm | `ProductTable.tsx`, `ProductFilters.tsx`, `lib/admin/products.ts` | Có bảng/list mobile, preview, lọc, xóa; số sản phẩm hiện tại chưa truy vấn |
| Thêm/sửa sản phẩm | `ProductForm.tsx`, `san-pham/them/page.tsx`, `san-pham/[id]/page.tsx`, `san-pham/actions.ts` | Code mới chưa kiểm thử đầy đủ |
| Ảnh nhiều tấm/camera | `ProductImageManager.tsx`, `lib/supabase/client.ts` | Có chọn/capture/preview/order/delete/upload; cần bucket/migration và xác minh trên điện thoại |
| Excel | `lib/excel/*`, `app/admin/(shell)/nhap-excel/*` | Có 3 dạng parser, mẫu, lỗi, đối chiếu; user báo đã import quạt thành công |
| Tồn/kiểm kho/POS/đơn | admin `ton-kho`, `kiem-kho`, `ban-tai-quay`, `don-hang`; `lib/admin/*` | Có module và SQL nghiệp vụ; cần regression theo dữ liệu thật |
| Khác admin | `bao-cao`, `khuyen-mai`, `nhan-vien`, `nhat-ky`, `cai-dat`, `doi-mat-khau` | Có source; báo cáo CSV và phiếu A5 có route |
| Ảnh báo giá | `lib/quote-image.ts`, `san-pham/[id]/anh-thong-tin` | Canvas PNG; 1 SP tải 1 ảnh, nhiều SP chọn thư mục trên browser hỗ trợ |
| Duyệt AI | `san-pham/duyet-ai` | Placeholder lịch sử, không coi là tính năng AI hoàn chỉnh |

Các khối user yêu cầu bỏ: Mua theo nhu cầu, Cách mua hàng, cột dịch vụ cạnh banner, thanh địa chỉ/giờ/hotline trên cùng; không dựng lại theo layout v3 cũ.

Thiết kế theo `docs/DESIGN.md`: xanh #0D6B45, vàng #F2B705, Be Vietnam Pro, giao diện rõ ràng; tôn trọng responsive và reduced motion. Tham khảo Điện Máy Xanh là hành vi/thẻ danh mục con, không yêu cầu sao chép thương hiệu.

## 6. Phần code mới nhất: ảnh và thêm sản phẩm

Yêu cầu user đã chốt: nhiều ảnh, thư viện lẫn camera Android/iPhone; SKU tự nhập; đầy đủ trường như màn hình sửa; ảnh đầu làm bìa, được sắp xếp/xóa.

Code hiện có:
- Nút Thêm sản phẩm ở danh sách; form dùng lại `ProductForm` với `product=null`.
- Sản phẩm mới mặc định ẩn, tồn 0 theo trigger. Đây là mặc định implementer chọn, không phải yêu cầu user nói nguyên văn.
- `createProduct` kiểm tra SKU và quyền, insert products, sau đó update inventory và cost; không phải một transaction duy nhất.
- Upload trực tiếp Storage qua browser session; server action đăng ký metadata `product_images`.
- 10 ảnh thật/sản phẩm; original tối đa 25 MB, file upload tối đa 6 MB; HEIC/ảnh lớn thử chuyển bằng browser bitmap/canvas 2048px. Đây là giới hạn do implementer chọn.
- Ảnh thật thay metadata ảnh minh họa khi upload thành công. Xóa/reorder ảnh đã lưu có hiệu lực ngay, không chờ nút Lưu; ảnh mới được tải khi lưu form.
- Migration `20261028000100_product_image_storage.sql`: bucket `product-images`, public read, staff có `edit_products` được list/upload/delete.
- CSP cho phép ảnh từ Supabase; Permissions-Policy camera self. Không đồng nghĩa camera đảm bảo chạy mọi browser/model.
- Storage migration **chưa được áp dụng trong phiên triển khai**. Không có bằng chứng user đã áp sau đó.

Hai agent khảo sát luồng/Storage chỉ đọc, một reviewer đọc code. Đã sửa cạnh tranh chỉnh ảnh khi upload, object URL tạm, và cảnh báo khi xóa Storage thất bại. Chỉ có `git diff --check` cho đợt mới; không typecheck/build/runtime test. Đọc NEXT_STEPS trước khi gọi tính năng hoàn tất.

## 7. Dữ liệu và tài liệu tham chiếu

Workbook nguồn user: `C:\Users\Hai Trieu\Downloads\Kho-App-Quạt.xlsx`, `Kho-App-Ấm siêu tốc.xlsx`. Bản bỏ tiền tố đã tạo trong repo: `Kho-App-Quạt-da-bo-tien-to-phan-loai.xlsx`. Chỉ ghi đường dẫn, không đưa workbook/giá nhập vào gói này.

Lịch sử task board ghi đã xóa 98 sản phẩm ngày 27-10 theo lệnh user và kiểm tra dữ liệu liên quan. Sau đó user nói đã sửa mã trùng, nhập file quạt thành công. Do đó mọi số 0/90/98/100/114 trong tài liệu là mốc lịch sử, không phải số lượng hiện tại. File Ấm đã nhận; chưa có xác nhận import thành công rõ như file Quạt.

Đọc thêm tại repo: `docs/PRD.md`, `DESIGN.md`, `DEV_PLAN.md`, `MENTOR_LOG.md`, `AI_TASK_BOARD.md`, `GIAO_DIEN_BAN_GIAO.md`, `CHU_SHOP_CAN_CHUAN_BI.md`. `PROJECT_DOSSIER.md` và tài liệu superpowers 26-10 phản ánh giai đoạn cũ; so với lịch sử chat mới trước khi áp dụng.

Hồ sơ hội đồng AI: `reports/Công cụ hội đồng AI.md` và `research_notes/Công cụ hội đồng AI/`. Đây là nghiên cứu/đề xuất, không phải hệ thống điều phối đã xây. Quyết định mới: Claude Code nhận phần code hệ thống; không mặc nhiên tiếp tục phân công cũ Claude chỉ plan/Antigravity sửa code.
