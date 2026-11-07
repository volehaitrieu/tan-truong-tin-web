# Rà soát việc Codex làm 07/11 tối (Claude Code)

Đọc: cuộc trao đổi "Đọc ảnh và hỏi khi cần" (18:07–20:48), `1_KE_HOACH.md`, file `outputs/quat-dieu-khien-20261107/Kho-App-Quat-dieu-khien-2026-11-07.xlsx` (thư mục gốc dự án, bị `.gitignore` chặn — đúng, file có giá nhập). Không ghi Supabase, không sửa mã.

## 1. File thêm điều khiển vào tên
- So với `Downloads/Kho-App-Quat-ket-qua-2026-11-07.xlsx`: chỉ đổi Tên sản phẩm (76 dòng), Nguồn (27), Ghi chú đối chiếu. Giá, giá nhập, thông số, phân loại, mã: không đổi. 100 mã, không trùng tên.
- Nhãn đúng bộ chủ shop duyệt: Núm vặn 32, Dây giật 16, Remote 12, Nút nhấn 11, Hộp số gắn tường 3, 2 dây giật 2; 24 dòng chưa xác minh giữ tên.
- Đối chiếu cột Thông số: nhãn khớp dòng "Điều khiển" ở các dòng đã có. 17 dòng tra bổ sung có link riêng; Claude kiểm lại 4 link (FF2318, LS1630, BF168, TĐ-20): đúng mã, đúng kiểu điều khiển ("Phím bấm cơ" = nút nhấn).
- **Thiếu nhỏ:** 16 dòng tra bổ sung có kiểu điều khiển trong tên nhưng cột Thông số chưa có dòng "Điều khiển: …" → trang sản phẩm không hiện mục này. Đề xuất thêm dòng đó (chờ chủ shop đồng ý).
- Còn mở: S-18CN (N) chưa xác minh (Codex ghi đúng lý do: không lấy số của biến thể khác).

## 2. Kế hoạch nhiều phân loại (`1_KE_HOACH.md`)
- Khớp quyết định chủ shop trong chat: lọc HOẶC trong nhóm; Excel một cột, dấu `;`; ô có nội dung thay toàn bộ; ô trống giữ nguyên; xuất cùng định dạng.
- Thiết kế bảng liên kết nhiều-nhiều dùng lại phân loại cấp 3, RLS, giao dịch DB, chuyển dữ liệu cũ có snapshot: hợp lý, không dùng service-role, có điểm dừng xin phép trước migration/dữ liệu thật.
- Lưu ý khi làm bước 2: (a) bản cũ tự tạo phân loại khi nhập; kế hoạch đổi thành "hiện là loại mới trong xem trước, tạo khi xác nhận" — cần báo chủ shop khác biệt này; (b) mã đang chưa commit của phan-loai + loc-va-thanh-day dùng `classification` là chuỗi — phải đổi cùng đợt; (c) form sửa sản phẩm phải giữ liên kết (đã nêu).
- 4 câu phân loại 19 quạt (quạt lỡ Senko, thêm Lửng, giữ Công nghiệp, Đ-616A) vẫn chưa có câu trả lời; chủ shop chốt "tên theo nguồn Internet" nhưng chưa chốt nhãn phân loại.

## Bước tiếp theo
Codex dừng (hết hạn mức) ngay sau khi chủ shop duyệt kế hoạch, ở bước "lập khung giao diện/mẫu và kế hoạch chi tiết". Chưa có mẫu hay mã nào.
