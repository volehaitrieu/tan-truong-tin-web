# Bàn giao GIAO DIỆN — Tân Trường Tín (web bán hàng + trang quản trị)

_Bản 22/10/2026. File này tự đủ: công cụ AI nhận file chỉ cần đọc file này để dựng **giao diện** (UI). Không cần (và không dùng) Google Stitch hay file thiết kế nào khác._

> **Phạm vi:** chỉ làm giao diện với **dữ liệu mẫu** — bố cục, màu, chữ, thành phần, trạng thái hiển thị, co giãn điện thoại. **Không** làm backend, đăng nhập thật, database, thanh toán thật, gửi Telegram… Mỗi màn dưới đây là **một màn riêng**, không gộp các màn/chức năng vào nhau.

---

## 1. Cửa hàng (thông tin thật — dùng đúng như sau)
- **Tên:** TÂN TRƯỜNG TÍN — dòng phụ: _Điện nước · Kim khí · Dụng cụ · Quạt · Gia dụng_
- **Slogan:** "Chất lượng tạo niềm tin, dịch vụ tạo khác biệt."
- **Địa chỉ:** 379 đường 2/4, phường Bắc Nha Trang, tỉnh Khánh Hòa
- **SĐT/Zalo chính:** 0948 732 064 · **SĐT phụ:** 0793 783 379
- **Giờ mở cửa:** 7:45 – 20:30 hằng ngày
- Chỉ có **1 cửa hàng** (không có chi nhánh, không có ô chọn chi nhánh).
- Khách: sinh viên, người sửa nhà, gia đình, thợ/công trình ở Nha Trang. Mặt hàng: ống nước, phụ kiện điện, dây điện, công tắc ổ cắm, đèn, quạt (treo tường, đứng, trần), dụng cụ cầm tay, kim khí (vít, bulông, keo, băng keo), đồ gia dụng.
- Thương hiệu mẫu dùng được: Bình Minh, Tiền Phong, Cadivi, Panasonic, Rạng Đông, Hali, Senko, Asia, Makita, Bosch, Tombo, Miha, Midea.

## 2. Tính cách & giọng văn
- **Tin cậy · Rõ ràng · Gần gũi.** Lời lẽ như nhân viên tại quầy: ngắn, rõ, có ích. Xưng "bạn" với khách.
- Nút ghi đúng việc sẽ xảy ra: "Thêm vào giỏ", "Đặt trước", "Xem 14 sản phẩm", "Lưu thay đổi".
- Báo lỗi nói rõ sai gì + sửa thế nào: "Số điện thoại cần 10 số, bắt đầu bằng 0."
- **Toàn bộ chữ trên giao diện bằng tiếng Việt có dấu.**

## 3. Màu (chỉ giao diện sáng — không có chế độ tối)
| Token | Mã | Dùng cho |
|---|---|---|
| `--brand` | `#0D6B45` | Nút chính, link, icon, chữ thương hiệu, mục đang chọn |
| `--brand-deep` | `#08482F` | Hover nút chính, tiêu đề lớn trên nền xanh nhạt, **nền thanh menu trái của Admin** |
| `--brand-tint` | `#E3F2E9` | Nền banner, thanh trên cùng, chip đã chọn, mục menu đang chọn (storefront) |
| `--gold` | `#F2B705` | Nút nhấn mạnh ("Đặt trước", CTA banner), số trên giỏ hàng, **viền focus** |
| `--gold-ink` | `#3A2C00` | Chữ trên nền vàng |
| `--gold-tint` | `#FFF3C7` | Ô nổi bật nhẹ |
| `--ground` | `#F7FAF7` | Nền trang |
| `--surface` | `#FFFFFF` | Thẻ, bảng, khung, ô nhập |
| `--sunk` | `#EEF3EF` | Nền ảnh SP, chip chưa chọn, vạch chia rất nhạt |
| `--line` | `#E5E7EB` | Đường kẻ mảnh trong bảng Admin, viền ô nhập |
| `--ink` | `#14231B` | Chữ chính |
| `--ink-2` | `#4B5A51` | Chữ phụ, mô tả, thông số |
| `--danger` | `#B3261E` | **Giá bán** (storefront), nhãn % giảm, lỗi |
| `--ok` | `#1B7A47` | "Còn hàng", thành công |
| `--ask` | `#B7791F` | "Liên hệ" (hết hàng nhưng vẫn đặt được), "Sắp hết" |

**Nhãn trạng thái Admin (chữ / nền, dạng viên thuốc bo tròn):** Thành công `#0D6B45`/`#ECFDF5` · Cảnh báo `#B45309`/`#FEF3C7` · Đang xử lý `#1D4ED8`/`#EFF6FF` · Nguy hiểm `#B3261E`/`#FEF2F2` · Trung tính `#4B5A51`/`#EEF3EF`.

**Quy tắc màu:** tách vùng bằng bậc màu nền (ground → surface → sunk), không viền đậm. Bóng đổ chỉ cho thứ nổi lên trên (menu thả, bảng từ dưới lên, hộp thoại). **Không gradient**, không nền tối lớn, không glow, không kính mờ. Màu vàng tối đa 1–2 chỗ mỗi màn hình. Logo được phép giữ màu chuyển xanh đậm → xanh ngọc của bản gốc (ngoại lệ duy nhất).

## 4. Chữ
- Font duy nhất **Be Vietnam Pro** (Google Fonts), 400/500/600/700/800. Dự phòng: `system-ui, "Segoe UI", Roboto, Arial, sans-serif`.
- Số (giá, tồn kho, mã) dùng `font-variant-numeric: tabular-nums`.
- Giá hiển thị `480.000₫` (định dạng vi-VN), giá gốc gạch ngang màu `--ink-2`.

| Vai trò | Storefront | Admin |
|---|---|---|
| Tiêu đề trang (h1) | 28–40px / 800 | 24px / 700 |
| Tiêu đề mục (h2) | 22–30px / 800 | 18–20px / 600 |
| Tiêu đề thẻ | 14–19px / 600–800 | 16px / 600 |
| Chữ thường | 15px / 400, giãn dòng 1.5 | 14px / 400 |
| Chữ phụ, thông số | 12.5–13.5px | 13px |
| Nhãn cột bảng | — | 12px / 600 |
| Giá trên thẻ SP | 18px / 800 | — |

Tiêu đề tối đa 2 dòng. Không dùng chữ IN HOA nhỏ giãn cách trang trí, không đánh số trang trí 01/02/03.

## 5. Khoảng cách, bo góc, điểm ngắt
- Bội số 4px: 4 / 8 / 12 / 16 / 24 / 32px; giữa các mục lớn ~40px.
- **Storefront:** bề rộng nội dung tối đa 1240px, lề 2 bên ≥ 16px. Bo góc 6px (thẻ, nút, ô nhập); chip lọc và nút trượt ‹ › bo tròn hẳn.
- **Admin:** bo góc 4px (ô nhập, nút trong bảng, chip) và 8px (thẻ, bảng, hộp thoại); hàng bảng cao 44px.
- Điểm ngắt: ≤ 1180px (tablet ngang) · ≤ 860px (điện thoại/tablet dọc) · ≤ 420px (điện thoại nhỏ). Kiểm tra ở **1440px, 390px và 440px** (chủ shop dùng iPhone 17 Pro Max 440×956).
- Vùng bấm ≥ 44px trên điện thoại; tôn trọng tai thỏ/thanh home iPhone (safe area).
- Hiệu ứng chỉ CSS transition ≤ 200ms, tắt khi người dùng bật "giảm chuyển động" (`prefers-reduced-motion`).
- Focus bàn phím: viền vàng `--gold` 3px (storefront) / vòng `0 0 0 2px #fff, 0 0 0 4px #0D6B45` (Admin).
- Icon: bộ icon nét mảnh thống nhất (ví dụ Lucide hoặc Material Symbols Outlined). Không dùng emoji thay icon.

## 6. Logo & ảnh
- Logo: hình tròn màu xanh (chuyển xanh đậm → xanh ngọc) + chữ **TÂN TRƯỜNG TÍN** in hoa, đậm 800, màu `--brand`. Tối thiểu 32px. Nếu không có file logo, dùng ô tròn xanh `--brand` có chữ "TTT" trắng làm chỗ giữ. _(File thật của chủ shop: `docs/brand/logo-trong-suot.png`, `logo-512.png`, `logo-64-favicon.png`.)_
- Ảnh SP: khung **vuông 1:1**, nền `--sunk`, sản phẩm giữa khung ~70%. SP chưa có ảnh thật → **ảnh minh họa** vẽ phẳng màu xanh/vàng theo danh mục con, luôn có nhãn nhỏ **"Ảnh minh họa"**.
- Thương hiệu hiển thị **bằng chữ**, không dùng logo hãng.

## 7. KHÔNG được làm
- Số liệu bịa cho khách thấy: sao đánh giá, "đã bán 1,2k", số khách hàng, "Hỗ trợ 24/7", "Giao toàn quốc siêu tốc".
- Địa chỉ/SĐT mẫu sai (TP.HCM, 0901…, "124 Đường 2/4", "0905.xxx.xxx").
- Ô chọn chi nhánh; ca làm việc / thu ngân / tiền trong két; máy in hóa đơn K80 / cấu hình máy in; gửi Zalo OA; tự lưu nháp; nhân bản sản phẩm; công nợ / nhà cung cấp; chữ "POS" hay "đồng bộ POS"; vai trò "Quản lý"; IP người thao tác.
- Tích điểm, hạng thành viên, flash sale đếm ngược, thanh toán thẻ/ví (VNPay, MoMo), trả góp, chat trực tuyến trong web, đa ngôn ngữ, chế độ tối.
- Danh mục shop không bán (thời trang, làm đẹp, thể thao).
- Nút **Xóa sản phẩm** (shop chỉ Ẩn/Hiển thị).

---

# PHẦN A — TRANG QUẢN TRỊ (Admin, đường dẫn `/admin`)

Làm **Admin trước**. Mật độ dày hơn storefront, cùng màu và font. Vai trò chỉ có 3: **Chủ shop · NV đơn · NV kho**. Những gì chỉ chủ shop được thấy thì vẽ kèm biểu tượng ổ khóa + chữ nhỏ "Chỉ chủ shop".

## A0. Khung chung Admin
**Máy tính (≥ 861px):**
- **Thanh menu trái** cố định rộng 240px, nền `--brand-deep` (#08482F), chữ trắng. Trên cùng: logo + "TÂN TRƯỜNG TÍN" + dòng phụ "Quản trị cửa hàng". 13 mục (icon + chữ), mục đang chọn nền trắng mờ 12% + vạch vàng bên trái:
  1. Tổng quan · 2. Đơn hàng · 3. Bán tại quầy · 4. Sản phẩm · 5. Nhập Excel · 6. Tồn kho · 7. Kiểm kho · 8. Danh mục & thương hiệu · 9. Khuyến mãi · 10. Báo cáo · 11. Nhân viên & quyền · 12. Nhật ký thao tác · 13. Cài đặt
  - Đáy menu: "Hotline 0948 732 064" chữ nhỏ.
  - Tablet 768–1024px: menu thu thành cột icon 72px.
- **Thanh trên** (cao 64px, nền trắng, đường kẻ dưới `--line`): ô tìm nhanh "Tìm mã đơn, tên SP, SKU…" · nút "+ Tạo đơn mới" (xanh) · chuông thông báo có số đỏ · người dùng (ảnh tròn + tên + vai trò, menu thả có "Đăng xuất").
- Vùng nội dung: nền `--ground`, lề 24px, có **đường dẫn** (vd. Sản phẩm › Quạt treo tường Hali TR2) và **tiêu đề trang** + nút hành động chính bên phải.

**Điện thoại (≤ 860px):**
- **Thanh trên** dính đầu: nút quay lại (ở màn con) hoặc logo nhỏ, tiêu đề màn, chuông.
- **Thanh đáy** 5 tab (icon + chữ, cao 64px + safe area): **Tổng quan · Đơn hàng · Bán tại quầy · Sản phẩm · Thêm**. "Thêm" mở danh sách các mục còn lại (Nhập Excel, Tồn kho, Kiểm kho, Danh mục & thương hiệu, Khuyến mãi, Báo cáo, Nhân viên & quyền, Nhật ký thao tác, Cài đặt). Màn không thuộc 4 tab đầu thì sáng tab "Thêm".
- **Bảng → danh sách thẻ** xếp dọc. **Bộ lọc** gom vào nút "Bộ lọc (n)" mở bảng trượt từ dưới lên. Nút hành động chính dính đáy (trên thanh tab) hoặc nút tròn nổi.
- Màn sửa/chi tiết/wizard: ẩn thanh tab, có thanh nút dính đáy.

**Trạng thái chung (vẽ cho mọi danh sách):** đang tải (khung xương xám nhấp nháy nhẹ) · trống ("Chưa có đơn nào hôm nay" + nút liên quan) · lỗi ("Không tải được dữ liệu. Thử lại") · toast ở góc dưới ("Đã lưu thay đổi").

## A1. Đăng nhập (`/admin/dang-nhap`)
- Không có menu. Nền `--ground`, giữa màn 1 thẻ trắng rộng ~420px: logo + "TÂN TRƯỜNG TÍN" + "Điện nước • Kim khí • Gia dụng" · tiêu đề "Đăng nhập quản trị" · ô "Số điện thoại hoặc email" · ô "Mật khẩu" có nút mắt hiện/ẩn · ô tích "Ghi nhớ đăng nhập" · nút xanh rộng hết "Đăng nhập" · chữ nhỏ "Quên mật khẩu? Liên hệ chủ shop" · chân thẻ: "379 đường 2/4, Bắc Nha Trang • 0948 732 064".
- Vẽ thêm trạng thái lỗi dưới ô mật khẩu: "Sai số điện thoại/email hoặc mật khẩu".
- Điện thoại: 1 cột toàn màn, bỏ viền thẻ, ô nhập và nút cao ≥ 48px.
- Không có Đăng ký, không đăng nhập bằng Google/Facebook.

## A2. Tổng quan (`/admin`)
- Hàng 4 **thẻ số liệu**: Doanh thu hôm nay · Đơn mới · Đơn chờ xác nhận · SP sắp hết (mỗi thẻ: nhãn, số lớn, so sánh hôm qua dạng chữ nhỏ). Điện thoại: lưới 2×2.
- **Biểu đồ cột doanh thu 7 ngày** (1 màu `--brand`, không nhiều màu).
- **Đơn cần xử lý**: danh sách 5 đơn (mã, khách, cách nhận, tổng tiền, nhãn trạng thái, nút "Xem").
- **Sắp hết hàng**: bảng SP có tồn ≤ tồn tối thiểu (tên, SKU, tồn / tối thiểu, nhãn "Sắp hết"/"Hết hàng", nút "Điều chỉnh").
- Thẻ doanh thu chỉ chủ shop thấy.

## A3. Sản phẩm — danh sách (`/admin/san-pham`)
- Đầu trang: tiêu đề "Sản phẩm" + số lượng (vd. "3.575 sản phẩm") · nút "+ Thêm sản phẩm" (xanh) · nút phụ "Nhập Excel" · nút phụ "Duyệt gợi ý AI".
- Thanh lọc: ô tìm (tên, SKU, thương hiệu — gõ không dấu vẫn ra) · Danh mục · Thương hiệu · Trạng thái (Hiển thị/Ẩn) · Ảnh (Có ảnh thật / Ảnh minh họa) · Thiếu thông tin. Chip lọc đang bật có ×.
- Bảng: ô chọn · ảnh vuông 40px · Tên (+ SKU dòng dưới) · Danh mục · Thương hiệu · Giá bán · **Giá nhập (ổ khóa — chỉ vai trò có quyền)** · Tồn (nhãn Sắp hết/Hết) · Trạng thái Hiển thị/Ẩn (công tắc) · nút icon "Tải ảnh thông tin" · nút "Sửa".
- Chọn nhiều → thanh hành động: Ẩn · Hiển thị · Tải ảnh thông tin (.zip).
- Phân trang + chọn số dòng/trang. Không có nút Xóa.
- Điện thoại: mỗi SP 1 thẻ (ảnh trái, tên/SKU/giá/tồn phải, chip trạng thái), nút tròn nổi "+".

## A4. Sửa / thêm sản phẩm (`/admin/san-pham/[id]`)
- Máy tính 2 cột (trái ~65%, phải ~35%). Đầu trang: tên SP + SKU + nhãn Hiển thị/Ẩn · nút "Lịch sử cập nhật" · nút "Tạo ảnh thông tin SP".
- **Cột trái** (các thẻ có tiêu đề đánh số chữ):
  - *Thông tin cơ bản:* Tên (đếm ký tự /120), SKU, Đơn vị tính, Danh mục (chọn cây), Thương hiệu, Nhãn nhu cầu (chip: Phòng trọ, Sửa nhà, Bếp & gia đình, Công trình).
  - *Giá:* Giá bán (đã gồm VAT) · **Giá nhập (ổ khóa, chỉ người có quyền)** + lãi gộp hiển thị nhỏ · Giá khuyến mãi + ngày bắt đầu/kết thúc + tự hiện "-10%".
  - *Thông số theo danh mục:* các ô thay đổi theo danh mục (vd. quạt: sải cánh, công suất W, số cánh, kiểu điều khiển, điện áp, màu, xuất xứ).
  - *Mô tả* (ô soạn thảo đơn giản) · *Bảo hành & xuất xứ* · cân nặng, kích thước đóng hộp.
- **Cột phải:** *Ảnh sản phẩm* (lưới ảnh, ảnh 1 = "Chính", nhãn "Ảnh thật"/"Ảnh minh họa", ô "+ Thêm ảnh" kéo thả) · *Trạng thái hiển thị* (công tắc Hiển thị/Ẩn) · *Tồn kho* (số hiện có, tồn tối thiểu, link "Điều chỉnh tồn kho").
- **Thanh dính đáy:** "Sửa lần cuối: Chủ shop · 10:05 21/10/2026" · nút "Hủy" · nút xanh "Lưu thay đổi".
- Điện thoại: 1 cột, các thẻ thành mục thu gọn được, dải ảnh cuộn ngang, nút "Lưu" dính đáy, ẩn thanh tab.

## A5. Nhập Excel (`/admin/nhap-excel`) — trình tự 3 bước
- Thanh bước trên cùng: 1 Chọn file → 2 Xem trước & kiểm lỗi → 3 Xác nhận.
- *Bước 1:* vùng kéo thả file .xlsx, chọn mẫu (Danh mục hàng hóa / Mẫu quạt), link "Tải file mẫu".
- *Bước 2:* thẻ tóm tắt (Mới · Cập nhật · Lỗi) · công tắc "Chỉ xem dòng lỗi" · bảng xem trước (Dòng, SKU, Tên, Đơn vị — hiện "Mét → m" khi chuẩn hóa, Giá bán, Giá nhập, Tồn kho, Tồn tối thiểu, Kết quả) · dòng lỗi nền đỏ nhạt + lý do ("Thiếu SKU", "Trùng SKU", "Giá = 0", "Đơn vị lạ") · nút "Tải danh sách dòng lỗi".
- *Bước 3:* tóm tắt + nút xanh "Nhập vào kho (n dòng)" + dòng nhắc "Chưa ghi gì vào kho cho tới khi bạn xác nhận". SP mới vào ở trạng thái **Ẩn**.
- Điện thoại: bước gọn, mỗi dòng xem trước là 1 thẻ, thanh "Quay lại" + "Nhập vào kho" dính đáy.

## A6. Duyệt gợi ý danh mục bằng AI (`/admin/san-pham/duyet-ai`) — chỉ giao diện
- 3 tab theo độ tin cậy kèm số: **Cao · Trung bình · Thấp**.
- Mỗi dòng: ô chọn · tên SP + SKU · danh mục gợi ý (đường dẫn cha > con) · thương hiệu gợi ý · nhãn % tin cậy · nút "Chấp nhận" · nút "Đổi danh mục" (mở bảng chọn cây).
- Thanh dính đáy: "Chấp nhận tất cả mức Cao (n)".
- Điện thoại: thẻ dọc, nút "Đổi danh mục" mở bảng từ dưới lên.

## A7. Ảnh thông tin sản phẩm (`/admin/san-pham/[id]/anh-thong-tin`)
- Trái: chọn SP (ô tìm) + tùy chọn: chọn thông số hiển thị (ô tích), hiện giá KM, ngày giá.
- Phải: **xem trước thẻ vuông 1080×1080** (thu nhỏ): ảnh SP, tên, thông số chọn, giá (giá gốc gạch nếu KM), "Giá ngày 22/10/2026", logo, địa chỉ, Zalo 0948 732 064.
- Nút: "Tải ảnh PNG" (xanh) · "Sao chép ảnh" (dán vào Zalo). Không có nút "Gửi Zalo OA".
- Điện thoại: thẻ xem trước vừa bề ngang, tùy chọn bên dưới, nút "Tải ảnh PNG" dính đáy.

## A8. Tồn kho (`/admin/ton-kho`)
- Thẻ tóm tắt: Tổng mặt hàng · Sắp hết · Hết hàng.
- Bảng: SP + SKU · Danh mục · Tồn hiện có · Tồn tối thiểu · Trạng thái (Đủ/Sắp hết/Hết) · nút "Điều chỉnh".
- **Bảng điều chỉnh** (khung bên phải trên máy tính, bảng từ dưới lên trên điện thoại): số hiện có → nút −/+ số lượng → "Sau điều chỉnh: n" · Lý do (Nhập hàng, Hư hỏng, Thất lạc, Trả hàng, Kiểm kho, Khác) · Ghi chú · "Lưu điều chỉnh".
- Tab "Lịch sử thay đổi": ai, khi nào, +/−, lý do.
- NV kho chỉ xem (nút Điều chỉnh mờ + chú thích "Bạn chỉ có quyền xem").

## A9. Kiểm kho (`/admin/kiem-kho`) — màn quản lý của chủ shop
- Danh sách đợt kiểm (tên đợt, phạm vi danh mục/kệ, người được giao, tiến độ thanh %, trạng thái Đang đếm / Chờ chốt / Đã chốt) + nút "+ Tạo đợt kiểm kho".
- Chi tiết đợt: thanh tiến độ "đã đếm 120/150" · lọc Tất cả / Lệch / Chưa đếm · bảng: SP, SKU, Số hệ thống, Số đếm, **Chênh lệch** (đỏ khi thiếu, xanh khi dư), người đếm.
- Nút xanh "Chốt kiểm kho" + ổ khóa "Chỉ chủ shop".

## A10. Đếm kho trên điện thoại (`/admin/kiem-kho/[dot]/dem`) — dành cho NV kho, chỉ bản điện thoại
- Thanh trên: tên đợt + "Kệ G1 – Tầng 2" + tiến độ.
- Ô tìm/quét mã lớn (icon máy ảnh).
- Thẻ SP hiện tại thật to: ảnh, tên, SKU, đơn vị · ô số đếm lớn với nút − / + cỡ 56px · **đếm mù**: không hiện số hệ thống (có công tắc nếu chủ shop cho phép).
- Nút "Lưu & sang món tiếp" dính đáy. Danh sách "Đã đếm" thu gọn bên dưới.

## A11. Danh mục & thương hiệu (`/admin/danh-muc`)
- 2 tab: **Danh mục · Thương hiệu**.
- *Danh mục:* cây cha > con (mũi tên mở/đóng, icon, tên, số SP, nút kéo đổi thứ tự) bên trái; bên phải khung sửa: tên, danh mục cha, icon, **bộ thông số của danh mục** (danh sách trường: tên trường, kiểu Số/Chọn/Chữ, đơn vị, ô tích "Dùng làm bộ lọc trên web", nút thêm/bỏ trường).
- *Thương hiệu:* lưới thẻ (tên, logo nếu có, số SP) + "+ Thêm thương hiệu".
- Điện thoại: cây thành danh sách mở được, sửa trong bảng từ dưới lên, nút tròn "+".

## A12. Đơn hàng — danh sách (`/admin/don-hang`)
- Chip trạng thái có số: Tất cả · Chờ xác nhận · Đã xác nhận · Đang giao · Sẵn sàng lấy · Hoàn thành · Đã hủy.
- Lọc: khoảng ngày · cách nhận (Nhận tại cửa hàng / Giao nội thành / Gửi đi tỉnh) · thanh toán (COD / VietQR; Chưa thanh toán / Đã thanh toán).
- Bảng: Mã đơn · Thời gian · Khách (tên + SĐT) · Cách nhận (icon) · Tổng tiền · Thanh toán · Trạng thái · cờ vàng **"Chưa có phí ship"** cho đơn đi tỉnh chưa nhập phí.
- Điện thoại: mỗi đơn 1 thẻ.

## A13. Chi tiết đơn (`/admin/don-hang/[ma]`)
- Đầu: mã đơn lớn, thời gian, nhãn trạng thái, nhãn thanh toán · nút "In phiếu giao hàng" · nút "In phiếu xuất kho".
- Cột trái: *Sản phẩm* (ảnh, tên, SL × giá, thành tiền) · *Tổng* (tiền hàng, phí ship, tổng) · *Dòng thời gian trạng thái* · *Ghi chú nội bộ* (ô nhập + danh sách).
- Cột phải: *Khách hàng* (tên, SĐT bấm để gọi, nút Zalo) · *Giao hàng* (cách nhận, địa chỉ Tỉnh → Phường/Xã → số nhà, mã vận đơn SPX/GHTK nhập tay) · *Phí ship* (ô nhập + "Lưu phí ship"; chú thích "Khách chỉ thấy mã VietQR sau khi nhập phí ship") · *Thanh toán* (COD / VietQR — VietQR nhãn xám "Sắp có"; nút "Xác nhận đã nhận tiền").
- Thanh hành động: nút đổi trạng thái kế tiếp ("Xác nhận đơn", "Giao hàng", "Hoàn thành"). Với NV đơn: **không có** nút Hủy và Giảm giá.
- Điện thoại: 1 cột thẻ, nút trạng thái dính đáy, ẩn thanh tab.

## A14. Bán tại quầy (`/admin/ban-tai-quay`)
- Máy tính chia 65/35. Trái: ô tìm/quét mã lớn · chip danh mục · lưới SP (ảnh, tên, giá, tồn) bấm để thêm. Phải: **Đơn tại quầy**: danh sách món (SL −/+, xóa dòng) · khách (SĐT, không bắt buộc) · tổng · cách trả: Tiền mặt / Chuyển khoản (VietQR "Sắp có") · "Tiền khách đưa" + gợi ý mệnh giá nhanh · "Tiền thối" · nút xanh lớn "Hoàn tất bán" · nút phụ "In phiếu".
- Điện thoại: lưới 2 cột, giỏ thành thanh dính đáy "3 món · 1.250.000₫ · Thanh toán" mở bảng từ dưới lên.
- Không có ca làm việc, thu ngân, két tiền, máy in K80.

## A15. Khuyến mãi (`/admin/khuyen-mai`)
- 2 tab: **Giá KM theo sản phẩm · Mã giảm giá**.
- *Giá KM:* bảng/thẻ: SP, giá gốc (gạch), giá KM (đỏ), % giảm, từ ngày – đến ngày, trạng thái (Đang chạy / Sắp tới / Đã hết), công tắc bật/tắt · nút "+ Tạo khuyến mãi".
- *Mã giảm giá:* mã, loại (% hoặc số tiền), điều kiện đơn tối thiểu, lượt dùng, hạn, trạng thái.
- Chú thích: "SP đang KM hiện trong mục 'Sản phẩm đang giảm giá' trên trang chủ".

## A16. Báo cáo (`/admin/bao-cao`) — chủ shop
- Chọn kỳ: Hôm nay · 7 ngày · 30 ngày · Tùy chọn.
- Thẻ: Doanh thu · Số đơn · Giá trị đơn trung bình · **Lãi gộp (ổ khóa)**.
- Biểu đồ doanh thu theo ngày (1 màu) · cơ cấu đơn theo cách bán (Tại quầy / Giao nội thành / Đi tỉnh / Lấy tại cửa hàng) dạng thanh ngang · **Top 10 sản phẩm bán chạy** (tên, SL, doanh thu, lãi gộp).
- Nút "Xuất Excel" (Sản phẩm / Tồn kho / Đơn hàng).

## A17. Nhân viên & quyền (`/admin/nhan-vien`) — chủ shop
- 2 phần (máy tính: trái danh sách, phải ma trận; điện thoại: 2 tab).
- *Danh sách:* Họ tên, SĐT, vai trò (nhãn: Chủ shop / NV đơn / NV kho), trạng thái (Đang hoạt động / Đã khóa), đăng nhập gần nhất · "+ Thêm nhân viên" · nút "Khóa tài khoản".
- *Ma trận quyền:* cột = 3 vai trò, hàng = quyền, mỗi ô 1 công tắc. Cột Chủ shop bật hết và khóa. Quyền: Xem giá nhập · Sửa sản phẩm · Sửa giá bán · Điều chỉnh tồn kho · Nhập Excel · Xử lý đơn hàng · Hủy đơn · Giảm giá trong đơn · Bán tại quầy · Chốt kiểm kho · Xem báo cáo · Xem lãi gộp · Quản lý nhân viên · Cài đặt. Mặc định: NV kho = xem SP + xem giá nhập (không sửa gì); NV đơn = xử lý đơn (không hủy, không giảm giá).
- Nút "Lưu thay đổi".

## A18. Nhật ký thao tác (`/admin/nhat-ky`) — chủ shop, chỉ xem
- Lọc: khoảng ngày · nhân viên · loại (Sản phẩm, Giá, Tồn kho, Kiểm kho, Đơn hàng, Khuyến mãi, Nhân viên & quyền, Cài đặt) · ô tìm.
- Danh sách nhóm theo ngày: giờ · NV + nhãn vai trò · nhãn loại (màu) · đối tượng (link tên SP / mã đơn) · chi tiết **cũ (gạch) → mới**, vd. "Giá bán 450.000₫ → 420.000₫", "Tồn kho 12 → 9, lý do: hư hỏng".
- Không có sửa, xóa, xuất.

## A19. Cài đặt (`/admin/cai-dat`) — chủ shop
- Máy tính: tab dọc bên trái + nội dung bên phải. Điện thoại: danh sách mục có mũi tên kiểu iPhone.
- *Thông tin cửa hàng:* tên, ngành hàng, địa chỉ, SĐT/Zalo chính, SĐT phụ, giờ mở cửa, logo (dùng đúng thông tin mục 1).
- *Giao hàng & phí ship:* công tắc 3 cách nhận (Nhận tại cửa hàng = 0₫ · Giao nội thành · Gửi đi tỉnh SPX/GHTK); ghi chú "Phí đi tỉnh: nhân viên nhập sau khi xác nhận đơn"; ô phí nội thành + ngưỡng miễn phí **mờ** kèm nhãn vàng **"Chờ chủ shop"**.
- *Thanh toán:* COD bật (mặc định); VietQR mờ + nhãn xám **"Sắp có"** (ngân hàng, số TK, tên chủ TK).
- *Thông báo Telegram:* Bot token (ẩn ký tự), Chat ID, ô tích Đơn mới / Sắp hết hàng / Chốt kiểm kho, nút "Gửi tin thử".
- *Đổi trả & bảo hành:* ô soạn trống + nhãn vàng **"Chờ chủ shop"** + chú thích "Chính sách sẽ hiện trên trang bán hàng".
- Thanh dính đáy "Lưu thay đổi".

---

# PHẦN B — WEB BÁN HÀNG (Storefront) — làm sau Admin

## B0. Khung chung
- **Thanh trên cùng** nền `--brand-tint`: địa chỉ · giờ mở cửa · hotline.
- **Header** dính khi cuộn: logo + tên + dòng phụ · ô tìm kiếm viền xanh ("Tìm ống nước, quạt, công tắc…", gõ không dấu vẫn ra, có gợi ý thả xuống) · "Tra cứu đơn" · Giỏ hàng có số đếm vàng.
- **Footer**: thông tin cửa hàng, giờ mở cửa, bản đồ, link chính sách (Đổi trả · Bảo hành · Vận chuyển · Thanh toán · Bảo mật · Giới thiệu).
- **Nút nổi** góc phải dưới: Zalo + Gọi điện.
- **Điện thoại:** thanh đáy 4 tab: Trang chủ · Danh mục (mở ngăn kéo trái) · Giỏ hàng (số) · Tra cứu đơn.
- Toast "Đã thêm vào giỏ: …".

## B1. Trang chủ
Thứ tự: Thanh trên cùng → Header → **[Menu danh mục dọc | Banner | 3 ô dịch vụ]** → Danh mục hàng hóa (8 ô icon tròn + tên + số mặt hàng; điện thoại 4 cột) → Mua theo nhu cầu (4 ô: Phòng trọ · Sửa nhà · Bếp & gia đình · Công trình) → **Sản phẩm đang giảm giá** (hàng trượt ngang, nút ‹ ›) → **Tất cả sản phẩm** (bộ lọc trái 250px + lưới) → Thương hiệu (hàng trượt chữ) → Cách mua (3 cách nhận + 2 cách trả: COD, VietQR) → Ghé cửa hàng (ảnh mặt tiền, địa chỉ, bản đồ) → Footer.
- **Menu dọc** mở sẵn bên trái: rê chuột 1 danh mục → bảng con 3 cột chip (Danh mục con · Thương hiệu · Khoảng giá).
- **Banner**: nền `--brand-tint`, tiêu đề xanh đậm, 1 nút vàng + 1 nút trắng viền xanh, hình minh họa bên phải.
- Điện thoại: banner (ẩn hình) → lưới danh mục ngay dưới; ẩn 3 ô dịch vụ.

## B2. Thẻ sản phẩm (dùng chung)
Ảnh vuông nền `--sunk` (+ nhãn "Ảnh minh họa", + nhãn đỏ "-10%") · thương hiệu (chữ xanh nhỏ) · tên tối đa 2 dòng · 1 dòng thông số chính · giá đỏ 18px + đơn vị (hoặc giá KM + giá gốc gạch) · tình trạng (chấm xanh "Còn hàng" / chấm cam "Liên hệ") · nút "Thêm vào giỏ" (xanh) hoặc "Đặt trước" (vàng, khi Liên hệ). Không sao, không "đã bán".

## B3. Bộ lọc
Nhóm: Danh mục · Danh mục con · Thương hiệu (6 + "Xem thêm") · Khoảng giá · **Thông số riêng của danh mục** (quạt: loại, sải cánh, điều khiển…) · Tình trạng (Còn hàng / Liên hệ / Đang giảm giá). Mỗi lựa chọn có số lượng, ra 0 thì mờ; lựa chọn đang bật thành chip × trên kết quả. Thanh kết quả: "Tìm thấy N sản phẩm" + sắp xếp (Phổ biến, Giá thấp → cao, Giá cao → thấp, Giảm nhiều nhất, Tên A–Z); 12 món + "Xem thêm". Điện thoại: nút "Bộ lọc (n)" → bảng từ dưới lên → nút "Xem N sản phẩm".

## B4. Danh mục / Kết quả tìm kiếm
Đường dẫn (Trang chủ › Quạt › Quạt đứng) · tiêu đề · chip danh mục con · khối bộ lọc + lưới như B3. Tìm kiếm: tiêu đề "Kết quả cho “quat treo”"; không có kết quả → gợi ý danh mục + nút gọi shop.

## B5. Chi tiết sản phẩm
Ảnh lớn + dải ảnh nhỏ · tên, thương hiệu, mã hàng · giá (giá gốc gạch nếu KM) · tình trạng · chọn số lượng (số nguyên) · "Thêm vào giỏ" / "Đặt trước" · "Chat Zalo" · 3 ô cam kết (Lấy tại cửa hàng · Giao nội thành · COD/VietQR) · **bảng thông số** · mô tả · bảo hành · nút "Báo giá số lượng lớn" (mở form: danh sách món + SĐT) · SP cùng danh mục. Hết hàng → "Liên hệ", vẫn đặt được, ghi chú "Shop sẽ gọi báo thời gian có hàng".

## B6. Giỏ hàng
Danh sách món (ảnh, tên, giá, SL −/+, xóa) · tóm tắt tiền hàng · "Phí ship tính ở bước sau" · nút "Đặt hàng". Giỏ trống: hình minh họa + "Xem sản phẩm".

## B7. Thanh toán (checkout) — 1 cột trên điện thoại, gọn ~1 màn cuộn
Họ tên · SĐT (bắt buộc) · Email (tùy chọn) · **Cách nhận** 3 thẻ chọn (Đến cửa hàng lấy — 0₫ / Giao nội thành / Gửi đi tỉnh SPX, GHTK — "phí báo sau") · Địa chỉ: Tỉnh/Thành → Phường/Xã (địa giới mới, không còn cấp quận/huyện) → số nhà, tên đường · Ghi chú · Thanh toán: **COD (mặc định)** / VietQR (nhãn "Sắp có") · tóm tắt đơn + phí ship ("báo sau" khi đi tỉnh) · nút "Đặt hàng". Lỗi hiện ngay dưới ô.

## B8. Cảm ơn
Mã đơn to, rõ · tóm tắt · nếu phí ship báo sau: "Tổng tiền hàng … — phí ship sẽ được báo khi xác nhận đơn" · các bước trạng thái · nút "Tra cứu đơn" · (VietQR: khung mã QR — hiện "Sắp có").

## B9. Tra cứu đơn
Ô Mã đơn + SĐT → kết quả: các bước trạng thái (Chờ xác nhận → Đã xác nhận → Đang giao / Sẵn sàng lấy → Hoàn thành), danh sách món, tổng, phí ship, mã vận đơn.

## B10. Trang chính sách & giới thiệu
Đổi trả (nội dung "Chờ chủ shop"), Bảo hành, Vận chuyển, Thanh toán, Bảo mật, Giới thiệu + địa chỉ + bản đồ. Bố cục 1 cột đọc, rộng tối đa ~760px.

---

## C. Dữ liệu mẫu nên dùng
- 8 danh mục cha: Ống nước & phụ kiện · Thiết bị điện · Dây & cáp điện · Đèn chiếu sáng · Quạt · Dụng cụ cầm tay · Kim khí & keo · Gia dụng.
- SP mẫu: "Quạt treo tường Hali TR2 (Ghi xám)" 480.000₫ (KM 430.000₫) · "Ống nhựa PVC Bình Minh Φ21 (cây 4m)" 32.000₫ · "Dây điện Cadivi 2x2.5 (cuộn 100m)" 1.450.000₫ · "Bóng LED Rạng Đông 9W" 35.000₫ · "Máy khoan Bosch GSB 550" 1.150.000₫ · "Băng tan Tombo 10m" 8.000₫ · "Van bi đồng Miha Φ21" 95.000₫ · "Bình đun siêu tốc Midea 1.8L" 390.000₫.
- Đơn mẫu mã dạng `TTT000123`. Nhân viên mẫu: Nguyễn Văn An (NV đơn), Trần Thị Bình (NV kho), chủ shop.
- Dữ liệu mẫu chỉ để dựng giao diện; không trình bày như số liệu thật cho khách.

## D. Kỹ thuật gợi ý (không bắt buộc)
Next.js (App Router) + TypeScript + Tailwind CSS (+ shadcn/ui nếu muốn), icon Lucide, font Be Vietnam Pro qua `next/font`. Khai báo màu ở mục 3 thành biến CSS/Tailwind theme. Tách component theo màn; dữ liệu mẫu để trong `lib/mock/`.
