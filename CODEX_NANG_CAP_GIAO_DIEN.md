# Bàn giao cho Codex — Nâng cấp giao diện Tân Trường Tín

_24/10/2026. Đọc kèm `HANDOFF.md` (toàn bộ dự án, database, quyết định kỹ thuật). File này chỉ nói về **giao diện**._

## Lời nhắn để dán vào Codex

> Bạn nhận yêu cầu nâng cấp giao diện cho web bán hàng + trang quản trị "Tân Trường Tín" (Next.js 16 App Router, React 19, Tailwind 4, Supabase). Đọc `HANDOFF.md` rồi file này. **Bước đầu chỉ tạo hai ảnh mockup tĩnh để chủ shop duyệt: màn Sản phẩm và màn Tồn kho trên điện thoại. Chưa sửa mã ứng dụng, chưa đụng database và chưa deploy.** Xuất hai PNG riêng, rõ chữ tiếng Việt ở cỡ điện thoại 375–440px; giữ màu xanh hiện tại, font Be Vietnam Pro, logo và nghiệp vụ thật. Có thể tạo HTML tạm chỉ để kết xuất ảnh, nhưng không tích hợp vào ứng dụng. Gửi ảnh và giải thích ngắn các quyết định bố cục; chờ chủ shop xác nhận rõ ràng rồi mới bắt đầu code. Khi được duyệt, chỉ sửa phần trình bày (JSX, class Tailwind, `app/globals.css`, thành phần trong `components/`); không đổi truy vấn, server action, hàm/quyền database, `proxy.ts`, `lib/auth.ts`. Mỗi màn phải đẹp ở 375px và 1280px, không tràn ngang, nút ≥ 44px trên điện thoại. Làm từng màn theo ưu tiên trong file, sau mỗi màn chạy `npx tsc --noEmit -p .` và `npm run lint`, chụp ảnh trước/sau. Hỏi chủ shop trước khi đổi bố cục lớn hoặc màu thương hiệu. Khi bắt đầu code, dùng Taste Skill cho màn ứng dụng và đọc `node_modules/next/dist/docs/` theo yêu cầu trong `AGENTS.md`.

## Bổ sung sau khi trao đổi với chủ shop (24/10/2026)

### Cổng duyệt bằng hình ảnh trước khi code

- Chủ shop muốn xem ảnh kết quả trước; chỉ khi chủ shop thấy phù hợp và đồng ý rõ ràng mới bắt đầu thực hiện giao diện thật.
- Mockup đầu tiên theo xác nhận mới nhất của chủ shop: **hai màn Sản phẩm và Tồn kho trên điện thoại**, xuất thành hai ảnh PNG riêng ở độ rộng 375–440px. Màn Sản phẩm cần thể hiện ảnh + tên + mã, tìm kiếm/lọc và các thao tác đã có; màn Tồn kho cần giúp nhận biết nhanh số tồn và hàng dưới mức tối thiểu. Không tự đổi nghiệp vụ hoặc thêm số liệu giả.
- Trước khi duyệt: chỉ tạo ảnh PNG xem trước; không sửa trang thật, không sửa dữ liệu/cơ sở dữ liệu, không thêm thư viện và không deploy.
- Hình phải giữ nhận diện hiện có của Tân Trường Tín, nội dung tiếng Việt chính xác, tương phản dễ đọc và kích thước thao tác điện thoại đủ lớn. Không dùng số liệu hoặc nghiệp vụ giả như thể là dữ liệu thật.

### Trang tham khảo giao diện và nghiệp vụ

Các trang dưới đây dùng để tham khảo mẫu tương tác, không sao chép nguyên giao diện:

| Tham khảo | Điều có thể học |
|---|---|
| [Sapo — Quản lý kho sản phẩm](https://help.sapo.vn/quan-ly-kho-san-pham-tren-phan-mem-quan-ly-ban-hang-sapo) | Ảnh + tên + mã hàng, số tồn và giá; tìm SKU/barcode; lọc, sắp xếp, chỉnh cột, thao tác hàng loạt. Gần với cửa hàng bán lẻ Việt Nam. |
| [Shopify — Tìm kiếm và lọc sản phẩm](https://help.shopify.com/en/manual/products/searching-filtering) | Bộ lọc dễ tìm, lưu chế độ xem, tùy chỉnh cột và thao tác hàng loạt. |
| [Shopify — Xem tồn kho](https://help.shopify.com/en/manual/inventory-and-locations/adjusting-inventory/viewing-inventory) | Phân biệt tồn thực, số có thể bán, hàng đang giữ/chờ về và vị trí để hàng. |
| [Square for Retail](https://squareup.com/us/en/retail/capabilities) | Kiểm hàng bằng điện thoại, cảnh báo sắp hết, nhập danh mục và thao tác tồn kho. |
| [Sapo — Tổng quan trên điện thoại](https://help.sapo.vn/gioi-thieu-giao-dien-tong-quan-phan-mem-quan-ly-ban-hang-sapo) | Điều hướng dưới màn hình và ghim thao tác thường dùng trên điện thoại. |

Hướng tham khảo tổng hợp: ưu tiên sự rõ ràng và thao tác nhanh cho cửa hàng một địa điểm; giữ bảng/lọc linh hoạt trên máy tính và chuyển thành các khối dễ quét trên điện thoại. Dùng bảng màu/kiểu chữ đã có trong phần 1, không đổi bộ nhận diện nếu chưa được chủ shop duyệt.

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
- Tài liệu thiết kế gốc: `docs/DESIGN.md`; mô tả từng màn: `docs/GIAO_DIEN_BAN_GIAO.md`; không còn ảnh chụp màn hình trong dự án — chạy `npm run dev` để xem giao diện thật.
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
