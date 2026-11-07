# Cột Phân loại + Xuất Excel chọn cột — 3. Bàn giao Codex (07/11/2026)

Đọc trước: `1_THIET_KE.md` (cùng thư mục, đã duyệt). Chủ shop chọn **Mẫu C** (bảng chọn cột theo nhóm + mẫu nhanh) và **Mẫu 2** (hàng chip Phân loại trên danh sách + nhóm trong bảng Lọc).
Nhánh: `worktree-website-v2` (đã gộp `feature/nhap-excel-ton-kho`, commit a0a84e6). Đọc `AGENTS.md` + `node_modules/next/dist/docs/` trước khi viết Next.js.

## A. Nhập Excel đọc cột "Phân loại"
Tệp: `lib/excel/parse-products.ts`, `app/admin/(shell)/nhap-excel/actions.ts`, `ImportClient.tsx`/`ReviewTable.tsx` nếu cần hiện cột.
1. `TEMPLATE_COLUMNS`: thêm `"Phân loại"` ngay sau `"Danh mục con"`. Mẫu chuẩn đọc vào trường mới `classification: string | null` (cắt 80 ký tự). Mẫu DMHH / file quạt cũ: để `null`.
2. Kiểm dòng (`finish`): có Phân loại mà không xác định được Danh mục con (sub null hoặc sub là danh mục gốc) → lỗi dòng tiếng Việt: "Có Phân loại thì phải có Danh mục con."
3. Server `importProducts`: tải `categories` kèm `parent_id`. Với mỗi cặp (Danh mục con, Phân loại) khác nhau trong các dòng hợp lệ:
   - Tìm danh mục có `parent_id = id Danh mục con` và `plain(name)` trùng → dùng.
   - Không có → **tạo mới** `{ parent_id, name, slug }`; `slug = slugify(subSlug + "-" + name)`, trùng thì thêm `-2`, `-3`… (cột slug unique toàn bảng). RLS `categories_write` cần quyền `edit_products`: lỗi quyền → trả lỗi "Bạn chưa có quyền tạo Phân loại mới (cần quyền sửa sản phẩm)." và không nhập lần đó. **Không dùng service-role.**
4. SP mới: `category_id` = id Phân loại nếu có, không thì Danh mục con như cũ.
5. SP đã có (so sánh `category`):
   - Có Phân loại → giá trị đích = Phân loại; `new_value` ghi dạng đường dẫn `"Quạt > Quạt treo tường"`; `old_value` cũng dạng đường dẫn nếu SP đang ở cấp Phân loại.
   - **Ô Phân loại trống** + SP đang ở một Phân loại **thuộc đúng Danh mục con đó** → coi như không đổi (giữ nguyên). Khác Danh mục con → đề xuất đổi như cũ.
6. `applyChanges` field `category`: `new_value` có `" > "` → tìm theo (tên cha, tên con); không có → tìm theo tên như cũ. Không tìm thấy → không ghi, báo lỗi SP đó.
7. Nhật ký `logEvent` kết quả thêm số Phân loại đã tạo (`classificationsCreated`); kết quả hiển thị cho chủ shop: "Đã tạo N Phân loại mới" khi N > 0.

## B. File mẫu + hướng dẫn
Nơi tạo file mẫu (tìm "Hướng dẫn" / `TEMPLATE_SHEET` trong `ImportClient.tsx` hoặc lib): thêm cột Phân loại sau Danh mục con; sheet Hướng dẫn thêm dòng: "Phân loại: nhóm nhỏ trong Danh mục con (vd. Quạt treo tường). Chưa có sẽ tự tạo. Để trống = giữ nguyên." Dòng ví dụ trong mẫu có Phân loại.

## C. Xuất Excel — Mẫu C
Tệp: `lib/admin/product-export.ts`, `app/admin/(shell)/san-pham/actions.ts`, `components/admin/ProductExportButton.tsx`, `components/admin/ProductTable.tsx` (thanh "Đã chọn N"), tệp mới `components/admin/ExportColumnsDialog.tsx`.
1. Xuất có cột "Phân loại" (sau Danh mục con). Tính từ `category_id`: SP ở cấp 3 → Danh mục = gốc, Danh mục con = cha, Phân loại = chính nó; cấp 2 → như cũ, Phân loại trống.
2. Hai lối vào: nút trên đầu trang (theo bộ lọc, như cũ) và nút **Xuất Excel** mới trên thanh "Đã chọn N" (chỉ SP đã tick). Cả hai mở cùng bảng chọn cột.
3. Bảng chọn cột (dialog/bottom sheet điện thoại, `role="dialog"`, Esc đóng, trả tiêu điểm): tiêu đề "Chọn cột xuất · N SP".
   - Hàng **mẫu nhanh** (chip, chọn một): `Đầy đủ (nhập lại)` = mọi nhóm; `Chỉ tồn kho` = Cơ bản + Kho; `Chỉ giá` = Cơ bản + Giá nhập (nếu được xem). Chỉnh tay nhóm → bỏ đánh dấu chip mẫu.
   - **Nhóm** (một ô tick mỗi nhóm, dưới tên nhóm ghi các cột của nhóm, chữ nhỏ):
     - Cơ bản: Mã hàng hóa (khóa, luôn có, biểu tượng khóa) + Tên sản phẩm, Đơn vị tính, Giá bán — **cả nhóm khóa luôn có** (vì Nhập Excel bắt buộc Giá bán > 0, file thiếu sẽ không nhập lại được).
     - Giá nhập: Giá nhập, Giá nhập + 10% — chỉ hiện khi người dùng là chủ shop (cùng điều kiện `withCost` hiện tại).
     - Phân nhóm: Ngành hàng, Danh mục, Danh mục con, Phân loại, Thương hiệu
     - Kho: Tồn, Tồn tối thiểu, Vị trí
     - Thông tin: Thông số, Mô tả, Bảo hành, Xuất xứ, Sản xuất tại
     - Khác: Giá khuyến mãi, Trạng thái, Link ảnh
   - Mặc định lần đầu: Đầy đủ. Nhớ lựa chọn nhóm trong `localStorage` (bọc try/catch).
   - Nút đáy "Tải file" (vùng bấm ≥44px), "Đang xuất…" khi bận; lỗi tiếng Việt.
4. Server `exportProducts`: nhận thêm `ids?: number[]` và `groups: string[]`.
   - `ids`: tối đa 5.000, mọi phần tử `Number.isSafeInteger` > 0; có ids thì lọc `.in("id", ids)` (theo lô nếu cần) thay cho bộ lọc.
   - `groups`: chỉ nhận tên nhóm hợp lệ; luôn cộng nhóm Cơ bản; nhóm Giá nhập bị bỏ nếu không phải chủ shop (kiểm ở server, không tin client).
   - Thứ tự cột giữ theo thứ tự mẫu nhập rồi cột thêm. Vẫn ghi `logEvent("export:products", …)` kèm số SP, `by_ids: true/false`, `groups`.

## D. Web cho khách — Mẫu 2
Tệp: `components/storefront/ProductBrowser.tsx` (và `lib/catalog.ts` chỉ nếu cần).
1. Thay nhóm `"spec:Loại quạt"` bằng nhóm chung **`key: "classification"`, title "Phân loại"**, áp dụng cho **mọi** danh sách (không chỉ quạt) khi ≥1 SP có `classification`; option sắp theo số SP giảm dần. Bỏ biến `hasFanTypes`/điều kiện `isFanList` cho phần này (giữ nguyên nhóm Điều khiển).
2. **Hàng chip Phân loại** ngay dưới hàng "Lọc + chip hãng" (cùng kiểu, cuộn ngang): nhãn bỏ phần trùng tên Danh mục con ở đầu ("Quạt treo tường" → "Treo tường") + số lượng, vd. "Treo tường 27". Bấm = bật/tắt cùng tham số URL với nhóm Phân loại trong bảng Lọc (đồng bộ hai chiều, số trên nút Lọc tính cả). Chỉ hiện khi có ≥2 Phân loại.
3. Chip chọn: `aria-pressed`, vùng bấm ≥44px cao (có thể padding ẩn), giữ màu/hiệu ứng hàng chip hãng hiện có.

## Không được
Commit, push, ghi Supabase, migration, deploy. Trang Sản phẩm quản trị **không** thêm cột/ô Phân loại. Không đổi giao diện ngoài các phần trên. Cần tệp khác → ghi lý do trong báo cáo.

## Nghiệm thu (Codex tự kiểm, không ghi DB thật)
1. `npx tsc --noEmit`, ESLint các tệp sửa đạt.
2. Đọc thử (parse) file `C:\Users\Hai Trieu\Downloads\Kho-App-Quat-xuat-2026-11-06.xlsx` ở bước xem trước: 100 dòng, đọc được Phân loại, không dòng lỗi mới.
3. File mẫu tải về có cột Phân loại + dòng hướng dẫn.
4. Bảng chọn cột: Cơ bản khóa; đổi mẫu nhanh đổi nhóm; người không phải chủ shop không thấy nhóm Giá nhập.
5. `localhost` 375px `/danh-muc/quat`: hàng chip Phân loại hiện (khi dữ liệu có phân loại; nếu DB máy chưa có thì ghi rõ chưa kiểm được).
6. Báo cáo: tệp đã sửa, đã kiểm gì, chưa kiểm gì.

---

## Kết quả Codex — 07/11/2026

Đã triển khai A–D trong worktree `website-v2`, nhánh `worktree-website-v2`. Giữ nguyên các thay đổi có sẵn của người khác. Chưa commit/push, không chạy migration/deploy, không thực hiện ghi Supabase.

### Đã làm

- Nhập mẫu chuẩn đọc `Phân loại` (tối đa 80 ký tự); mẫu DMHH/file quạt cũ để null. Kiểm trường hợp thiếu Danh mục con, server kiểm lại cấp danh mục dựa trên `parent_id`.
- Khi chủ shop thực sự bấm nhập: tìm Phân loại theo tên chuẩn hóa và đúng cha; thiếu thì kiểm quyền `edit_products`, tạo bằng client đăng nhập hiện có, xử lý slug trùng bằng hậu tố. Không dùng service-role. Thông báo thiếu quyền bằng tiếng Việt trước khi nhập sản phẩm.
- Sản phẩm mới gắn vào cấp Phân loại; sản phẩm đã có đưa đường dẫn `Danh mục con > Phân loại` vào bảng chờ. Ô trống giữ Phân loại đang thuộc đúng Danh mục con. Xác nhận thay đổi không tìm thấy/không xác định duy nhất danh mục thì giữ lại mục chờ và báo ID sản phẩm bị lỗi, không ghi sản phẩm đó.
- Nhật ký/kết quả nhập có `classificationsCreated`; giao diện báo “Đã tạo N Phân loại mới”. Bảng xem trước nhập Excel có cột Phân loại; bảng Sản phẩm quản trị không thêm cột/ô Phân loại.
- File mẫu có cột Phân loại sau Danh mục con, ví dụ Quạt → Quạt đứng và dòng hướng dẫn. File xuất suy đúng ba cấp danh mục.
- Mẫu C: cả nút Xuất Excel đầu trang và nút ở thanh chọn sản phẩm mở cùng bảng chọn nhóm cột. Cơ bản khóa luôn có; mẫu nhanh Đầy đủ/Chỉ tồn kho/Chỉ giá; nhớ nhóm trong localStorage; người không phải owner không thấy nhóm Giá nhập. Có trạng thái bận/lỗi, Esc, quản lý tiêu điểm và khóa cuộn nền.
- Server xuất kiểm IDs nguyên dương (tối đa 5.000), lọc theo IDs thay bộ lọc khi được cung cấp, lấy theo lô 500; chỉ nhận nhóm hợp lệ, luôn thêm Cơ bản và bỏ Giá nhập nếu không phải owner. Nhật ký có `by_ids` và `groups`.
- Mẫu 2: bộ lọc Phân loại chung cho mọi loại sản phẩm có dữ liệu, sắp theo số sản phẩm giảm dần; hàng chip xuất hiện khi có ít nhất hai Phân loại. Chip rút gọn phần tên Danh mục con ở đầu, có số lượng, `aria-pressed`, chiều cao 44px và đồng bộ tham số URL `classification` với bảng Lọc. Giữ phần Điều khiển.

### Tệp đã sửa

- `lib/excel/parse-products.ts`: đọc/kiểm Phân loại và định nghĩa chung các nhóm cột xuất.
- `app/admin/(shell)/nhap-excel/actions.ts`: tạo/đối chiếu/xác nhận Phân loại, quyền và nhật ký.
- `app/admin/(shell)/nhap-excel/ImportClient.tsx`: mẫu Excel, hướng dẫn, xem trước và kết quả.
- `lib/admin/product-export.ts`: xuất ba cấp danh mục, lọc ID và chiếu nhóm cột.
- `app/admin/(shell)/san-pham/actions.ts`: kiểm tham số/quyền xuất, trả quyền hiển thị nhóm Giá nhập và ghi nhật ký.
- `components/admin/ProductExportButton.tsx`, `components/admin/ProductTable.tsx`: hai lối mở bảng chọn cột; giữ danh sách đã chọn khi thao tác trên điện thoại.
- `components/admin/ExportColumnsDialog.tsx` (mới): bảng chọn cột mẫu C.
- `components/storefront/ProductBrowser.tsx`: nhóm/chip Phân loại mẫu 2.
- **Tệp bổ sung cần thiết:** `app/(store)/danh-muc/page.tsx` — chỉ thêm `classification` vào danh sách tham số bộ lọc. Nếu thiếu, URL `/danh-muc?classification=...` sẽ mở màn danh mục thay vì danh sách sản phẩm; không đổi bố cục trang. Ghi lý do tại đây theo quy tắc “Cần tệp khác → ghi lý do trong báo cáo”.
- Tệp bàn giao này.

### Đã kiểm

- `npx tsc --noEmit`: đạt sau khi sửa kiểm tra trường hợp sản phẩm chưa có danh mục.
- ESLint các tệp mã sửa: đạt.
- `git diff --check`: đạt (Git báo chuẩn hóa LF/CRLF trên Windows).
- File `C:\Users\Hai Trieu\Downloads\Kho-App-Quat-xuat-2026-11-06.xlsx`: đọc XML cục bộ rồi đưa toàn bộ dòng vào chính hàm `detectAndParse`; **100 dòng, 0 dòng lỗi, đủ Phân loại**. Kết quả: Treo tường 27, Đứng 25, Sàn 20, Lửng 17, Bàn 5, Trần 4, Hộp 2. Không tải file lên dịch vụ nào, không in giá nhập.
- Chạy mã nhập/xác nhận với DB giả: tạo/dùng lại Phân loại, phân biệt cha, giữ ô trống đúng Danh mục con, chuyển sang mục khác, sản phẩm chưa gắn danh mục, chặn thiếu quyền trước khi ghi, slug trùng thêm `-2`, đường dẫn không tồn tại không ghi và giữ mục chờ: đạt.
- Chạy mã xuất với DB giả: cấu trúc ba cấp, nhóm Cơ bản luôn có, không truy vấn/xuất giá nhập cho nhân viên, IDs/nhóm sai bị từ chối, ID trùng được gộp và nhật ký có nhóm/kiểu xuất: đạt.
- Chạy trực tiếp hàm tạo file mẫu, tạo XLSX tạm và đọc lại: đúng vị trí cột Phân loại, ví dụ, hướng dẫn: đạt.
- Kiểm hàm render/xử lý sự kiện của bảng chọn cột bằng hook giả: Cơ bản khóa, mẫu nhanh đổi nhóm, chỉnh tay bỏ chip mẫu, nhân viên không có nhóm Giá nhập: đạt. Đây là kiểm logic, không phải ảnh chụp trình duyệt.
- Kiểm hàm render/xử lý sự kiện ProductBrowser bằng router/hook giả: chip và checkbox đồng bộ URL hai chiều, tải URL phục hồi lựa chọn, số kết quả đổi đúng, hỗ trợ danh sách ngoài quạt: đạt.

### Chưa kiểm / cần Claude Code rà tiếp

- Trình duyệt trong ứng dụng không mở được `http://localhost:3000/danh-muc/quat` (`ERR_CONNECTION_TIMED_OUT`) dù Next dev đã khởi động. **Chưa kiểm trực quan 375px**, cuộn/tiêu điểm/Esc trong trình duyệt thật hoặc bố cục thanh chọn sản phẩm sau khi thêm nút Xuất Excel.
- Chưa thực hiện nhập, xác nhận thay đổi, tạo Phân loại hoặc xuất có ghi nhật ký trên DB thật theo giới hạn của chủ shop. Các kiểm tra ghi dữ liệu dùng DB giả; chưa xác nhận RLS thực tế với tài khoản nhân viên/owner.
- Chưa chạy build. Chủ shop vẫn là người quyết định nhập lại file quạt trên web thật để gắn Phân loại cho 100 quạt.
