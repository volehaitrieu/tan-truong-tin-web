# Việc tiếp theo cho Claude Code

Mục tiêu đầu: tiếp quản working tree an toàn, hoàn thiện/kiểm chứng tính năng thêm sản phẩm và ảnh đã được user cho phép. Không xây lại ứng dụng, không sửa tiếp thương hiệu đang hoãn.

## 1. Thứ tự tiếp nhận

1. Đọc HANDOFF/PROJECT/CHAT_HISTORY, AGENTS và docs Next đang cài. `git status --short`, đọc diff hiện tại và các file untracked; lưu mốc/snapshot phù hợp trước khi sửa. Không reset, clean, force checkout, áp stash hoặc commit tất cả một cách mù quáng.
2. Kiểm tra phiên bản tools và dev server đang chạy. Chạy typecheck/lint/build thích hợp sau khi đọc scripts; kết quả cũ không tính cho code mới. Báo lỗi chính xác, sửa trong phạm vi tính năng.
3. Đọc `ProductForm`, `ProductImageManager`, product actions, client/server Supabase, migration Storage, policies và quyền hiện hành. Các vấn đề bên dưới là điểm bắt đầu review.
4. Xác minh bằng truy vấn chỉ đọc migration/bucket/policies thực trên đúng Supabase project. Storage migration mới chưa được apply bởi phiên này. Chuẩn bị migration đã review; không áp lại toàn bộ migrations/seed. Xác định rõ DB thật trước mọi phép ghi.
5. Hoàn thiện luồng UI + server/RLS đồng bộ, rồi kiểm tra với dữ liệu/test fixture cô lập. Không dùng bài test cũ tùy tiện trên DB đã nhập hàng thật.
6. Kiểm tra desktop, Safari iPhone và Chrome Android thực nếu có: tạo SKU mới, SKU trùng, gallery nhiều ảnh, camera, HEIC, file lớn/sai định dạng, cover/reorder/delete, reload, mất mạng và retry, các quyền khác nhau. Browser giả lập kích thước không chứng minh camera thiết bị thật.
7. Ghi kết quả, vấn đề còn lại và diff; user xem giao diện. Deploy/đổi dữ liệu hàng loạt là bước riêng có phạm vi rõ.

## 2. Bằng chứng code mới cần xử lý trước khi gọi hoàn tất

### A. Hồi quy quyền sửa sản phẩm — quan sát trực tiếp trong code

`components/admin/ProductForm.tsx` hiện chặn `submit` khi `!canPrice` và disable nút lưu khi `!canPrice`, áp cho cả product đã tồn tại. Trước thay đổi, người có `edit_products` nhưng không `edit_price` có thể gửi thay đổi không gồm giá. Đây là hành vi mới không nằm trong yêu cầu user. Tách quyền tạo mới/nhập giá khỏi sửa thông tin hoặc ảnh SP cũ; kiểm tra server và DB đúng theo quyền, không mở rộng quyền cho tiện.

`canAdjustStock` mặc định true trong form; edit page chưa truyền quyền này, create page có truyền. Server save vẫn update inventory. Đối chiếu policy `inventory_min_update` và các migration sau: thiếu quyền có thể update 0 dòng mà không error. Không chỉ tin `.error === null`; xác minh số dòng/tồn tại nếu cần.

### B. Upload trên điện thoại qua HTTP LAN — cần xác minh runtime

`ProductImageManager.tsx` dùng `crypto.randomUUID()`. Người dùng hiện mở `http://192.168.1.64:3000`, không phải localhost trên điện thoại hoặc HTTPS. API secure-context có thể không khả dụng ở origin này. Kiểm tra trên thiết bị; dùng giải pháp UUID an toàn phù hợp hoặc cấp đường test HTTPS, không dùng Math.random cho định danh nhạy cảm. `capture` của file input khác với getUserMedia: không khẳng định mọi capture đều bị HTTPS chặn, cũng không hứa mọi máy đều mở camera giống nhau.

`next.config.ts` còn `allowedDevOrigins: ["192.168.5.122"]`, trong khi IP vừa đo là 192.168.1.64. Xác minh HMR/cross-origin cho Next 16 rồi cập nhật đúng phạm vi nếu cần. Đây không phải firewall allowlist hoặc bằng chứng web đang nghe trên LAN.

### C. Lỗi mạng và retry — chưa có bằng chứng đã xử lý đầy đủ

Các async handler lưu, upload, remove, reorder còn nhiều chỗ thiếu try/catch/finally. Nếu Server Action ném exception hoặc mất mạng, trạng thái pending/status có thể không hồi phục đúng. Kiểm tra từng nhánh; không tạo bản ghi trùng khi lần tạo đã thành công nhưng response thất lạc.

### D. Transaction, thứ tự ảnh, giới hạn đồng thời

`createProduct`: insert products → update inventory → upsert cost, không atomic. Có trả id khi lỗi sau insert; form nhớ id để lần sau sửa. Cần xác minh partial failure và invalidation cache, số dòng update; cân nhắc giao dịch đúng quyền khi cần, không dùng service-role để che lỗi.

`registerProductImage`: list file → đọc count/order → dịch sort → insert metadata → xóa placeholder. `reorderProductImages` update từng hàng. Hai tab upload/reorder đồng thời có thể trùng sort/vượt 10 ảnh, vì kiểm count chưa có khóa/constraint giao dịch. Cleanup placeholder và vài thao tác chưa kiểm error. Bản review trước không chứng minh đây là luồng transaction an toàn.

Storage xóa lỗi sau khi metadata đã xóa: UI đã có warning, nhưng file public có thể còn mồ côi, chưa có cơ chế retry/cleanup hoàn chỉnh. `deleteProduct` cũng cần xem lại lỗi Storage cleanup sau khi xóa SP. Tránh đổi thứ tự đơn giản thành xóa file trước rồi metadata nếu có thể làm link ảnh còn tồn tại nhưng tệp đã mất.

### E. Ảnh lớn và tương thích

25 MB file gốc không giới hạn số pixel. `createImageBitmap` decode trước khi resize có thể dùng nhiều RAM với ảnh cực lớn; preview blob cũng cần lưu ý. HEIC không đọc được thì có thông báo chọn JPEG/PNG/WebP/định dạng iPhone tương thích. Hiện chưa chứng minh hỗ trợ tất cả iPhone/Android. `ProductImageManager` có 10 ảnh thật, placeholder không tính vào hạn mức; xác minh reorder sau khi thay placeholder và các sort có khoảng trống.

Chưa có runtime validation file signature phía ứng dụng; bucket MIME/size + kiểm tra phía client hiện là phần bảo vệ chính. Review yêu cầu an toàn file theo threat model thật, không coi MIME client gửi là kiểm chứng toàn bộ nội dung.

### F. Trường Ngành hàng khi tạo thủ công

Form thêm giống form sửa, nhưng form sửa hiện không có industry. Tạo thủ công có thể không xuất hiện trong thẻ ngành trên home. Đây là gap chức năng cần trình bày cho user/chốt thêm trường khi hoàn thiện; không tự suy ngành từ danh mục như quyết định nghiệp vụ.

## 3. Các gap storefront và dữ liệu

- `app/(store)/page.tsx` dùng `MENU_SUBS = INDUSTRIES.length ? INDUSTRIES : ["Quạt", "Ấm siêu tốc"]`. Panel con đang lấy ngành của toàn catalog và thường link `?industry=...`, không truy vấn đúng children của Đồ gia dụng. Với data hiện tại hai tên trùng nhau nên có thể trông đúng; khi thêm ngành/danh mục sẽ sai. Cần tách mô hình theo yêu cầu user.
- Bấm Đồ gia dụng dùng slug `gia-dung`; xác minh slug DB đã nhập, không hardcode giả định khi cây danh mục thay đổi.
- Mẫu chuẩn Excel code chưa có cột Phân loại, trong khi workbook người dùng có; nhận dạng đơn vị giá tùy mẫu. Không nhân 1000 cả file Ấm hoặc dùng nhánh file Quạt chỉ vì tên file. Đối chiếu header và giá thực.
- `getProducts()` đọc `.limit(5000)` một lần; Supabase có thể áp max rows thấp hơn. Kiểm tra phân trang/count khi quy mô ~3.500 sản phẩm; chưa coi 5000 là bảo đảm lấy đủ.
- Logo ngoài trong `BrandCarousel` có thể bị CSP `img-src` (self/data/blob/Supabase) chặn. Có hãng bị bỏ khỏi carousel nếu chưa có LOGOS map. Đã ghi nhận, nhưng user hoãn phần này; không tự ưu tiên trước upload.
- Yêu thích chỉ localStorage; tài khoản khách chỉ preview. Không nói dữ liệu đã đồng bộ tài khoản.
- Catalog hiện lấy ảnh đầu theo sort; cần kiểm tra gallery chi tiết SP/storefront có đọc đầy đủ ảnh mới hay mới chỉ cover.

## 4. Vấn đề lịch sử cần xác minh, chưa kết luận còn tồn tại

- HANDOFF cũ ghi có thể update trực tiếp inventory.qty bằng quyền adjust_stock, không ghi movement. Đọc lại grants/trigger/RLS remote trước khi kết luận hoặc sửa.
- HANDOFF cũ ghi giá vốn SP cũ chưa +10%, test owner password không còn đúng, dashboard quét nhiều SP, khó chọn thư mục ảnh báo giá trong browser nhúng.
- Production Vercel/HTTPS/robots/noindex/auto-deploy chưa xác minh. Không mở index Google trước khi shop cho mở bán.
- VietQR, Telegram, coupon, phí ship/chính sách và luồng auth khách chưa đủ bằng chứng hoàn chỉnh.

## 5. Những lần thử thất bại, tránh lặp mù quáng

- Supabase CLI `--version`, `migration --help`, `migration new product_image_storage` bị EPERM khi ghi `C:\Users\Hai Trieu\.supabase\telemetry.json.tmp...`. Đặt SUPABASE_TELEMETRY_DISABLED=true vẫn không giải quyết trong môi trường đó. Migration hiện có được viết cục bộ; chưa được CLI/apply xác nhận. Đừng tiếp tục gọi vô hạn hoặc yêu cầu mở toàn bộ quyền chỉ vì telemetry.
- `Get-NetIPConfiguration`/CIM bị chặn; `ipconfig` đọc được IPv4 Wi-Fi. IP Radmin VPN 26.x không phải địa chỉ nên đưa cho điện thoại cùng Wi-Fi.
- `npm run dev -- --hostname 0.0.0.0` báo `listen EACCES: permission denied 0.0.0.0:3000`. Thử3101 thấy “Another next dev server is already running”, port3000, PID61400, log `.next/dev/logs/next-development.log`. Nguyên nhân chưa kết luận; PID là lịch sử, phải nhận diện tiến trình hiện tại trước khi xử lý.
- Link cũ 192.168.5.122 không còn khớp Wi-Fi 192.168.1.64 ở lần đo cuối. Đừng hardcode lâu dài.
- Hộp chọn thư mục ảnh báo giá không giống nhau giữa browser nhúng và Chrome/Edge. Không coi API mock hoặc kích thước emulator là thử thiết bị thật.

## 6. Lệnh tham khảo (đọc trước khi chạy)

```powershell
git status --short
npx tsc --noEmit
npm run lint
npm run build
npm run dev -- --hostname 0.0.0.0
ipconfig
```

Các script `scripts/kiem-thu-bao-mat.mjs`, `scripts/tan-cong-thu.mjs`, `nap-du-lieu-thu.mjs`, `tao-tai-khoan-thu.mjs` có thể dùng tài khoản/dữ liệu và tác động DB. Phải đọc source và cô lập môi trường trước. Fixture seed đã bị user yêu cầu xóa. Không chạy script chỉ vì HANDOFF cũ ghi 47/47 hoặc 35/35.

## 7. Trình tự công cụ

Claude Code là người chịu trách nhiệm code hệ thống theo quyết định mới. Nếu dùng agent phụ: đọc-only audit trước; một người sở hữu mỗi nhóm file khi sửa; reviewer độc lập sau diff; test theo phạm vi; tích hợp và báo cáo bằng chứng. Không giao Claude, Antigravity, Codex đồng thời sửa cùng ProductForm/actions/migrations. Không mặc nhiên có kết nối giữa ba công cụ; chỉ báo đã giao khi thực sự gửi qua cơ chế có sẵn và được user cho phép.
