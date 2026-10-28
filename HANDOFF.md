# Bàn giao hiện hành — Tân Trường Tín

> **Mới nhất (28-10, cuối ngày): đọc [docs/BAN_GIAO_TIEP_TUC.md](docs/BAN_GIAO_TIEP_TUC.md) trước** — trạng thái đã kiểm chứng, việc còn dở và quy tắc an toàn.

Cập nhật 28-10-2026. Chủ shop chuyển trách nhiệm code hệ thống sang Claude Code.

## Bắt đầu

Đọc [bộ hồ sơ tiếp quản](docs/claude-code-handoff-2026-10-28/README.md), theo thứ tự PROJECT.md, CHAT_HISTORY.md, NEXT_STEPS.md và SKILLS.md. Đọc CLAUDE.md và AGENTS.md ở gốc repo trước khi sửa code.

- PROJECT: kiến trúc, nghiệp vụ, trạng thái tính năng và vị trí mã nguồn.
- CHAT_HISTORY: lịch sử quyết định, các yêu cầu mới thay thế yêu cầu cũ; không phải bản xuất nguyên văn chat.
- NEXT_STEPS: rủi ro cụ thể trong code và thứ tự kiểm tra/sửa tiếp.
- SKILLS: 7 skill cốt lõi được sao chép cùng tài nguyên và script cài không ghi đè.
- START_HERE.txt: lời nhắn để bắt đầu phiên Claude Code.

## Trạng thái quan trọng

Branch quan sát: `codex/desktop-storefront-upgrade`, HEAD `696105a`. Có nhiều thay đổi chưa commit/untracked. Giữ nguyên công việc hiện có; không reset/clean hoặc seed lại dữ liệu.

Chức năng thêm sản phẩm và quản lý nhiều ảnh đã có code, nhưng chưa xác nhận chạy thành công và chưa được typecheck/build trong đợt triển khai. Migration `supabase/migrations/20261028000100_product_image_storage.sql` chưa được áp dụng trong phiên triển khai; phải kiểm tra môi trường thực tế trước khi áp dụng. Có các vấn đề phân quyền/form, xử lý lỗi và ảnh cần rà theo NEXT_STEPS.

Chủ shop đã xác nhận tự nhập Excel quạt thành công sau khi sửa SKU trùng. Không tự nhập lại hay khôi phục 98 sản phẩm mẫu đã xóa. Số sản phẩm và trạng thái DB hiện tại chưa được kiểm tra trong lượt bàn giao.

Ngành hàng lấy từ Excel đã nhập, khác Danh mục/Danh mục con/Phân loại. Tài khoản khách chỉ chốt giao diện. Logo/thương hiệu đang hoãn. Phần ảnh: nhiều ảnh, thư viện/camera Android/iPhone, SKU nhập tay, ảnh đầu làm bìa, được đổi thứ tự và xóa.

IP Wi-Fi quan sát gần nhất: `192.168.1.64`; cần kiểm tra lại khi dùng điện thoại. Không coi localhost trên điện thoại là máy phát triển.

## Bằng chứng và tài liệu cũ

Lượt này chỉ đọc mã/trạng thái và viết tài liệu; không test ứng dụng, ghi DB, áp migration hay deploy. Gói bàn giao không có secrets, workbook, dump DB hay toàn bộ source code; Claude cần mở repo hiện hữu.

Bản HANDOFF cũ được giữ nguyên tại [bản lưu 24-10](docs/claude-code-handoff-2026-10-28/HANDOFF-2026-10-24-original.md). Các kết quả test/deploy, dữ liệu mẫu và phân công công cụ trong đó là lịch sử, không tự động áp dụng cho hiện trạng. Ưu tiên quyết định mới và kiểm chứng thực tế.
