# Bàn giao Tân Trường Tín cho Claude Code

Ngày: 28-10-2026 · Múi giờ: Asia/Ho_Chi_Minh.

Chủ shop chuyển phần code hệ thống sang Claude Code. Đây là bộ tiếp quản dự án đang có, không phải yêu cầu xây lại từ đầu.

## Đọc theo thứ tự

1. `PROJECT.md`: mục tiêu, kiến trúc, nghiệp vụ, trạng thái tính năng.
2. `CHAT_HISTORY.md`: lịch sử trao đổi đã tổng hợp và các quyết định thay thế quyết định cũ.
3. `NEXT_STEPS.md`: vấn đề đã nhìn thấy trong code, việc chưa xác minh, trình tự tiếp tục.
4. `SKILLS.md`: skill cốt lõi, nguồn, cách cài và những gì đã có trên máy.
5. `GIT_STATUS.txt`, `SOURCE_MAP.txt`: điểm xuất phát trước khi viết bộ bàn giao.
6. `../../AGENTS.md` tính từ thư mục này là AGENTS của repo; đọc hướng dẫn Next.js tại đó trước khi sửa code. Đọc thêm PRD/DESIGN theo đường dẫn trong PROJECT.

`START_HERE.txt` là lời nhắn có thể dán vào Claude Code. `Install-Skills.ps1` cài các skill được đóng gói khi được chạy; hiện chưa chạy script này.

## Phạm vi bằng chứng

- Đã đọc mã và trạng thái Git tại workspace khi tạo gói này.
- Lịch sử chat được tổng hợp từ nội dung có trong phiên cùng tài liệu dự án. **Không phải bản xuất nguyên văn đầy đủ từng tin nhắn/tool call**; ảnh chú thích được mô tả bằng chữ, không đính kèm lại ảnh.
- Các con số DB, kết quả test, deploy trong tài liệu cũ là kết quả lịch sử; không mặc nhiên là hiện trạng.
- Không truy vấn DB, không áp migration, không build/test ứng dụng trong lượt soạn bàn giao.
- Không đóng gói `.env.local`, API keys, mật khẩu, bản dump DB, workbook có giá nhập hoặc dữ liệu khách hàng. Tệp ZIP chỉ gồm hồ sơ và skill, không gồm toàn bộ source code; Claude phải làm trong repo hiện hữu.

## Điểm cần biết ngay

- Branch hiện tại: `codex/desktop-storefront-upgrade`; HEAD quan sát: `696105a`. Có nhiều thay đổi chưa commit/untracked. Không reset/clean hoặc lấy bản Git cũ ghi đè.
- Ảnh + thêm sản phẩm mới: có code; **chưa xác nhận chạy thành công**, chưa chạy typecheck/build cho phần mới; migration Storage chưa được áp dụng trong phiên triển khai.
- Chủ shop nói đã sửa SKU trùng và tự nhập Excel quạt thành công. Không nhập lại hoặc khôi phục dữ liệu mẫu.
- Tài khoản khách: chỉ bản giao diện xem trước; chưa có đăng nhập khách/OTP/lịch sử đơn thật.
- Thương hiệu/logo: chủ shop đã hoãn để sửa sau.
- IP Wi-Fi quan sát gần nhất: `192.168.1.64`; IP cũ `192.168.5.122` vẫn còn trong `allowedDevOrigins`. IP động, phải kiểm tra lại.

## Tài liệu cũ

`HANDOFF-2026-10-24-original.md` giữ nguyên bàn giao cũ để tra cứu. Các mục cấm xóa seed, số lượng 98 sản phẩm, chưa có upload/create, trạng thái production trong đó không còn là chỉ dẫn hiện hành. Ưu tiên quyết định mới trong CHAT_HISTORY và bằng chứng từ code/DB thực tế.
