# Bàn giao tiếp tục — Tân Trường Tín

**Cập nhật:** 28-10-2026 · **Người viết:** Claude Code · **Nhánh Git:** `codex/desktop-storefront-upgrade` (không phải `main`)

Đây là **điểm bắt đầu duy nhất** cho bất kỳ công cụ AI nào tiếp tục dự án. Đọc hết tệp này trước, rồi mới mở các tài liệu khác.

---

## 1. Dự án là gì

Web bán hàng + trang quản trị kho/đơn cho cửa hàng điện nước, kim khí, quạt, gia dụng **Tân Trường Tín** (379 đường 2/4, Bắc Nha Trang, Khánh Hòa).

- **Kỹ thuật:** Next.js **16.4.2** App Router (API khác bản phổ biến — đọc `node_modules/next/dist/docs/` trước khi viết mã), React 19, Tailwind CSS 4, Supabase (Postgres + Auth + Storage).
- **Supabase project:** `ztbwxfzklznpqbofbwlk` (Singapore). Đây là **cơ sở dữ liệu thật**, bản chạy thử trên máy cũng nối thẳng vào đó.
- **Chạy thử:** `npm run dev` → `http://localhost:3000`. Kiểm tra: `npx tsc --noEmit`, `npm run lint`, `npm run build`. Không có test runner.

## 2. Đọc theo thứ tự

1. Tệp này.
2. `CLAUDE.md` — quy tắc làm việc của dự án.
3. `docs/claude-code-handoff-2026-10-28/` — `PROJECT.md`, `CHAT_HISTORY.md` (quyết định của chủ shop, quyết định mới thay quyết định cũ), `NEXT_STEPS.md`.
4. `docs/PRD.md` (nghiệp vụ) và `docs/DESIGN.md` (nhận diện, quy tắc giao diện).
5. `docs/MENTOR_LOG.md` — nhật ký từng đợt việc, mới nhất ở cuối.
6. `docs/AI_TASK_BOARD.md` — trạng thái task AI-001, AI-002.

## 3. Quy tắc an toàn — bắt buộc

- **Hỏi chủ shop trước** khi: ghi/xóa dữ liệu Supabase, chạy migration, deploy, gộp vào `main`, commit/đẩy mã.
- **Không đẩy lên `main`.** Vercel có thể tự deploy production từ `main` (chưa xác minh cài đặt). Làm trên nhánh riêng.
- Không đọc, in hay chép nội dung `.env.local`. Không đưa Excel (có thể chứa giá nhập), dump DB, dữ liệu khách hàng lên Git — `.gitignore` đã chặn `*.xlsx`, `exports/`, `*.log`, `*.dump`.
- Giữ RLS và kiểm quyền phía server; không dùng service-role để né lỗi quyền.
- Không bịa số liệu, đánh giá, "đã bán", cam kết thương mại.
- Repo có nhiều đợt việc của nhiều công cụ (Codex, Claude Code). Đọc `git status`/`git diff` trước khi sửa; không reset, không ghi đè việc đang có.

## 4. Trạng thái hiện tại (đã kiểm chứng ngày 28-10)

### Trang bán hàng desktop (AI-001) — Codex làm, Claude Code rà và sửa
- Bộ lọc + sắp xếp lưu trong URL (lặp tham số `?brand=A&brand=B`), Back/Forward đúng; khung chờ `Suspense` là 12–15 sản phẩm thật dựng ở máy chủ (đạt Hallmark quy tắc 7: có nội dung khi tắt JavaScript).
- `npm run build` sạch; `/`, `/danh-muc` tĩnh làm mới 1 phút; `/danh-muc/[slug]` dựng sẵn.
- Trang chủ: 15 sản phẩm mỗi lượt (lưới 5 cột). Hằng số ở `lib/mock/store.ts` (`PAGE_SIZE=12`, `HOME_PAGE_SIZE=15`).
- Các thay đổi so với kế hoạch v4 (bỏ "Cách mua", bỏ "Mua theo nhu cầu", menu chỉ Đồ gia dụng, hai bộ lọc giá ngang) là **quyết định của chủ shop**, xem `CHAT_HISTORY.md` dòng 46, 56.
- **Chưa xem trực quan đầy đủ; mobile chưa làm** (chờ chủ shop duyệt desktop).

### Ảnh sản phẩm (quản trị) — đã chạy được
- Kho Supabase `product-images` (công khai, ≤6 MB, JPG/PNG/WebP/HEIC). Hai migration **đã áp**: `product_image_storage` và `fix_product_image_insert_policy` (sửa lỗi `name` bị hiểu là `products.name`, trước đó mọi lần tải đều bị chặn).
- `next.config.ts` có `images.remotePatterns` chỉ cho thư mục `product-images` của Supabase shop.
- Tải ảnh: chọn ảnh / chụp ảnh → **khung chỉnh vuông 1:1** (`components/admin/ImageCropDialog.tsx`: kéo, phóng to bằng thanh trượt/2 ngón/con lăn) → **nén trên thiết bị** (`lib/image-encode.ts`: cạnh dài ≤1600px, WebP 0.82, lùi JPEG; vẽ lại nên xóa EXIF/GPS). Đo thử: 5,9 MB → 246 KB.
- Xóa ảnh: xác nhận ngay trên nút (trình duyệt nhúng chặn `window.confirm`).
- Đã thử thành công: SP 366 *Quạt bàn B4 Airport* có 2 ảnh trong kho, hiện được ngoài trang sản phẩm, không còn EXIF/GPS. Hai ảnh này tải **bằng mã cũ** (trang chưa tải lại) nên ảnh PNG còn 2,1 MB.

### Ngành hàng (AI-002) — Codex làm
- Cột `products.industry`, nhập từ Excel; thẻ Ngành hàng lấy theo dữ liệu đã nhập. Ngành khởi đầu: Quạt, Ấm siêu tốc. Xem `AI_TASK_BOARD.md` dòng AI-002.

### Đã làm thêm 28–29/10 (sau lần bàn giao đầu)
- Danh sách SP điện thoại: giữ yên 0,6s để chọn, chạm để chọn thêm, thanh dính đáy "Hủy · Tải N ảnh" (`components/admin/useProductSelection.ts`). Desktop giữ ô tick.
- Lọc ngay khi gõ cho mọi ô tìm (`lib/use-url-params.ts`, `components/LiveSearchField.tsx`): Sản phẩm, Đơn hàng, trang Tìm kiếm web bán hàng; Tồn kho có ô tìm mới. Ô "Tìm nhanh" đầu trang quản trị: Enter → trang Sản phẩm.
- Thanh đáy quản trị điện thoại: Tổng quan · Đơn hàng · Sản phẩm · Tồn kho · Thêm.
- Sửa: tên tệp ảnh trên http://IP-LAN (không có crypto.randomUUID) giờ đúng dạng UUID; ảnh báo giá vẽ ảnh Supabase cần `crossOrigin` (trước báo "Không tạo được ảnh"); xóa sản phẩm dùng hộp xác nhận riêng (trình duyệt nhúng chặn `window.confirm`); khung chỉnh ảnh là `<dialog>` modal + khóa cuộn nền.
- **Vercel:** dự án `trieuvolehai-2530/tan-truong-tin-web`, deploy **bằng tay**: `npx vercel deploy --prod --yes` (không tự deploy từ GitHub). Tên miền: tantruongtin.com. Deploy 29/10 = commit 33665d4; `main` đã khớp. Quay lại bản trước: `npx vercel rollback`. Có đủ 3 biến môi trường mã cần. `robots.txt` đang chặn mọi công cụ tìm kiếm.
- **Quyền nhân viên:** `order_staff` (bán quầy, xử lý đơn), `stock_staff` (kiểm kho, xem giá nhập) — 29/10 chủ shop đã cấp `edit_products` cho `stock_staff` (gồm sửa, tạo, xóa SP, tải ảnh; không gồm sửa giá/tồn).

## 5. Việc còn dở — làm tiếp theo thứ tự

1. **Chủ shop sẽ báo thêm lỗi** sau khi thử — hỏi chủ shop trước tiên.
2. (Đã xong 29/10) ~~Nút xóa sản phẩm~~, ~~khung chỉnh ảnh giữ tiêu điểm~~.
3. Xóa các ảnh thử (ảnh chụp màn hình game/mạng xã hội) khỏi SP 361 và 366 trước khi cho khách xem.
4. **Thử nén ảnh trên điện thoại thật** (Android, iPhone; ảnh HEIC, ảnh chụp dọc). Ảnh PNG 2,1 MB của SP 366 có thể xóa rồi tải lại.
5. **Lịch sử migration lệch** giữa Supabase và repo: trên Supabase `product_industry`=`20261027133325`, `product_image_storage`=`20261028121846`, `fix_product_image_insert_policy`=`20261028124745`; tệp repo mang số khác, và `inventory_column_privileges` có trên Supabase mà repo không có. Phải dọn trước khi ai đó chạy `supabase db push`. (Riêng `products_delete_policy` 29/10 đã khớp: `20261029090608`.)
6. **Chủ shop cần quyết:** bộ lọc giá trên trang chủ có lưu vào URL không (hiện chỉ lưu trong trang).
7. Các khoảng trống khác đã ghi ở `docs/claude-code-handoff-2026-10-28/NEXT_STEPS.md` mục 3–4 (menu lấy Ngành hàng thay Danh mục con, `getProducts()` giới hạn 5000, logo hãng bị CSP chặn, VietQR/phí ship chưa xong...).

## 6. Lời dặn để dán vào công cụ AI khác

```text
Bạn tiếp tục dự án web bán hàng Tân Trường Tín. Repo GitHub riêng tư volehaitrieu/tan-truong-tin-web, nhánh codex/desktop-storefront-upgrade.
Trước khi làm gì: đọc docs/BAN_GIAO_TIEP_TUC.md, rồi CLAUDE.md, rồi các tài liệu nó chỉ dẫn.
Giao tiếp tiếng Việt, xưng em, gọi tôi là chủ shop. Phân biệt rõ: đã kiểm chứng / có code / chưa xác minh.
Không ghi dữ liệu Supabase, không chạy migration, không deploy, không đẩy lên main, không commit khi chưa hỏi tôi.
Không đọc hay in .env.local. Việc đầu tiên: hỏi tôi có lỗi nào cần báo, rồi đề xuất thứ tự làm mục 5 của tệp bàn giao.
```

## 7. Khi dự án xong — gỡ thông tin

- Git giữ mọi phiên bản cũ. Xóa tệp ở bản mới **không** xóa khỏi lịch sử. Vì vậy repo này được giữ sạch từ đầu: không khóa, không Excel, không dữ liệu khách (đã quét ngày 28-10: không có khóa/JWT/mật khẩu; chỉ có 2 số điện thoại công khai của shop).
- Khi xong: thu hồi quyền truy cập GitHub của các công cụ AI; luân chuyển (đổi) khóa Supabase và khóa Anthropic/OpenAI đã dùng trong quá trình làm; cân nhắc lưu trữ (archive) repo.
