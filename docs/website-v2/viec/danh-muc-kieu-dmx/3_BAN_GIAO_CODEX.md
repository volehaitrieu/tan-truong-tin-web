# Bàn giao Codex — Danh mục kiểu DMX

Worktree: `.claude/worktrees/website-v2`  
Nhánh: `worktree-website-v2`  
Ngày: 06/11/2026

## Bản 2 — Danh mục phủ toàn màn hình (07/11/2026)

Đã triển khai theo `2_KHUNG_V2.md` và phần “Đo lại chi tiết” trong `0_PHAN_TICH_DMX.md`. Bản 2 thay thế màn Danh mục điện thoại của lượt trước; trang danh sách mẫu D giữ nguyên.

> Phần “Bản 2 — sửa tab” bên dưới là cập nhật mới nhất và thay thế dữ liệu tab Ngành được mô tả trong phần bàn giao ban đầu này.

### Đã làm

- Nút “Danh mục” ở thanh đáy điện thoại mở tấm phủ toàn màn hình có tiêu đề “Danh mục sản phẩm” và nút ✕; mở bằng lịch sử trình duyệt để nút Quay lại/Back đóng tấm, đồng thời hỗ trợ Esc, khóa cuộn nền, chuyển tiêu điểm vào tấm và trả tiêu điểm về nút mở khi đóng.
- Bố cục theo số đo đã duyệt: thanh đầu 48px; tab Ngành rộng 100px, mỗi tab cao 60px, cuộn riêng; khung nội dung nền trắng, cách 8px; lưới ba cột chỉ gồm Danh mục con. Không hiện cấp Phân loại.
- Thêm chuyển động mở/đóng, đổi tab và trạng thái nhấn ô; tắt chuyển động khi hệ thống bật `prefers-reduced-motion`. Tab hỗ trợ phím mũi tên, Home/End; tấm dùng `dialog`, `aria-modal` và vòng tiêu điểm.
- Thêm `getCategoryMenu()` trong `lib/catalog.ts`: nhóm theo `product.industry`, thiếu ngành gom vào “Khác”, sắp xếp theo số sản phẩm giảm dần; tiêu đề là Danh mục, ô là Danh mục con có sản phẩm trong đúng ngành. Dữ liệu gửi xuống client chỉ gồm nhãn/slug/số lượng/ảnh/biểu tượng, không gửi danh sách sản phẩm. Ảnh đại diện là ảnh sản phẩm đầu tiên; bỏ ảnh minh họa `/ai/hardware-hero.jpg`, thiếu ảnh thì dùng `CategoryIcon`.
- Trang `/danh-muc` trên điện thoại dùng cùng cây dữ liệu và bố cục; nhánh desktop giữ nguyên.
- Đã cập nhật tiêu đề trang danh sách thành “Tên mục · N sản phẩm”, theo phần được chủ shop cho phép thêm trong Bản 2.
- Giữ nguyên các chỉnh sửa có sẵn trong `StoreShell.tsx` của Claude Code (bao gồm nút nổi); chỉ thêm việc truyền menu danh mục vào `CategoryDrawer`.

### Tệp mã thuộc Bản 2

- `components/storefront/CategoryDrawer.tsx`
- `components/storefront/CategoryIndexClient.tsx`
- `components/storefront/CategoryOverlay.tsx` (mới)
- `components/storefront/StoreShell.tsx`
- `app/(store)/danh-muc/page.tsx`
- `app/(store)/danh-muc/[slug]/page.tsx`
- `lib/catalog.ts`

### Kiểm tra Bản 2

- `npx tsc --noEmit`: đạt.
- ESLint các tệp mã liệt kê ở trên: đạt.
- Chưa kiểm tra trực quan trên trình duyệt ở 375px hoặc desktop; Claude Code cần rà bước 4.
- Không ghi Supabase, không chạy migration, không commit/push.

### Còn cần rà

- Xác nhận trên trình duyệt dữ liệu ngành/danh mục con và ảnh thực tế, thao tác Back/Esc/tiêu điểm, cuộn độc lập, giảm chuyển động, kích thước 375px và giao diện desktop.
- Bàn giao phạm vi cũ bên dưới thuộc Bản 1; quyền sửa `[slug]/page.tsx` đã được chủ shop mở rộng riêng trong khung Bản 2 và đã thực hiện ở trên.

## Bản 2 — sửa tab (07/11/2026)

Đã sửa theo mục “Sửa sau rà — Tab = Danh mục” ở cuối `2_KHUNG_V2.md`.

- Tab trái hiện là các **Danh mục gốc có hàng** (ví dụ “Đồ gia dụng”), sắp xếp theo số sản phẩm giảm dần.
- Khung phải hiện tiêu đề IN HOA của Danh mục đang chọn và lưới ba cột các **Danh mục con** có hàng (ví dụ Quạt, Ấm siêu tốc).
- Bỏ việc dùng `product.industry` để tạo tab/menu; hàm `getCategoryMenu()` trả cây gọn Danh mục → Danh mục con. Ảnh thật, fallback `CategoryIcon`, số đo, hiệu ứng, mở/đóng và truy cập giữ nguyên.
- Tệp đã sửa: `lib/catalog.ts`, `components/storefront/CategoryIndexClient.tsx`, `components/storefront/CategoryDrawer.tsx`, `components/storefront/CategoryOverlay.tsx`, và tệp bàn giao này. Các trang vẫn nhận cùng prop `menu`; không cần sửa `StoreShell` hay trang `/danh-mục` trong cập nhật này.
- `npx tsc --noEmit`: đạt.
- ESLint các tệp mã thuộc Bản 2: đạt.
- `git diff --check`: đạt; chỉ có cảnh báo chuẩn hóa LF/CRLF của Git trên Windows.
- Không ghi Supabase, không commit/push.

## Cần Claude Code rà phạm vi tệp

Khung yêu cầu dòng đầu trang danh sách có dạng “Tên mục · N sản phẩm”. Tên mục và `<h1>` hiện được tạo ở `app/(store)/danh-muc/[slug]/page.tsx`, nhưng tệp này **không nằm trong danh sách được phép sửa** của `2_KHUNG.md`. Codex giữ nguyên tệp đó. Hiện trang vẫn có tiêu đề mục và dòng “Tìm thấy N sản phẩm” riêng trong `ProductBrowser`. Đề nghị Claude Code xem xét mở rộng danh sách tệp hoặc chấp nhận cách trình bày hiện tại trước khi sửa thêm.

## Đã làm

- Viết lại `components/storefront/CategoryIndexClient.tsx` theo mẫu A: tab nhóm hàng bên trái, vùng phải là lưới ba cột chỉ gồm danh mục con, không hiển thị cấp Phân loại. Mặc định chọn nhóm đầu tiên, có thao tác phím mũi tên/Home/End và trạng thái ARIA tab/tablist/tabpanel.
- Trang `/danh-mục` truyền ảnh đại diện tối giản cho client: ảnh sản phẩm đầu tiên có ảnh thật trong mỗi danh mục con; nếu chưa có ảnh thì dùng `CategoryIcon` của nhóm. Ảnh dùng `alt=""` vì tên danh mục đã hiện cạnh đó.
- Trong `components/storefront/ProductBrowser.tsx`, thêm hàng cuộn ngang trên điện thoại gồm nút “Lọc” và chip thương hiệu lấy từ chính danh sách đang xem. Chip bật/tắt cùng tham số `brand` dùng trong bảng lọc.
- Đổi hai nút đáy bảng lọc thành “Bỏ chọn” và “Xem N kết quả”; số kết quả lấy từ danh sách sau bộ lọc hiện tại.
- Tab nhóm dùng React state, không thêm `?nhom=`: chọn nhóm chỉ là trạng thái tạm trong trang; tránh thêm query mới ảnh hưởng cách URL lọc hiện có. Khi tải lại, mặc định trở về nhóm đầu tiên.

## Tệp đã sửa

- `components/storefront/CategoryIndexClient.tsx`
- `app/(store)/danh-muc/page.tsx` — chỉ truyền ánh xạ ảnh cho trang điện thoại; giữ nguyên trang desktop và định tuyến bộ lọc.
- `components/storefront/ProductBrowser.tsx`
- `docs/website-v2/viec/danh-muc-kieu-dmx/3_BAN_GIAO_CODEX.md` — tệp này.

Không sửa `lib/catalog.ts`, `app/(store)/danh-muc/[slug]/page.tsx` hay tệp nào ngoài danh sách khung. Các thay đổi đang có sẵn trong worktree được giữ nguyên.

## Kiểm tra

- `npx tsc --noEmit`: đạt.
- ESLint các tệp mã sửa (`CategoryIndexClient.tsx`, `app/(store)/danh-muc/page.tsx`, `ProductBrowser.tsx`): đạt.
- `git diff --check`: đạt; Git có cảnh báo chuẩn hóa LF/CRLF trên một số tệp Windows.
- Chưa kiểm tra trực quan trình duyệt; chưa chạy build.
- Không ghi Supabase, không chạy migration, không commit hoặc push.

## Việc cần tiếp

1. Claude Code rà mẫu trên trình duyệt ở 375px và desktop, đặc biệt kiểm tra ảnh thật/ảnh fallback, tab bàn phím, hàng thương hiệu và số kết quả.
2. Claude Code phản hồi điểm phạm vi ở đầu bàn giao. Nếu chấp thuận sửa `app/(store)/danh-muc/[slug]/page.tsx`, Codex có thể cập nhật tiêu đề thành “Tên mục · N sản phẩm” trong lượt tiếp theo.
3. Giữ nguyên việc đang chờ chủ shop duyệt riêng: thay đổi dữ liệu phân loại quạt trên Supabase.
