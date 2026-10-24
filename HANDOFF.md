# HANDOFF — Web Tân Trường Tín

_Cập nhật: 24/10/2026._
_Nhật ký chi tiết từng bước: `docs/MENTOR_LOG.md` (đọc ~30 dòng cuối)._

---

## 1. Tổng quan dự án

- **Mục tiêu:** web bán hàng + trang quản trị (admin) cho cửa hàng **Tân Trường Tín** ở Nha Trang. Cửa hàng bán **điện nước, kim khí, dụng cụ, quạt, gia dụng** (không chỉ quạt; quạt là nhóm có thông số chi tiết nhất).
- **Người dùng:**
  - Khách mua: xem hàng, đặt hàng (COD), tra cứu đơn, gửi yêu cầu báo giá.
  - Chủ shop (`owner`), nhân viên đơn (`order_staff`), nhân viên kho (`stock_staff`) — quyền chi tiết chỉnh được trong Admin › Nhân viên & quyền.
- **Tính năng chính:** danh mục + tìm kiếm không dấu, giỏ hàng, đặt hàng, tra cứu đơn; admin: đơn hàng, bán tại quầy, sản phẩm, nhập Excel, tồn kho, kiểm kho, khuyến mãi, báo cáo, nhân viên, nhật ký, cài đặt, ảnh báo giá gửi khách.
- **Chủ dự án** không phải lập trình viên, giao tiếp **tiếng Việt**, muốn giải thích dễ hiểu.

## 2. Công nghệ sử dụng

- **Next.js 16.4.2** (App Router, Turbopack) + **React 19.3** + **TypeScript 5**. Lưu ý: Next 16 có thay đổi so với bản cũ — đọc `node_modules/next/dist/docs/` trước khi viết mã (xem `AGENTS.md`). File chặn đường dẫn là `proxy.ts` (không phải `middleware.ts`).
- **Tailwind CSS 4** (cấu hình bằng CSS trong `app/globals.css`, không có `tailwind.config`).
- **Supabase** (Postgres + Auth + RLS), gói miễn phí, vùng ap-southeast-1. Thư viện `@supabase/ssr`, `@supabase/supabase-js`.
- **lucide-react** (biểu tượng). Không có thư viện UI khác, không có thư viện Excel/zip/sanitize — đều tự viết (xem mục 9).
- **Hosting:** Vercel, vùng `sin1` (`vercel.json`). Mã nguồn: GitHub (kho riêng tư, chủ `volehaitrieu`).
- **Tên miền:** `tantruongtin.com` (mua ở P.A Việt Nam), DNS đã trỏ về Vercel, đã xác minh; HTTPS lúc kiểm tra cuối (23/10) **chưa có chứng chỉ** — chưa xác định đã cấp chưa.
- Dịch vụ bên thứ ba khác: **chưa có** (VietQR, Telegram, tải ảnh lên — chưa làm).

## 3. Cấu trúc thư mục

```
app/
  (store)/            Trang bán hàng: trang chủ, danh-muc, san-pham/[sku], gio-hang, thanh-toan,
                      cam-on, tra-cuu, bao-gia, chinh-sach, tim-kiem; actions.ts (đặt hàng, báo giá)
  admin/
    dang-nhap/        Đăng nhập bằng SĐT/email
    in-phieu/[ma]/    Phiếu giao hàng in A5
    (shell)/          Khung admin (sidebar + thanh dưới ĐT), mỗi thư mục = 1 màn:
      page.tsx        Tổng quan
      don-hang/ ban-tai-quay/ san-pham/ (+ [id] sửa SP, [id]/anh-thong-tin, duyet-ai = nhãn "chưa dùng")
      nhap-excel/ ton-kho/ kiem-kho/ (+ [dot]/dem trang đếm ĐT) danh-muc/ khuyen-mai/
      bao-cao/ (+ xuat/route.ts xuất CSV) nhan-vien/ nhat-ky/ cai-dat/ doi-mat-khau/
  globals.css         Màu, font, lớp .rich-text (mô tả định dạng)
  robots.ts           Đang CHẶN công cụ tìm kiếm (giai đoạn thử)
components/
  admin/              ProductTable (bảng SP + khung chi tiết + tải ảnh), ProductFilters, ProductForm,
                      RichTextEditor, ProductCell/ProductInfo (dùng chung), InventoryScreens, Sidebar, Topbar…
  storefront/         Thẻ SP, giỏ, thanh toán, tìm kiếm, khung trang bán hàng
  brand/Logo.tsx
lib/
  supabase/           server.ts (theo phiên người dùng), public.ts (khách), admin.ts (khóa bí mật, chỉ server)
  auth.ts             requireStaff(quyền) — chặn trang admin theo quyền
  catalog.ts          Đọc SP/danh mục cho trang bán hàng
  admin/              Truy vấn cho admin: products, inventory, orders, counts, reports, preview
  excel/              read-xlsx (đọc .xlsx trong trình duyệt), parse-products (3 mẫu file), write-xlsx (tạo .xlsx/zip)
  rich-text.ts        Làm sạch HTML mô tả, đổi chữ↔HTML, tách thông số "Tên: giá trị"
  quote-image.ts      Vẽ ảnh báo giá PNG bằng canvas, lưu 1 ảnh / thư mục nhiều ảnh
  shop.ts             Thông tin cửa hàng + định dạng tiền
  mock/store.ts       Kiểu dữ liệu Product/Category dùng chung (tên "mock" là di sản, kiểu vẫn đang dùng)
supabase/migrations/  11 file SQL (lược đồ, hàm nghiệp vụ, dữ liệu gốc, các bản vá)
scripts/              kiem-thu-bao-mat.mjs (47 bài), tan-cong-thu.mjs (35 bài), nạp dữ liệu thử, tạo tài khoản thử
docs/                 PRD, DESIGN, DEV_PLAN, GIAO_DIEN_BAN_GIAO (mô tả màn hình), MENTOR_LOG, BAO_CAO_HOAN_THANH,
                      CHU_SHOP_CAN_CHUAN_BI
public/ai/            Ảnh minh họa theo nhóm hàng (chưa có ảnh SP thật)
```

## 4. Database (Supabase, project `ztbwxfzklznpqbofbwlk`)

Kiểu enum: `app_role` (owner, order_staff, stock_staff) · `delivery_method` (pickup, inner, province, counter) · `order_status` (pending, confirmed, shipping, ready, completed, cancelled).

| Bảng | Cột chính | Quan hệ / ghi chú |
|---|---|---|
| profiles | id, full_name, phone, role, is_active | id = auth.users.id |
| permissions / role_permissions | key, label / role, permission, allowed | 15 quyền: view_cost, edit_products, edit_price, adjust_stock, count_stock, import_excel, process_orders, cancel_orders, discount_orders, pos_sale, view_reports, view_profit, manage_staff, settings, view_audit |
| categories | parent_id, name, slug, sort, attribute_schema (jsonb) | cây 2 cấp; attribute_schema = nhãn thông số (quạt) |
| brands | name, slug | |
| products | sku (A-Z0-9-), name, slug, unit, price, sale_price, sale_from/to, category_id, brand_id, spec_line (thông số nhiều dòng), attributes (jsonb), description (HTML đã làm sạch), warranty, origin, made_in, is_visible, in_stock, search_text | in_stock do trigger cập nhật; search_text không dấu |
| product_costs | product_id, cost_price (giá vốn = nhập +10%), import_price (giá nhập gốc) | chỉ người có view_cost đọc; SP cũ: import_price = null, cost_price = giá nhập cũ |
| product_images | product_id, url, is_illustration, sort | hiện toàn ảnh minh họa |
| inventory | product_id, qty, min_qty, location (mặc định "Kho 1") | chỉ nhân viên đọc; qty chỉ đổi qua hàm |
| inventory_movements | product_id, delta, reason, note, order_id | lịch sử tồn |
| orders / order_items / order_events | code (TTT######), phone, delivery, status, payment_*, subtotal, shipping_fee / sku, name, unit_price, qty / type, note | order_items lưu tên+giá lúc bán |
| quote_requests | items, phone, handled | giới hạn 20 yêu cầu/10 phút toàn shop |
| stock_counts / stock_count_items | name, scope, status / system_qty, counted_qty | đợt kiểm kho |
| settings | 1 dòng: shop, inner_ship_fee, free_ship_threshold, return_policy, bank | phí ship đang để trống |
| audit_log | actor, action, target, details | trigger ghi khi sửa SP/giá/quyền |
| import_changes | product_id, field, old_value, new_value (unique product_id+field) | thay đổi chờ duyệt khi nhập Excel |

**Bảo mật:**
- RLS bật trên **mọi bảng**. Hàm kiểm quyền: `private.has_perm(key)`, `private.is_staff()`, `private.is_owner()`.
- Khách (anon) chỉ đọc: products (đang hiển thị), categories, brands, product_images, settings. Khách ghi **chỉ qua hàm** `place_order`, `lookup_order`, `submit_quote` (security definer, server tự tính tiền).
- Nghiệp vụ nhân viên qua hàm security definer: `adjust_stock`, `order_set_status`, `order_set_shipping`, `order_mark_paid`, `count_create/set/close`, `pos_create_order`.
- Trigger: `products_before_write` (chặn sửa giá nếu thiếu edit_price), `inventory_sync`, `audit`, `profiles_guard` (chặn tự nâng quyền).

## 5. Đã hoàn thành (chạy được)

- **Trang bán hàng** (`app/(store)/`): trang chủ, danh mục + lọc thông số quạt, tìm kiếm không dấu có gợi ý, chi tiết SP (bảng thông số + mô tả định dạng), giỏ, đặt hàng COD, cảm ơn, tra cứu đơn (mã + SĐT), báo giá số lượng lớn, chính sách, 404. Đã chạy trên Vercel.
- **Admin** — 19 màn, dữ liệu thật, menu + chặn trang theo quyền (`lib/auth.ts`, `proxy.ts`):
  - Tổng quan (`(shell)/page.tsx`), Đơn hàng + chi tiết + in phiếu, Bán tại quầy, Tồn kho + điều chỉnh, Kiểm kho + trang đếm ĐT, Danh mục & thương hiệu, Khuyến mãi, Báo cáo + xuất CSV, Nhân viên & quyền, Nhật ký, Cài đặt, Đổi mật khẩu, Ảnh thông tin SP 1080×1080.
  - **Sản phẩm** (`components/admin/ProductTable.tsx`, `ProductFilters.tsx`): ảnh + tên + "Mã:", cột Vị trí, số tồn đỏ khi < tối thiểu, lọc danh mục/thương hiệu (gõ tìm, kèm số SP)/khoảng giá tự nhập (hỏi giá gốc/KM/cả 2)/trạng thái, nút Xóa bộ lọc, ô tick + Chọn tất cả, bấm dòng → khung chi tiết 3 cột.
  - **Ảnh báo giá** (`lib/quote-image.ts`): 1 SP → tải 1 PNG; nhiều SP → bảng hướng dẫn → chọn thư mục → web tạo thư mục "Báo giá ngày dd-mm-yyyy" chứa PNG.
  - **Sửa SP** (`components/admin/ProductForm.tsx`): thông số nhiều dòng, mô tả soạn kiểu Word (`RichTextEditor.tsx`), xuất xứ, sản xuất tại, vị trí, giá vốn = nhập + 10%.
  - **Nhập Excel** (`app/admin/(shell)/nhap-excel/`): đọc 3 mẫu (mẫu chuẩn web, DMHH KHO XHD, file quạt), tải file mẫu, SP mới thêm thẳng, SP đã có → bảng "Thay đổi chờ xác nhận" tick từng thay đổi (lưu DB), xuất file dòng lỗi + cột Ghi chú.
- Ảnh SP nhỏ ở mọi màn có SP (Tổng quan, Tồn kho, Kiểm kho, Bán tại quầy, Khuyến mãi, Chi tiết đơn).
- **Kiểm thử:** `scripts/kiem-thu-bao-mat.mjs` 47/47 (lần chạy đạt cuối: 23/10 trước khi đổi mật khẩu), `scripts/tan-cong-thu.mjs` 35/35 (23/10 tối).
- **Dữ liệu thử:** ~98 SP (90 từ Excel chủ shop + 8 SP mẫu cũ dùng cho bài kiểm thử, ví dụ `QUA-HALI-TR2`).

## 6. Đang làm dở / còn lỗi

- **Đã commit + push lên GitHub (24/10, commit cd5c6e0) nhưng CHƯA deploy Vercel.** Bản trên tan-truong-tin-web.vercel.app là bản 23/10 trưa. Vercel KHÔNG nối GitHub (push không tự deploy) — deploy bằng `vercel --prod`.
- **Bài kiểm thử phân quyền không chạy được:** mật khẩu chủ shop đã đổi, `TEST_OWNER_PASSWORD` trong `.env.local` không còn đúng.
- **Lưu thư mục ảnh báo giá** chỉ chạy trên Chrome/Edge thật; khung trình duyệt nhúng (ví dụ trong ứng dụng Claude) không hiện câu hỏi cấp quyền → web báo lỗi. Chrome cấm chọn thẳng Tải xuống/Màn hình (phải chọn thư mục con). Chưa xác nhận chủ shop đã lưu thành công bằng hộp thật.
- **Giá vốn SP cũ chưa +10%** (cập nhật hàng loạt bị chặn, chưa được duyệt). Chỉ SP sửa giá nhập/nhập Excel mới tính +10%.
- **Kẽ hở nhỏ:** nhân viên có quyền `adjust_stock` vẫn có thể `update` thẳng cột `inventory.qty` qua API (không ghi lịch sử). Đề xuất `revoke update` + `grant update (min_qty, location)` — chưa được duyệt.
- **Màn Tổng quan** đọc toàn bộ SP (tới 5.000) để tìm hàng sắp hết → sẽ chậm khi đủ ~3.500 SP.
- Không có TODO/FIXME trong mã.
- Dữ liệu: 2.189 dòng DMHH chưa có danh mục, 93 dòng quạt thiếu SKU, tồn = 0 hết, phí ship + đổi trả chưa nhập.

## 7. Chưa làm (theo thứ tự ưu tiên)

| # | Việc | Độ khó | Công cụ |
|---|---|---|---|
| 1 | Rà lỗi toàn dự án, chạy lại 2 bộ kiểm thử, commit + push + deploy Vercel | Dễ | code + cấu hình hạ tầng |
| 2 | Thay khóa bí mật Supabase mới (`SUPABASE_SECRET_KEY`) trên máy + Vercel (nếu chủ shop đã tạo) | Dễ | cấu hình hạ tầng |
| 3 | Tải ảnh SP thật lên (Supabase Storage, nhiều ảnh/SP, thay ảnh minh họa) | Vừa–khó | code + thiết kế giao diện |
| 4 | Thanh giỏ hàng dính đáy ở Bán tại quầy trên điện thoại | Dễ | thiết kế giao diện + code |
| 5 | Tổng quan: lọc hàng sắp hết trong DB (hàm/view) thay vì tải hết SP | Dễ–vừa | code (cần migration) |
| 6 | Báo đơn mới qua Telegram | Vừa | code + cấu hình (chủ shop tạo bot) |
| 7 | Thanh toán VietQR ở trang thanh toán | Vừa | code (cần tài khoản ngân hàng) |
| 8 | Mã giảm giá | Khó | code (giỏ, thanh toán, báo cáo, bảo mật) |
| 9 | Mở bán: gỡ chặn Google (`app/robots.ts` + noindex trong `app/layout.tsx`), kiểm tra HTTPS tantruongtin.com | Dễ | cấu hình hạ tầng |
| 10 | Nhập dữ liệu thật (danh mục, tồn, ảnh, phí ship, đổi trả) | — | nội dung (chủ shop) |

## 8. Giao diện cần thiết kế lại / cải thiện

Hỗ trợ cả **điện thoại (~375–440px)** và **máy tính (1280–1440px)**. Không còn ảnh chụp màn hình trong dự án — chạy web để xem giao diện thật; mô tả màn gốc: `docs/GIAO_DIEN_BAN_GIAO.md`.

- **Bán tại quầy (ĐT):** giỏ nằm dưới lưới SP, phải cuộn xa → cần thanh giỏ dính đáy.
- **Sản phẩm (ĐT):** thẻ SP dài khi mã SKU dài (đã cho xuống dòng); khung chi tiết trên ĐT trượt từ đáy, ảnh thu nhỏ (max 240px), phải cuộn để xem mô tả (máy tính: 3 cột, vừa 1 màn).
- **Ảnh SP toàn bộ:** đang là ảnh minh họa theo nhóm → mọi màn (trang bán hàng, khung chi tiết, ảnh báo giá) sẽ đẹp hơn khi có ảnh thật; hàng ảnh nhỏ trong khung chi tiết chỉ hiện khi ≥ 2 ảnh.
- **Nhập Excel:** màn dài (xem trước + bảng đối chiếu + nút); bảng đối chiếu trên ĐT dạng thẻ — chưa được chủ shop duyệt kỹ.
- **Ảnh báo giá (PNG):** bố cục canvas cố định trong `lib/quote-image.ts`; mô tả dài sẽ làm ảnh rất cao.
- **Duyệt AI** (`san-pham/duyet-ai`): chỉ là nhãn "chưa dùng" — bỏ hoặc làm sau.
- Các màn khác: chưa xác định vấn đề cụ thể (chủ shop chưa góp ý).

## 9. Quyết định kỹ thuật đã chọn và lý do

- **Server tự tính tiền, khách ghi qua hàm Postgres** (`place_order`…): chống sửa giá/số lượng trong trình duyệt.
- **RLS mọi bảng + hàm security definer cho nghiệp vụ**: kiểm quyền ở DB, không chỉ ở giao diện; trang admin còn chặn bằng `requireStaff(quyền)`.
- **Tồn kho chỉ đổi qua hàm có ghi lịch sử** (`adjust_stock`, kiểm kho, bán hàng).
- **Giá nhập/giá vốn tách bảng `product_costs`**, chỉ quyền `view_cost` đọc. Giá vốn tính lãi = giá nhập + 10% (chủ shop chốt 23/10).
- **Không thêm thư viện ngoài khi tự viết được ngắn gọn:** đọc/ghi .xlsx, zip, làm sạch HTML (danh sách thẻ cho phép), ảnh canvas. Giữ bundle nhỏ, ít lỗ hổng phụ thuộc.
- **Mô tả lưu HTML đã làm sạch ở server** (`lib/rich-text.ts`), làm sạch lại khi hiển thị.
- **Nhập Excel: SP đã có không ghi đè** — đưa vào `import_changes` để chủ shop tick từng thay đổi; ô trống trong file = giữ nguyên.
- **Ảnh báo giá gửi Zalo là PNG thật, không zip** (kéo từ trong zip vào Zalo bị file 0 byte).
- **Trang admin luôn lấy dữ liệu mới** (không cache phía server); chỉ nhớ tạm phía trình duyệt 30s (`staleTimes.dynamic` trong `next.config.ts`).
- **Vercel sin1** cạnh Supabase ap-southeast-1 (giảm độ trễ).
- **Đang chặn Google** cho tới khi chủ shop mở bán.
- Header bảo mật (CSP, chống nhúng trang, nosniff…) trong `next.config.ts`.

## 10. Cách chạy dự án

```bash
npm install
npm run dev          # http://localhost:3000 (admin: /admin)
npm run build        # kiểm tra build
npx tsc --noEmit -p .   # kiểm tra kiểu
npm run lint
node --env-file=.env.local scripts/kiem-thu-bao-mat.mjs   # 47 bài phân quyền
node --env-file=.env.local scripts/tan-cong-thu.mjs       # 35 bài thử tấn công
vercel --prod        # deploy (CLI đã đăng nhập tài khoản của chủ shop); Vercel cũng nối GitHub — chưa xác định có tự deploy khi push không
```

Migration: file trong `supabase/migrations/`, đã áp lên DB thật (qua công cụ MCP Supabase). Thêm migration mới = file mới cùng quy ước tên `YYYYMMDDHHMMSS_ten.sql`.

**Biến môi trường** (`.env.local`, không commit — đã có trong `.gitignore`; trên Vercel cấu hình riêng):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (chỉ server, KHÔNG thêm tiền tố NEXT_PUBLIC_)
- `TEST_OWNER_PHONE`, `TEST_OWNER_PASSWORD`, `TEST_ORDER_PHONE`, `TEST_ORDER_PASSWORD`, `TEST_STOCK_PHONE`, `TEST_STOCK_PASSWORD` (cho script kiểm thử)
- `ANTHROPIC_API_KEY` (có trong file nhưng mã hiện không dùng)
- `VERCEL_OIDC_TOKEN` (do Vercel CLI tự tạo)

## 11. Lưu ý và ràng buộc

- **Ngôn ngữ:** giao diện, chú thích mã, thông báo lỗi → tiếng Việt. Tên biến/hàm → tiếng Anh. Đường dẫn trang → tiếng Việt không dấu (`/admin/san-pham`, `/tra-cuu`).
- **Phong cách mã:** dòng dài, gọn; chú thích ngắn tiếng Việt ở đầu khối; server action trả `{ ok, error }`; truy vấn admin trong `lib/admin/*.ts` (có `import "server-only"`); thành phần dùng chung trong `components/admin/`.
- Màu/font dùng biến Tailwind có sẵn (`brand`, `ink`, `ink-2`, `line`, `ground`, `sunk`, `danger`…) — không tự đặt mã màu mới.
- Nút/ô bấm trên ĐT ≥ 44px; kiểm tra cả 375px và 1280px.
- **Không sửa:** quy tắc RLS/hàm bảo mật mà không chạy lại 2 bộ kiểm thử; không đưa `SUPABASE_SECRET_KEY` ra trình duyệt; không dùng `lib/supabase/admin.ts` trong mã chạy theo yêu cầu người dùng trừ khi thật cần.
- **Không xóa** 8 SP mẫu cũ (SKU như `QUA-HALI-TR2`, `ONG-BM-21-4M`) — bài kiểm thử dựa vào chúng (giá `QUA-HALI-TR2` phải là 480.000).
- Supabase **gói miễn phí** — không bật tính năng trả phí.
- Đổi DB lớn (cập nhật hàng loạt, đổi quyền) → hỏi chủ shop trước.
- Sau mỗi đợt sửa mã: rà lỗi (chủ shop yêu cầu dùng skill `ponytail-review`), thử trên trình duyệt, ghi 1 dòng vào `docs/MENTOR_LOG.md`.
- Hạn mức AI: dừng ở 90% hạn mức tuần; không cắt bớt chất lượng vì hạn mức, chỉ xếp việc nhẹ trước.
