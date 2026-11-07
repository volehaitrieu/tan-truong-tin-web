# Phân công Claude Code và Codex — từ 06/11/2026

## Vai trò (chủ shop chốt 06/11)

| Bước | Ai làm | Kết quả giao lại |
|---|---|---|
| 1. Phân tích + kế hoạch | **Claude Code** | Tệp `docs/website-v2/viec/<ten-viec>/1_KE_HOACH.md`: mục tiêu, dữ liệu dùng, rủi ro, tiêu chí nghiệm thu |
| 2. Khung + bố cục | **Claude Code** | `2_KHUNG.md`: sơ đồ khối từng màn (điện thoại + desktop), luồng bấm, trạng thái trống/lỗi/đang tải, câu chữ tiếng Việt, danh sách tệp được phép sửa |
| — Chủ shop duyệt khung | Chủ shop | Ghi "ĐÃ DUYỆT" vào đầu `2_KHUNG.md` |
| 3. Thiết kế giao diện + viết mã | **Codex** | Mã trên nhánh của việc đó + `3_BAN_GIAO_CODEX.md` (đã làm gì, kiểm tra gì, còn thiếu gì) |
| 4. Rà soát | **Claude Code** | `4_RA_SOAT.md`: đối chiếu với khung + tiêu chí, lỗi tìm thấy, typecheck/ESLint/build, xem trên trình duyệt |
| 5. Sửa theo rà soát | **Codex** (Claude Code chỉ sửa khi chủ shop cho phép) | Cập nhật `3_BAN_GIAO_CODEX.md` |
| 6. Gộp | Claude Code, sau khi chủ shop duyệt | Commit/gộp, ghi `docs/MENTOR_LOG.md` |

## Quy tắc
- **DUYỆT MẪU TRƯỚC KHI LÀM (chủ shop chốt 06/11):** mọi thay đổi có ảnh hưởng tới giao diện — kể cả sửa lỗi — cả Claude Code lẫn Codex đều phải gửi chủ shop **khung, ảnh mẫu hoặc ảnh thiết kế** (nên có 2–3 phương án) và **chờ chủ shop chọn/duyệt** rồi mới viết mã. Codex lưu ảnh mẫu vào thư mục việc (`docs/website-v2/viec/<ten-viec>/mau/`) và ghi đường dẫn ở đầu tệp bàn giao, sau đó dừng chờ. Sửa lỗi không đổi gì nhìn thấy được (logic, chữ sai chính tả) thì không cần mẫu.
- Mỗi việc một thư mục `docs/website-v2/viec/<ten-viec>/` và một nhánh riêng. **Tại một thời điểm chỉ một công cụ được sửa mã của việc đó** (bước 3 và 5 là Codex; bước 4 Claude Code chỉ đọc).
- Codex thiết kế theo `docs/DESIGN.md` và khung đã duyệt; được tự chọn chi tiết giao diện (màu sắc trong bảng màu sẵn có, khoảng cách, hiệu ứng), nhưng không đổi luồng, dữ liệu hay câu chữ đã chốt mà không ghi lý do.
- Codex chỉ sửa tệp nằm trong danh sách của `2_KHUNG.md`; cần sửa thêm tệp thì ghi vào bàn giao để Claude Code xem trước.
- Không ghi Supabase, chạy migration, deploy, push, gộp `main` khi chủ shop chưa đồng ý rõ. Logic tính tiền/tồn/quyền phải ở phía server (Claude Code kiểm kỹ ở bước 4).
- Thông báo lỗi, chữ trên giao diện: tiếng Việt. Không bịa thông số sản phẩm.

## Câu lệnh mẫu chủ shop đưa cho Codex
> Đọc `docs/website-v2/PHAN_CONG_CLAUDE_CODEX_2026-11-06.md`, rồi làm bước 3 cho việc `docs/website-v2/viec/<ten-viec>/` theo `1_KE_HOACH.md` và `2_KHUNG.md` đã duyệt. Xong thì viết `3_BAN_GIAO_CODEX.md`.

## Danh sách việc và trạng thái

| Việc | Nhánh | Bước hiện tại |
|---|---|---|
| Danh mục điện thoại + lọc quạt | `worktree-website-v2` | Mã đã có (Codex). Claude Code đã rà: lỗi bộ lọc Điều khiển bị gắn chung điều kiện Loại quạt → chờ Codex sửa (bước 5). Cập nhật 100 quạt trên Supabase chờ chủ shop đồng ý. |
| Nhập Excel đọc cột Tồn | `feature/nhap-excel-ton-kho` | Mã xong, migration đã chạy, ĐÃ lên tantruongtin.com (06/11). Còn: thử nhập file nhỏ trên web thật; gộp nhánh vào `main` (chưa gộp) |
| Giỏ hàng + Thanh toán (`viec/gio-hang-thanh-toan/`) | `worktree-website-v2` (sau khi việc Danh mục đã commit; nếu chưa thì tạo nhánh riêng `feature/gio-hang-thanh-toan`) | Xong, chủ shop duyệt, đã commit (07/11) |
| Danh mục kiểu DMX (`viec/danh-muc-kieu-dmx/`) | `worktree-website-v2` | Xong, chủ shop duyệt, đã commit (07/11) |
| Tra cứu đơn / Báo giá / Cảm ơn | (tạo khi bắt đầu) | Chờ |
| Trang Chính sách | (tạo khi bắt đầu) | Chờ chủ shop chốt nội dung đổi trả/vận chuyển |
| Tài khoản khách (chỉ UI) | (tạo khi bắt đầu) | Chờ |
