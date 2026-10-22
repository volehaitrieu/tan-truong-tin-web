# HANDOFF — Tân Trường Tín (đọc file này thay cho cả lịch sử chat)

_Cập nhật: 2026-10-21. Thư mục dự án: `C:\Users\Hai Trieu\Documents\tan-truong-tin-web`_

## 1. Dự án
Web bán hàng + trang quản trị cho cửa hàng **Tân Trường Tín** (điện nước, kim khí, dụng cụ, quạt, gia dụng) · 379 đường 2/4, phường Bắc Nha Trang, Khánh Hòa · SĐT/Zalo chính 0948 732 064, phụ 0793 783 379 · mở cửa 7:45–20:30.
Stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui · Supabase · GitHub + Vercel. Làm theo skill `shop-mentor` (hỏi 2-3 lựa chọn trước khi làm, báo cáo + ghi `docs/MENTOR_LOG.md` cuối mỗi lượt). Trả lời ngắn (caveman), tiếng Việt.

## 2. Tài liệu (nguồn sự thật — đọc khi cần, không cần đọc hết)
| File | Nội dung |
|---|---|
| `docs/PRD.md` | Yêu cầu, tính năng P0/P1/P2, quyết định đã chốt (mục 10, "Chốt thêm") |
| `docs/DESIGN.md` | Màu, font, logo (mục 1b), thành phần, bố cục |
| `docs/DEV_PLAN.md` | **v1.2**: Đợt 1 Admin (~7/11) → Đợt 2 Bán hàng (~20/11); task Trigger/Response/Error/Done |
| `docs/PROGRESS.md` | Trạng thái từng task |
| `docs/MENTOR_LOG.md` | Nhật ký (chỉ cần đọc mục cuối) |
| `docs/brand/` | Logo chính thức `logo-trong-suot.png`, `logo-512.png`, `logo-64-favicon.png` |

## 3. Thiết kế đã có
- **Canvas** (2 trang: Quản trị / Bán hàng): https://claude.ai/artifact/9hbAUJokC937LsVrHWRs3C — Admin 15 màn + 2 màn điện thoại kiểm kho (**đã duyệt**); Bán hàng 8 màn máy tính + 9 điện thoại (**chưa duyệt**). File nguồn canvas nằm ở thư mục tạm, muốn sửa thì `Artifact read` lại.
- Mẫu trang chủ HTML: `mockup/trang-chu.html` · https://claude.ai/artifact/E5Vo4W6s1hL8aqcbgrWthg

## 4. Quyết định chính đã chốt
- 1 shop nhiều ngành; ~3.575 mã (Excel DMHH) + ~183 mã quạt (file mẫu chuẩn có thông số). Giá Excel = nghìn đồng (×1.000), giá gồm VAT.
- Admin là sổ kho chính (bỏ app Kho Mộc). Excel có thêm cột **Tồn kho + Tồn tối thiểu** → cảnh báo sắp hết.
- Ảnh: minh họa theo danh mục con cho mọi SP, ảnh thật thay dần. Không dùng ảnh shop khác. Có tính năng **ảnh thông tin SP** (PNG 1080, nút icon tải) để gửi khách qua Zalo.
- Kiểm kho: đợt kiểm + đếm trên điện thoại (đếm mù tùy chọn).
- Quyền: Chủ = tất cả; NV kho = xem (kể cả giá nhập) + đếm, không điều chỉnh; NV đơn = xử lý đơn, nhập phí ship, xác nhận tiền, không hủy/giảm giá. Quyền dạng công tắc trong admin. Không xóa SP, chỉ Ẩn.
- Mua hàng: không cần tài khoản; COD (+ VietQR **tạm chưa làm**, chưa có tài khoản ngân hàng); hết hàng → "Liên hệ", vẫn đặt trước; số lượng nguyên; giá sỉ = nút "Báo giá số lượng lớn"; báo đơn qua Telegram.
- Ship: lấy tại cửa hàng 0₫; đi tỉnh (SPX/GHTK) báo phí sau; nội thành chưa chốt (admin tự cài, chưa cài = báo sau).
- Chỉ giao diện sáng; xanh lá #0D6B45 + nhấn vàng #F2B705; font Be Vietnam Pro; menu danh mục dọc; bộ lọc kiểu CellphoneS.
- Tên miền: dùng địa chỉ miễn phí Vercel trước, mua `tantruongtin.vn` trước mở bán công khai.

## 5. Hạ tầng
- Supabase project **mới** `tan-truong-tin-web` (id `ztbwxfzklznpqbofbwlk`, Singapore, gói miễn phí). Project cũ "TanTruongTin'sWeb" giữ nguyên, **không dùng**.
- Máy: Node 24, npm 11, Git 2.55, Supabase CLI 2.115, Python + Pillow. Có GitHub; **chưa có Vercel**.

## 6. Việc tiếp theo (theo thứ tự)
1. Chủ shop duyệt trang Bán hàng trên canvas (đã có thông tin liên hệ thật + ô địa chỉ Tỉnh → Phường/Xã có tìm kiếm, nội thành khóa Khánh Hòa; COD mặc định, VietQR "sắp có"). Còn sót: mẫu trang chủ + Tra cứu đơn còn nhắc VietQR.
2. Khi code: tra nguồn dữ liệu địa giới mới 2 cấp (tên phường trên canvas là mẫu). Bản đồ Goong để sau.
3. **Task 1.1** dựng dự án Next.js trong thư mục này (hỏi trước khi cài).
4. Còn treo: chính sách đổi trả, VietQR, phí ship nội thành, tài khoản Vercel, Excel có cột tồn kho.

## 7. Đang chạy xuyên đêm (từ 2026-10-22)
Làm theo `docs/OVERNIGHT_PLAN.md` (quy tắc + checklist). Chủ shop đã cho toàn quyền, chỉ hỏi khi xong giao diện + backend. Đã chốt: Admin có bản iPhone 17 Pro Max cho mọi màn; lọc tính năng thừa trong mã Stitch; được viết Next.js. Đã đăng nhập: Stitch (trình duyệt trong app), GitHub CLI (`volehaitrieu`), Supabase CLI; Claude API key trong `.env.local` (đã kiểm tra hoạt động). Canh hạn mức bằng `get_usage`.
