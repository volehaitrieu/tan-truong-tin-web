# Design Guideline — Tân Trường Tín

_v1.0 · 2026-10-21 · Trạng thái: **đã duyệt** (theo mẫu trang chủ v3)_
_Mẫu tham chiếu (bản xem online): https://claude.ai/artifact/E5Vo4W6s1hL8aqcbgrWthg_

> Khi code thật, **mẫu v3 là chuẩn**: màu, chữ, khoảng cách, cách hoạt động của menu và bộ lọc lấy đúng theo file mẫu. Tài liệu này giải thích các quy tắc đằng sau để áp dụng cho những trang chưa có mẫu.

---

## 1. Tính cách thương hiệu
**Tin cậy · Rõ ràng · Gần gũi.**
- Tin cậy: cửa hàng thật ở Nha Trang, giá thật, không số liệu bịa.
- Rõ ràng: khách tìm đúng món trong vài giây (menu dọc, lưới danh mục, bộ lọc).
- Gần gũi: lời lẽ như nhân viên tại quầy, không quảng cáo phô trương.

Slogan: _"Chất lượng tạo niềm tin, dịch vụ tạo khác biệt."_

## 1b. Logo (chốt 2026-10-21)
| File | Dùng cho |
|---|---|
| `docs/brand/logo-trong-suot.png` (651×651, nền trong suốt) | **Bản chính**: header, trang đăng nhập, ảnh thông tin sản phẩm, mạng xã hội |
| `docs/brand/logo-512.png` | Web (header, admin), Open Graph |
| `docs/brand/logo-64-favicon.png` | Icon tab trình duyệt (favicon) |
| `docs/brand/logo-mark.svg` | Dự phòng ở cỡ rất nhỏ (bản vẽ lại, màu phẳng, gần giống) |
| `docs/brand/logo-goc.webp` | Lưu bản gốc, không dùng trực tiếp |

- Nguồn: `OneDrive\Desktop\Tân Trường Tín\logo.png` (đã tách nền ô caro, giữ nguyên hình và màu).
- **Ngoại lệ màu chuyển sắc:** logo giữ màu chuyển xanh đậm → xanh ngọc của bản gốc; mọi phần khác của web vẫn dùng màu phẳng.
- Kích thước tối thiểu: 32px trên web. Chừa khoảng trống quanh logo ≥ 1/4 chiều rộng logo.
- Tên luôn đi kèm logo: **TÂN TRƯỜNG TÍN** (chữ in hoa, đậm 800, màu `--brand`). Không kéo méo, không đổi màu, không đặt trên nền ảnh rối.
- In khổ lớn (biển hiệu, bao bì): cần bản vector do nhà thiết kế làm; file PNG hiện tại chỉ đủ cho web và ảnh gửi khách.

## 2. Màu sắc
Web **chỉ dùng giao diện sáng** (không có chế độ tối, kể cả khi máy khách bật chế độ tối). Xanh lá theo logo là màu chính; vàng nhắc biển hiệu cửa hàng là màu nhấn.

| Token | Mã màu | Dùng cho |
|---|---|---|
| `--brand` | `#0D6B45` | Nút chính "Thêm vào giỏ", chữ thương hiệu, icon, link |
| `--brand-deep` | `#08482F` | Tiêu đề lớn trên nền xanh nhạt, nút khi rê chuột |
| `--brand-tint` | `#E3F2E9` | Nền banner, thanh trên cùng, mục menu đang chọn, chip đã lọc |
| `--gold` | `#F2B705` | Nút nhấn mạnh (CTA banner, "Đặt trước"), số trên giỏ hàng, viền focus |
| `--gold-ink` | `#3A2C00` | Chữ trên nền vàng |
| `--gold-tint` | `#FFF3C7` | Ô nổi bật nhẹ (ví dụ "Đặt online, lấy tại cửa hàng") |
| `--ground` | `#F7FAF7` | Nền trang |
| `--surface` | `#FFFFFF` | Thẻ sản phẩm, menu, bộ lọc, khung |
| `--sunk` | `#EEF3EF` | Nền ảnh sản phẩm, chip chưa chọn, đường chia rất nhạt |
| `--ink` | `#14231B` | Chữ chính |
| `--ink-2` | `#4B5A51` | Chữ phụ, mô tả, thông số |
| `--danger` | `#B3261E` | **Giá bán**, nhãn % giảm |
| `--ok` | `#1B7A47` | "Còn hàng" |
| ask | `#B7791F` | "Liên hệ" (hết hàng, vẫn đặt được) |

**Quy tắc:**
- Các vùng tách nhau bằng **bậc màu nền** (ground → surface → sunk), không dùng viền đậm hay bóng đổ.
- Bóng đổ chỉ dùng cho thứ **nổi lên trên** trang: bảng con menu, kết quả tìm kiếm, bảng bộ lọc trên điện thoại.
- Không dùng gradient, không nền tối lớn.
- Màu vàng chỉ dùng cho 1-2 thứ cần chú ý trên mỗi màn hình.

## 3. Chữ
- Font duy nhất: **Be Vietnam Pro** (Google Fonts, hỗ trợ tiếng Việt đầy đủ), trọng lượng 400 / 500 / 600 / 700 / 800. Font dự phòng: `system-ui, Segoe UI, Roboto, Arial, sans-serif`.

| Vai trò | Cỡ | Đậm |
|---|---|---|
| Tiêu đề banner (h1) | 28-40px (co theo màn hình) | 800 |
| Tiêu đề mục (h2) | 22-30px | 800 |
| Tiêu đề thẻ, tiêu đề nhỏ | 14-19px | 500-800 |
| Chữ thường | 15px, giãn dòng 1.5 | 400 |
| Chữ phụ, thông số | 12.5-13.5px | 400-500 |
| Giá sản phẩm | 18px | 800, số đều cột |

- **Tiêu đề tối đa 2 dòng** ở mọi kích thước màn hình (khoảng ≤ 32 ký tự cho h1).
- Không dùng chữ IN HOA nhỏ giãn cách, không đánh số trang trí kiểu 01/02/03.
- Giá hiển thị dạng `480.000₫` (`Intl.NumberFormat('vi-VN')`), giá gốc gạch ngang màu `--ink-2`.

## 4. Khoảng cách, bo góc, bố cục
- Chiều rộng tối đa nội dung: **1240px**, lề hai bên tối thiểu **16px** (tính cả tai thỏ điện thoại).
- Khoảng cách giữa các phần tử: 8 / 12 / 16 / 24px. Giữa các mục lớn: ~40px.
- Bo góc: **6px** cho thẻ, nút, ô nhập; **tròn hẳn** cho chip lọc và nút trượt ‹ ›.
- Điểm ngắt màn hình: **≤ 1180px** (máy tính bảng ngang), **≤ 860px** (điện thoại / tablet dọc), **≤ 420px** (điện thoại nhỏ).

## 5. Thành phần (component)

| Thành phần | Mô tả |
|---|---|
| **Header** | Logo + tên + dòng phụ "Điện nước · Gia dụng · Dụng cụ" · ô tìm kiếm viền xanh (gõ không dấu vẫn tìm ra) · Tra cứu đơn · Giỏ hàng có số đếm vàng. Dính trên đầu khi cuộn |
| **Thanh trên cùng** | Nền xanh nhạt: địa chỉ cửa hàng, giờ mở cửa, hotline |
| **Menu danh mục dọc** | Mở sẵn bên trái trên máy tính. Rê chuột hoặc focus → **bảng con** gồm 3 cột chip: Danh mục con · Thương hiệu · Khoảng giá. **Bấm chip → lọc thẳng mục Tất cả sản phẩm** |
| **Banner** | Nền xanh nhạt, tiêu đề xanh đậm, 1 nút vàng + 1 nút trắng, ảnh minh họa bên phải. Cạnh banner là 3 ô dịch vụ (ẩn trên điện thoại) |
| **Lưới danh mục** | 8 ô có icon tròn + tên + số mặt hàng. Máy tính 8 cột, điện thoại 4 cột. Bấm → lọc |
| **Ô nhu cầu** | 4 ô: Phòng trọ · Sửa nhà · Bếp & gia đình · Công trình. Nền xen kẽ xanh nhạt / trắng / vàng nhạt |
| **Thẻ sản phẩm** | Ảnh vuông nền `--sunk` + nhãn "Ảnh minh họa" (nếu có) + nhãn % giảm · thương hiệu (xanh) · tên tối đa 2 dòng · thông số chính · giá đỏ + đơn vị hoặc giá gốc gạch · tình trạng (chấm xanh "Còn hàng" / chấm cam "Liên hệ") · nút "Thêm vào giỏ" (xanh) hoặc "Đặt trước" (vàng) |
| **Hàng trượt** | Dùng cho "Đang giảm giá" và "Thương hiệu": 1 hàng, nút ‹ › tròn (mờ khi hết), vuốt cảm ứng trên điện thoại, cuộn bắt khớp từng thẻ |
| **Bộ lọc** | Cột trái 250px, dính khi cuộn. Nhóm: Danh mục · Danh mục con · Thương hiệu (6 + "Xem thêm") · Khoảng giá · **Thông số riêng theo danh mục** (quạt: sải cánh…) · Tình trạng. Mỗi lựa chọn có **số lượng**, lựa chọn ra 0 thì mờ. Lựa chọn đang bật hiện thành chip có × phía trên kết quả. **Điện thoại:** nút "Bộ lọc (n)" mở bảng từ dưới lên, nút "Xem N sản phẩm" |
| **Thanh kết quả** | "Tìm thấy N sản phẩm" + sắp xếp (Phổ biến, Giá thấp/cao, Giảm nhiều nhất, Tên A–Z). Hiện 12 món, "Xem thêm" thêm 12 |
| **Nút** | Cao 46px (banner), 40px (thẻ). Xanh = hành động chính; vàng = nhấn mạnh / đặt trước; trắng viền xanh = phụ |
| **Toast** | Thông báo ngắn ở đáy: "Đã thêm vào giỏ: …" |
| **Thanh đáy điện thoại** | Trang chủ · Danh mục (mở ngăn kéo) · Giỏ hàng (số đếm) · Tra cứu đơn |
| **Ngăn kéo danh mục (điện thoại)** | Trượt từ trái, mỗi danh mục mở ra chip "Xem tất cả" + danh mục con, bấm là lọc |
| **Focus bàn phím** | Viền vàng 3px quanh phần tử đang chọn |

## 6. Trang & bố cục

### 6.1. Trang chủ (đã có mẫu v3)
Thứ tự: Thanh trên cùng → Header → [Menu dọc | Banner | 3 ô dịch vụ] → Danh mục hàng hóa → Mua theo nhu cầu → **Sản phẩm đang giảm giá** → **Tất cả sản phẩm (có bộ lọc)** → Thương hiệu → Cách mua (3 cách nhận + 2 cách trả tiền) → Ghé cửa hàng (ảnh mặt tiền thật) → Footer.
Điện thoại: banner → lưới danh mục ngay bên dưới (ẩn 3 ô dịch vụ, ẩn hình banner).

### 6.2. Trang danh mục / kết quả tìm kiếm (chưa có mẫu)
Dùng lại **đúng khối "Tất cả sản phẩm"** (bộ lọc trái + lưới), thêm: đường dẫn (Trang chủ › Quạt › Quạt đứng), tiêu đề danh mục, chip danh mục con ở đầu trang. Tìm kiếm: tiêu đề "Kết quả cho “…”".

### 6.3. Chi tiết sản phẩm (chưa có mẫu)
Ảnh lớn + ảnh nhỏ bên dưới · tên, thương hiệu, mã hàng · giá (giá gốc nếu giảm) · tình trạng · chọn số lượng · nút Thêm vào giỏ / Đặt trước · nút Chat Zalo · 3 ô cam kết (lấy tại cửa hàng, giao nội thành, COD/VietQR) · **bảng thông số** · mô tả · bảo hành · SP cùng danh mục (P1).
**Không** có sao đánh giá, "đã bán", "yêu thích" cho tới khi có dữ liệu thật (P2).

### 6.4. Giỏ hàng & Checkout (chưa có mẫu)
Một cột trên điện thoại, checkout gọn trong ~1 màn hình cuộn: Họ tên · SĐT (bắt buộc) · Email (tùy chọn) · Cách nhận (3 lựa chọn dạng thẻ) · Địa chỉ (Tỉnh → Phường/Xã, địa giới mới) · Ghi chú · Thanh toán (COD / VietQR) · Tóm tắt đơn + phí ship tính ở server.

### 6.5. Cảm ơn & Tra cứu đơn
Mã đơn to, rõ · mã QR VietQR (nếu chọn chuyển khoản) · các bước trạng thái đơn.

### 6.6. Admin (`/admin`)
Theo bộ ảnh admin chủ shop gửi: **menu dọc bên trái** (Tổng quan, Sản phẩm, Đơn hàng, Danh mục, Thương hiệu, Khuyến mãi, Nhân viên, Cài đặt), bảng dữ liệu gọn, nhãn trạng thái màu (Còn hàng / Sắp hết / Hết hàng; Chờ xác nhận / Đang giao / Hoàn thành / Hủy).
Cùng màu và font với storefront, nhưng mật độ dày hơn (chữ 14px, hàng bảng 44px). Được dùng đường kẻ mảnh trong bảng. Không gradient, không biểu đồ nhiều màu, không số liệu giả.
Chỉ làm các module trong PRD P0; Khách hàng, Đánh giá, So sánh, Nội dung, Ngôn ngữ để sau.

## 7. Ảnh sản phẩm
- Khung **vuông 1:1**, nền `--sunk`, sản phẩm nằm giữa, chiếm ~70% khung. Ảnh thật: nền trắng hoặc trong suốt.
- Lưu dạng **WebP**, cạnh dài 1000px (ảnh lớn) và 400px (ảnh thẻ); tự nén khi upload.
- **Chưa có ảnh thật → ảnh minh họa theo danh mục con**, vẽ phẳng bằng màu xanh/vàng của bộ nhận diện, luôn có nhãn **"Ảnh minh họa"**. Ảnh chủ shop gửi luôn thay thế ảnh minh họa.
- Không dùng ảnh do cửa hàng khác chụp. Ảnh hãng chỉ dùng khi được nhà phân phối/hãng cho phép, tải về lưu trên kho ảnh của shop.
- Thương hiệu hiển thị **bằng chữ**, không dùng logo hãng khi chưa được phép.

## 8. Giọng văn (UX copy)
- Xưng "bạn", nói như nhân viên tại quầy: ngắn, rõ, có ích.
- Nút ghi đúng việc sẽ xảy ra: "Thêm vào giỏ", "Đặt trước", "Xem 14 sản phẩm".
- Báo lỗi nói rõ sai gì và sửa thế nào: "Số điện thoại cần 10 số, bắt đầu bằng 0."
- Không dùng: "Hỗ trợ 24/7", "Giao toàn quốc siêu tốc", "Hàng chính hãng 100%" nếu chưa đúng thực tế.

## 9. Không được làm
- Số liệu bịa: sao đánh giá, "đã bán 1.2k", số khách hàng.
- Thông tin mẫu khi lên web thật (địa chỉ TP.HCM, SĐT 0901…).
- Gradient, nền tối lớn, chế độ tối, glow, kính mờ.
- Danh mục cửa hàng không bán (Thời trang, Làm đẹp, Thể thao).

## 10. Việc còn treo
- ~~Logo~~: đã có PNG trong suốt chính thức (mục 1b). Còn thiếu bản vector để in khổ lớn.
- **Thông tin liên hệ thật**: số nhà, SĐT, Zalo, giờ mở cửa.
- **Bộ ~80-120 ảnh minh họa** theo danh mục con (mẫu đang có ~25 hình).
- Mẫu cho trang chi tiết SP, giỏ hàng/checkout, admin (vẽ khi tới Giai đoạn 6-7).
