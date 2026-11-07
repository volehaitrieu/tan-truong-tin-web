# Bộ lọc gọn + thanh đáy + tấm Danh mục — 4. Rà soát (Claude Code, 07/11/2026)

Codex làm phần lớn rồi hết hạn mức giữa chừng; Claude Code rà, sửa nốt và kiểm.

## Claude Code sửa thêm
- `CategoryDrawer.tsx`: đọc `ref` trong lúc vẽ (ESLint `react-hooks/refs` báo lỗi) → lưu nơi gắn tấm (`.store`) vào state khi mở.
- `ProductBrowser.tsx`: hai đầu thanh giá trước đây co theo hãng đang tick → số đếm hãng khác sai (ChingHai 17 → 2). Nay cố định theo cả danh sách.
- `ProductBrowser.tsx`: nút Lọc ẩn trên máy tính (đã có cột lọc bên trái); bỏ dòng trống thừa.

## Đã kiểm (localhost:3000, 375px)
- `npx tsc --noEmit` đạt; ESLint 7 tệp storefront đạt.
- `/danh-muc/quat`: đầu trang chỉ còn Lọc (có chấm nhỏ) + "Khoảng giá" + thanh kéo. Kéo đầu thấp → URL `?min=950000`, còn 37/100 SP; mở Lọc thấy giá khớp.
- Bảng Lọc: bấm "Xem thêm" rồi tick Hali → vẫn mở rộng ("Thu gọn" còn hiện). Số đếm hãng đúng.
- Tấm Danh mục: màu web (nền kem, tab chọn chữ đen + vạch trái), đáy tấm = đỉnh thanh đáy (không che), nút Danh mục sáng; bấm Trang chủ khi tấm mở → đóng và về `/`.
- Thanh đáy sáng đúng nút ở `/`, `/danh-muc/quat`, `/gio-hang`, `/tra-cuu`; không tràn ngang.

## Chưa kiểm
- Bằng mắt hiệu ứng trượt/phập phồng và chế độ giảm chuyển động (mã có chặn `prefers-reduced-motion`).
- Máy tính (≥768px), điện thoại thật (safe-area iPhone), nút Quay lại của điện thoại khi tấm Danh mục mở.

## Đợt 2 (07/11, chủ shop chọn K3 + L2 + C1 + A1)
- Nút kéo giá K3: vòng đen 18px lõi trắng, ray 3px; vùng chạm vẫn 44px; phóng nhẹ khi kéo.
- Nút Lọc L2: bỏ chấm, nút lắc nhẹ 3 lần (500ms, trễ 0,5s) khi vào trang; tắt khi giảm chuyển động.
- Bảng Lọc chỉ 4 nhóm cho mọi danh sách: Phân loại (khi có dữ liệu), Điều khiển (danh sách quạt), Khoảng giá, Thương hiệu. Bỏ hàng chip "đã chọn", Danh mục, Ngành hàng, Danh mục con, thông số, Tình trạng. Bỏ lọc bằng bỏ tick hoặc "Bỏ chọn".
- Lựa chọn C1: ô tick tự vẽ, không tô nền dòng, không co dòng; ô tick nhún khi nhấn, dấu ✓ bật ra, chữ đậm khi chọn.
- Ảnh A1: khung chờ nền kem có vệt sáng lướt (`.img-shimmer`), ảnh về thì hiện dần. Thêm hiệu ứng: thẻ sản phẩm trồi lên lần lượt khi mới hiện (`anim-rise`).
- Trang chủ "Ghé cửa hàng": dùng ảnh mặt tiền thật `/shop/mat-tien.webp`.
- Đã kiểm: tsc + ESLint đạt; 375px: nút kéo, hoạt ảnh nút Lọc chạy, bảng Lọc còn Điều khiển/Khoảng giá/Thương hiệu (chưa có Phân loại vì dữ liệu chưa có), tick Lifan → 32 kết quả, ảnh mặt tiền hiện.
- Chưa kiểm bằng mắt: vệt sáng khi mạng chậm, giao diện máy tính.
- Nút Lọc: lắc 3 lần, nghỉ 4 giây rồi lặp; dừng hẳn khi khách bấm Lọc hoặc kéo thanh giá (đã thử trên trình duyệt: lặp đúng nhịp, bấm Lọc thì đứng yên).
