# Bộ lọc gọn + thanh đáy + tấm Danh mục — Bàn giao Codex (07/11/2026, chủ shop đã chọn mẫu)

Nhánh `worktree-website-v2`. Đọc `AGENTS.md`, `docs/DESIGN.md`, `docs/website-v2/BANG_MAU_VA_BO_CUC.md`. Làm mobile 375px trước. Không commit/push/ghi Supabase/migration/deploy.
Lưu ý: việc "cột Phân loại" (`viec/phan-loai/`) đang chờ chủ shop kiểm, chưa commit — giữ nguyên các thay đổi đó, chỉ sửa đè phần nêu dưới đây.

## 1. Đầu trang danh sách (`ProductBrowser.tsx`, có thể dùng lại `PriceRange.tsx`) — chủ shop chọn "Mẫu 2"
- Phía trên lưới sản phẩm **chỉ còn**:
  - Hàng 1: nút **Lọc** (trái, như hiện có, kèm số bộ lọc đang bật) — bên phải là chữ "Khoảng giá: **300.000₫ – 1.200.000₫**" (giá đang chọn).
  - Hàng 2: **thanh kéo giá 2 đầu** dài hết bề ngang, min/max = giá thấp/cao nhất của danh sách hiện tại (trước khi lọc giá). Dùng lại `PriceRange` (đã có kiểm lỗi, bước giá). Thả tay mới lọc (không lọc liên tục khi đang kéo); ghi vào URL cùng cơ chế với bộ lọc giá trong bảng Lọc (đồng bộ hai chiều).
  - Rồi dòng "Tìm thấy N sản phẩm" + sắp xếp như cũ.
- **Bỏ khỏi đầu trang**: hàng chip thương hiệu và hàng chip Phân loại (vừa thêm ở việc phan-loai). Các nhóm này vẫn nằm trong bảng Lọc.
- Nút Lọc thu hút nhẹ: chấm nhỏ màu nhấn trên nút, nhấp nháy/phập phồng nhẹ **2–3 lần khi vào trang rồi đứng yên**; tắt khi `prefers-reduced-motion`.

## 2. Bảng Lọc (`FilterSheet.tsx` / `ProductBrowser.tsx`)
- **Giữ nguyên tất cả các nhóm hiện có** (không bớt nhóm nào).
- **Sửa lỗi**: bấm "Xem thêm" (danh sách hãng/lựa chọn dài) rồi tick một lựa chọn → phần mở rộng bị thu gọn. Nguyên nhân thấy ở `ProductBrowser.tsx`: `brandExpansion` gắn `key: navigationKey` (URL), tick đổi URL nên mất trạng thái. Kiểm cả `FilterSheet.tsx` nếu có chỗ tương tự. Giữ mở rộng cho tới khi khách bấm "Thu gọn" hoặc đổi trang danh mục (pathname), không phụ thuộc query.
- Hiệu ứng nhẹ, mượt: bảng trượt lên + hiện dần ~220ms ease-out, đóng ~160ms; nhóm mở/đóng mượt (không giật chiều cao — dùng grid-rows 0fr→1fr hoặc tương đương); chip/ô tick co nhẹ `scale(0.97)` khi nhấn, đổi màu 150ms; danh sách kết quả hiện dần ~150ms khi đổi lọc. Không nảy, lắc, lóe. Tôn trọng `prefers-reduced-motion`.

## 3. Thanh đáy (`StoreShell.tsx` → tách phần nav thành client component dùng `usePathname`)
- Nút của trang đang xem: **chữ + biểu tượng màu `text-brand` (đen hệ thống, KHÔNG dùng xanh) và nền nhạt `bg-brand-tint` bo tròn** quanh biểu tượng+chữ, chữ đậm hơn; `aria-current="page"`. Trang chủ = `/`; Danh mục = `/danh-muc*` hoặc khi tấm Danh mục đang mở; Giỏ hàng = `/gio-hang*` (gồm thanh toán nếu cùng nhánh đường dẫn); Tra cứu đơn = `/tra-cuu*`.
- Chuyển trạng thái màu 150ms. Màu lấy từ token `.store:has([data-theme-v2])` trong `app/globals.css`; không hex cứng.

## 4. Tấm Danh mục (`CategoryOverlay.tsx`, `CategoryIndexClient.tsx`)
- Đổi toàn bộ màu chép từ DMX (#F2F4F7, #EAECF0, #2A83E9, #252A31, #101828, #D0D5DD, #EAF3FF, #98A2B3, #667085) sang token hệ thống: nền `ground`/`sunk`, khung `surface`, chữ `ink`/`ink-2`, kẻ `line`, tab chọn: nền `surface` + chữ đậm `ink` + vạch trái `brand`; ô ảnh nền `brand-tint` hoặc `sunk`; nút ✕ theo kiểu nút tròn của web. Giữ nguyên bố cục, số đo, hiệu ứng.
- **Không che thanh đáy**: tấm chừa phần đáy bằng chiều cao thanh đáy (64px + safe-area), thanh đáy luôn hiện và bấm được. Khi tấm mở, nút "Danh mục" ở thanh đáy ở trạng thái đang chọn; bấm lại nút Danh mục hoặc nút khác thì đóng tấm (và điều hướng nếu là nút khác).

## Nghiệm thu
1. 375px `/danh-muc/quat`: đầu trang chỉ có Lọc + khoảng giá + thanh kéo; kéo 2 đầu lọc đúng, URL đổi, mở Lọc thấy giá khớp.
2. Bảng Lọc đủ nhóm cũ; "Xem thêm" rồi tick → vẫn mở rộng.
3. Hiệu ứng mượt; bật giảm chuyển động → không trượt/nhấp nháy.
4. Thanh đáy: đúng nút sáng ở `/`, `/danh-muc/quat`, `/gio-hang`, `/tra-cuu`; màu đen + nền nhạt, không xanh.
5. Mở tấm Danh mục: thanh đáy vẫn hiện, nút Danh mục sáng; màu tấm khớp web.
6. `npx tsc --noEmit`, ESLint tệp sửa đạt. Không tràn ngang. Báo: tệp sửa, đã kiểm, chưa kiểm.
