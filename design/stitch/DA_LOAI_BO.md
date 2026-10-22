# Tính năng Stitch tự thêm — LOẠI khi dựng code

Đối chiếu `docs/PRD.md` (22/10/2026). Mã thô vẫn giữ nguyên trong `admin/_raw/`; danh sách này là luật khi chuyển sang Next.js. Bảng chi tiết từng màn: `admin/LOC_THEO_PRD.md`.

## Loại hẳn (ngoài phạm vi PRD)
| Tính năng Stitch tự thêm | Xuất hiện ở | Lý do |
|---|---|---|
| Ca làm việc, thu ngân, tiền mặt trong két, "Kiểm két cuối ca" | Tổng quan (MT + ĐT), Bán tại quầy MT ("Quầy #01 · Thu ngân"), Nhật ký ĐT, Nhân viên ĐT | PRD không có quản lý ca/két |
| Máy in bill K80 qua mạng LAN, "In tự động", cấu hình IP máy in, "Đồng bộ máy in nhiệt" | Bán tại quầy (MT + ĐT), Tổng quan, Cài đặt ĐT, Nhật ký MT, Nhân viên ĐT | PRD chỉ có A13 *in phiếu giao hàng / phiếu xuất kho* (in qua trình duyệt) — giữ nút "In phiếu", bỏ máy in K80 |
| Gửi qua **Zalo OA** | Ảnh thông tin SP MT, Cài đặt ĐT | A26 chỉ tải PNG / .zip / sao chép để dán Zalo — giữ "Sao chép", bỏ Zalo OA |
| Tự động lưu nháp | Sửa SP (MT + ĐT) | Không có trong PRD |
| Nhân bản sản phẩm | Sửa SP MT | Không có trong PRD |
| Công nợ, chiết khấu nhà cung cấp | Tổng quan (MT + ĐT), Nhân viên ĐT | Không quản lý nhà cung cấp/công nợ |
| Bộ chọn **chi nhánh** / "Cửa hàng chính", "Toàn bộ chi nhánh" | ~21 màn (thanh trên cùng) | Chỉ có 1 cửa hàng — thay bằng tên + địa chỉ cửa hàng, không có ô chọn |
| "Đồng bộ POS & Web", "Đồng bộ máy quét POS", "máy POS-NT01" | Danh mục MT, Khuyến mãi MT, Tồn kho MT, Sửa SP, Cài đặt ĐT, Nhật ký ĐT | Một hệ thống duy nhất, không có máy POS riêng — đổi chữ "POS" thành "Bán tại quầy" |
| Ô "Dùng làm bộ lọc POS & Tồn kho" cho thông số | Danh mục (MT + ĐT) | Giữ ý (S5: thông số làm bộ lọc trên web) nhưng đổi chữ thành "Dùng làm bộ lọc trên web" |
| Vai trò **"Quản lý"** | Nhân viên & quyền (MT + ĐT), ~10 màn | PRD chỉ có 3 vai trò: **Chủ shop · NV đơn · NV kho** (chính prompt Stitch đã thêm nhầm "Quản lý") |
| Khóa "bất biến", IP người thao tác | Nhật ký ĐT | Giữ ai/khi nào/cũ→mới; bỏ IP |

## Sửa dữ liệu giả của Stitch (bắt buộc)
- Địa chỉ "124 Đường 2/4" (21 màn) → **379 đường 2/4, phường Bắc Nha Trang, Khánh Hòa**.
- Hotline "0905.xxx.xxx" (18 màn) → **0948 732 064** (phụ 0793 783 379).
- "Hệ thống QLTT v2.4" (17 màn) → bỏ.
- Email mẫu `...@tantruongtin.vn` (17 màn) → chưa có tên miền, dùng email đăng nhập thật khi có.
- Số SP mẫu (3.700 / 3.724) → để hiển thị từ dữ liệu thật.

## Giữ dù là P1/P2 (đúng luật "giữ mọi thứ có trong PRD")
- Bán tại quầy (A21 · P2), Lãi gộp (A25 · P2), Nhật ký thao tác (A16 · P1), Xuất Excel (A19 · P1), Mã giảm giá (A20 · P1), Dashboard doanh thu (A17 · P1).
- Duyệt gợi ý AI: PRD 21/10 ghi bỏ A7, nhưng chủ shop chốt 22/10 "AI gợi ý: giao diện trước" → **giữ giao diện**, chưa nối AI.
