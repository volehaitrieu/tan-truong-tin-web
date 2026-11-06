# Giỏ hàng + Thanh toán — 4. Rà soát (Claude Code, 06/11/2026)

Cách kiểm: đọc mã `CartControls.tsx` (CartPanel), `CheckoutForm.tsx`, phần sửa `ProductBrowser.tsx`; `npx tsc --noEmit` **đạt**; ESLint 3 tệp **đạt**; mở `localhost:3000` (máy chủ dev đang chạy sẵn) ở 375px và 1366px với giỏ thử 2 quạt Lifan (chỉ ghi `localStorage` của trình duyệt kiểm thử, **không đặt đơn, không ghi Supabase**).

Kết luận: **chưa đạt, cần Codex sửa 5 lỗi** (bước 5). Phần lớn khung đã làm đúng.

## Đã đúng khung
- Bỏ ô email; dữ liệu gửi `placeOrder` giữ nguyên các trường còn lại; thêm `try/catch` khi gửi đơn.
- Phí nội thành hiện "20.000₫ · miễn phí từ 500.000₫", lấy cùng nguồn với bảng tính.
- Nhãn "Đặt trước — shop gọi báo ngày có hàng" ở giỏ và thanh toán.
- Thanh dính đáy giỏ: tiền hàng + Zalo + Đặt hàng. Thanh dính thanh toán: tạm tính + Đặt hàng, ẩn khi đang nhập, lỗi máy chủ hiện ngay trên nút, "Còn N ô cần sửa".
- Xác nhận khi giảm từ 1, xóa có Hoàn tác 5 giây, khung xương khi tải, nút "Chuyển sang Gửi đi tỉnh".
- Desktop 2 cột, khung đơn hàng phải có ảnh, tên, thành tiền.
- Lỗi Danh mục: bộ lọc Điều khiển nay hiện trên danh sách toàn quạt kể cả khi chưa có Loại quạt. ✔

## Lỗi cần sửa (Codex, bước 5)
| # | Mức | Lỗi | Bằng chứng | Cách sửa đề xuất |
|---|---|---|---|---|
| 1 | **Cao** | Ô số lượng trong giỏ không cập nhật khi bấm + / − | Bấm + món 2: `localStorage` = 2 nhưng ô vẫn hiện "1" (đã thử trên trình duyệt). Do ô dùng `defaultValue` | Dùng giá trị có kiểm soát (state nháp theo dòng) hoặc `key={quantity}` cho ô |
| 2 | **Cao** | Nút nổi Chat + Gọi của trang che số tiền và nút Đặt hàng trên thanh dính (375px), cả giỏ lẫn thanh toán | Ảnh chụp 375px: số "6.120.0…" và "8.080.0…" bị che | Không được sửa `StoreShell`/`globals.css` → Codex ghi yêu cầu: ẩn hoặc đẩy nút nổi lên trên thanh dính ở `/gio-hang`, `/thanh-toan`. **Claude Code sẽ sửa phần StoreShell** nếu chủ shop đồng ý |
| 3 | Trung bình | Giá hiện **2 lần** trên mỗi dòng giỏ (một dòng chữ đen, một dòng đỏ) | `CartPanel`: hai đoạn `<p>` cùng `formatVnd(p.price)` | Giữ một dòng giá màu `--danger` |
| 4 | Trung bình | Thanh toán điện thoại: khối "Đơn hàng (N món)" nằm **cuối trang**, khung yêu cầu ngay dưới tiêu đề | Thứ tự phần tử trong `<form>` | Đặt khối thu gọn lên đầu cột (dùng `order-first` hoặc đổi thứ tự) |
| 5 | Thấp | Thông tin phụ sai khi chưa có Loại quạt: thanh toán hiện "Lifan · " (dư dấu chấm), giỏ bỏ mất "Quạt" | `classification` là chuỗi rỗng nên `??` không rơi sang `sub` | Dùng `p.classification \|\| p.sub` và ghép bằng `filter(Boolean).join(" · ")` ở cả hai nơi |

## Ghi chú nhỏ (không chặn)
- Ảnh minh họa chung trong giỏ/thanh toán chưa có nhãn "Ảnh minh họa" như thẻ sản phẩm (khung yêu cầu).
- Bộ lọc Điều khiển vẫn được thêm khi không có giá trị nào (trước đây có `if (controls.length)`).
- Ký tự cách toàn khổ "　" trong nút Đơn hàng thu gọn; nên dùng khoảng cách CSS.
- Hoàn tác xóa đưa món về **cuối** giỏ thay vì vị trí cũ.
- Trạng thái "lỗi tải giá + Thử lại" chưa làm: đúng như Codex báo, cần sửa `useCartLines` — để việc riêng.

## Chưa kiểm
Bàn phím thật trên điện thoại (thanh dính ẩn khi nhập), đặt đơn thật, Safari iPhone, build bản chạy thật.

## Rà lần 2 (sau bước 5) — ĐẠT
- Lỗi 1: bấm + từ 1 → ô hiện 2 (thử trên trình duyệt 375px). ✔
- Lỗi 2: Claude Code sửa theo mẫu B chủ shop duyệt — tệp mới `components/storefront/FloatActions.tsx`, `StoreShell.tsx` dùng nó; ở `/gio-hang`, `/thanh-toan` (màn < lg) nút Chat/Gọi nổi phía trên thanh dính. Xem 375px: không còn che tiền và nút Đặt hàng. ✔
- Lỗi 3 (mẫu B) và lỗi 4 (mẫu B): Codex áp dụng, dùng màu web; đã thấy trên trình duyệt. ✔
- Lỗi 5: "Lifan · Quạt" hiện đúng ở giỏ. ✔
- `npx tsc --noEmit` đạt; ESLint `components/storefront`, `app/(store)`, `lib/catalog.ts` đạt.
- Còn lại (nhỏ, không chặn): ký tự cách toàn khổ trong "Thành tiền　" (`CartControls.tsx:282`); nút nổi vẫn che mép phải nội dung khi cuộn (đặc điểm của mẫu B); chưa có nhãn "Ảnh minh họa"; trạng thái lỗi tải giá + Thử lại để việc riêng; chưa build, chưa thử bàn phím thật / Safari.
