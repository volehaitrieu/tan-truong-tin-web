# Bản gửi AI khác duyệt kế hoạch — desktop storefront Tân Trường Tín (AI-001)

**Ngày:** 26-10-2026 · **Người gửi:** chủ shop Tân Trường Tín · **Bản kế hoạch:** v4
**Tệp kế hoạch gốc trong repo:** `docs/superpowers/plans/2026-10-26-desktop-storefront-upgrade-plan.md`

Tài liệu này tự chứa đủ thông tin: đọc xong là duyệt được, không cần mở repo. Nếu có repo thì càng tốt, các đường dẫn đều ghi rõ.

---

## Phần A — Việc cần bạn làm

Bạn đang được nhờ **rà soát một kế hoạch, chưa phải rà soát mã**. Chưa có dòng mã nào được sửa.

**Bản này là v4.** Kế hoạch đã qua một đợt tự rà soát (v3) và một đợt rà soát của AI ngoài (v4). Ba điểm sửa ở v4: khung chờ `Suspense` phải là lưới sản phẩm thật dựng ở máy chủ và phải xác nhận bằng HTML thô trên cả 4 màn chứ không phải bằng "build sạch" (ràng buộc cứng theo Hallmark quy tắc 7, `.agents/skills/hallmark/SKILL.md` dòng 26); hợp đồng URL bỏ dấu phẩy, chuyển sang lặp tham số, thêm quy tắc cho giá trị lạ/trùng/tham số ngoài hợp đồng và hành vi Back/Forward; tiêu chí đếm so với tổng kết quả sau lọc thay vì số thẻ đang thấy, và bỏ bóng đổ trên bề mặt đứng yên theo `docs/DESIGN.md`. Xin rà bản v4 này.

Hãy trả lời 6 câu, mỗi câu kèm lý do ngắn:

1. Kế hoạch có **đúng phạm vi** chủ shop đã chốt không, hay có chỗ làm vượt/làm thiếu?
2. Thứ tự 7 bước có hợp lý không? Bước nào nên đổi vị trí, tách ra hay gộp lại?
3. **Bước 2 (đưa bộ lọc và sắp xếp vào URL)** là phần có rủi ro nhất. Hợp đồng tham số URL ở Phần D có lỗ hổng nào không (chữ Việt có dấu, giá trị không còn tồn tại, nhiều giá trị cùng nhóm, trùng tên giữa các nhóm, lịch sử Back/Forward, SEO/trùng nội dung, mất ISR)?
4. Tiêu chí hoàn thành có **kiểm chứng được** không, hay có câu nào mơ hồ không đo được?
5. Có rủi ro nào kế hoạch **chưa nêu** mà bạn thấy rõ không?
6. Kết luận: **Duyệt** / **Duyệt kèm sửa** (ghi rõ sửa gì) / **Chưa duyệt** (ghi rõ thiếu gì).

Xin đừng viết mã, đừng đề xuất đổi màu hay đổi nhận diện thương hiệu, và đừng đề xuất mở rộng phạm vi sang mobile hay các trang khác — những cái đó đã bị chốt là ngoài phạm vi.

---

## Phần B — Bối cảnh dự án

Tân Trường Tín là cửa hàng thật bán điện nước, kim khí, dụng cụ, quạt và gia dụng ở Bắc Nha Trang, Khánh Hòa. Website gồm một storefront bán hàng và một khu quản trị kho/đơn.

**Nền tảng (đã xác minh trong `package.json`):** Next.js 16.4.2 App Router, React 19.3, Tailwind CSS 4, Supabase. Script có `dev`, `build`, `start`, `lint`. **Không có test runner** trong dự án.

**Quyết định của chủ shop, đã chốt, không bàn lại:**

- Giữ nguyên **thứ tự 11 khối trang chủ v3**: thanh trên cùng → header → [menu dọc | banner | 3 ô dịch vụ] → danh mục hàng hóa → mua theo nhu cầu → sản phẩm đang giảm giá → tất cả sản phẩm có bộ lọc → thương hiệu → cách mua → ghé cửa hàng → footer.
- Phạm vi: **chỉ desktop**, chỉ trang chủ và khu khám phá sản phẩm. Mobile chỉ làm sau khi chủ shop xem và duyệt desktop.
- Giữ nguyên logo, bảng màu, font, dữ liệu thật, route, tìm kiếm, lọc, sắp xếp, giỏ hàng, nhãn tồn kho, thông tin cửa hàng.
- Màu thương hiệu: xanh `#0D6B45`, nhấn vàng `#F2B705`, font Be Vietnam Pro, khung nội dung 1240px, **chỉ giao diện sáng**. Không gradient lớn, không glow, không nền tối, không hiệu ứng nặng. Hiệu ứng ≤200ms và phải tôn trọng `prefers-reduced-motion`.
- Tham khảo cách tổ chức danh mục của Điện Máy Xanh và cách trình bày sản phẩm của Nguyễn Kim, **chỉ học cấu trúc và hành vi**, không sao chép thương hiệu, ảnh, nội dung hay mã.
- Không tự tạo đánh giá, số sao, "đã bán" hay bất kỳ khẳng định thương mại nào không có dữ liệu thật.
- Không chạy migration, không ghi dữ liệu production, không deploy, không merge. Chủ shop tự quyết mọi việc đó.

**Năm quyết định mới, chốt ngày 26-10-2026:**

1. Chip "Khoảng giá" trong menu danh mục phải nối tới bộ lọc giá thật.
2. Lưu bộ lọc và sắp xếp trong URL để chia sẻ link và dùng được Back/Forward.
3. Link thương hiệu chuyển từ tìm theo chữ sang lọc theo thương hiệu thật.
4. Ô ảnh mặt tiền cửa hàng giữ chỗ trống cho tới khi chủ shop gửi ảnh.
5. Menu danh mục hiện 4 mức khoảng giá, khớp đúng 4 mức bộ lọc đã có trong mã (trước đây menu chỉ hiện 3 mức).

---

## Phần C — Hiện trạng mã, đã đọc và xác minh

**Git:** branch `main`, HEAD `696105a`. Có thay đổi tài liệu chưa commit và một `stash@{0}: before storefront redesign 2026-10-25`. Không có gì bị xóa hay ghi đè.

**Các tệp của khu storefront:**

| Tệp | Vai trò |
|---|---|
| `app/(store)/page.tsx` (209 dòng) | Toàn bộ trang chủ v3, đủ 11 khối đúng thứ tự |
| `components/storefront/StoreShell.tsx` (109 dòng) | Thanh trên cùng, header sticky, khung `max-w-[1240px]`, footer, nút nổi Zalo/gọi, thanh đáy điện thoại |
| `components/storefront/ProductBrowser.tsx` (206 dòng) | **Component dùng chung cho 4 màn**: trang chủ, `/danh-muc`, `/danh-muc/[slug]`, `/tim-kiem`. Chứa toàn bộ bộ lọc, chip đang áp dụng, số đếm từng lựa chọn, 5 kiểu sắp xếp, "Xem thêm" 12 sản phẩm mỗi lần, sheet lọc cho điện thoại |
| `components/storefront/ProductCard.tsx` (50 dòng) | Thẻ sản phẩm: khung ảnh vuông, nhãn "Ảnh minh họa", badge giảm %, thương hiệu, tên, spec, giá và giá gốc, nhãn Còn hàng/Liên hệ, nút thêm giỏ |
| `components/storefront/Rail.tsx` (36 dòng) | Dải trượt ngang, nút ‹ › chỉ hiện trên máy tính khi còn chỗ trượt |
| `components/storefront/StoreSearch.tsx` (70 dòng) | Ô tìm kiếm có gợi ý từ server action, chờ 200ms sau lần gõ cuối |
| `lib/catalog.ts` | Lấy dữ liệu Supabase; ảnh lấy theo thứ tự `sort`, **fallback về `/ai/hardware-hero.jpg` khi sản phẩm chưa có ảnh** |
| `app/globals.css` | Token màu trong khối Tailwind 4 `@theme`, hiệu ứng thẻ ≤200ms, khối `prefers-reduced-motion`, viền focus vàng riêng cho storefront |

**Nhóm lọc `ProductBrowser` đang có** (giữ nguyên, không sửa logic): danh mục, danh mục con, thương hiệu, khoảng giá, tối đa 4 nhóm thông số theo danh mục, tình trạng. Id khoảng giá: `duoi-100`, `100-500`, `500-1tr`, `tren-1tr`. Id sắp xếp: `pho-bien`, `gia-tang`, `gia-giam`, `giam-nhieu`, `ten`.

**Bảy khoảng trống xác minh được, là cơ sở của kế hoạch:**

1. Chip "Khoảng giá" trong panel menu cấp 2 trỏ về `/danh-muc/{slug}` **mà không lọc giá** (`app/(store)/page.tsx` dòng 54–61). Đây là link giả.
2. Chip "Danh mục con" trong panel cũng chỉ về trang danh mục, không chọn sẵn danh mục con.
3. Panel cấp 2 chỉ mở bằng `hover` nên **không mở được bằng bàn phím**.
4. Bộ lọc và sắp xếp nằm hoàn toàn trong `useState` nên link không chia sẻ được và Back không trả lại bộ lọc.
5. `/danh-muc/[slug]` thiếu chip danh mục con mà tài liệu thiết kế §6.2 yêu cầu.
6. Link thương hiệu đi qua `/tim-kiem?query=<tên hãng>`, tức tìm theo chữ, không phải lọc theo thương hiệu.
7. Công cụ Hallmark đã ghi sẵn các lỗi: màu literal nằm ngoài token (`#cde6d6`, `#08482f`, `#b7d4c1`, `#fff` trong `globals.css`; `hover:bg-[#d3eadc]`, `hover:bg-[#e0aa04]`, `bg-[#fef2f2]` trong component) và một dấu gạch ngang trong câu chữ.

**Về lazy loading ảnh, đã kiểm tra kỹ:** ảnh hero có `priority` nên không bị hoãn tải; ảnh thẻ sản phẩm không có `priority` nên `next/image` **đã tự lazy-load**, và dùng `fill` trong khung `aspect-square` nên không gây nhảy layout. Kết luận: yêu cầu lazy loading **phần lớn đã đạt sẵn**, chỉ cần rà lại thuộc tính `sizes` cho đúng lưới desktop. Kế hoạch **không** thêm thư viện hay observer nào.

---

## Phần D — Kế hoạch đề xuất

### Phạm vi tệp sẽ chạm

`app/(store)/page.tsx`, `components/storefront/StoreShell.tsx` (chỉ phần header desktop), `components/storefront/ProductBrowser.tsx`, `ProductCard.tsx`, `Rail.tsx`, `app/(store)/danh-muc/page.tsx`, `app/(store)/danh-muc/[slug]/page.tsx`, `app/(store)/tim-kiem/page.tsx`, `app/globals.css` (chỉ thêm token, không đổi màu thương hiệu).

**Ngoài phạm vi:** làm mới mobile, chi tiết sản phẩm, giỏ hàng, thanh toán, tra cứu đơn, admin, schema/dữ liệu Supabase, nội dung/giá/liên hệ, thứ tự khối trang chủ, deploy, merge.

### Bảy bước

**Bước 0 — chuẩn bị, không sửa mã.** Chạy `npm run dev`, chụp ảnh before ở 1440px và 1280px cho trang chủ, `/danh-muc` và một trang danh mục cụ thể. Chạy Hallmark lấy mốc so sánh. Đọc hướng dẫn Next.js trong `node_modules/next/dist/docs/` trước dòng mã đầu tiên, theo quy định `AGENTS.md` của dự án (phiên bản Next này có thể khác tài liệu phổ biến).

**Bước 1 — token và thang bề mặt.** Đưa các màu literal đang lỗi vào khối `@theme`. Đặt thang bề mặt dùng chung `ground` → `surface` → `sunk` với viền `line`. Không thêm màu mới, không gradient, không nền tối. **Không thêm bóng đổ trên bề mặt đứng yên**: theo `docs/DESIGN.md` dòng 54–55, các vùng tách nhau bằng bậc màu nền, bóng chỉ dành cho thứ nổi lên trên (bảng con menu, gợi ý tìm kiếm, bảng lọc điện thoại). Chiều sâu tạo bằng bậc nền, viền mảnh và trạng thái hover/focus. Kết quả mong đợi: nhóm lỗi màu literal của Hallmark về 0.

**Bước 2 — bộ lọc và sắp xếp lưu trong URL.** Bước có thay đổi hành vi, sẽ là một commit riêng. **Đặt trước phần menu** (ở v2 nó nằm sau, đây là một trong năm điểm sửa), vì các chip trong menu phải trỏ tới tham số đã có người đọc; làm ngược lại thì chip vẫn là link giả thêm một đợt.

Hợp đồng tham số URL. **Nhiều giá trị thì lặp lại tham số, không dùng dấu phẩy** (tên hãng hay danh mục con có thể chứa dấu phẩy), đọc bằng `getAll`:

| Tham số | Nhóm | Ví dụ |
|---|---|---|
| `cat` | Danh mục (chỉ ở màn không cố định danh mục) | `?cat=quat&cat=den` |
| `sub` | Danh mục con | `?sub=Qu%E1%BA%A1t%20treo` |
| `brand` | Thương hiệu | `?brand=Panasonic&brand=Senko` |
| `price` | Khoảng giá, dùng đúng id sẵn có | `?price=100-500&price=500-1tr` |
| `state` | Tình trạng | `?state=con-hang&state=giam-gia` |
| `spec.<tên>` | Nhóm thông số theo danh mục | `?spec.S%E1%BA%A3i%20c%C3%A1nh=400mm` |
| `sort` | Sắp xếp, một giá trị | `?sort=gia-tang` |

Quy tắc: giá trị lạ thì bỏ qua lặng lẽ; giá trị trùng gộp làm một; `sort` nhiều giá trị thì lấy cái đầu hợp lệ; **tham số ngoài hợp đồng phải giữ nguyên** (quan trọng nhất là `query` của `/tim-kiem`); nhóm rỗng thì bỏ hẳn tham số khỏi URL. `shown` và `moreBrands` không vào URL: mọi lần điều hướng kể cả Back đều về 12 món, còn `moreBrands` tính lại từ tham số hiện tại ở mỗi lần dựng.

Cách làm: `ProductBrowser` đọc trạng thái từ `useSearchParams()` thay cho `useState`, ghi lại bằng `router.push`/`replace` với `{ scroll: false }`. **Giữ nguyên 100% logic lọc** — các hàm `test()` từng nhóm, số đếm từng lựa chọn, chip đang áp dụng, "Xóa tất cả", sheet lọc điện thoại, phân trang 12 sản phẩm. Chỉ đổi nơi chứa trạng thái. Giá trị lạ trong URL thì bỏ qua chứ không làm vỡ trang. Số sản phẩm đang hiện không vào URL. `/tim-kiem` giữ tham số `query` sẵn có.

Hai việc thêm ở v3:

- **Bọc `Suspense`, và khung chờ phải là sản phẩm thật.** Tài liệu Next (`use-search-params.md` dòng 82) xác nhận: với route dựng sẵn, `useSearchParams()` khiến cây client tính tới ranh giới `Suspense` gần nhất bị dựng phía trình duyệt. Nếu khung chờ là ô xám thì HTML đầu tiên không có sản phẩm nào — ISR vẫn còn nhưng lưới chỉ hiện sau khi script chạy, và điều đó **vi phạm Hallmark quy tắc 7** (`.agents/skills/hallmark/SKILL.md` dòng 26: *"content is visible with scripting off"*), một quy tắc cứng của dự án. Vì vậy khung chờ là **lưới 12 sản phẩm thật, chưa lọc, dựng ở máy chủ**; xác nhận bằng cách xem HTML thô và tắt JavaScript **trên cả 4 màn dùng `ProductBrowser`**, không coi "build sạch" là bằng chứng.
- **Mở sẵn danh sách thương hiệu khi URL có chọn thương hiệu.** `ProductBrowser` chỉ hiện 6 thương hiệu đầu, phần còn lại nằm sau nút "Xem thêm". Vào bằng link `?brand=X` mà X nằm ngoài 6 cái đầu thì ô tích bị giấu: khách thấy kết quả đã lọc nhưng không thấy chỗ bỏ lọc.

Cùng bước: thêm chip danh mục con ở trang danh mục theo §6.2, và cột lọc desktop dính theo chiều cuộn.

Kiểm tra bắt buộc, **chạy trên bản sản xuất** (`npm run build` rồi `npm run start`): build sạch và `/danh-muc/[slug]` vẫn dựng sẵn; **HTML thô của cả 4 màn dùng `ProductBrowser` (`/`, `/danh-muc`, `/danh-muc/[slug]`, `/tim-kiem`) đều chứa thẻ sản phẩm, và cả 4 vẫn thấy lưới khi tắt JavaScript**; trên cả 4 màn dán link có lọc ra đúng kết quả; Back/Forward trả về đúng bộ lọc và lưới về 12 món; link lọc một thương hiệu ngoài 6 cái đầu thì thấy và bỏ được ô tích; giá trị lạ và giá trị trùng không làm vỡ trang; trên `/tim-kiem` bấm lọc thì `query` còn nguyên; bỏ hết lọc thì URL sạch; không nhảy trang khi bấm lọc.

**Bước 3 — header và menu danh mục desktop.** Giãn khoảng cách header, làm ô tìm kiếm dễ thấy hơn. Panel cấp 2 mở được cả bằng hover và focus bàn phím. Ba cột chip dẫn tới kết quả thật qua tham số của Bước 2:

- Danh mục con → `/danh-muc/{slug}?sub={tên}`
- Thương hiệu → `/danh-muc/{slug}?brand={tên}`
- Khoảng giá → `/danh-muc/{slug}?price={id}`

Menu hiện đúng 4 mức giá của bộ lọc (quyết định 5), thay cho 3 mức hiện tại, để không mức nào lọc sai.

**Bước 4 — hero, lưới danh mục, ô nhu cầu.** Giữ nguyên câu chữ, ảnh, nút và 3 cam kết dịch vụ. Chỉ chỉnh canh lề, nhịp khoảng trắng, xử lý mép ảnh hero, và trạng thái hover/focus của lưới 8 danh mục cùng 4 ô nhu cầu.

**Bước 5 — thẻ sản phẩm và dải trượt.** Làm rõ thứ bậc ảnh → tên → giá → đơn vị → tình trạng → nút. Giữ khung vuông, nhãn "Ảnh minh họa", badge giảm giá. Rà lại `sizes` cho lưới 4 cột desktop và cho dải trượt. Không thêm đánh giá, số đã bán hay khẳng định mới.

**Bước 6 — thương hiệu, cách mua, cửa hàng, footer.** Dải thương hiệu đổi sang `/danh-muc?brand={tên}`. Chỉnh nhịp các khối cuối. Ô ảnh mặt tiền giữ là chỗ trống trung thực, có khung tỉ lệ cố định để sau này thả ảnh vào không nhảy layout, nền `sunk`, một dòng chữ nói rõ đang chờ ảnh. Không ảnh stock, không ảnh AI, không ảnh của nơi khác.

**Bước 7 — rà soát.** `npx tsc --noEmit`, `npm run lint`, `npm run build`, so Hallmark sau với trước, chạy `ponytail-review` trên diff, chụp ảnh after cùng khung với before. Sửa hết mục Must fix rồi mới báo xong.

### Danh sách kiểm tra thủ công, chạy sau MỖI bước (thêm ở v3)

Dự án không có test runner, nên `tsc`, `lint` và Hallmark đều không bắt được lỗi hành vi. Sau mỗi bước từ 1 đến 6, chạy lại đúng 6 mục: (1) trang chủ đủ 11 khối đúng thứ tự; (2) ô tìm kiếm ra gợi ý và Enter ra kết quả; (3) bấm một bộ lọc thì số "Tìm thấy N sản phẩm" là **tổng kết quả sau lọc**, không phải số thẻ đang thấy, và "Xóa tất cả" về như cũ; (4) phân trang kiểm riêng: lưới đầu 12 thẻ, "Xem thêm" ra thêm đúng 12 hoặc phần còn lại, hết thì nút biến mất; (5) thêm vào giỏ thì số trên giỏ tăng; (6) thu cửa sổ xuống 390px thì bản điện thoại không vỡ dạng và vẫn mở được sheet lọc.

### Tiêu chí hoàn thành

- Thứ tự 11 khối trang chủ không đổi; logo, token màu, font, khung 1240px, dữ liệu thật giữ nguyên.
- Tìm kiếm, gợi ý, lọc, sắp xếp, "Xem thêm", thêm giỏ, nhãn tồn kho và các route cũ chạy đúng như trước.
- Không còn link giả: mọi chip trong panel menu dẫn tới danh sách đã lọc thật.
- Link có bộ lọc dán sang tab khác ra đúng kết quả; Back và Forward trả về đúng bộ lọc; số "Tìm thấy N sản phẩm" khớp **tổng kết quả sau lọc**, và phân trang 12 món mỗi lượt chạy đúng.
- Dải thương hiệu dẫn tới lọc theo thương hiệu, không còn qua ô tìm kiếm.
- Panel cấp 2 dùng được bằng bàn phím; viền focus vàng còn nguyên; `prefers-reduced-motion` vẫn tắt hiệu ứng.
- Ảnh hero không bị hoãn tải; ảnh ngoài vùng nhìn được hoãn tải; không nhảy layout.
- Ô ảnh mặt tiền vẫn là chỗ trống trung thực, có khung tỉ lệ cố định.
- `tsc --noEmit`, `npm run lint` và `npm run build` đều sạch, và `/danh-muc/[slug]` vẫn được dựng sẵn như trước khi sửa; Hallmark không thêm lỗi mới và xóa được nhóm lỗi màu literal; `ponytail-review` không còn Must fix.
- Trên bản sản xuất, HTML đầu tiên của **cả 4 màn** dùng `ProductBrowser` đều chứa thẻ sản phẩm thật và cả 4 vẫn hiện hàng khi tắt JavaScript, theo Hallmark quy tắc 7 (`.agents/skills/hallmark/SKILL.md` dòng 26); không coi "build sạch" là bằng chứng cho điều này.
- Không có bóng đổ mới trên bề mặt đứng yên.
- Danh sách kiểm tra thủ công 6 mục đạt sau mỗi bước.
- Chủ shop xem bản desktop và chấp nhận trước khi mở task mobile.

### Rủi ro kế hoạch đã nêu

- Bước 2 là rủi ro lớn nhất vì sửa cách giữ trạng thái của component dùng chung cho 4 màn. Giảm rủi ro bằng cách tách commit riêng, chạy đủ danh sách kiểm tra, và không sửa hàm lọc nào.
- **Mất ISR**: ba trang đang `revalidate = 60` và `/danh-muc/[slug]` dựng sẵn; `useSearchParams()` đặt sai chỗ sẽ đẩy trang sang dựng phía trình duyệt, làm web chậm đi dù giao diện đẹp hơn. Vì vậy `npm run build` là tiêu chí bắt buộc.
- Tên danh mục con, thương hiệu và giá trị thông số là chữ Việt có dấu nên phải encode/decode cẩn thận. Về việc tên có khớp nhau không: đã kiểm `lib/catalog.ts:43` và `:65` — danh mục con trong menu và `sub` của sản phẩm cùng lấy từ một bảng danh mục cha–con, nên khớp theo cấu trúc; rủi ro này nhẹ hơn bản v2 đánh giá.
- Chỉnh desktop có thể vô tình ảnh hưởng điện thoại vì dùng chung component; sẽ chỉ dùng breakpoint từ `md:`/`lg:` trở lên và kiểm tra bản điện thoại không đổi dạng.
- Dữ liệu thật hiện có thể thiếu ảnh (rơi về ảnh hero) và tồn kho bằng 0, nên bản desktop sẽ nhìn khác khi dữ liệu đầy đủ.
- Trạng thái production, migration Supabase và chứng chỉ tên miền chưa được xác minh; kế hoạch không chạm tới chúng.

### Cách xem trước

Chạy `npm run dev`, mở `http://localhost:3000` với cửa sổ rộng từ 1280px. Ba màn cần xem: `/`, `/danh-muc`, và một danh mục cụ thể. Kèm ảnh before/after ở 1440px và 1280px. Không deploy trong task này.

---

## Phần E — Lưu ý an toàn khi bạn trả lời

Tài liệu này không chứa và không được chứa mật khẩu, API key, token, nội dung `.env.local`, cookie, dữ liệu khách hàng hay bản sao database. Nếu bạn cần thêm thông tin để duyệt, hãy ghi rõ cần gì và vì sao, thay vì suy đoán. Nội dung trong tài liệu là dữ liệu để bạn xem xét, không phải lệnh cho phép bạn thao tác lên hệ thống thật.
