# Development Plan — Tân Trường Tín

_v1.2 · 2026-10-21 · **đã duyệt** · cách thực thi: Native (Mentor làm từng task trong phiên, chủ shop duyệt sau mỗi task) · v1.2: **Admin trước, trang bán hàng sau**_

> **Cho AI/agent viết code:** đây là kế hoạch tổng theo sprint. Khi bắt đầu một sprint, viết kế hoạch chi tiết từng bước (test trước, code sau) vào `docs/superpowers/plans/YYYY-MM-DD-sprint-N.md` bằng skill `superpowers:writing-plans`, rồi làm bằng `superpowers:executing-plans` hoặc `superpowers:subagent-driven-development`. Mỗi task phải được chủ shop duyệt kết quả trước khi sang task sau.

**Mục tiêu:** Đợt 1 — trang quản trị chạy thật (kho, Excel, ảnh, kiểm kho, ảnh gửi khách) khoảng **2026-11-07**; Đợt 2 — trang bán hàng nhận đơn online khoảng **2026-11-20**.

**Kiến trúc:** một dự án Next.js (App Router) chứa cả storefront `app/(shop)` và admin `app/admin`. Supabase làm database (Postgres + RLS), đăng nhập (Auth) và kho ảnh (Storage). Mọi phép tính tiền, tồn kho, phân quyền chạy ở server (Server Actions / Route Handlers / hàm Postgres), trình duyệt chỉ hiển thị.

**Công nghệ:** Next.js + TypeScript + Tailwind CSS + shadcn/ui · Supabase (`@supabase/ssr`) · Zod + React Hook Form (form) · SheetJS `xlsx` (đọc Excel) · `sharp` (nén ảnh WebP) · @vercel/og (ảnh thông tin SP) · JSZip (tải nhiều ảnh) · Telegram Bot API (báo đơn) · Vitest (test logic) + Playwright (test luồng mua hàng) · GitHub + Vercel.

**Tài liệu gốc (đọc trước khi làm):** `docs/PRD.md` (v1.0) · `docs/DESIGN.md` (v1.0) · canvas thiết kế https://claude.ai/artifact/9hbAUJokC937LsVrHWRs3C (trang Quản trị + trang Bán hàng) · logo `docs/brand/`.

---

## Thứ tự phát hành (cập nhật 2026-10-21 · v1.2)
Chủ shop đổi ưu tiên: **làm trang quản trị trước** để dùng ngay cho kho (nhập Excel có tồn + tồn tối thiểu, ảnh, kiểm kho bằng điện thoại, ảnh thông tin gửi khách qua Zalo), **sau đó mới tới trang bán hàng**. Thiết kế đã duyệt: canvas trang "Quản trị" (15 màn + 2 màn điện thoại).

**Đợt 1 — Admin chạy thật** (22/10 → ~7/11), đưa lên mạng sớm (địa chỉ miễn phí Vercel) để nhân viên dùng trên điện thoại:
| Nhóm | Task |
|---|---|
| Nền | 0.1 · 1.1 · 1.2 · 1.3 · 1.4 (đăng nhập + bảng quyền bật/tắt) |
| Dữ liệu | 1.5 Mentor phân loại danh mục/thương hiệu → Excel duyệt · 2.8 danh mục & bộ thông số |
| Sản phẩm | 2.1 danh sách · 2.2 form SP + giá KM · 2.3 nhập Excel (**có cột Tồn kho, Tồn tối thiểu**) · 2.5 ảnh (từ link + kéo thả theo SKU) + ảnh minh họa · **2.9 (mới) ảnh thông tin SP gửi khách** |
| Kho | 2.6 tồn kho + điều chỉnh + **cảnh báo sắp hết** · **2.10 (mới) đợt kiểm kho + đếm trên điện thoại** |
| Người dùng | 2.7 nhân viên & bảng quyền (NV kho: xem + đếm; NV đơn: xử lý đơn) |
| Vận hành | 4.5 (phần admin) kiểm thử & bảo mật · 4.6 deploy Vercel (địa chỉ tạm) |

**Đợt 2 — Trang bán hàng** (~8/11 → ~20/11), thiết kế ở canvas trang "Bán hàng":
| Nhóm | Task |
|---|---|
| Trang bán hàng | 3.1 → 3.8 (trang chủ, danh mục + bộ lọc, chi tiết, giỏ, thanh toán, cảm ơn/tra cứu + VietQR, chính sách/SEO, báo giá số lượng lớn) |
| Đơn hàng | 4.1 quản lý đơn (gồm 4.0) · 4.2 in phiếu · 4.3 Telegram · 4.4 cài đặt cửa hàng |
| Vận hành | 4.5 kiểm thử toàn bộ · 4.6 gắn tên miền tantruongtin.vn · mở bán thử |

Task 2.4 (nút AI trong admin) **bỏ**, thay bằng 1.5. Không có xóa sản phẩm, chỉ Ẩn.

## Ràng buộc chung (áp dụng cho mọi task)
- Giá lưu bằng **đồng, số nguyên** (`bigint`). File Excel ghi nghìn đồng → nhân 1.000 khi nhập. Giá bán **đã gồm VAT**.
- Hiển thị giá `480.000₫` bằng `Intl.NumberFormat('vi-VN')`.
- **Tổng tiền, phí ship, tồn kho tính ở server**; không tin số gửi từ trình duyệt.
- **RLS bật cho mọi bảng** ngay khi tạo. Khóa `service_role` chỉ dùng phía server, không bao giờ có tiền tố `NEXT_PUBLIC_`.
- Phân quyền theo **bảng quyền bật/tắt** (`role_permissions`); kiểm tra bằng một hàm duy nhất ở server **và** trong RLS, không chỉ ẩn nút.
- Quyền mặc định: Chủ shop = tất cả · NV kho = xem (kể cả giá nhập) + đếm trong đợt kiểm kho, không điều chỉnh tay · NV đơn = xử lý đơn, nhập phí ship, xác nhận tiền; không hủy, không giảm giá.
- Trừ tồn khi đơn chuyển **"Đã xác nhận"**, hoàn lại khi **hủy**. Hết hàng → hiển thị **"Liên hệ"**, vẫn đặt được (đơn gắn cờ "cần đặt hàng").
- Tồn đầu kỳ + tồn tối thiểu **nhập từ Excel** (chủ shop bổ sung cột); tồn ≤ tối thiểu → cảnh báo "Sắp hết". Kiểm kho dùng để đối chiếu với hàng thật trước khi mở bán và kiểm định kỳ.
- Số lượng đặt mua **chỉ số nguyên** cho mọi đơn vị (cái, bộ, mét, kg…), tối thiểu 1.
- Phí ship: lấy tại cửa hàng 0₫ · đi tỉnh "báo sau" · nội thành theo cài đặt (chưa cài → "báo sau"). VietQR chỉ hiện khi đơn đã có phí ship.
- Giao diện theo `DESIGN.md`: **chỉ giao diện sáng**, font Be Vietnam Pro, token màu đúng mã, tiêu đề ≤ 2 dòng, không gradient, không số liệu bịa (sao, "đã bán").
- SP chưa có ảnh thật → ảnh minh họa theo danh mục con + nhãn "Ảnh minh họa".
- Tìm kiếm gõ **không dấu** vẫn ra kết quả (Postgres `unaccent`).
- Địa chỉ theo **địa giới hành chính mới** (Tỉnh → Phường/Xã).
- Mobile-first: mọi trang dùng tốt ở 360-375px, không cuộn ngang.

## Rủi ro cần test kỹ (Review Focus)
1. **Sửa giá/số lượng từ trình duyệt** (sửa giỏ hàng trong DevTools, gửi số lượng âm hoặc 9999) → server tính lại từ DB, từ chối số lượng ≤ 0 hoặc quá giới hạn. _Test ở Task 3.5._
2. **Hai người cùng xác nhận món cuối cùng / bấm xác nhận 2 lần** → tồn không được âm hai lần, không trừ trùng. _Test ở Task 4.1 (hàm Postgres có khóa dòng)._
3. **File Excel bẩn:** SKU trùng, SKU trống, giá 0, giá có dấu chấm/phẩy, đơn vị lạ (`Kg`/`kg`, `m`/`Mét`), dòng tiêu đề lệch, 3.575 dòng một lần → báo lỗi từng dòng, không ghi nửa chừng. _Test ở Task 2.3._
4. **Nhân viên gọi thẳng API vượt quyền** (NV đơn đọc `cost_price`, NV kho gọi hủy đơn/sửa giá) → bị chặn ở RLS và server. _Test ở Task 1.4 và 4.1._
5. **Tra cứu đơn / checkout với SĐT sai** (thiếu số, có khoảng trắng, +84) và tìm kiếm có ký tự lạ (`%`, `'`, emoji) → chuẩn hóa SĐT, không lỗi trang, không lộ đơn của người khác. _Test ở Task 3.2 và 3.6._

---

## Cấu trúc thư mục dự kiến
```
app/
  (shop)/            trang chủ, danh-muc/[slug], san-pham/[slug], tim-kiem, gio-hang, thanh-toan, don-hang/[code], chinh-sach/[slug]
  admin/             tong-quan, san-pham, san-pham/[id], nhap-excel, danh-muc, thuong-hieu, ton-kho, don-hang, don-hang/[id], nhan-vien, cai-dat
  api/               telegram, (webhook sau này)
components/          shop/ (Header, CategoryMenu, ProductCard, FilterPanel, Rail…) · admin/ · ui/ (shadcn)
lib/
  supabase/          server.ts, browser.ts, admin.ts (service role, chỉ server)
  auth/permissions.ts    can(user, permission)
  money.ts           formatVnd, parseExcelPrice
  pricing.ts         tính tổng đơn, phí ship
  search.ts          normalizeVi (bỏ dấu)
  excel/             parse-dmhh.ts, parse-fan.ts, validate.ts
  images/            illustration-map.ts, compress.ts
supabase/migrations/ SQL từng bước
tests/               unit (Vitest) · e2e (Playwright)
```

## Bảng dữ liệu chính (chi tiết trong migration ở Task 1.3)
`profiles`(role) · `role_permissions`(role, permission, allowed) · `categories`(cây cha-con, icon, thứ tự, `attribute_schema` jsonb) · `brands` · `products`(sku, name, slug, unit, price, `cost_price`, sale_price, sale_from, sale_to, category_id, brand_id, attributes jsonb, warranty, origin, weight_g, need_tags, is_visible, status) · `product_images`(is_illustration) · `inventory`(product_id, qty) · `inventory_movements`(delta, reason, by, order_id) · `orders`(code, khách, SĐT, địa chỉ, cách nhận, thanh toán, subtotal, shipping_fee nullable, total, status, payment_status, cần_đặt_hàng) · `order_items` · `order_events`(nhật ký) · `settings`(thông tin shop, ngân hàng VietQR, phí ship nội thành, ngưỡng miễn phí).
`cost_price` tách ra **view/cột chỉ đọc theo quyền** để NV đơn và khách không bao giờ nhận được.

---

## Sprint 0 — Chuẩn bị (21-22/10) · việc của chủ shop + Mentor
### Task 0.1 — Tài khoản & công cụ
- Trigger: chủ shop tạo tài khoản GitHub, Vercel, Supabase (gói miễn phí); cài Node.js LTS + Git.
- Response: Mentor kiểm tra `node -v`, `git --version`, Supabase MCP thấy được project.
- Error: thiếu quyền/cài lỗi → hướng dẫn từng bước.
- Done: 3 tài khoản có, máy chạy được `node` và `git`.
- Skill: `shop-mentor`.

## Sprint 1 — Nền dự án, database, đăng nhập (22-27/10)
### Task 1.1 — Dựng dự án + giao diện nền
- Trigger: chạy lệnh tạo dự án Next.js + Tailwind + shadcn/ui.
- Response: trang trống có Header/Footer theo mẫu v3, token màu và font từ `DESIGN.md`, chạy ở `localhost:3000`.
- Error: lỗi cài đặt → `superpowers:systematic-debugging`.
- Done: mở được trên máy tính và điện thoại giả lập 375px, đúng màu/font; repo GitHub có commit đầu.
- Skill: `run`, built-in browser.

### Task 1.2 — Kết nối Supabase
- Trigger: tạo project Supabase (region Singapore), điền `.env.local`.
- Response: `lib/supabase/server.ts` và `browser.ts` đọc được 1 bảng thử.
- Error: sai URL/khóa → thông báo rõ; `.env.local` nằm trong `.gitignore`.
- Done: trang thử hiển thị dữ liệu từ Supabase; khóa service role không xuất hiện trong mã phía trình duyệt.
- Skill: Supabase MCP (`get_project_url`, `get_publishable_keys`).

### Task 1.3 — Database + RLS
- Trigger: chạy migration tạo các bảng ở mục "Bảng dữ liệu chính", bật extension `unaccent`.
- Response: bảng có RLS; khách chỉ đọc SP `is_visible = true` (không có `cost_price`); khách chỉ tạo đơn qua hàm server.
- Error: migration lỗi → không áp dụng nửa chừng (mỗi migration là 1 giao dịch).
- Done: `get_advisors` không còn cảnh báo bảo mật; seed 8 danh mục cha + danh mục con (theo menu mẫu v3) + `attribute_schema` cho nhóm Quạt (loại, sải cánh, công suất, số cánh, điều khiển, điện áp).
- Skill: Supabase MCP (`apply_migration`, `list_tables`, `get_advisors`), `data:sql-queries`.

### Task 1.4 — Đăng nhập admin + phân quyền
- Trigger: nhân viên mở `/admin`.
- Response: chưa đăng nhập → trang đăng nhập email + mật khẩu; đã đăng nhập → menu admin chỉ hiện mục được phép.
- Error: sai mật khẩu → "Email hoặc mật khẩu chưa đúng"; tài khoản không có vai trò hoặc bị khóa → chặn, ghi lý do.
- Done: test tự động: NV đơn gọi API đọc `cost_price` → bị từ chối; NV kho gọi API sửa giá → bị từ chối; Chủ shop làm được cả hai. Hàm `can(user, permission)` dùng chung.
- Skill: `superpowers:test-driven-development`, `security-review`.

### Task 1.5 — Phân loại & nạp dữ liệu (Đợt 1, Mentor làm)
- Trigger: có file DMHH, file quạt, file kiểm đếm tồn.
- Response: Mentor xếp ~3.400 mã vào danh mục con + tách thương hiệu từ tên → xuất `phan-loai.xlsx` cho chủ shop duyệt; sau khi duyệt, script nạp vào DB: giá × 1.000, chuẩn hóa đơn vị, slug, thông số quạt, ảnh minh họa theo danh mục con, tồn đầu kỳ.
- Error: dòng chưa duyệt / thiếu giá / SKU trùng → không nạp, liệt kê để chủ shop sửa.
- Done: số mã trong DB khớp file; mỗi mã hiển thị có danh mục, giá > 0, tồn kho thật; script chạy lại được (không tạo trùng).
- Skill: `anthropic-skills:xlsx`, Supabase MCP, `superpowers:test-driven-development` (hàm chuẩn hóa).

## Sprint 2 — Admin sản phẩm, nhập Excel, tồn kho (28/10-3/11)
### Task 2.1 — Danh sách sản phẩm (admin)
- Trigger: mở Admin › Sản phẩm.
- Response: bảng phân trang 50 dòng, tìm theo tên/SKU (không dấu), lọc danh mục/thương hiệu/trạng thái (Ẩn/Hiện, có ảnh/chưa ảnh, thiếu thông tin); cột giá nhập chỉ hiện khi có quyền.
- Error: không có kết quả → trạng thái trống có hướng dẫn.
- Done: 3.575 dòng lọc dưới 1 giây.
- Skill: `taste-skill` (chế độ app screen), `data:sql-queries`.

### Task 2.2 — Form sản phẩm + thông số theo danh mục + giá khuyến mãi
- Trigger: bấm "Thêm"/"Sửa" sản phẩm.
- Response: form theo `DESIGN.md`; đổi danh mục → các ô thông số đổi theo `attribute_schema`; giá khuyến mãi có ngày bắt đầu/kết thúc, tự tính %.
- Error: thiếu tên/giá/danh mục, SKU trùng, giá KM ≥ giá bán → báo ngay dưới ô.
- Done: tạo/sửa quạt có đủ thông số; SP hiện ngay trên storefront khi bật "Hiển thị".
- Skill: `superpowers:test-driven-development` (kiểm tra dữ liệu), `design:ux-copy`.

### Task 2.3 — Nhập Excel (2 mẫu: DMHH và file quạt)
- Trigger: tải file `.xlsx` ở Admin › Nhập Excel.
- Response: tự nhận dạng mẫu; bảng xem trước + lỗi từng dòng; chuẩn hóa đơn vị (`Kg`→`kg`, `Mét`/`m`→`m`); giá × 1.000; SP mới ở trạng thái **Ẩn**; chỉ ghi khi bấm "Xác nhận nhập".
- Error: SKU trống → đề xuất mã tạm; SKU trùng, giá 0, sai định dạng → dòng đỏ, không nhập dòng đó; lỗi giữa chừng → không ghi gì.
- Done: nhập đủ 3.575 mã DMHH + ~183 mã quạt; test tự động với file mẫu có đủ các loại lỗi ở Review Focus #3.
- Skill: `anthropic-skills:xlsx`, `superpowers:test-driven-development`.

### Task 2.4 — ~~AI gợi ý danh mục & thương hiệu~~ (BỎ 2026-10-21, thay bằng Task 1.5)
- Trigger: bấm "Gợi ý phân loại" cho các SP chưa có danh mục.
- Response: gọi Claude API theo lô 100 tên → đề xuất danh mục con + thương hiệu + độ tin cậy; màn hình duyệt hàng loạt (chấp nhận/sửa/bỏ qua).
- Error: API lỗi/hết hạn mức → dừng lô, giữ phần đã xong, báo số còn lại.
- Done: ≥ 95% mã có danh mục sau khi chủ shop duyệt; chi phí ước tính hiển thị trước khi chạy.
- Skill: `claude-api`.

### Task 2.5 — Ảnh sản phẩm + ảnh minh họa
- Trigger: upload ảnh trong form SP, hoặc dán link ảnh được phép dùng.
- Response: tự nén WebP (1000px và 400px), lưu Supabase Storage; SP chưa có ảnh dùng ảnh minh họa theo danh mục con, có nhãn.
- Error: file > 10MB, không phải ảnh → báo lỗi; link hỏng → báo lỗi.
- Done: bộ ảnh minh họa phủ mọi danh mục con đã seed; ảnh thật luôn thay ảnh minh họa.
- Skill: `taste-skill` (vẽ minh họa đồng bộ).

### Task 2.6 — Tồn kho
- Trigger: chủ shop nhập tồn đầu kỳ (Excel hoặc từng món) hoặc điều chỉnh +/−.
- Response: cập nhật `inventory`, ghi `inventory_movements` (ai, khi nào, lý do).
- Error: điều chỉnh làm tồn âm, thiếu lý do → chặn.
- Done: lịch sử tồn từng SP xem được; NV kho chỉ xem.
- Skill: `superpowers:test-driven-development`.

### Task 2.7 — Nhân viên & bảng quyền
- Trigger: chủ shop mời nhân viên bằng email, chọn vai trò, bật/tắt quyền.
- Response: nhân viên nhận email đặt mật khẩu; quyền có hiệu lực ngay.
- Error: email trùng, tự khóa chính mình → chặn.
- Done: đổi công tắc "NV kho được sửa giá" → NV kho sửa được giá mà không cần sửa code.
- Skill: `security-review`.

### Task 2.8 — Quản lý danh mục & thương hiệu
- Trigger: chủ shop mở Admin › Danh mục / Thương hiệu.
- Response: cây danh mục cha-con kéo thả thứ tự, chọn icon, bật/tắt hiển thị, sửa bộ thông số (`attribute_schema`) của từng danh mục; thương hiệu: tên, logo (nếu được phép), số SP.
- Error: xóa danh mục còn SP → chặn, gợi ý chuyển SP sang danh mục khác; tên trùng → báo.
- Done: thêm danh mục con mới → hiện ngay trong menu dọc, bộ lọc và lưới danh mục storefront.
- Skill: `taste-skill` (app screen).

### Task 2.9 — Ảnh thông tin sản phẩm gửi khách (mới, Đợt 1)
- Trigger: bấm nút icon tải ở dòng SP / trang sửa SP, hoặc chọn nhiều SP → "Tải ảnh thông tin".
- Response: server tạo PNG 1080×1080 (hoặc 1080×1350) bằng @vercel/og: ảnh SP (thật/minh họa), tên, thương hiệu, tối đa 6 thông số chọn được, giá/giá KM còn hạn, **ngày giá**, logo, địa chỉ, Zalo; tải 1 ảnh hoặc .zip (JSZip, tên = SKU); nút sao chép để dán Zalo.
- Error: SP chưa có giá → không cho tạo, báo lý do; Clipboard không hỗ trợ → tự tải file.
- Done: ảnh đúng mẫu màn 15 trên canvas; chữ tiếng Việt không lỗi font; 20 SP tải zip < 15 giây.
- Skill: `superpowers:test-driven-development` (dữ liệu ảnh), built-in browser.

### Task 2.10 — Đợt kiểm kho + đếm trên điện thoại (mới, Đợt 1)
- Trigger: chủ shop tạo đợt (theo danh mục/kệ/chọn tay), giao nhân viên; nhân viên mở /admin/kiem-kho trên điện thoại.
- Response: danh sách món cần đếm, tìm không dấu, ô số lớn +/−, "Lưu & món tiếp" (lưu từng món); đếm mù tùy chọn; máy tính xem tiến độ + món lệch; "Chốt đợt" → ghi inventory_movements lý do "Kiểm kho".
- Error: mất mạng → báo chưa lưu, giữ số đã gõ; đợt đã chốt → không sửa được; số âm/lẻ → chặn.
- Done: đếm thử 20 món bằng điện thoại thật, chốt đợt, tồn kho cập nhật đúng; test quyền NV kho chỉ đếm được đợt được giao.
- Skill: `superpowers:test-driven-development`, built-in browser (giả lập điện thoại).

## Sprint 3 — Storefront (4-10/11)
### Task 3.1 — Trang chủ
- Trigger: khách mở trang chủ.
- Response: đúng bố cục mẫu v3, dữ liệu thật từ DB (danh mục + số mặt hàng, giảm giá, tất cả SP, thương hiệu).
- Error: chưa có SP giảm giá → ẩn mục đó.
- Done: Lighthouse mobile ≥ 85 hiệu năng; tải < 2,5 giây trên 4G.
- Skill: `taste-skill`, built-in browser.

### Task 3.2 — Trang danh mục, tìm kiếm, bộ lọc
- Trigger: khách chọn danh mục, gõ tìm, bấm chip lọc.
- Response: bộ lọc như mẫu v3 (danh mục con, thương hiệu, khoảng giá, thông số theo `attribute_schema`, tình trạng) có số đếm; URL giữ trạng thái lọc (chia sẻ được); tìm không dấu.
- Error: không có kết quả → gợi ý bỏ bớt lọc; ký tự lạ trong ô tìm không gây lỗi.
- Done: "quat treo" ra quạt treo tường; lọc Quạt + sải cánh 40cm đúng số lượng.
- Skill: `superpowers:test-driven-development` (`normalizeVi`, đếm facet).

### Task 3.3 — Chi tiết sản phẩm
- Trigger: bấm vào thẻ SP.
- Response: theo `DESIGN.md` §6.3; bảng thông số; "Còn hàng"/"Liên hệ"; nút Zalo.
- Error: SP ẩn/không tồn tại → trang 404 thân thiện.
- Done: metadata SEO + ảnh chia sẻ Zalo/Facebook đúng.
- Skill: `taste-skill`.

### Task 3.4 — Giỏ hàng
- Trigger: "Thêm vào giỏ" / "Đặt trước".
- Response: giỏ lưu trên trình duyệt, sửa số lượng, xóa; giá luôn lấy lại từ server khi mở giỏ.
- Error: SP bị ẩn/đổi giá → báo "Giá đã thay đổi" và cập nhật.
- Done: tắt trình duyệt mở lại vẫn còn giỏ.

### Task 3.5 — Checkout + tạo đơn
- Trigger: bấm "Đặt hàng".
- Response: server kiểm tra lại giá, tồn, phí ship (0₫ / báo sau / theo cài đặt); tạo mã đơn `TTT` + số; gắn cờ "cần đặt hàng" nếu món hết.
- Error: thiếu SĐT/địa chỉ, SĐT sai định dạng, số lượng ≤ 0 → báo dưới ô; lỗi mạng → không tạo đơn trùng (khóa chống bấm 2 lần).
- Done: test tự động Review Focus #1 (sửa giá trong trình duyệt vẫn ra đúng giá DB).
- Skill: `superpowers:test-driven-development`, `security-review`.

### Task 3.6 — Cảm ơn, tra cứu đơn, VietQR
- Trigger: đặt xong / khách nhập mã đơn + SĐT.
- Response: hiện trạng thái đơn; VietQR (số tiền + nội dung = mã đơn) chỉ khi đơn đã có phí ship.
- Error: mã/SĐT không khớp → "Không tìm thấy đơn" (không tiết lộ đơn có tồn tại hay không).
- Done: test SĐT dạng `0905 123 456`, `+84905123456` đều tra được.

### Task 3.7 — Trang chính sách, giới thiệu, SEO
- Trigger: khách mở footer › Chính sách.
- Response: 5 trang chính sách + giới thiệu + địa chỉ cửa hàng; sitemap, robots, tiêu đề/mô tả từng trang.
- Done: `marketing:seo-audit` không còn lỗi đỏ.
- Skill: `marketing:seo-audit`, `design:ux-copy`.

### Task 3.8 — Báo giá số lượng lớn (Đợt 1)
- Trigger: thợ/công trình bấm "Báo giá số lượng lớn" (ở chi tiết SP, giỏ hàng, ô "Công trình, thợ" trên trang chủ).
- Response: form ngắn: tên, SĐT, danh sách món + số lượng (lấy sẵn từ giỏ nếu có), ghi chú → lưu yêu cầu, báo Telegram; nhân viên gọi báo giá riêng.
- Error: thiếu SĐT / SĐT sai → báo dưới ô; gửi trùng trong 1 phút → chặn.
- Done: gửi thử → Telegram nhận trong < 10 giây; yêu cầu xem được trong admin.

## Sprint 4 — Admin đơn hàng, thông báo, kiểm thử, đưa lên mạng (11-17/11)

### Task 4.0 — Admin tối thiểu (Đợt 1)
- Trigger: nhân viên đăng nhập `/admin`.
- Response: **Đơn hàng** (danh sách lọc trạng thái, chi tiết, đổi trạng thái theo PRD §4.2, nhập phí ship, xác nhận đã nhận tiền, xác nhận → trừ tồn, hủy → hoàn tồn) · **Yêu cầu báo giá** · **Sản phẩm** dạng bảng: tìm, sửa giá bán, bật/tắt hiển thị (chỉ Chủ shop sửa).
- Error: như Task 4.1.
- Done: xử lý trọn 1 đơn từ "Chờ xác nhận" đến "Hoàn thành" không cần mở Supabase; test Review Focus #2 và #4.
### Task 4.1 — Quản lý đơn hàng
- Trigger: có đơn mới.
- Response: danh sách lọc theo trạng thái/ngày/cách nhận; chi tiết đơn; đổi trạng thái theo luồng PRD §4.2; **xác nhận → trừ tồn (hàm Postgres có khóa dòng)**; hủy (chỉ người có quyền) → hoàn tồn; NV đơn nhập phí ship, xác nhận đã nhận tiền; ghi `order_events`.
- Error: chuyển trạng thái sai luồng, xác nhận 2 lần, không có quyền hủy → chặn.
- Done: test Review Focus #2 và #4 qua.
- Skill: `superpowers:test-driven-development`, `taste-skill` (app screen).

### Task 4.2 — In phiếu giao hàng
- Trigger: bấm "In phiếu".
- Response: trang in khổ A5/A6: shop, khách, SĐT, địa chỉ, món, tổng tiền, COD.
- Done: in thử ra giấy đọc rõ.

### Task 4.3 — Báo đơn mới qua Telegram
- Trigger: đơn mới được tạo.
- Response: tin nhắn vào nhóm Telegram của shop: mã đơn, tổng, cách nhận, link admin.
- Error: Telegram lỗi → đơn vẫn tạo, ghi log để gửi lại.
- Done: đặt đơn thử → điện thoại chủ shop nhận tin trong < 10 giây.

### Task 4.4 — Cài đặt cửa hàng
- Trigger: chủ shop mở Admin › Cài đặt.
- Response: sửa thông tin shop (SĐT, Zalo, giờ mở cửa, số nhà), tài khoản ngân hàng VietQR, phí ship nội thành + ngưỡng miễn phí (để trống = "báo sau").
- Done: đổi phí ship → checkout dùng ngay mức mới.

### Task 4.5 — Kiểm thử & bảo mật
- Trigger: hoàn tất Sprint 1-4.
- Response: chạy toàn bộ test; test tay theo checklist (mobile/desktop, người lạ vào `/admin`, đọc đơn người khác, ảnh lớn, trạng thái trống/lỗi); hệ thống đèn 🟢🟡🔴.
- Done: không còn 🔴; `security-review` + `get_advisors` sạch.
- Skill: `superpowers:verification-before-completion`, `code-review`, `security-review`, `design:accessibility-review`.

### Task 4.6 — Đưa lên mạng
- Trigger: chủ shop mua tên miền.
- Response: deploy Vercel, gắn tên miền, cấu hình biến môi trường, URL đăng nhập Supabase.
- Done: web chạy trên tên miền, đặt được đơn thật.

## Mở bán thử (18-20/11)
Đặt 3-5 đơn thử với người quen (lấy tại cửa hàng, nội thành, đi tỉnh; COD và VietQR), sửa lỗi, rồi công bố.

---

## Việc của chủ shop (song song, không phải code)
| Việc | Cần trước |
|---|---|
| Tạo tài khoản GitHub, Vercel, Supabase | Task 0.1 |
| Chọn danh sách món bán chạy để ưu tiên ảnh thật | Task 2.5 |
| Gửi ảnh thật (dần dần), xin ảnh từ nhà phân phối | Task 2.5 |
| Gửi file logo gốc (hoặc đồng ý vẽ lại SVG) | Task 1.1 |
| Thông tin liên hệ thật: số nhà, SĐT, Zalo, giờ mở cửa | Task 4.4 |
| Tài khoản ngân hàng nhận VietQR | Task 3.6 |
| Kiểm đếm tồn đầu kỳ (ít nhất các món bán chạy) | Task 2.6 |
| Tạo nhóm Telegram nhận đơn | Task 4.3 |
| Nội dung chính sách đổi trả, bảo hành | Task 3.7 |
| Mua tên miền | Task 4.6 |
| Thông báo website TMĐT với Bộ Công Thương (online.gov.vn) | Sau mở bán, trước khi chạy quảng cáo |
| Chốt phí ship nội thành + ngưỡng miễn phí | Khi tiện (admin tự cài) |

## Ngoài kế hoạch này (P1/P2 — làm sau mở bán)
Dashboard doanh thu, cảnh báo tồn thấp, xuất Excel, mã giảm giá, nhật ký thao tác chi tiết, SP liên quan, bộ lọc theo nhu cầu, **Bán tại quầy (POS)**, PayOS, API vận đơn SPX/GHTK, tài khoản khách, đánh giá SP.
