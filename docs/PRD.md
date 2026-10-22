# PRD — Tân Trường Tín (Web bán hàng + Trang quản trị)

_v1.0 · 2026-10-21 · Trạng thái: **đã duyệt** (v0.1 ngày 2026-10-20)_
_Nguồn: `docs/IDEA_BRIEF.md`, `docs/MENTOR_LOG.md`_

> Ký hiệu: **(đề xuất)** = Mentor đề xuất, chủ shop chưa chốt · **chưa chốt** = cần chủ shop trả lời.

---

## 1. Tổng quan
Tân Trường Tín là cửa hàng **điện nước – kim khí – dụng cụ – quạt – gia dụng** tại phường Bắc Nha Trang, Khánh Hòa, đang bán offline với khoảng **3.575 mã hàng**. Dự án gồm hai phần trong cùng một web:

- **Storefront** (trang bán hàng): khách xem hàng theo menu danh mục dọc, lọc theo thương hiệu/giá/thông số, đặt hàng, trả bằng COD hoặc chuyển khoản VietQR, nhận hàng tận nơi hoặc đến cửa hàng lấy.
- **Admin** (`/admin`): chủ shop và nhân viên quản lý sản phẩm, tồn kho, đơn hàng. **Admin là sổ kho chính**, thay thế app Kho Mộc và việc quản lý bằng Excel.

**Khác biệt:** có cửa hàng thật ở Nha Trang (đến xem, lấy hàng, bảo hành tại chỗ); hàng điện nước – kim khí đa dạng mà các web điện máy lớn ít bán; giao nhanh nội thành.

## 2. Mục tiêu
| # | Mục tiêu | Đo bằng | Hạn |
|---|---|---|---|
| G1 | Web chạy thật, nhận **đơn online đầu tiên** | Đơn thật được giao thành công | ~2026-11-20 |
| G2 | Mở bán **toàn bộ mã đủ điều kiện** (có danh mục + giá > 0), SP chưa có ảnh thật dùng ảnh minh họa; ảnh thật thay dần | Số SP hiển thị · % SP có ảnh thật | ~2026-11-20 |
| G3 | Toàn bộ 3.575 mã nằm trong admin, đã có danh mục | % mã đã gán danh mục | ~2026-11-20 |
| G4 | Nhân viên tự xử lý đơn, không cần mở Supabase/Excel | Không cần hỗ trợ kỹ thuật trong 2 tuần đầu | Sau mở bán |
| G5 | Doanh thu online (chưa chốt con số) | Doanh thu/tháng từ web | **chưa chốt** |

## 3. Người dùng & vai trò

| Vai trò | Ai | Được làm | KHÔNG được làm |
|---|---|---|---|
| **Khách** (không cần tài khoản) | Sinh viên, người sửa nhà, gia đình, thanh niên | Xem, tìm, lọc SP · thêm giỏ · đặt hàng · tra cứu đơn bằng mã đơn + SĐT | Xem giá nhập, tồn kho chính xác, đơn người khác |
| **Chủ shop** (Owner) | Chủ cửa hàng | **Mọi thứ**, kể cả giá nhập, báo cáo doanh thu, quản lý nhân viên | — |
| **Nhân viên đơn** (Order staff) | NV bán hàng | Xem/xử lý đơn, đổi trạng thái, nhập phí ship đi tỉnh, xác nhận đã nhận tiền, in phiếu | Hủy đơn · giảm giá trong đơn · xem giá nhập · sửa giá bán · xóa SP · quản lý nhân viên |
| **Nhân viên kho** (Stock staff) | NV kho | **Xem** toàn bộ thông tin SP: giá bán, **giá nhập**, tồn kho, thông số | **Chưa được sửa** gì (giá, thông tin SP, tồn kho, nhập Excel) — chủ shop sẽ mở thêm sau · xem doanh thu · xử lý thanh toán |

**Phân quyền (chốt 2026-10-21):**
- Chủ shop: toàn quyền.
- NV kho: chỉ xem (kể cả giá nhập), chưa được điều chỉnh.
- NV đơn: xử lý đơn, đổi trạng thái, xác nhận đã nhận tiền; **không** được hủy đơn, **không** được giảm giá trong đơn.
- Quyền làm dạng **công tắc bật/tắt theo từng vai trò** trong admin (A2), để chủ shop mở thêm quyền sau mà không cần sửa code.

## 4. Luồng chính

### 4.1. Khách mua hàng
```
Trang chủ / Menu dọc / Tìm kiếm
  → Trang danh mục (lọc thương hiệu, giá, thông số)
  → Chi tiết SP (ảnh, giá, thông số, tình trạng còn hàng)
  → Thêm vào giỏ → Giỏ hàng (sửa số lượng)
  → Checkout: Họ tên · SĐT (bắt buộc) · Email (tùy chọn)
              Cách nhận: Giao nội thành / Giao đi tỉnh / Đến cửa hàng lấy
              Địa chỉ (Tỉnh → Phường/Xã, theo địa giới mới) · Ghi chú
              Thanh toán: COD / Chuyển khoản VietQR
  → Trang cảm ơn: mã đơn + (nếu VietQR) mã QR có sẵn số tiền & nội dung = mã đơn
  → Tra cứu đơn bằng mã đơn + SĐT
```

### 4.2. Xử lý đơn (nhân viên)
```
Đơn mới → báo Telegram cho shop
  → NV đơn gọi/nhắn xác nhận với khách → [Đã xác nhận]  (tồn kho bị trừ ở bước này — đề xuất)
  → Đóng gói → tạo vận đơn SPX/GHTK bằng tay hoặc gọi Grab/tự giao → [Đang giao] (nhập mã vận đơn)
  → [Hoàn thành]  (COD: đánh dấu đã thu tiền)
  Nhánh: [Hủy] ở bất kỳ bước nào trước Hoàn thành → hoàn lại tồn kho
  Đến cửa hàng lấy: [Đã xác nhận] → [Sẵn sàng lấy] → [Hoàn thành]
```
Trạng thái thanh toán tách riêng: **Chưa thanh toán → Đã thanh toán** (NV đơn xác nhận sau khi thấy tiền vào tài khoản) / Hoàn tiền.

### 4.3. Nhập hàng & đưa SP lên web (nhân viên kho / chủ shop)
```
Tải file Excel (mẫu DMHH hoặc mẫu quạt) → xem trước, báo lỗi từng dòng
  → Nhập vào kho (SP ở trạng thái "Ẩn")
  → Gán/duyệt danh mục, thương hiệu, thông số (AI gợi ý, người duyệt)
  → Upload ảnh → bật "Hiển thị"
  → Kiểm đếm → nhập tồn đầu kỳ (một lần, riêng với danh mục)
```

## 5. Tính năng theo ưu tiên

**P0** = bắt buộc trước khi mở bán (~20/11) · **P1** = ngay sau mở bán · **P2** = để sau · **P3** = có thể bỏ.

### 5.1. Storefront
| ID | Tính năng | Ưu tiên | Ghi chú |
|---|---|---|---|
| S1 | Trang chủ: banner, lối vào theo nhu cầu (Phòng trọ · Sửa nhà · Bếp & gia đình · Công nghệ), danh mục nổi bật có icon, SP nổi bật | P0 | Bố cục chi tiết ở `DESIGN.md` |
| S2 | **Menu danh mục dọc** bên trái, rê chuột mở bảng con (danh mục con + thương hiệu); trên điện thoại là menu trượt | P0 | Tham khảo CellphoneS + Nguyễn Kim |
| S3 | Trang danh mục: lưới SP, sắp xếp (mới, giá tăng/giảm), phân trang | P0 | |
| S4 | **Bộ lọc** theo thương hiệu + khoảng giá | P0 | |
| S5 | Bộ lọc theo **thông số riêng từng danh mục** (quạt: loại, sải cánh, điều khiển…) + tình trạng (còn hàng / liên hệ / đang giảm giá); hiện số lượng cạnh mỗi lựa chọn | **P0** | Nâng từ P1 lên P0 (2026-10-21). Bắt đầu với nhóm Quạt |
| S6 | Bộ lọc theo **nhu cầu** (Phòng trọ, Sửa nhà…) | P1 | Cần gắn nhãn SP |
| S7 | **Tìm kiếm** theo tên/mã/thương hiệu, gõ **không dấu** vẫn ra ("quat treo" → "Quạt treo") | P0 | |
| S8 | Chi tiết SP: 1-5 ảnh, giá (đã gồm VAT), đơn vị tính, thông số dạng bảng, bảo hành, xuất xứ, tình trạng (Còn hàng / **Liên hệ**), nút Thêm giỏ + nút Chat Zalo | P0 | Hết hàng → nhãn "Liên hệ", khách **vẫn đặt được**; đơn ghi chú "cần đặt hàng", NV gọi báo thời gian có hàng |
| S8b | Ảnh minh họa cho SP chưa có ảnh thật, gắn nhãn "Ảnh minh họa" | P0 | Mỗi danh mục con 1 hình vẽ dùng chung (~80-120 hình). Không dùng ảnh do shop khác chụp |
| S9 | Giỏ hàng lưu trên trình duyệt (tắt máy mở lại vẫn còn) | P0 | |
| S10 | Checkout khách không cần tài khoản; 3 cách nhận hàng; COD / VietQR | P0 | **Tổng tiền tính ở server** |
| S11 | Phí ship: **lấy tại cửa hàng = 0₫** · **đi tỉnh (SPX/GHTK) = "nhân viên báo phí khi xác nhận đơn"** · **nội thành = theo cài đặt của chủ shop** (A15; mức phí và ngưỡng miễn phí **chưa chốt** — khi chưa đặt thì cũng hiện "báo phí sau") | P0 | Chốt một phần 2026-10-21 |
| S11b | Đơn có phí ship "báo sau": trang cảm ơn ghi rõ tổng tiền hàng + "phí ship sẽ được báo". VietQR chỉ hiện **sau khi** NV nhập phí ship và xác nhận (xem trong Tra cứu đơn) để số tiền chuyển khoản đúng | P0 | (đề xuất) |
| S12 | Trang cảm ơn + mã QR VietQR | P0 | |
| S13 | Tra cứu đơn (mã đơn + SĐT) | P0 | |
| S14 | Trang chính sách: đổi trả, bảo hành, vận chuyển, thanh toán, bảo mật; giới thiệu & địa chỉ cửa hàng + bản đồ | P0 | Bắt buộc theo quy định TMĐT |
| S15 | SEO cơ bản: tiêu đề/mô tả từng trang, ảnh chia sẻ Facebook/Zalo, sitemap | P0 | |
| S16 | Nút Zalo / gọi điện nổi | P0 | |
| S16d | Nút **"Báo giá số lượng lớn"** cho thợ/công trình: gửi danh sách món + SĐT, nhân viên gọi báo giá riêng (web chỉ có 1 giá cho mọi khách) | P0 | Chốt 2026-10-21 |
| S16b | Trang chủ: hàng **"Sản phẩm đang giảm giá"** (trượt ngang, nút trái/phải, vuốt trên điện thoại) + khối **"Tất cả sản phẩm"** có bộ lọc bên trái (điện thoại: nút "Bộ lọc" mở bảng từ dưới lên) | P0 | Thêm 2026-10-21 theo góp ý mẫu trang chủ |
| S16c | Hàng **thương hiệu** 1 dòng, nút trái/phải, vuốt trên điện thoại; bấm vào thương hiệu → lọc SP | P0 | |
| S17 | SP liên quan / cùng danh mục | P1 | |
| S18 | Tài khoản khách, lịch sử mua, địa chỉ đã lưu | P2 | |
| S19 | Đánh giá SP | P2 | |
| S20 | So sánh SP | P3 | |

### 5.2. Admin
| ID | Tính năng | Vai trò | Ưu tiên | Ghi chú |
|---|---|---|---|---|
| A1 | Đăng nhập email + mật khẩu; chặn mọi người không có vai trò khỏi `/admin` | Tất cả | P0 | |
| A2 | Quản lý nhân viên: mời, gán vai trò, khóa tài khoản; **bảng quyền bật/tắt theo vai trò** (xem giá nhập, sửa SP, sửa giá, chỉnh tồn, nhập Excel, hủy đơn, giảm giá trong đơn) | Chủ shop | P0 | Quyền kiểm tra ở server + database, không chỉ ẩn nút |
| A12b | NV đơn **nhập phí ship** cho đơn đi tỉnh / đơn nội thành chưa có mức phí → hệ thống cập nhật tổng tiền, mở VietQR cho khách | Chủ, Đơn | P0 | |
| A3 | **Danh sách SP**: tìm, lọc theo danh mục/thương hiệu/trạng thái (Ẩn/Hiển thị, có ảnh/chưa có ảnh, thiếu thông tin) | Chủ, Kho | P0 | Xử lý được 3.575+ dòng mượt |
| A4 | **Form SP**: tên, SKU, đơn vị, giá bán, **giá nhập (chỉ vai trò có quyền xem giá nhập)**, danh mục, thương hiệu, thông số theo danh mục, ảnh, mô tả, bảo hành, xuất xứ, cân nặng, nhãn nhu cầu, Ẩn/Hiển thị | Chủ, Kho | P0 | |
| A5 | **Nhập Excel** theo 2 mẫu (DMHH, file quạt): xem trước, báo lỗi từng dòng (thiếu SKU, trùng SKU, giá 0, đơn vị lạ), không ghi đè khi chưa xác nhận | Chủ, Kho | P0 | |
| A6 | Chuẩn hóa đơn vị tính (kg/Kg → kg, m/Mét → m) khi nhập | — | P0 | |
| A7 | **AI gợi ý danh mục + thương hiệu** từ tên SP cho ~3.400 mã chưa phân loại; người duyệt hàng loạt | Chủ, Kho | P0 | Dùng Claude API (đề xuất) |
| A8 | Quản lý **cây danh mục** (cha > con, icon, thứ tự) và **bộ thông số** của từng danh mục | Chủ | P0 | |
| A9 | Quản lý thương hiệu (tên, logo) | Chủ, Kho | P0 | |
| A10 | Upload ảnh SP (tự nén, đổi sang webp); tải ảnh từ link về kho ảnh của shop; đánh dấu ảnh thật / ảnh minh họa | Chủ, Kho | P0 | Không link thẳng ảnh web hãng. Ảnh chủ shop cung cấp luôn thay thế ảnh minh họa |
| A11 | **Tồn kho**: nhập tồn đầu kỳ, điều chỉnh (+/−) kèm lý do, lịch sử thay đổi (ai, khi nào) | Chủ, Kho | P0 | |
| A12 | **Đơn hàng**: danh sách lọc theo trạng thái/ngày/cách nhận, chi tiết đơn, đổi trạng thái, nhập mã vận đơn, xác nhận đã nhận tiền, ghi chú nội bộ | Chủ, Đơn | P0 | |
| A13 | In phiếu giao hàng / phiếu xuất kho | Chủ, Đơn | P0 | |
| A14 | Báo đơn mới qua **Telegram** | — | P0 | |
| A15 | Cài đặt cửa hàng: thông tin, bảng phí ship, tài khoản ngân hàng cho VietQR | Chủ | P0 | |
| A15b | **Giá khuyến mãi** theo SP: giá giảm, ngày bắt đầu/kết thúc; tự hiện % giảm và giá gốc gạch ngang | Chủ | P0 | Cần cho mục "Sản phẩm đang giảm giá" (thêm 2026-10-21) |
| A26 | **Ảnh thông tin sản phẩm để gửi khách**: nút icon tải ở danh sách và trang sửa SP → ảnh PNG 1080×1080 (ảnh SP, tên, thông số chọn được, giá/giá KM, ngày giá, logo, địa chỉ, Zalo); tải nhiều → .zip; sao chép để dán Zalo | Chủ, Kho | P0 | Thêm 2026-10-21 |
| A27 | **Đợt kiểm kho** theo danh mục/kệ, giao nhân viên; **đếm trên điện thoại** (đếm mù tùy chọn); so sánh lệch; chốt đợt → ghi tồn | Chủ, Kho | P0 | Thêm 2026-10-21. NV kho được đếm |
| A16 | Nhật ký thao tác (ai sửa giá, ai hủy đơn) | Chủ | P1 | |
| A17 | Dashboard: doanh thu hôm nay/tuần/tháng, số đơn mới, SP sắp hết | Chủ | P1 | |
| A18 | Cảnh báo sắp hết: tồn ≤ **tồn tối thiểu** → nhãn 'Sắp hết' + thẻ ở Tổng quan | Chủ, Kho | **P0** | Nâng từ P1 (2026-10-21). Tồn kho + tồn tối thiểu nhập từ Excel (A5) |
| A19 | Xuất Excel (SP, tồn kho, đơn hàng) | Chủ | P1 | |
| A20 | Mã giảm giá | Chủ | P1 | |
| A21 | **Bán tại quầy** (POS) — đơn offline trừ chung kho | Chủ, Đơn | P2 | Hướng A đã chốt, làm sau mở bán |
| A22 | PayOS tự xác nhận chuyển khoản | — | P2 | |
| A23 | Tạo vận đơn tự động qua API SPX/GHTK | — | P2 | |
| A24 | Biến thể (màu/size có tồn riêng) | Chủ, Kho | P2 | Tạm thời: mỗi biến thể là 1 SKU riêng |
| A25 | Báo cáo lãi gộp (giá bán − giá nhập) | Chủ | P2 | |

## 6. Ngoài phạm vi (cố tình chưa làm trong MVP)
- App Kho Mộc: **bỏ**, không nối, không chuyển dữ liệu từ app (chỉ nhập từ Excel).
- Sàn nhiều người bán; app di động riêng; đa ngôn ngữ.
- Thanh toán thẻ/ví (VNPay, MoMo); trả góp.
- Tích điểm, hạng thành viên, flash sale có đếm ngược.
- Chat trực tuyến trong web (dùng nút Zalo thay thế).
- Hóa đơn điện tử tự động (vẫn xuất bằng phần mềm hiện tại của shop).

## 7. Yêu cầu phi chức năng
- **Mobile-first:** mọi trang dùng tốt trên điện thoại màn 360px; nút bấm to; checkout ≤ 1 màn hình cuộn.
- **Tốc độ:** trang chủ, danh mục tải < 2,5 giây trên 4G; ảnh nén webp, tải dần.
- **Bảo mật:**
  - Bật RLS (luật để mỗi người chỉ thấy dữ liệu được phép) cho **mọi bảng** ngay từ đầu.
  - Giá nhập chỉ đọc được bởi vai trò có quyền "xem giá nhập" (hiện tại: Chủ shop + NV kho; NV đơn và khách không xem được) — chặn ở database, không chỉ ẩn trên giao diện.
  - Tổng tiền, phí ship, tồn kho luôn tính và kiểm tra **ở server**; không tin giá gửi từ trình duyệt.
  - Khóa `service_role` của Supabase chỉ dùng phía server.
- **Dữ liệu:** giá lưu bằng **đồng, số nguyên** (480.000, không lưu 480). Hiển thị `480.000₫`.
- **Tìm kiếm tiếng Việt** gõ không dấu vẫn ra kết quả.
- **Địa chỉ** theo địa giới hành chính mới (sau 2025).
- **Pháp lý (chủ shop tự kiểm tra):** thông báo website TMĐT với Bộ Công Thương (online.gov.vn); trang chính sách; tuân thủ quy định bảo vệ dữ liệu cá nhân — chỉ thu thập SĐT, tên, địa chỉ cần cho giao hàng.
- **Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui · Supabase (Postgres, Auth, Storage) · GitHub + Vercel.

## 8. Chỉ số theo dõi
- Số SP đang hiển thị · % SP có ảnh · % SP đã có danh mục.
- Lượt truy cập/ngày · tỉ lệ thêm giỏ · tỉ lệ đặt hàng thành công.
- Số đơn/ngày, giá trị đơn trung bình, tỉ lệ hủy/bom hàng (COD).
- Thời gian từ lúc có đơn đến lúc xác nhận.

## 9. Mốc thời gian (đề xuất, ~5-6 giờ/ngày)
| Tuần | Khoảng ngày | Việc chính |
|---|---|---|
| 1 | 21-27/10 | Hoàn tất tài liệu (PRD, DESIGN, DEV_PLAN) · thiết kế giao diện · dựng nền dự án · database & đăng nhập |
| 2 | 28/10-3/11 | Admin: SP, danh mục, thương hiệu, nhập Excel, AI phân loại, ảnh · bắt đầu chụp/thu thập ảnh 200-300 món |
| 3 | 4-10/11 | Storefront: menu dọc, danh mục, lọc, tìm kiếm, chi tiết SP, giỏ hàng, checkout |
| 4 | 11-17/11 | Admin đơn hàng, Telegram, VietQR, phí ship · kiểm thử · bảo mật · deploy · tên miền |
| — | 18-20/11 | Mở bán thử, đơn thật đầu tiên |

⚠️ Rủi ro lớn nhất về thời gian: **chuẩn bị ảnh + duyệt danh mục** (việc của chủ shop/nhân viên, không phải code). Nên bắt đầu chụp ảnh từ tuần 1.

## 10. Quyết định đã chốt (2026-10-21)
- Giá trong file Excel là **nghìn đồng** (480 = 480.000₫). Khi nhập: nhân 1.000, lưu bằng đồng.
- Giá bán **đã gồm VAT**.
- Hết hàng → hiển thị **"Liên hệ"**, khách vẫn đặt được.
- **Ảnh:** SP chưa có ảnh do chủ shop cung cấp → dùng **ảnh minh họa**, gắn nhãn "Ảnh minh họa". Ảnh chủ shop gửi luôn được ưu tiên.
- Đồng ý 3 đề xuất: trừ tồn khi đơn "Đã xác nhận" (hoàn lại khi hủy) · 3 vai trò Chủ / Đơn / Kho (cập nhật 2026-10-21: NV kho cũng xem được giá nhập, chỉ xem) · AI (Claude API) gợi ý danh mục + thương hiệu, người duyệt.

### Chốt thêm 2026-10-21
- **Phát hành 2 đợt:** Đợt 1 = trang bán hàng đầy đủ (xem, lọc, giỏ, đặt hàng, báo giá số lượng lớn…) + admin tối thiểu (đơn hàng, sửa giá, ẩn/hiện SP). Đợt 2 = phần admin còn lại.
- **Kiểm đếm hết tồn kho trước khi mở bán.**
- **Số lượng đặt chỉ số nguyên**, kể cả hàng bán theo mét/kg.
- **Giá sỉ:** không có bảng giá sỉ; dùng nút "Báo giá số lượng lớn".
- **Phân loại 3.400 mã:** Mentor làm trong phiên, xuất Excel cho chủ shop duyệt (bỏ tính năng AI trong admin, A7 → không làm).
- **Báo đơn mới:** Telegram.

### Chốt thêm 2026-10-21 (sau canvas Admin)
- **Làm Admin trước**, trang bán hàng sau.
- Excel có thêm cột **Tồn kho** và **Tồn tối thiểu** → tồn đầu kỳ + cảnh báo sắp hết.
- NV kho **được đếm** trong đợt kiểm kho (vẫn không điều chỉnh tay).
- **Không xóa sản phẩm**, chỉ Ẩn.
- Thêm tính năng **Ảnh thông tin sản phẩm** (A26) và **Đợt kiểm kho** (A27).

## 11. Câu hỏi chưa chốt
1. Có dùng ảnh web hãng không (sau khi hỏi nhà phân phối/hãng)?
2. _(đã chốt 2026-10-21: tạm dùng ảnh minh họa theo danh mục con cho toàn bộ SP, hiện lên web ngay; chủ shop gửi ảnh thật sau)_
3. **Phí ship nội thành** (đồng giá / theo vùng / theo km / miễn phí) và **ngưỡng miễn phí ship** — chủ shop chốt sau; admin cho phép tự cài. _(đi tỉnh đã chốt: nhân viên báo phí sau)_
4. _(đã chốt 2026-10-21: NV kho chỉ xem, kể cả giá nhập; NV đơn không hủy, không giảm giá; quyền mở thêm sau bằng bảng bật/tắt)_
5. Danh sách **200-300 món chủ lực** — chủ shop chọn hay dựa vào món bán chạy?
6. Ngân sách hàng tháng (tên miền, Claude API, quảng cáo).
7. Giới hạn khu vực giao nội thành (bán kính / danh sách phường)?
8. Có cần xuất hóa đơn VAT cho khách online không?
