# Bàn giao Codex — Giỏ hàng và thanh toán

## ĐÃ DUYỆT + ĐÃ LÀM

Chủ shop duyệt mẫu B cho lỗi 3 và lỗi 4. Đã áp dụng trong mã bằng token màu hiện tại của website; không dùng màu xanh cobalt trong ảnh mẫu.

### Lỗi 3 — Chỉ hiển thị giá một lần trong mỗi dòng giỏ

- Đã chọn và áp dụng mẫu B: đơn giá màu phụ dưới thông tin sản phẩm, thành tiền màu đỏ ở cuối dòng. Dòng giá trùng đã bỏ.
- Mẫu A tham khảo: [loi-3-gia-mau-a.svg](mau/loi-3-gia-mau-a.svg); mẫu B đã duyệt: [loi-3-gia-mau-b.svg](mau/loi-3-gia-mau-b.svg).

### Lỗi 4 — Đưa khối “Đơn hàng (N món)” lên đầu trang thanh toán điện thoại

- Đã chọn và áp dụng mẫu B: khối đơn hàng lên ngay dưới tiêu đề, xem trước tối đa hai dòng tên món × số lượng, nút “Xem chi tiết đơn hàng” mở danh sách và thông tin đầy đủ.
- Mẫu A tham khảo: [loi-4-don-hang-mau-a.svg](mau/loi-4-don-hang-mau-a.svg); mẫu B đã duyệt: [loi-4-don-hang-mau-b.svg](mau/loi-4-don-hang-mau-b.svg).

Lỗi 2 về nút nổi Chat/Gọi được giao Claude Code xử lý trong `StoreShell`; Codex không sửa `StoreShell.tsx` hoặc `globals.css`.

## Cập nhật bước 5 — đã sửa lỗi logic

- Lỗi 1: ô số lượng được remount theo số lượng hiện tại để giá trị nhìn thấy cập nhật khi bấm `+`/`−`; nhập trực tiếp vẫn được giữ.
- Lỗi 5: thông tin phụ dùng `classification || sub`, lọc giá trị rỗng trước khi ghép; hết phân loại sâu sẽ hiện “Lifan · Quạt”, không còn dấu chấm thừa.
- Lỗi 3 và 4 đã áp dụng theo mẫu B được duyệt.
- Chạy lại `npx tsc --noEmit` và ESLint sau khi hoàn tất các thay đổi.

Ngày: 06/11/2026  
Worktree: `.claude/worktrees/website-v2`  
Nhánh: `worktree-website-v2`

## Kết quả

Đã triển khai bước 3 theo `1_KE_HOACH.md` và khung `2_KHUNG.md` đã duyệt.

- `/gio-hang`: trình bày ảnh, tên, thông tin thật, giá, số lượng và thành tiền từng dòng; đánh dấu rõ món đặt trước; nhập số lượng 1–999; xác nhận khi giảm từ 1; xóa có hoàn tác trong 5 giây; loại bỏ sản phẩm không còn được trả về. Có skeleton, thanh tổng tiền/nút đặt hàng/Zalo dính trên điện thoại, tóm tắt dính trên desktop.
- `/thanh-toan`: biểu mẫu một cột trên điện thoại với bốn bước, đơn hàng thu gọn, tóm tắt hai cột trên desktop; ảnh và thông tin sản phẩm; lựa chọn phí nội thành lấy từ `innerFee`/`freeFrom`; bỏ ô email theo quyết định chủ shop; thêm nút chuyển sang gửi tỉnh khi địa chỉ ngoài Nha Trang; hiển thị lỗi máy chủ gần nút trên di động; ẩn thanh dính khi đang nhập.
- Sửa lỗi Danh mục trong `ProductBrowser.tsx`: bộ lọc Điều khiển và ghi chú thiếu thông tin hiện độc lập với phân loại Loại quạt. Ghi nhận chi tiết trong `BAN_GIAO_DANH_MUC_VA_LOC_QUAT_2026-11-06.md`.

## Tệp đã sửa

- `components/storefront/CartControls.tsx` — chỉ khu vực `CartPanel`.
- `components/storefront/CheckoutForm.tsx`.
- `components/storefront/ProductBrowser.tsx` — lỗi bộ lọc Danh mục đã giao.
- `docs/website-v2/BAN_GIAO_DANH_MUC_VA_LOC_QUAT_2026-11-06.md` — cập nhật bàn giao.
- `docs/website-v2/viec/gio-hang-thanh-toan/3_BAN_GIAO_CODEX.md` — tệp này.

Không cần tạo component mới hoặc sửa các trang cha. Không sửa `actions.ts`, `StoreShell.tsx`, `globals.css`, `lib/*` hay Supabase.

## Kiểm tra

- `npx tsc --noEmit`: đạt.
- ESLint trên `CartControls.tsx`, `CheckoutForm.tsx`, `ProductBrowser.tsx`, hai trang `/gio-hang` và `/thanh-toan`: đạt.
- Chưa đặt đơn thật, không ghi dữ liệu Supabase, không chạy migration, build, commit hoặc push.
- Chưa kiểm tra trực quan trên trình duyệt/điện thoại trong lượt này.

## Giới hạn cần Claude rà soát

Khung yêu cầu trạng thái lỗi tải giá và nút “Thử lại”. `useCartLines()` hiện không trả lỗi tải và bị giới hạn không được sửa helper này hoặc `actions.ts`; vì vậy giao diện không thể phân biệt lỗi mạng với trạng thái đang tải hoặc kích hoạt thử lại một cách đáng tin cậy. Cần mở rộng luồng trạng thái trong một việc riêng, sau khi cho phép sửa helper; phần còn lại không bị ảnh hưởng.

Vui lòng Claude Code rà soát giao diện và thay đổi, ghi nhận lỗi nếu có trước khi gộp. Chưa cập nhật phân loại quạt trong Supabase; việc đó vẫn cần chủ shop duyệt riêng.
