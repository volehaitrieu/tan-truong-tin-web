# Bàn giao cho Codex — Nâng cấp giao diện Tân Trường Tín

_24/10/2026. Đọc kèm `HANDOFF.md` (toàn bộ dự án, database, quyết định kỹ thuật). File này chỉ nói về **giao diện**._

## Lời nhắn để dán vào Codex

> Bạn nhận nâng cấp **giao diện** cho web bán hàng + trang quản trị "Tân Trường Tín" (Next.js 16 App Router, React 19, Tailwind 4, Supabase). Đọc `HANDOFF.md` rồi `CODEX_NANG_CAP_GIAO_DIEN.md` trước khi làm. Chỉ sửa phần trình bày (JSX, class Tailwind, `app/globals.css`, thành phần trong `components/`); **không đổi** truy vấn, server action, hàm/quyền database, `proxy.ts`, `lib/auth.ts`. Giữ tiếng Việt cho mọi chữ hiển thị. Mỗi màn phải đẹp ở **375px và 1280px**, không tràn ngang, nút ≥ 44px trên điện thoại. Làm từng màn một theo thứ tự ưu tiên trong file, sau mỗi màn chạy `npx tsc --noEmit -p .` và `npm run lint`, chụp ảnh trước/sau. Hỏi chủ shop trước khi đổi bố cục lớn hoặc màu thương hiệu. Next.js 16 khác bản cũ: xem `node_modules/next/dist/docs/` khi cần.

## 1. Hệ màu, chữ (đang dùng — giữ nguyên trừ khi chủ shop đồng ý đổi)

Khai báo trong `app/globals.css` (Tailwind 4, `@theme`). Dùng qua class `bg-brand`, `text-ink-2`…

| Tên | Mã | Dùng cho |
|---|---|---|
| brand / brand-deep / brand-tint | #0d6b45 / #08482f / #e3f2e9 | Màu chính (xanh lá), nút chính, sidebar admin |
| gold / gold-ink / gold-tint | #f2b705 / #3a2c00 / #fff3c7 | Điểm nhấn trang bán hàng, cảnh báo nhẹ |
| ground / surface / sunk | #f7faf7 / #fff / #eef3ef | Nền trang / thẻ / ô ảnh |
| line | #e5e7eb | Viền |
| ink / ink-2 | #14231b / #4b5a51 | Chữ chính / chữ phụ |
| danger / ok / ask | #b3261e / #1b7a47 / #b7791f | Giá, lỗi, hết hàng / còn hàng / "Liên hệ" |

- Font: **Be Vietnam Pro** (`next/font/google`, `app/layout.tsx`).
- Biểu tượng: **lucide-react**.
- Logo: `components/brand/Logo.tsx`, file `public/brand/logo-trong-suot.png`.
- Tài liệu thiết kế gốc: `docs/DESIGN.md`; mô tả từng màn: `docs/GIAO_DIEN_BAN_GIAO.md`; ảnh chụp hiện tại: `docs/anh-giao-dien/dt/` (điện thoại) và `docs/anh-giao-dien/mt/` (máy tính) — **ảnh chụp ngày 23/10 sáng, chưa có các thay đổi sau đó**.
- Thành phần admin dùng chung: `components/admin/ui.tsx` (PageHeader, Card, Badge, ButtonLink, OwnerOnly), `ProductCell.tsx` (ảnh + tên + "Mã:").

## 2. Danh sách màn và việc cần cải thiện (theo thứ tự ưu tiên)

### Trang quản trị (`app/admin/(shell)/…`)
1. **Bán tại quầy** (`ban-tai-quay/PosClient.tsx`) — ĐT: giỏ nằm dưới lưới SP, phải cuộn xa. Cần **thanh giỏ dính đáy** (tổng tiền + nút Thanh toán, bấm mở giỏ), không che thanh menu dưới (`components/admin/MobileTabBar.tsx`).
2. **Sản phẩm** (`san-pham/page.tsx`, `components/admin/ProductTable.tsx`, `ProductFilters.tsx`) — bảng nhiều cột trên máy tính; thẻ trên ĐT. Khung chi tiết: máy tính 3 cột vừa 1 màn (không được thêm thanh cuộn), ĐT trượt từ đáy. Bảng lưu thư mục ảnh báo giá (`SaveFolderDialog`). Có thể làm đẹp thêm nhưng **giữ nguyên hành vi** (ô tick, Chọn tất cả, Xóa bộ lọc, hỏi lọc giá gốc/KM/cả 2).
3. **Nhập Excel** (`nhap-excel/ImportClient.tsx`, `ReviewTable.tsx`) — màn dài: bước 1-2-3, xem trước, bảng "Thay đổi chờ xác nhận" (cũ gạch ngang / mới màu xanh, ô tick, Chọn tất cả). Cần gọn, dễ đọc trên ĐT. Bảng đối chiếu trên ĐT **chưa được kiểm tra**.
4. **Sửa sản phẩm** (`components/admin/ProductForm.tsx`, `RichTextEditor.tsx`) — form dài 3 thẻ + cột phải; thanh Lưu dính đáy. Thanh nút soạn mô tả xuống 2 hàng trên ĐT.
5. **Tổng quan** (`(shell)/page.tsx`) — thẻ số liệu, biểu đồ 7 ngày, bảng sắp hết hàng (số tồn đỏ khi < tối thiểu).
6. **Đơn hàng + chi tiết** (`don-hang/`), **Tồn kho** (`components/admin/InventoryScreens.tsx`), **Kiểm kho** (`kiem-kho/`), **Khuyến mãi**, **Báo cáo**, **Nhân viên**, **Nhật ký**, **Cài đặt**, **Danh mục**, **Đổi mật khẩu**, **Đăng nhập** — chạy được, chưa có góp ý cụ thể; chỉ cần đồng bộ phong cách.
7. **Duyệt AI** (`san-pham/duyet-ai`) — chỉ là nhãn "chưa dùng"; không cần làm.

### Trang bán hàng (`app/(store)/…`, `components/storefront/`)
8. Trang chủ, danh mục (lọc thông số quạt), chi tiết SP (bảng thông số + mô tả định dạng `.rich-text`), giỏ, thanh toán, cảm ơn, tra cứu đơn, báo giá, chính sách, tìm kiếm, 404 — chạy được, chưa có góp ý cụ thể. Ảnh SP hiện là **ảnh minh họa theo nhóm** (`public/ai/`), có nhãn "Ảnh minh họa".

### Ảnh báo giá PNG (`lib/quote-image.ts`)
9. Vẽ bằng canvas (rộng 1080px, cao theo nội dung): thanh xanh đầu, ảnh + tên + mã + giá + thông tin, bảng thông số 2 cột, mô tả, chân trang. Có thể làm đẹp nhưng giữ: chữ tiếng Việt rõ, không có giá nhập/tồn, tên file = tên SP.

## 3. Không được thay đổi

- Logic dữ liệu: `lib/admin/*.ts`, `lib/catalog.ts`, mọi `actions.ts`, `route.ts`, `supabase/migrations/`, `proxy.ts`, `lib/auth.ts`, `lib/supabase/*`.
- Bộ làm sạch HTML `lib/rich-text.ts` (bảo mật) — chỉ được thêm style cho `.rich-text` trong CSS.
- Chữ hiển thị phải tiếng Việt; đường dẫn trang giữ nguyên.
- Không thêm thư viện UI/animation mới nếu chưa hỏi chủ shop (dự án cố ý ít phụ thuộc).
- Không import gì từ `design/`, `design-system/`, `mockup/` (bản mẫu cũ).
- Không lộ giá nhập ở nơi khách thấy; ô "Giá nhập" trong admin chỉ hiện khi có quyền (`OwnerOnly`).

## 4. Cách kiểm tra sau khi sửa

```bash
npm run dev                                   # http://localhost:3000, admin: /admin (cần tài khoản chủ shop)
npx tsc --noEmit -p .
npm run lint
node --env-file=.env.local scripts/kiem-thu-bao-mat.mjs   # phải 47/47 (cần TEST_OWNER_PASSWORD đúng)
node --env-file=.env.local scripts/tan-cong-thu.mjs       # phải 35/35
```

- Xem mỗi màn ở 375px và 1280px; không có thanh cuộn ngang (`document.documentElement.scrollWidth === innerWidth`).
- Không lỗi trong console trình duyệt.
- Không deploy (`vercel --prod`) khi chủ shop chưa đồng ý.

## 5. Trạng thái mã lúc bàn giao

- Nhánh `main`, commit mới nhất đã push lên GitHub (`volehaitrieu/tan-truong-tin-web`). Có thể quay lại bằng `git log` / `git checkout <commit>`.
- Web thật (Vercel) **chưa** có các thay đổi từ 23/10 chiều.
