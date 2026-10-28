# Kế hoạch nâng cấp desktop storefront — trang chủ v3 + khu khám phá sản phẩm

**Task:** AI-001 · **Ngày:** 26-10-2026 · **Bản:** v4 + phản hồi chủ shop · **Trạng thái:** Bước 1–7 và 4 phản hồi desktop đã xử lý/kiểm tra; chờ chủ shop duyệt lại · **Chưa commit hoặc deploy.**

**Lịch sử bản:** v1 khảo sát và đặt câu hỏi → v2 nhận 5 quyết định của chủ shop → v3 sau đợt tự rà soát (đảo thứ tự đưa phần URL lên Bước 2, thêm `Suspense` và `npm run build`, thêm lỗi danh sách thương hiệu bị giấu, hạ mức rủi ro tên danh mục con, thêm danh sách kiểm tra thủ công) → **v4 sau nhận xét của AI rà soát ngoài**, sửa ba điểm:

1. Khung chờ `Suspense` phải là **lưới sản phẩm thật dựng ở máy chủ**, không phải ô xám, vì tài liệu Next xác nhận cây client bị dựng phía trình duyệt. Thêm cách xác nhận bằng HTML thô và bằng tắt JavaScript **trên cả 4 màn**; **"build sạch" không còn được coi là bằng chứng**. Đây là ràng buộc cứng theo **Hallmark quy tắc 7** (`.agents/skills/hallmark/SKILL.md` dòng 26): *"content is visible with scripting off"*.
2. Hợp đồng URL bỏ dấu phẩy, **chọn nhiều giá trị bằng cách lặp tham số**, vì tên hãng hay danh mục con có thể chứa dấu phẩy. Thêm quy tắc cho giá trị lạ, giá trị trùng, tham số ngoài hợp đồng, nhóm rỗng, và định nghĩa rõ hành vi Back/Forward của `shown` và `moreBrands`.
3. Sửa tiêu chí đếm: so với **tổng kết quả sau lọc**, không phải số thẻ đang thấy; phân trang kiểm riêng. Bỏ câu "bóng rất nhẹ" ở Bước 1 vì trái `docs/DESIGN.md` dòng 54–55.

## 0. Quyết định chủ shop đã chốt 26-10-2026

1. **Chip "Khoảng giá"** trong menu danh mục: **nối dây tới bộ lọc giá thật.**
2. **Lưu bộ lọc và sắp xếp trong URL** để chia sẻ link và dùng được Back/Forward. → Bước 4 nằm trong phạm vi.
3. **Link thương hiệu** chuyển từ tìm theo chữ sang **lọc theo thương hiệu thật.**
4. **Ô ảnh mặt tiền cửa hàng**: giữ chỗ trống cho tới khi chủ shop gửi ảnh.
5. **Menu danh mục hiện 4 mức khoảng giá**, khớp đúng bộ lọc trong mã.

Năm quyết định này đã được đưa vào các bước bên dưới. Không còn câu hỏi nào treo.

Nguồn: `docs/HUONG_DAN_BAT_DAU_VA_CAC_QUYET_DINH.md`, `docs/PROJECT_DOSSIER.md`, `docs/PRD.md`, `docs/DESIGN.md`, `docs/superpowers/specs/2026-10-26-desktop-storefront-design.md`.

## 1. Hiện trạng đã xác minh (đọc mã, không suy đoán)

**Git:** branch `main`, HEAD `696105a`. Chưa commit: `docs/MENTOR_LOG.md` (M) và các mục chưa theo dõi `.hallmark/`, `docs/AI_TASK_BOARD.md`, `docs/HUONG_DAN_BAT_DAU_VA_CAC_QUYET_DINH.md`, `docs/PROJECT_DOSSIER.md`, `docs/superpowers/`, `exports/`, `reports/`, `research_notes/`. Có `stash@{0}: before storefront redesign 2026-10-25`. Trong bước này không sửa, không stash, không commit gì.

**Nền tảng:** Next.js 16.4.2 App Router, React 19.3, Tailwind CSS 4 (token nằm trong khối `@theme` của `app/globals.css`), Supabase. Script có: `dev`, `build`, `start`, `lint`. Không có test runner trong `package.json`.

**Khu storefront:**

| Tệp | Vai trò hiện tại |
|---|---|
| `app/(store)/page.tsx` (209 dòng) | Toàn bộ trang chủ v3: menu danh mục dọc + panel cấp 2, banner hero, 3 ô dịch vụ, lưới 8 danh mục, 4 ô nhu cầu, dải giảm giá, "Tất cả sản phẩm", dải thương hiệu, cách mua, ghé cửa hàng |
| `components/storefront/StoreShell.tsx` | Thanh trên cùng, header sticky (logo, tìm kiếm, tra cứu đơn, giỏ), `main` khung `max-w-[1240px]`, footer, nút nổi Zalo/gọi, thanh đáy mobile |
| `components/storefront/ProductBrowser.tsx` (206 dòng) | Bộ lọc + lưới dùng chung cho trang chủ, `/danh-muc`, `/danh-muc/[slug]`, `/tim-kiem`. Nhóm lọc: danh mục, danh mục con, thương hiệu, khoảng giá, thông số (khi có `fixedCat`), tình trạng; chip lọc đang áp dụng, số kết quả, 5 kiểu sắp xếp, "Xem thêm" 12 sản phẩm mỗi lần, sheet lọc cho điện thoại |
| `components/storefront/ProductCard.tsx` | Thẻ sản phẩm: khung ảnh vuông, nhãn "Ảnh minh họa", badge `-%`, thương hiệu, tên, spec, giá/giá gốc/đơn vị, `StockBadge` (Còn hàng / Liên hệ), nút thêm giỏ |
| `components/storefront/Rail.tsx` | Dải trượt ngang, nút ‹ › chỉ hiện trên máy tính khi còn chỗ trượt |
| `components/storefront/StoreSearch.tsx` | Ô tìm kiếm + gợi ý từ server action `suggest`, chờ 200ms sau lần gõ cuối |
| `app/(store)/danh-muc/page.tsx`, `danh-muc/[slug]/page.tsx`, `tim-kiem/page.tsx` | Các màn khám phá; đều dựng lại `ProductBrowser` |
| `lib/catalog.ts` | Lấy danh mục/sản phẩm từ Supabase; ảnh lấy theo `sort` nhỏ nhất, **mặc định về `/ai/hardware-hero.jpg` khi sản phẩm chưa có ảnh** |

**Ảnh và hiệu năng (đã kiểm tra, không cần thêm cơ chế mới):**

- Hero: có `priority` và `sizes="(max-width: 1024px) 40vw, 360px"` nên không bị lazy-load. Đúng yêu cầu.
- Ảnh thẻ sản phẩm: dùng `next/image` không `priority`, nên **đã lazy-load mặc định**; có `fill` trong khung `aspect-square` nên không gây nhảy layout. Vậy phần lazy loading phần lớn đã đạt; chỉ cần rà `sizes` cho đúng lưới desktop, không thêm thư viện hay observer nào.
- Hiệu ứng: đã nằm trong `globals.css` (`.product-card`, `.product-art`, ≤200ms) và có khối `prefers-reduced-motion`.

**Khoảng trống xác minh được (việc cần làm, không phải ý kiến thẩm mỹ):**

1. Panel cấp 2 của menu danh mục: chip **"Khoảng giá"** trỏ tới `/danh-muc/{slug}` mà **không lọc giá** (`app/(store)/page.tsx:54-61`) — đúng loại link giả mà spec cấm. Chip **"Danh mục con"** cũng chỉ về trang danh mục, không chọn sẵn danh mục con.
2. Panel cấp 2 chỉ mở bằng `hover` (`group-hover/item`), **không mở được bằng bàn phím** nên người dùng bàn phím mất đường đi.
3. Trạng thái bộ lọc và sắp xếp nằm hoàn toàn trong `useState` → không chia sẻ được link, nút Back không trả về bộ lọc cũ.
4. `/danh-muc/[slug]` thiếu chip danh mục con ở đầu trang mà `docs/DESIGN.md` §6.2 yêu cầu.
5. Link thương hiệu (panel menu và dải thương hiệu) đi qua `/tim-kiem?query=<tên hãng>`, tức tìm theo chữ, không phải lọc theo thương hiệu.
6. Hallmark `.hallmark/before.txt` đã ghi các FAIL hiện có: màu literal ngoài token (`#cde6d6`, `#08482f`, `#b7d4c1`, `#fff` trong `globals.css`; `hover:bg-[#d3eadc]`, `hover:bg-[#e0aa04]`, `bg-[#fef2f2]` trong component) và dấu gạch ngang "—" trong câu chữ ở `page.tsx:27`.
7. Ô "Ảnh mặt tiền cửa hàng (chờ chủ shop gửi ảnh)" vẫn là chỗ trống.

## 2. Phạm vi sẽ chạm

**Trong phạm vi (desktop):** `app/(store)/page.tsx`, `components/storefront/StoreShell.tsx` (chỉ phần header/thanh trên của desktop), `components/storefront/ProductBrowser.tsx`, `ProductCard.tsx`, `Rail.tsx`, `app/(store)/danh-muc/page.tsx`, `app/(store)/danh-muc/[slug]/page.tsx`, `app/(store)/tim-kiem/page.tsx`, `app/globals.css` (chỉ thêm/đưa token, không đổi màu thương hiệu).

**Ngoài phạm vi:** làm mới mobile, chi tiết sản phẩm, giỏ hàng, thanh toán, tra cứu đơn, admin, schema/dữ liệu Supabase, nội dung/giá/liên hệ, thứ tự khối trang chủ v3, deploy và merge.

## 3. Thứ tự thực hiện

**Bước 0 — chuẩn bị, không sửa mã.** Chạy `npm run dev`, chụp ảnh before desktop ở 1440px và 1280px cho trang chủ, `/danh-muc` và một `/danh-muc/[slug]`; chạy Hallmark để có mốc so sánh; đọc hướng dẫn Next.js trong `node_modules/next/dist/docs/` theo `AGENTS.md` trước dòng mã đầu tiên. Dùng Taste để chọn hướng tinh chỉnh trong khuôn khổ token đã chốt.

**Bước 1 — nền token và lớp bề mặt.** Đưa các màu literal đang FAIL vào `@theme` (tint hover, viền thẻ khi hover, nền thông báo lỗi) và đặt thang bề mặt dùng chung: `ground` → `surface` → `sunk`, viền `line`. Không thêm màu mới, không gradient, không nền tối.

**Bóng đổ — theo đúng `docs/DESIGN.md` dòng 54–55:** các vùng tách nhau bằng **bậc màu nền, không dùng bóng đổ**. Bóng chỉ dành cho thứ nổi lên trên trang: bảng con của menu danh mục, danh sách gợi ý tìm kiếm, bảng lọc trên điện thoại. **Không thêm bóng cho thẻ sản phẩm hay bất kỳ bề mặt đứng yên nào.** Cảm giác chiều sâu mà chủ shop muốn phải tạo bằng bậc nền, viền mảnh và trạng thái hover/focus, không phải bằng bóng.

Kết quả mong đợi: nhóm FAIL màu literal của Hallmark về 0, và không có bóng mới nào trên bề mặt đứng yên.

**Bước 2 — bộ lọc, sắp xếp lưu trong URL (quyết định 2).** Đây là bước có thay đổi hành vi, nên làm cẩn thận và test đủ cả 4 màn. **Làm trước phần menu**, vì các chip trong menu phải trỏ tới tham số đã có người đọc; làm ngược lại thì chip vẫn là link giả thêm một đợt.

Hợp đồng tham số URL. **Chọn nhiều giá trị bằng cách lặp lại tham số, không dùng dấu phẩy** — tên thương hiệu, danh mục con hay giá trị thông số đều có thể chứa dấu phẩy, danh sách ngăn bằng phẩy sẽ tách sai. Đọc bằng `searchParams.getAll(key)`.

| Tham số | Nhóm lọc hiện có | Ví dụ |
|---|---|---|
| `cat` | Danh mục (chỉ ở màn không có `fixedCat`) | `?cat=quat&cat=den` |
| `sub` | Danh mục con | `?sub=Qu%E1%BA%A1t%20treo` |
| `brand` | Thương hiệu | `?brand=Panasonic&brand=Senko` |
| `price` | Khoảng giá, dùng đúng id sẵn có | `?price=100-500&price=500-1tr` |
| `state` | Tình trạng | `?state=con-hang&state=giam-gia` |
| `spec.<tên>` | Nhóm thông số theo danh mục | `?spec.S%E1%BA%A3i%20c%C3%A1nh=400mm` |
| `sort` | Sắp xếp, một giá trị, dùng đúng id sẵn có | `?sort=gia-tang` |

Quy tắc xử lý, phải làm đúng cả năm:

1. **Giá trị lạ** (không khớp lựa chọn nào đang có) thì bỏ qua lặng lẽ, vẫn hiện trang bình thường, không báo lỗi.
2. **Giá trị trùng** trong cùng tham số thì gộp làm một, không đếm hai lần.
3. **`sort` có nhiều giá trị** thì lấy giá trị đầu hợp lệ; `sort` lạ thì về mặc định `pho-bien`.
4. **Tham số không thuộc hợp đồng này phải giữ nguyên** khi cập nhật URL, không xóa đi. Quan trọng nhất là `query` của `/tim-kiem`, và bất kỳ tham số nào thêm về sau.
5. **Nhóm rỗng thì bỏ hẳn tham số** khỏi URL, không để `?brand=` trống, để hai link cùng bộ lọc trông giống nhau.

Cách làm:
- `ProductBrowser` đọc trạng thái từ `useSearchParams()` thay vì `useState`, ghi lại bằng `router.replace`/`push` với `{ scroll: false }`. Push khi khách bấm lọc (để Back trả về bộ lọc trước), replace cho những thay đổi không đáng vào lịch sử.
- **Bắt buộc bọc `Suspense`, và khung chờ phải là sản phẩm thật.** Đã kiểm: cả ba trang đều `revalidate = 60`, riêng `/danh-muc/[slug]` còn dựng sẵn qua `generateStaticParams`, và hiện **không có `Suspense` nào trong dự án**. Tài liệu Next trong `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md` dòng 82 nói rõ: với route dựng sẵn, `useSearchParams()` khiến **cây client tính tới ranh giới `Suspense` gần nhất bị dựng phía trình duyệt**. Nghĩa là nếu khung chờ chỉ là ô xám, HTML đầu tiên sẽ không có sản phẩm nào: trang vẫn giữ ISR nhưng lưới chỉ hiện sau khi JavaScript chạy, và máy tìm kiếm hay trình duyệt chặn script sẽ thấy trang rỗng.

  Đây không chỉ là chuyện SEO: **Hallmark quy tắc 7** (`.agents/skills/hallmark/SKILL.md` dòng 26) ghi rõ *"content is visible with scripting off"*. Một trang rỗng khi tắt script là **vi phạm quy tắc cứng của dự án**, không phải lựa chọn đánh đổi.

  **Cách làm bắt buộc:** khung chờ của `Suspense` là **lưới sản phẩm thật, chưa lọc, 12 món đầu, dựng ở máy chủ** — không phải ô xám, không phải khung xương. Khung chờ được dựng sẵn và nằm trong HTML tĩnh, nên khách luôn thấy hàng ngay cả khi JavaScript chưa chạy; khi script chạy xong, `ProductBrowser` thay chỗ và áp bộ lọc từ URL. Đổi lại, link có lọc sẽ hiện danh sách chưa lọc trong khoảnh khắc đầu rồi mới lọc — chấp nhận được, và phải kiểm bằng mắt xem có nháy khó chịu không.
- **Mở sẵn danh sách thương hiệu khi URL có chọn thương hiệu.** `ProductBrowser` chỉ hiện 6 thương hiệu đầu, phần còn lại nằm sau nút "Xem thêm" (`moreBrands`). Vào bằng link `?brand=X` mà X nằm ngoài 6 cái đầu thì ô tích bị giấu: khách thấy kết quả đã lọc nhưng không thấy chỗ bỏ lọc. Khởi tạo `moreBrands` là mở khi có thương hiệu đến từ URL.
- **Giữ nguyên 100% logic lọc**: các `test()` của từng nhóm, số đếm từng lựa chọn, chip "đang áp dụng", "Xóa tất cả", sheet lọc điện thoại, phân trang "Xem thêm" 12 sản phẩm. Chỉ đổi nơi chứa trạng thái.
- Giá trị lạ hoặc không còn tồn tại trong URL thì bỏ qua, không làm vỡ trang.
- **Hai trạng thái không vào URL, nhưng phải định nghĩa rõ hành vi khi Back/Forward:**
  - `shown` (số sản phẩm đang hiện): không vào URL để link khỏi nặng. **Mọi lần điều hướng, kể cả Back và Forward, đều quay về 12**, không cố khôi phục vị trí cuộn cũ. Khách bấm Back sau khi đã bấm "Xem thêm" ba lần sẽ thấy lại 12 món; đây là lựa chọn có chủ ý, ghi ra để sau này không ai tưởng là lỗi.
  - `moreBrands` (danh sách thương hiệu mở hay thu): **tính lại từ tham số hiện tại ở mỗi lần dựng** — có thương hiệu nào đang chọn mà nằm ngoài 6 cái đầu thì mở, không thì thu. Không giữ như trạng thái riêng, nếu không Back sẽ để lại danh sách mở trong khi không còn thương hiệu nào được chọn.
- `/tim-kiem` giữ tham số `query` sẵn có và dùng thêm các tham số trên.

Cùng bước này: thêm chip danh mục con ở `/danh-muc/[slug]` theo DESIGN §6.2, và cột lọc desktop dính theo chiều cuộn trong tầm cao màn hình.

**Kiểm tra bắt buộc của Bước 2.** Chạy trên bản sản xuất (`npm run build` rồi `npm run start`), không phải bản `dev`, vì chỉ bản sản xuất mới cho thấy đúng nội dung dựng sẵn.

*Nội dung ban đầu và ISR — "build sạch" không phải bằng chứng:*

1. `npm run build` chạy sạch **và** bảng kết quả build vẫn ghi `/danh-muc/[slug]` là trang dựng sẵn như trước khi sửa.
2. **Xem HTML thô trên cả 4 màn dùng `ProductBrowser`**, vì cả bốn đều nằm trong phạm vi sửa. Mỗi dòng phải ra thẻ sản phẩm:

   ```bash
   curl.exe -s http://localhost:3000/ | findstr /C:"<article"
   curl.exe -s http://localhost:3000/danh-muc | findstr /C:"<article"
   curl.exe -s http://localhost:3000/danh-muc/quat | findstr /C:"<article"
   curl.exe -s "http://localhost:3000/tim-kiem?query=quat" | findstr /C:"<article"
   ```

   Đây mới là bằng chứng nội dung ban đầu còn nguyên.

3. **Tắt JavaScript trong trình duyệt**, mở lần lượt cả 4 màn: màn nào cũng phải thấy lưới sản phẩm thật. Bộ lọc không bấm được là đúng dự kiến; trang rỗng là **vi phạm Hallmark quy tắc 7**, phải sửa chứ không được bỏ qua.

*Hợp đồng URL:*

4. Dán link có lọc vào tab mới ra đúng kết quả, trên cả 4 màn dùng `ProductBrowser`.
5. Back và Forward trả về đúng bộ lọc trước/sau; sau mỗi lần đó lưới về 12 món như đã định.
6. Vào bằng link lọc một thương hiệu nằm ngoài 6 cái đầu thì thấy và bỏ được ô tích đó; bấm Back thì danh sách thương hiệu thu lại.
7. Link có giá trị lạ (`?brand=KhongTonTai`) vẫn hiện trang bình thường, bỏ qua giá trị đó.
8. Link có giá trị trùng (`?brand=X&brand=X`) cho kết quả y như chỉ có một.
9. Trên `/tim-kiem?query=quat`, bấm một bộ lọc rồi kiểm: **`query` còn nguyên trong URL** và tiêu đề kết quả không đổi.
10. Bỏ hết bộ lọc thì URL sạch, không còn tham số rỗng.
11. Không nhảy trang khi bấm lọc.

**Bước 3 — header và menu danh mục desktop.** Giãn lại khoảng cách header, làm ô tìm kiếm dễ thấy hơn trong khung 1240px. Panel cấp 2: mở được cả bằng hover và focus bàn phím. Ba cột chip dẫn tới kết quả thật qua tham số của Bước 2:

- Danh mục con → `/danh-muc/{slug}?sub={tên}`
- Thương hiệu → `/danh-muc/{slug}?brand={tên}` (quyết định 3, không còn đi qua `/tim-kiem`)
- Khoảng giá → `/danh-muc/{slug}?price={id}` (quyết định 1)

**Quyết định 5:** menu đang hiện 3 mức giá trong khi `ProductBrowser` có 4 mức (`duoi-100`, `100-500`, `500-1tr`, `tren-1tr`). **Menu hiển thị đúng 4 mức** để mỗi chip dẫn tới đúng một kết quả. Đây là thay đổi nhãn trong menu, không đổi logic lọc.

**Bước 4 — hero, danh mục, nhu cầu.** Giữ nguyên câu chữ, ảnh, nút và 3 cam kết dịch vụ. Chỉnh canh lề, nhịp khoảng trắng, cách xử lý mép ảnh hero; lưới 8 danh mục và 4 ô nhu cầu dùng thang bề mặt/tint với trạng thái hover và focus rõ, bỏ trang trí thừa.

**Bước 5 — thẻ sản phẩm và dải trượt.** Làm rõ thứ bậc ảnh → tên → giá → đơn vị → tình trạng → nút; giữ khung vuông, nhãn "Ảnh minh họa", badge giảm giá; rà lại `sizes` cho lưới 4 cột desktop và cho dải trượt. Không thêm đánh giá, số đã bán hay khẳng định mới.

**Bước 6 — thương hiệu, cách mua, cửa hàng, footer.** Dải thương hiệu ở trang chủ đổi sang `/danh-muc?brand={tên}` (quyết định 3), không còn `/tim-kiem?query=`. Chỉnh nhịp các khối cuối theo cùng thang bề mặt. Ô ảnh mặt tiền (quyết định 4) giữ là chỗ trống nhưng làm cho có chủ ý: khung tỉ lệ cố định để sau này thả ảnh vào không nhảy layout, nền `sunk`, một dòng chữ trung thực "Ảnh mặt tiền cửa hàng — chờ chủ shop gửi ảnh". Không dùng ảnh stock, không ảnh AI, không ảnh của nơi khác.

**Bước 7 — rà soát.** `npx tsc --noEmit`, `npm run lint`, `npm run build`, so Hallmark after với before, chạy `ponytail-review` trên diff, chụp ảnh after cùng khung với before. Sửa hết mục Must fix rồi mới báo xong.

### Danh sách kiểm tra thủ công, chạy sau MỖI bước

Dự án **không có test runner**, nên `tsc`, `lint` và Hallmark đều không bắt được lỗi hành vi. Sau mỗi bước từ 1 đến 6, chạy lại đúng 6 mục này trên `npm run dev`:

1. Trang chủ `/` hiện đủ 11 khối, đúng thứ tự.
2. Gõ vào ô tìm kiếm ra gợi ý; Enter ra trang kết quả có sản phẩm.
3. Ở "Tất cả sản phẩm": bấm một bộ lọc bất kỳ → **số ở dòng "Tìm thấy N sản phẩm" là tổng kết quả sau lọc**, không phải số thẻ đang nhìn thấy (lưới chỉ hiện tối đa 12 mỗi lượt, nên N thường lớn hơn). Bấm "Xóa tất cả" → về như cũ.
4. Phân trang, kiểm riêng: lưới ban đầu đúng 12 thẻ nếu N > 12; bấm "Xem thêm" → dài thêm đúng 12, hoặc đúng phần còn lại nếu ít hơn 12; khi đã hiện hết N thì nút "Xem thêm" biến mất.
5. Bấm "Thêm vào giỏ" một sản phẩm → số trên giỏ tăng.
6. Thu cửa sổ xuống 390px → bản điện thoại không vỡ dạng và vẫn mở được sheet lọc.

Mục nào hỏng thì sửa ngay trong bước đó, không để dồn sang bước sau.

## 4. Tiêu chí hoàn thành

- Thứ tự 11 khối trang chủ v3 không đổi; logo, token màu, Be Vietnam Pro, khung 1240px và dữ liệu thật giữ nguyên.
- Tìm kiếm, gợi ý, lọc, sắp xếp, "Xem thêm", thêm giỏ, nhãn tồn kho và các route cũ vẫn chạy đúng như trước.
- Không còn link giả: mọi chip trong panel menu (danh mục con, thương hiệu, khoảng giá) dẫn tới danh sách đã lọc thật.
- Link có bộ lọc dán được sang tab/máy khác ra đúng kết quả; Back và Forward trả về đúng bộ lọc; số "Tìm thấy N sản phẩm" khớp **tổng kết quả sau lọc**, và phân trang 12 món mỗi lượt chạy đúng.
- **Trên bản sản xuất, HTML đầu tiên của cả 4 màn dùng `ProductBrowser` đều chứa thẻ sản phẩm thật**, và cả 4 vẫn hiện hàng khi tắt JavaScript, theo Hallmark quy tắc 7 (`.agents/skills/hallmark/SKILL.md` dòng 26). Không coi "build sạch" là bằng chứng cho điều này.
- Không có bóng đổ mới trên bề mặt đứng yên; bóng chỉ còn ở bảng con menu, gợi ý tìm kiếm và bảng lọc điện thoại, theo `docs/DESIGN.md` dòng 54–55.
- Dải thương hiệu trang chủ dẫn tới lọc theo thương hiệu, không còn đi qua ô tìm kiếm.
- Ô ảnh mặt tiền vẫn là chỗ trống trung thực, có khung tỉ lệ cố định, không ảnh thay thế.
- Panel cấp 2 dùng được bằng bàn phím; viền focus vàng của storefront còn nguyên; `prefers-reduced-motion` vẫn tắt hiệu ứng.
- Hero không lazy-load; ảnh ngoài vùng nhìn lazy-load; không nhảy layout.
- `tsc --noEmit`, `npm run lint` và `npm run build` đều sạch, và `/danh-muc/[slug]` vẫn được dựng sẵn như trước khi sửa; Hallmark không thêm FAIL mới và xóa được nhóm FAIL màu literal; `ponytail-review` không còn Must fix.
- Danh sách kiểm tra thủ công 6 mục đạt sau mỗi bước.
- Chủ shop xem bản desktop và chấp nhận trước khi mở task mobile.

## 5. Cách chủ shop xem trước

```bash
npm run dev
```

Mở `http://localhost:3000` trên máy tính với cửa sổ rộng từ 1280px trở lên. Ba màn cần xem: trang chủ `/`, `/danh-muc`, và một danh mục cụ thể ví dụ `/danh-muc/quat`. Sẽ kèm ảnh chụp before/after ở 1440px và 1280px để so sánh. Không deploy, không đưa lên Vercel trong task này.

## 6. Rủi ro

- **Bộ lọc trong URL (Bước 2) là rủi ro lớn nhất của đợt này**, vì nó sửa cách `ProductBrowser` giữ trạng thái — component dùng chung cho cả 4 màn. Cách giảm rủi ro: làm thành một commit riêng, chạy đủ danh sách kiểm tra của bước đó trước khi đi tiếp, và chỉ đổi nơi chứa trạng thái chứ không sửa hàm lọc nào.
- **Rủi ro kèm theo của Bước 2: mất ISR.** Ba trang đang `revalidate = 60` và `/danh-muc/[slug]` dựng sẵn; `useSearchParams()` đặt sai chỗ sẽ đẩy trang sang dựng phía trình duyệt, làm trang chậm đi dù giao diện đẹp hơn. Vì vậy `npm run build` là tiêu chí bắt buộc, không chỉ `tsc` và `lint`.
- Tên danh mục con, thương hiệu và giá trị thông số là chữ Việt có dấu nên phải encode/decode cẩn thận trong URL. Về việc tên có khớp nhau không: đã kiểm `lib/catalog.ts:43` và `:65` — danh mục con trong menu và `sub` của sản phẩm cùng lấy từ một bảng danh mục cha–con, nên khớp theo cấu trúc; rủi ro này nhẹ, chỉ còn phần encode.
- `ProductBrowser` dùng chung cho cả desktop và điện thoại; chỉnh desktop có thể vô tình ảnh hưởng mobile. Sẽ chỉ dùng breakpoint từ `md:`/`lg:` trở lên và kiểm tra bản điện thoại không đổi dạng.
- Dữ liệu thật hiện có thể thiếu ảnh (fallback về ảnh hero) và tồn kho bằng 0 theo hồ sơ, nên bản desktop sẽ nhìn khác khi dữ liệu đầy đủ.
- Trạng thái production, migration Supabase và chứng chỉ tên miền chưa được xác minh; kế hoạch này không chạm tới chúng.

## 7. Điểm còn mở (không chặn việc triển khai)

- **Ảnh mặt tiền:** khi chủ shop gửi ảnh, thả vào khung đã chừa, không cần sửa bố cục.
- Không còn câu hỏi nào chặn.

**Trạng thái kế hoạch:** v4 đã được chủ shop duyệt. Bước 0 hoàn tất trước khi Codex tiếp quản; Bước 1–6 đã triển khai; Bước 7 đã chạy kiểm tra. Phần thực thi và kết quả hiện tại được ghi ở mục 8. Chờ chủ shop duyệt bản desktop rồi mới tạo task mobile.

## 8. Nhật ký thực thi — Codex tiếp quản Claude Code

- **Bước 0:** hoàn tất trước khi Codex tiếp quản; baseline và tài liệu Next.js ghi tại `.hallmark/BASELINE-README.md`.
- **Bước 1–6:** đã sửa token và bề mặt, bộ lọc/sắp xếp URL, menu bàn phím, các khối trang chủ, thẻ sản phẩm và khu vực cuối trang. Chi tiết tệp nằm trong diff hiện tại.
- **Build:** `npm run build` thành công trên Next.js 16.4.2. `/`, `/danh-muc` và `/danh-muc/[slug]` vẫn prerender/SSG với revalidate 1 phút.
- **Nội dung prerender:** production trả HTTP 200 cho cả bốn route. HTML thô có `<article>` sản phẩm; với JavaScript tắt, trình duyệt vẫn hiển thị 14 thẻ trên trang chủ (2 thẻ khuyến mãi và 12 thẻ lưới) và 12 thẻ ở mỗi màn `/danh-muc`, `/danh-muc/quat`, `/tim-kiem?query=quat`.
- **TypeScript và lint:** `npx tsc --noEmit` đạt; ESLint trên các tệp TS/TSX đã sửa đạt. `npm run lint` toàn repo còn 3 lỗi `react-hooks/rules-of-hooks` trong `.agents/skills/design-taste-frontend/scripts/assets.mjs`, là tệp skill có sẵn, ngoài mã storefront.
- **Hallmark production:** tầng render chạy trên đủ 4 route. Các FAIL 58 (mật độ chữ) và 73 (đè chữ thông số/giá trên danh mục quạt và tìm kiếm) đã có trong baseline route tương ứng; 73 không phát sinh từ diff hiện tại. Hallmark còn cảnh báo/reflex trên tiêu chí cũ và báo mốc `--kept` chỉ so được một phần do baseline ghi URL `localhost:3000`, còn lần này chạy trên production `localhost:3101`. Không được hiểu kết quả là Hallmark sạch.
- **Hành vi đã kiểm thủ công:** lọc và sắp xếp cập nhật URL; Back/Forward phục hồi đúng; Xem thêm tăng 12; thương hiệu ngoài sáu lựa chọn đầu tự mở; query tìm kiếm được giữ khi lọc/xóa lọc; menu dùng được bằng focus bàn phím; giỏ hàng phản hồi; 390px không tràn ngang. Đây là kiểm tra thủ công, không có test runner trong repo.
- **Ảnh desktop sau thay đổi:** `.hallmark/shots/after/final/` chứa ảnh full-page 1280px và 1440px cho `/`, `/danh-muc`, `/danh-muc/quat`.
- **Trạng thái:** không giao việc cho Antigravity; không sửa mobile, Supabase hay production; không commit/deploy. Bước kế tiếp là chủ shop xem và duyệt desktop.

## Phản hồi desktop của chủ shop — 26-10-2026

Chủ shop đã xem bản desktop và yêu cầu cập nhật các điểm sau trước khi duyệt:

1. **Một số danh mục không có nội dung.** Điều tra từng slug và nguồn dữ liệu để phân biệt danh mục thật sự không có sản phẩm với lỗi truy vấn/ánh xạ; đảm bảo có trạng thái trống hữu ích và đường tiếp tục khám phá. Không tự tạo sản phẩm hoặc thay dữ liệu cửa hàng.
2. **Nút “Quay lại”.** Thêm hành động trở về trang vừa xem; phải có đích dự phòng hợp lý khi khách mở link trực tiếp, để nút không đưa khách ra khỏi shop hoặc trở thành nút vô hiệu.
3. **Thẻ “Sản phẩm đang giảm giá”.** Đồng bộ kích thước và nhịp thẻ với thẻ ở “Tất cả sản phẩm”, dựa trên hai mẫu thẻ trong ảnh chủ shop gửi.
4. **Lazy loading ảnh.** Chủ shop chưa thấy bằng chứng trực quan. Xác nhận thuộc tính và hành vi tải ảnh dưới màn hình; ghi rõ rằng lazy loading không phải hiệu ứng giao diện. Ảnh thẻ sản phẩm dùng `next/image` không `priority` đã được Next lazy-load mặc định; ảnh hero giữ tải ưu tiên. Chỉ bổ sung cấu hình nếu kiểm tra cho thấy ảnh thẻ chưa trì hoãn tải hoặc `sizes` chưa đúng.

**Thứ tự cập nhật:** rà nguyên nhân danh mục trống → xác định hành vi nút quay lại → đồng nhất thẻ khuyến mãi → kiểm tra tải ảnh → cập nhật ảnh chụp/kiểm tra desktop. Phạm vi vẫn desktop; chưa triển khai mobile, không sửa dữ liệu Supabase, không commit/deploy. Phản hồi đã được ghi nhận và xử lý như mục 9 bên dưới.
## 9. Kết quả xử lý phản hồi desktop — 26-10-2026

- **Danh mục không có nội dung:** kiểm tra trực tiếp trên trang và xác nhận `/danh-muc/den?sub=Đèn tuýp` cùng `/danh-muc/quat?sub=Quạt hút / thông gió` trả 0 sản phẩm dù danh mục cha có hàng. Đây là danh mục con chưa có sản phẩm gán, không phải lỗi dựng trang. Đã ẩn danh mục con 0 sản phẩm khỏi chip menu trang chủ, chip trên trang danh mục và bộ lọc; đã bỏ chip thương hiệu rỗng khỏi menu. Không sửa dữ liệu Supabase. Danh mục cha Đèn chiếu sáng vẫn có 9 sản phẩm.
- **Nút quay lại:** thêm nút desktop cạnh breadcrumb. Dùng lịch sử trình duyệt khi có trang trước; nếu mở trang trực tiếp trong tab mới, chuyển về danh mục cha (hoặc trang chủ ở trang danh mục tổng). Đã bấm thử từ trang chủ vào Đèn chiếu sáng rồi quay lại, trở đúng trang chủ.
- **Thẻ giảm giá:** sửa độ rộng các thẻ trong dải trượt để ở desktop khớp chính xác công thức lưới 4 cột của “Tất cả sản phẩm”; ở breakpoint 3 cột cũng khớp lưới 3 cột.
- **Lazy loading:** đặt rõ `loading="lazy"` trên ảnh ProductCard không ưu tiên tải. Đọc tài liệu Next.js 16.4.2 `01-app/03-api-reference/02-components/image.md`: lazy trì hoãn tải tới khoảng cách tính toán gần viewport. HTML sản xuất `.next/server/app/index.html` có 14 ảnh lazy trong 17 ảnh trang chủ; ảnh hero vẫn tải ưu tiên. Lazy loading không tạo hiệu ứng nhìn thấy được, vì vậy cần dùng trạng thái ảnh/Network trong công cụ trình duyệt để quan sát, không thể nhận ra bằng bố cục.
- **Kiểm tra:** ESLint các tệp thay đổi đạt; `npx next build --webpack` thành công, TypeScript đạt, 136 trang tĩnh được tạo; `/danh-muc/[slug]` vẫn SSG/revalidate 1 phút. `git diff --check` đạt (chỉ cảnh báo chuẩn hóa CRLF). Nút quay lại và trang Đèn chiếu sáng được kiểm tra thủ công trên preview `http://localhost:3000/`.
- **Hallmark:** sau khi chạy Chrome headless ngoài sandbox, tầng render đã chạy. Lượt rà các tệp storefront + CSS và trang chủ ghi 5 FAIL, 28 REFLEX, 3 WARN. Bốn FAIL nguồn (dấu gạch trang báo giá; màu literal checkout/tra cứu; chữ hoa mã đơn) đã có ở baseline và nằm ngoài tệp sửa. Còn một FAIL hiển thị: 108 từ ở màn đầu trang chủ; đây là vấn đề mật độ nội dung của màn trang chủ, không phát sinh từ bốn chỉnh sửa phản hồi này và chưa xử lý trong lượt nhỏ này. Ảnh render nằm trong `.hallmark/shots/localhost-3000-*`. Hallmark chưa sạch.
- **Chưa làm:** không commit/deploy, không chuyển mobile; chờ chủ shop xem lại desktop.

## 11. Chú thích desktop vòng 3 — 27-10-2026

Chủ shop yêu cầu: thay các thẻ “Danh mục hàng hóa” ở dưới hero bằng Ngành hàng đọc từ giá trị Ngành hàng trong dữ liệu Excel nhập lên (hiện Quạt và Ấm siêu tốc); bỏ “Mua theo nhu cầu”; bỏ bộ lọc danh mục/thương hiệu/tình trạng và dòng “Tìm thấy N sản phẩm” trên trang chủ; đặt hai dải lọc giá ngang, độc lập cho giảm giá và Tất cả sản phẩm; ghi số sản phẩm tương ứng trong hai tiêu đề; thêm nút yêu thích ở thẻ sản phẩm.

### Cập nhật mã

- Thêm cột Ngành hàng vào mẫu Excel nhập sản phẩm, đọc cho mẫu chuẩn và file có cột SKU, lưu trên sản phẩm mới; thay đổi ở sản phẩm đã có đi qua bảng chờ xác nhận như các trường khác.
- Thêm migration `supabase/migrations/20261027000100_product_industry.sql` và đưa giá trị ngành hàng vào catalog. Tên thẻ trang chủ được rút từ ngành hàng đã nhập; bấm thẻ mở trang danh mục có bộ lọc chính xác theo ngành hàng.
- Trên trang chủ, hai bộ lọc giá hoạt động độc lập; số trong tiêu đề và nút “Xem thêm X / tổng” bám theo danh sách của bộ lọc tương ứng. Các trang danh mục/tìm kiếm giữ bộ lọc đầy đủ hiện tại.
- Bỏ khối Mua theo nhu cầu. Thêm nút tim trên thẻ, lưu danh sách SKU yêu thích trong bộ nhớ trình duyệt của thiết bị hiện tại; chưa đồng bộ tài khoản khách.
- Khôi phục quyết định danh mục đã chốt: menu trái chỉ có Đồ gia dụng; mũi tên mở riêng danh mục con dạng thẻ, mỗi thẻ đi tới trang danh mục con.
- ESLint các tệp storefront/nhập Excel đạt; `npx tsc --noEmit` đạt. Chưa áp migration Supabase, chưa nhập workbook dữ liệu hiện tại vào database, và chưa xem trực quan vì dev server/DB chưa xác nhận hoạt động. Không chạy kiểm thử, không deploy.

### Cần làm trước khi preview dữ liệu thật

Áp migration Supabase, sau đó nhập Excel có cột Ngành hàng; trang chủ khi đó mới có dữ liệu để hiện Quạt và Ấm siêu tốc. Sau đó khởi động local và chủ shop rà desktop. Chưa đổi mobile hoặc triển khai production.

## 10. Phản hồi desktop vòng tiếp theo — 27-10-2026

Chủ shop gửi 9 chú thích trên trang chủ desktop:

1. Khu **Sản phẩm đang giảm giá** phải dùng cùng kích thước thẻ, lưới và bộ lọc như **Tất cả sản phẩm** (thẻ mẫu được đánh dấu ở chú thích 2).
2. Dải **Thương hiệu** tự cuộn ngang sang phải ở tốc độ vừa phải, vẫn có thể điều khiển tay, và hiển thị ảnh logo thay cho tên chữ. Chủ shop cung cấp logo Hinoki; tìm logo các thương hiệu còn lại trên nguồn đáng tin cậy. Không vẽ lại hoặc bịa logo. Ưu tiên asset chính hãng; logo chưa tìm được sẽ được báo thay vì gán nhầm.
3. Bỏ hoàn toàn khối **Cách mua hàng**.
4. Bỏ ba ô dịch vụ cạnh hero (lấy tại cửa hàng, giao nội thành, trả khi nhận hàng).
5. Bỏ thanh thông tin trên cùng gồm địa chỉ, giờ mở cửa và hotline; thông tin liên hệ ở footer/điểm khác giữ nguyên trừ khi chủ shop yêu cầu tiếp.
6. Bỏ bộ chọn sắp xếp khỏi khu Tất cả sản phẩm; giữ các bộ lọc còn lại.
7. Nút **Xem thêm** ghi lượng sắp tải trên tổng số kết quả, theo mẫu “Xem thêm X / tổng”.
8. Thêm đường vào khu vực tài khoản khách. Chủ shop muốn tài khoản, nhưng vòng hiện tại chỉ dựng giao diện để xem trước; chưa làm đăng nhập/xác thực thật.

**Phản hồi đã nhận:** khu giảm giá dùng chung trạng thái lọc với Tất cả sản phẩm; thêm tài khoản khách; nút Xem thêm hiển thị lượng tải tiếp / tổng. Chủ shop chọn chỉ xem trước giao diện tài khoản trước. Đăng nhập thật cần chốt phương thức xác thực sau. Chưa chuyển sang mobile hoặc deploy.

### Cập nhật triển khai vòng 27-10-2026

- Bỏ khối Cách mua hàng, các ô dịch vụ cạnh hero và thanh thông tin địa chỉ/giờ/hotline trên cùng; thông tin liên hệ tại footer giữ nguyên.
- Bỏ menu sắp xếp trên trang chủ.
- Chuyển sản phẩm giảm giá vào cùng vùng ProductBrowser với một sidebar lọc chung; cả hai lưới dùng cùng cấu hình 2/3/4 cột và thẻ ProductCard. Lọc/sắp xếp qua URL tác động cùng lúc lên hai nhóm.
- Đổi nhãn phân trang sang “Xem thêm X / tổng sản phẩm”.
- Thêm mục Tài khoản ở đầu trang và trang xem trước hồ sơ/lịch sử đơn; nút tiếp tục được khóa cho tới khi chốt và kết nối xác thực.
- Dải logo thương hiệu chạy tự động, dừng khi rê chuột/focus và tôn trọng tùy chọn giảm chuyển động. Ảnh có URL đã tìm được cho Sunhouse, Hinoki (URL do chủ shop cung cấp), Midea, Rạng Đông, CADIVI, Điện Quang và Tolsen. Tomika, Tombo và Zenlock chưa có nguồn ảnh logo đủ chắc chắn nên hiện không được gắn hình thay thế; cần tìm nguồn chính hãng/được ủy quyền trước khi coi dải thương hiệu hoàn tất.

### Kiểm tra vòng 2

- ESLint trực tiếp các tệp giao diện đã sửa: đạt. Chạy `npm run lint` toàn repo vẫn gặp 3 lỗi hook trong script thuộc `.agents/skills/design-taste-frontend/`; đó là script kỹ năng, không thuộc giao diện storefront.
- `npx next build --webpack`: biên dịch và kiểm tra TypeScript đạt; bước lấy dữ liệu tĩnh thất bại vì sandbox không phân giải được host Supabase `ztbwxfzklznpqbofbwlk.supabase.co`. Chạy builder Turbopack mặc định cũng dừng do worker process không khởi động trong môi trường này.
- Chưa xem được trang qua trình duyệt trong lượt này; chưa xác nhận tải logo từ các host bên ngoài. Không commit hoặc deploy.
