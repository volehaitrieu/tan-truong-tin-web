# Phân tích Danh mục + trang danh sách của dienmayxanh.com (điện thoại) — 06/11/2026

Cách đo: trình duyệt trong app Claude, khổ 375×812, chỉ đọc trang (không đăng nhập, không mua). Skill REA không chạy được (lỗi định dạng tham số 3 lần) nên dùng trình duyệt app thay thế.
Mục đích: tham khảo **bố cục**; không lấy ảnh, logo, màu, chữ của họ (chủ shop chọn "Theo bố cục").

## 1. Tấm Danh mục (mở từ nút MENU ở đầu trang)
- Tấm phủ toàn màn hình, thanh tiêu đề cao 48px: "Danh mục sản phẩm" (14px, đậm vừa) + nút ✕ tròn xám.
- **Cột trái 100px**: mỗi tab cao ~60px, chữ 12px, tối đa 3 dòng. Nền xám nhạt; tab đang chọn nền trắng, chữ xanh đậm, vạch màu ở mép trái. Cột trái cuộn riêng.
- **Bên phải (~250px)**: chia nhóm con, tiêu đề IN HOA 12px đậm (vd. "BẾP NÚC", "NHÀ CỬA VÀ ĐỜI SỐNG"). Dưới là **lưới 3 cột**, ô gồm ảnh 48×48 trên nền bo tròn xanh nhạt + tên 12px tối đa 2 dòng, cắt "…".
- Bấm tab trái → bên phải đổi sang nội dung nhóm đó (không mở trang mới). Bấm ô → đến trang danh sách.
- Tab đầu "Chương trình hot" là khuyến mãi — shop mình chưa cần.

## 2. Trang danh sách (vd. /noi-com-dien)
- Dòng "Trang chủ › 214 Nồi cơm điện" (có số lượng).
- Banner khuyến mãi lớn, rồi **thanh ngang: nút "Lọc" + logo thương hiệu cuộn ngang** (bấm logo = lọc nhanh).
- Lưới **2 cột** thẻ sản phẩm: ảnh vuông, nhãn ưu đãi, tên 2 dòng, **chip thông số** (1.8L, 860W, 21 chế độ nấu), giá đỏ đậm, giá gốc gạch + % giảm, sao + "Đã bán", "So sánh".
- **Bảng Bộ lọc** toàn màn hình: Thương hiệu dạng lưới logo 4 cột; Khoảng giá dạng chip có sẵn + thanh kéo; đáy dính 2 nút "Bỏ chọn" / "Xem 214 kết quả" (báo trước số kết quả).

## 3. So với web Tân Trường Tín hiện tại
| Điểm | DMX | Web mình hiện tại |
|---|---|---|
| Vào danh mục | Tấm 2 cột: tab trái + lưới ảnh 3 cột | Trang `/danh-muc`: các nhóm dạng mở/đóng (accordion), mục con là dòng chữ + số lượng |
| Ảnh từng mục | Có | Chưa có |
| Lọc nhanh thương hiệu | Hàng logo cuộn ngang | Nằm trong bảng lọc |
| Nút lọc báo trước số kết quả | Có ("Xem 214 kết quả") | Cần kiểm lại |
| Chip thông số trên thẻ | Có | Chưa (cần dữ liệu thật, không bịa) |

## Quyết định chủ shop (06/11)
- Tấm Danh mục: **mẫu A** (tab nhóm lớn bên trái + lưới ảnh 3 cột bên phải).
- Lưới chỉ hiện **danh mục con** (Quạt, Ấm siêu tốc…), **không** hiện cấp Phân loại (đứng, treo, hộp…). Áp dụng cho mọi món. Vì chỉ một cấp nên bên phải không cần tiêu đề nhóm con.

## 4. Nên lấy / không nên lấy
- **Nên lấy**: tab trái + lưới ảnh 3 cột; số lượng trên trang danh sách; nút "Xem N kết quả"; hàng thương hiệu lọc nhanh.
- **Cân nhắc**: chip thông số — chỉ hiện khi sản phẩm có thông số thật trong dữ liệu.
- **Không lấy**: banner/nhãn khuyến mãi dày đặc, "Đã bán", sao đánh giá (shop chưa có dữ liệu thật — không được bịa), màu xanh–vàng của DMX.
- Lưu ý: shop mình ít ngành hơn (vài nhóm), nên cột tab trái có thể ngắn; mẫu B/C xử lý chuyện này.

## Đo lại chi tiết (06/11, tối) — chủ shop yêu cầu làm y hệt DMX
Đo bằng trình duyệt app, 375px (REA vẫn lỗi tham số):
- Mở bằng nút danh mục → **tấm phủ toàn màn hình** (không phải trang). Nền ngoài #F2F4F7.
- Thanh đầu: dính trên, cao 48px, nền trắng, padding 12px, "Danh mục sản phẩm" 14px/500 màu #252A31; nút ✕ 24px tròn xám bên phải.
- Cột tab: rộng 100px, bắt đầu y=56 (cách thanh đầu 8px), cuộn riêng, bo góc dưới phải 16px. Mỗi tab 60px, chữ 12px, padding 12px 8px 12px 16px. Tab thường: nền #EAECF0, chữ #101828, kẻ trên 1px. Tab chọn: nền trắng, chữ #2A83E9 đậm, viền trái 2.4px #2A83E9; tab đầu bo góc trên phải 8px.
- Khung phải: x=108 (cách cột tab 8px), nền trắng, bo góc trên trái 8px, padding 8px.
- Tiêu đề nhóm: 12px đậm, IN HOA, margin 2px 0 8px.
- Ô: lưới 3 cột, mỗi ô 75×95px, ảnh ~48px trên nền xanh nhạt bo tròn, tên 12px tối đa 2 dòng (cao 36px), cắt "…".
- Bấm tab: bên phải đổi theo tab.
