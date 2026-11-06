# Website v2: cách thiết kế các trang tiếp theo

Worktree `website-v2`, nhánh `worktree-website-v2` (cắt từ 05becd5). Nguồn: Stitch "Tân Trường Tín Store Mobile"
(https://stitch.withgoogle.com/projects/9241780212114474369), xuất .zip ngày 2/11/2026. Bản Trang chủ chủ shop đã duyệt:
`trang-chu-da-duyet/` (code.html + screen.png). Hệ thiết kế gốc của Stitch: `DESIGN-stitch.md`.

## Quy trình mỗi trang
1. Xem `screen.png` + `code.html` của màn đó trong zip (Downloads: `stitch_t_n_tr_ng_t_n_store_mobile.zip`; thư mục con theo tên màn, bản đánh số cao nhất thường là mới nhất, kiểm bằng ảnh).
2. Giữ nguyên chức năng, dữ liệu và quyền của trang hiện có. Chỉ thay giao diện.
3. Chạy `npm run dev` (launch.json tên `web`, cổng 3000), xem ở 390px rồi 1440px; kiểm không tràn ngang.
4. eslint, rà ponytail, ghi `docs/MENTOR_LOG.md`.

## Hệ thiết kế (đã áp ở `app/globals.css`)
- Nền `#FEFCF9` (ground), vùng lõm `#F5F1EA` (sunk), thẻ trắng, viền `#EAE4D9` (line).
- Chữ `#20252D` (ink), phụ `#5A6270` (ink-2), mờ `#8C95A5` (ink-3).
- Nhấn cobalt `#235CE3` (brand), đậm `#0044BE` (brand-deep), nền nhạt `#EBF0FC` (brand-tint). Giá = màu brand.
- Giảm giá/đếm giỏ/lỗi: san hô đậm `#B93B1F` (danger). Tuyệt đối không dùng xanh lá.
- `gold` (vàng) CHỈ cho nhãn chờ/cảnh báo ("Sắp có", "Chưa có phí ship"); đừng dùng làm nút chính.
- Font Be Vietnam Pro. Tiêu đề mục `text-lg font-bold sm:text-[22px]`.
- Bo góc: thẻ `rounded-xl` (12px), nút và ô tìm kiếm `rounded-full`, ô nhập 8px. `rounded-md` cũ đã thành 12px.
- Không bóng đen: viền mảnh + `shadow-[var(--shadow-soft)]`; nút nổi `shadow-[var(--shadow-float)]`.
- Vùng bấm >= 44px (`h-11`/`h-12`). Nút chính dạng viên thuốc, `active:scale-[0.98]`.
- Điện thoại trước (390px): thanh đáy 4 mục, nút nổi Gọi/Zalo, chân trang sáng.

## Luật nội dung (không được phá)
- Không cắt chữ: tránh `truncate`/`line-clamp` hẹp, hàng trượt ngang cắt dở; dùng xuống dòng. Tên SP tối đa 3 dòng.
- Dữ liệu thật từ Supabase (ngành hàng lấy từ Excel). KHÔNG đưa dữ liệu mẫu của Stitch: Anker, Baseus, giá, ảnh, "Còn hàng", trả góp, giao hàng nhanh, số sản phẩm bịa.
- Logo/thương hiệu đang hoãn: không dùng logo Stitch vẽ; thương hiệu hiển thị bằng tên + số SP thật. Logo cửa hàng giữ nguyên (còn xanh lá).
- Chữ tiếng Việt có dấu, lỗi báo bằng tiếng Việt. Tài khoản khách mới chỉ UI.
- Giá nhập riêng, tính tiền/tồn ở nơi đáng tin cậy, RLS giữ nguyên.

## Đã xong / còn lại
Xong: bảng màu, thẻ SP, đầu trang, ô tìm, thanh đáy, nút nổi, chân trang, Trang chủ.
Còn: chi tiết SP, danh mục, tìm kiếm, giỏ, thanh toán, cảm ơn, tra cứu đơn, báo giá, chính sách, tài khoản, 404, quản trị.
Các màn khác trong zip: `3_m_u_b_l_c...` (mẫu bộ lọc khoảng giá), `5_m_u_n_t_xem_th_m...` (3 mẫu nút xem thêm); chưa có màn trang con.
Prompt gửi Stitch cho từng trang: `docs/stitch/` ở nhánh `codex/desktop-storefront-upgrade` (W02-W13 web, A00-A20 quản trị), chưa commit ở đó.
