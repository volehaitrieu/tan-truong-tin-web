# Idea Brief — Tân Trường Tín

_Duyệt ngày 2026-10-20 · Giai đoạn 0_

| Nội dung | Giá trị | Trạng thái |
|---|---|---|
| Tên shop | Tân Trường Tín | ✅ đã chốt |
| Mô hình | 1 shop bán hàng của chính mình, nhiều ngành (không phải sàn) | ✅ đã chốt |
| Bán gì | Siêu thị **điện nước – kim khí – dụng cụ – gia dụng**: điện & đèn (~705), nước – ống – van (~671), dụng cụ & máy (~472), quạt – điện máy (~344), kim khí (~305), gia dụng bếp (~293), sơn – keo (~102), công nghệ (~46) · tổng **3.575 mã** (theo sheet DMHH; nhóm phân thử theo từ khóa) | ✅ đã chốt (cập nhật 2026-10-20) |
| Dữ liệu hàng hóa | DMHH: mã, tên, đơn vị, giá, thuế — chưa có danh mục, thương hiệu, ảnh. File quạt (~183 mã): đã có danh mục cha > con, thương hiệu, thông số chi tiết, link ảnh — dùng làm **mẫu chuẩn** cho các ngành khác | ✅ đã chốt |
| Khách hàng | Mọi lứa tuổi, gồm 4 nhóm: sinh viên (đồ phòng trọ), người lớn (dụng cụ sửa nhà), gia đình (gia dụng), thanh niên (công nghệ) | ✅ đã chốt |
| Lý do cần web | Đang bán offline, muốn bán nhiều hơn và tiếp cận khách ở xa cửa hàng | ✅ đã chốt |
| Kênh bán hiện tại | Cửa hàng offline tại phường Bắc Nha Trang, tỉnh Khánh Hòa | ✅ đã chốt |
| Quản lý kho hiện tại | File Excel | ✅ đã chốt |
| App kho cũ "Kho Mộc" | **Bỏ**, không nối hay chuyển tiếp; làm hệ thống kho mới trong admin web. Chỉ giữ lại dữ liệu Excel (DMHH, file quạt) để nhập | ✅ đã chốt |
| Hướng tồn kho | Trang quản trị web là **sổ kho chính**; nhập hàng lần đầu từ Excel, sau đó thêm màn hình "Bán tại quầy" để đơn offline và online trừ chung một kho | ✅ đã chốt |
| Người quản trị | Chủ shop + vài nhân viên, cần phân quyền (đề xuất: Chủ shop / Nhân viên đơn / Nhân viên kho) | ✅ đã chốt · phân quyền chi tiết **chưa chốt** |
| Thanh toán | COD + chuyển khoản VietQR (sau nâng lên PayOS) | ✅ đã chốt |
| Vận chuyển | Nội thành: shop tự giao hoặc gọi Grab · Đi tỉnh: SPX Express, GHTK · Khách đến cửa hàng lấy | ✅ đã chốt · cách tính phí ship **chưa chốt** |
| Phạm vi MVP | **Phương án A (sửa 2026-10-21)**: nhập đủ mã vào admin; hiện lên web mọi mã có danh mục + giá > 0; SP chưa có ảnh thật dùng **ảnh minh họa theo danh mục con**, chủ shop gửi ảnh thật sau | ✅ đã chốt |
| Bố cục tham khảo | Menu danh mục **dọc** bên trái, rê chuột mở bảng con bên phải (như CellphoneS); nhóm hàng có icon dễ chọn (như Nguyễn Kim); bộ lọc kiểu CellphoneS (thương hiệu, nhu cầu, khoảng giá, thông số) | ✅ đã chốt |
| Phong cách giao diện | Màu, font, logo | **chưa chốt** (Giai đoạn 3) |
| Logo, tên miền | Chưa có | **chưa chốt** (Giai đoạn 3) |
| Stack | Next.js + Supabase + Vercel; trang quản trị nằm ở `/admin` | ✅ đã chốt |
| Thời hạn | Đơn online đầu tiên khoảng **2026-11-20** · 5-6 giờ/ngày | ✅ đã chốt |
| Ngân sách | Chưa có | **chưa chốt** |

## Ghi chú của Mentor (đề xuất, chưa phải quyết định của chủ shop)
- Trang chủ nên có lối vào **theo nhu cầu** (Đồ phòng trọ · Sửa chữa trong nhà · Bếp & gia đình · Công nghệ) bên cạnh danh mục thông thường.
- Form địa chỉ dùng **địa giới hành chính mới** (sau năm 2025).
- Chi phí tối thiểu dự kiến: tên miền khoảng 250-750k/năm. Supabase và Vercel có gói miễn phí đủ dùng giai đoạn đầu.
