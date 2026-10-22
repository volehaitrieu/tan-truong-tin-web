# Lọc màn Admin theo PRD (bước C3 — 22/10/2026)

Dùng khi dựng Next.js: mỗi màn lấy bố cục từ thư mục trong `_raw/`, **giữ** cột "Giữ", **bỏ/sửa** cột "Bỏ / sửa". Luật chung (chi nhánh, máy in, ca/két, vai trò "Quản lý", dữ liệu giả) xem `../DA_LOAI_BO.md` — áp cho mọi màn, không nhắc lại dưới đây.

| Màn | Thư mục máy tính · điện thoại | PRD | Giữ | Bỏ / sửa riêng màn này |
|---|---|---|---|---|
| Đăng nhập | `ng_nh_p_qu_n_tr_t_n_tr_ng_t_n` · `…_mobile` | A1 · P0 | Email/SĐT + mật khẩu, hiện/ẩn mật khẩu, ghi nhớ, "Quên mật khẩu? Liên hệ chủ shop" | ĐT đang vẽ khung rộng → khi code làm 1 cột 390–440px |
| Tổng quan | `t_ng_quan_t_n_tr_ng_t_n` · `…_mobile` | A17 P1, A18 P0 | Thẻ số liệu, doanh thu 7 ngày, đơn cần xử lý, sắp hết hàng (tồn ≤ tồn tối thiểu) | Khối ca làm việc/két, đồng bộ máy in, đơn "Công nợ 15 ngày" |
| Sản phẩm | `s_n_ph_m_t_n_tr_ng_t_n` · `…_mobile` | A3 · P0 | Tìm, lọc danh mục/thương hiệu/trạng thái (Ẩn/Hiển thị, có/chưa ảnh, thiếu thông tin), nút tải ảnh thông tin SP | Nút Xóa (chỉ Ẩn) nếu có |
| Sửa SP | `may-tinh_sua-sp` · `s_a_s_n_ph_m_t_n_tr_ng_t_n_mobile` | A4, A10, A15b · P0 | Thông tin, giá bán, giá nhập (khóa theo quyền), giá KM + ngày, thông số theo danh mục, ảnh thật/minh họa, tồn + tồn tối thiểu, Ẩn/Hiển thị, lịch sử cập nhật (A16) | Tự lưu nháp, Nhân bản SP, "Tự động áp dụng POS", "Cho phép bán khi hết hàng" → PRD: hết hàng hiện "Liên hệ", luôn đặt được (không cần công tắc) |
| Nhập Excel | `may-tinh_nhap-excel` · `nh_p_excel_t_n_tr_ng_t_n_mobile` | A5, A6 · P0 | 3 bước, xem trước, lỗi từng dòng, chuẩn hóa đơn vị, chưa ghi khi chưa xác nhận, cột Tồn kho + Tồn tối thiểu | — |
| Duyệt gợi ý AI | `may-tinh_duyet-goi-y-ai` · `duy_t_g_i_ai_t_n_tr_ng_t_n_mobile` | A7 (giao diện trước) | Tầng tin cậy, chấp nhận / đổi danh mục, duyệt hàng loạt | Chữ "máy bán POS" |
| Ảnh thông tin SP | `may-tinh_anh-thong-tin-sp` · `nh_th_ng_tin_s_n_ph_m_t_n_tr_ng_t_n_mobile` | A26 · P0 | Thẻ 1080×1080, chọn thông số, tải PNG, sao chép dán Zalo | Zalo OA, "mẹo cho thu ngân" |
| Tồn kho | `t_n_kho_t_n_tr_ng_t_n` · `…_mobile` | A11, A18 · P0 | Điều chỉnh +/− kèm lý do, lịch sử ai/khi nào, sắp hết | "Đồng bộ máy quét POS", "mã hóa với thu ngân" (thay bằng: ẩn giá nhập theo quyền) |
| Kiểm kho | `ki_m_kho_t_n_tr_ng_t_n` · `…_mobile` | A27 · P0 | Đợt kiểm theo danh mục/kệ, giao NV, lệch, chốt (chỉ chủ shop) | — |
| Đếm kho ĐT | `ki_m_kho_di_ng_t_10_2026` | A27 · P0 | Đếm trên điện thoại, đếm mù tùy chọn | — |
| Danh mục & thương hiệu | `danh_m_c_th_ng_hi_u_t_n_tr_ng_t_n` · `…_mobile` | A8, A9 · P0 | Cây cha > con, icon, thứ tự, bộ thông số từng danh mục, thương hiệu + logo | "Đồng bộ 2 chiều POS & Web"; đổi "bộ lọc POS & Tồn kho" → "Dùng làm bộ lọc trên web" |
| Đơn hàng | `n_h_ng_t_n_tr_ng_t_n` · `…_mobile` | A12 · P0 | Lọc trạng thái/ngày/cách nhận, cờ "Chưa có phí ship" | — |
| Chi tiết đơn | `chi_ti_t_n_ttt000123_t_n_tr_ng_t_n` · `…_mobile` | A12, A12b, A13 · P0 | Đổi trạng thái, nhập phí ship → mở VietQR, mã vận đơn, xác nhận đã nhận tiền, ghi chú nội bộ, **In phiếu giao/xuất kho** | NV đơn không thấy Hủy/Giảm giá (theo quyền) |
| Bán tại quầy | `b_n_t_i_qu_y_t_n_tr_ng_t_n` · `…_mobile` | A21 · P2 | Tìm/quét mã, giỏ, tiền khách đưa/tiền thối, trừ chung kho | In bill K80 tự động, thu ngân/quầy #01, mã "#POS-01" → "Đơn tại quầy" |
| Khuyến mãi | `khuy_n_m_i_t_n_tr_ng_t_n` · `…_mobile` | A15b P0, A20 P1 | Giá KM theo SP (giá gốc gạch, %), mã giảm giá | "Đồng bộ POS" |
| Báo cáo | `b_o_c_o_t_n_tr_ng_t_n` · `…_mobile` | A17 P1, A19 P1, A25 P2 | Doanh thu, top SP, lãi gộp (chỉ chủ shop), xuất Excel | Đổi nhãn "Tại quầy (POS)" → "Tại quầy" |
| Nhân viên & quyền | `nh_n_vi_n_quy_n_t_n_tr_ng_t_n` · `…_mobile_2` (**chọn _2**, _1 tiêu đề không dấu) | A2 · P0 | Danh sách NV, mời, khóa; bảng công tắc theo vai trò | Vai trò chỉ **Chủ shop · NV đơn · NV kho**; quyền theo A2: xem giá nhập, sửa SP, sửa giá, chỉnh tồn, nhập Excel, hủy đơn, giảm giá trong đơn (+ các quyền màn khác nếu chủ shop muốn) |
| Nhật ký thao tác | `nh_t_k_thao_t_c_t_n_tr_ng_t_n` · `…_mobile` | A16 · P1 | Ai, khi nào, cũ → mới, lọc ngày/NV/loại, chỉ xem | Dòng mẫu máy in, IP, "khóa bất biến", máy POS |
| Cài đặt | `c_i_t_t_n_tr_ng_t_n` · `…_mobile` | A14, A15 · P0 | Thông tin shop thật, phí ship (nội thành "Chờ chủ shop"), VietQR "Sắp có", Telegram, đổi trả "Chờ chủ shop" | Máy in, Zalo OA, "đồng bộ máy POS" |

## Ghi chú cho bước dựng code
- 19 màn máy tính + 18 màn điện thoại đều có đủ (Đếm kho chỉ có bản điện thoại). Thư mục `…_mobile_1` để tham khảo, không dùng.
- Bản ĐT do Stitch vẽ rộng 390px; chủ shop dùng iPhone 17 Pro Max (440px) → code tự co giãn, kiểm tra ở cả 390 và 440.
- Quyền phải kiểm ở server + RLS (PRD mục 7), không chỉ ẩn nút như ảnh Stitch.
