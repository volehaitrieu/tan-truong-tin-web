# Tân Trường Tín — tiếp quản code

Đọc `HANDOFF.md`, sau đó `docs/claude-code-handoff-2026-10-28/README.md` trước khi tiếp tục code. Khi sửa nghiệp vụ, đọc PROJECT/CHAT_HISTORY; khi tiếp tục ảnh/tạo sản phẩm, đọc NEXT_STEPS trong cùng thư mục.

- Giao tiếp tiếng Việt, rõ ràng; phân biệt đã kiểm chứng, có code, chưa xác minh.
- Áp dụng `commerce-content-review` cho quyết định ecommerce/kỹ thuật/nội dung: không hùa theo, không bịa thông số hoặc cam kết; không tự nhận thâm niên người thật.
- User đã chốt và cho triển khai tính năng thêm sản phẩm/ảnh. Không hỏi lại toàn bộ brief; làm trong phạm vi đã được đồng ý.
- Repo đang có nhiều thay đổi chưa commit từ nhiều đợt. Đọc status/diff trước sửa; giữ nguyên công việc đang có, không reset/clean hoặc nạp lại seed.
- Ngành hàng lấy từ Excel đã nhập; khác Danh mục, Danh mục con, Phân loại. Tài khoản khách mới chỉ UI. Logo/thương hiệu đang hoãn.
- Đọc `AGENTS.md` và hướng dẫn liên quan trong `node_modules/next/dist/docs/` trước khi viết Next.js. Phiên bản đang dùng có thay đổi API.
- Giữ RLS/quyền server, giá nhập riêng, tính tiền/tồn ở nơi đáng tin cậy; không dùng service-role để né lỗi phân quyền.
- Không in/copy secrets từ `.env.local`; xác định môi trường DB trước mọi ghi dữ liệu hoặc chạy script test có mutation. Kết quả test cũ không bảo đảm code hiện tại.
- Theo `docs/DESIGN.md` và yêu cầu mới trong chat; giữ responsive, accessibility, thông báo lỗi tiếng Việt.
- Skill package và hướng dẫn cài: `docs/claude-code-handoff-2026-10-28/SKILLS.md`. Không giả định các tool chỉ có trong Codex tồn tại ở Claude.
- Phân công tuần tự, tránh hai công cụ sửa cùng file; báo rõ thay đổi, kiểm tra, giới hạn còn lại và cập nhật `docs/MENTOR_LOG.md` sau đợt làm việc.
