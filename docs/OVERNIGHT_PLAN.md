# Kế hoạch chạy xuyên đêm — Tân Trường Tín

_Chủ shop chốt 2026-10-22. Mỗi lượt `/loop`: đọc file này + mục cuối `MENTOR_LOG.md`, làm **đúng 1 bước nhỏ** tiếp theo chưa xong, đánh dấu [x], ghi 1-3 dòng vào MENTOR_LOG, rồi hẹn giờ lượt sau._

## Quy tắc
- Toàn quyền dùng máy, không hỏi lại. Chỉ hỏi chủ shop khi **xong giao diện + backend**.
- Tránh hết token: mỗi lượt 1 bước; lưu tiến độ ngay sau bước. Khi hạn mức gần hết: dừng, hẹn giờ dài (3600s) để chờ reset.
- **Canh hạn mức mỗi lượt** bằng công cụ `get_usage` (mức 5 giờ + mức tuần): 5 giờ ≥ 85% → không làm bước mới, hẹn giờ tới lúc reset (tối đa 3600s/lần, lặp lại). Mức tuần ≥ 70% → dừng vòng lặp, ghi log, chờ chủ shop (để dành hạn mức cho cả tuần).
- Stitch project: https://stitch.withgoogle.com/projects/7867520432298205303 (trình duyệt trong app, đã đăng nhập). Mỗi prompt bắt đầu bằng "Create a NEW separate screen, do not change existing screens. Same design system... Only include what is described." Gửi prompt: bấm vào ô nhập, gõ, rồi bấm Ctrl+Enter (Stitch: Ctrl+Enter = gửi) hoặc chụp màn hình tìm nút mũi tên ↑ và bấm (Tab ×7 từng mở nhầm menu tài khoản; Enter trong ô = xuống dòng).
- Lọc tính năng: tải mã HTML từng màn về `design/stitch/admin/` (hoặc `storefront/`), đối chiếu `docs/PRD.md`; giữ tính năng có trong PRD (kể cả P1/P2), **bỏ** tính năng ngoài dự án và ghi vào `design/stitch/DA_LOAI_BO.md`.
- Việc treo (đổi trả, VietQR, phí ship nội thành) → nhãn "chờ chủ shop". AI gợi ý: giao diện trước.
- Hiệu ứng nhẹ: chỉ CSS transition ≤200ms, tôn trọng `prefers-reduced-motion`.
- Admin dùng trên iPhone 17 Pro Max (440×956): **vẽ bản điện thoại cho mọi màn Admin** (chủ shop chọn B).

- **Chủ shop chốt 23/10 (trước khi ngủ):** toàn quyền đến hết dự án: xong giao diện → backend → chạy thử vai khách → thử tấn công (chỉ hệ thống của shop, trên máy này) → vá bảo mật; mã dễ bảo trì. Hạn mức tuần: dừng ở **90%** (thay 70%). Được **commit + đẩy GitHub** (kho riêng tư volehaitrieu) sau mỗi phần. Supabase `ztbwxfzklznpqbofbwlk`: được tạo bảng/RLS/tài khoản thử, **chỉ gói miễn phí**, mật khẩu thử lưu `.env.local`. **Chưa đưa lên Vercel**, chạy trên máy. Sau mỗi lần reset 5 giờ: tự khởi động lại công việc.

## Bước
### Giai đoạn A — Admin trên Stitch (máy tính)
- [x] Tổng quan · Sản phẩm · Sửa SP · Nhập Excel · Duyệt gợi ý AI · Ảnh thông tin SP · Tồn kho · Kiểm kho · Đếm kho ĐT · Danh mục & thương hiệu · Đơn hàng · Chi tiết đơn
- [x] Bán tại quầy
- [x] Khuyến mãi (giá KM theo SP + mã giảm giá) — xong
- [x] Báo cáo (doanh thu, top SP, lãi gộp owner-only, xuất Excel) — xong
- [x] Nhân viên & quyền (bảng công tắc quyền theo vai trò) — xong
- [x] Nhật ký thao tác — xong
- [x] Cài đặt (thông tin shop thật, phí ship, VietQR "sắp có", Telegram, đổi trả "chờ chủ shop") — xong
- [x] Đăng nhập — xong

### Giai đoạn B — Admin bản iPhone (440px) trên Stitch
- Quy tắc: Mỗi màn ở trên 1 bản điện thoại: menu thành thanh đáy, bảng thành thẻ, nút ≥44px
- [x] ĐT: Đăng nhập — xong (khung còn rộng như máy tính, có thể sửa ở bước tải mã)
- [x] ĐT: Tổng quan — xong (khung dọc đúng)
- [x] ĐT: Sản phẩm — xong
- [x] ĐT: Sửa SP — xong
- [x] ĐT: Nhập Excel — xong
- [x] ĐT: Duyệt gợi ý AI — xong
- [x] ĐT: Ảnh thông tin SP — xong
- [x] ĐT: Tồn kho — xong
- [x] ĐT: Kiểm kho (Đếm kho ĐT đã có) — xong
- [x] ĐT: Danh mục & thương hiệu — xong
- [x] ĐT: Đơn hàng — xong
- [x] ĐT: Chi tiết đơn — xong
- [x] ĐT: Bán tại quầy — xong
- [x] ĐT: Khuyến mãi — xong
- [x] ĐT: Báo cáo — xong
- [x] ĐT: Nhân viên & quyền — xong (Stitch vẽ 2 phương án, chọn khi tải mã)
- [x] ĐT: Nhật ký thao tác — xong
- [x] ĐT: Cài đặt — xong (Giai đoạn B hoàn tất 22/10 05:38; màn ĐT Stitch rộng 390px)

### Giai đoạn C — Tải mã + lọc Admin
- Export Stitch: chọn màn (Ctrl+A = chọn tất cả) → nút Export (icon thứ 2 góc trên phải) → định dạng: AI Studio · Figma · MCP · Netlify · Lovable · Bolt · .zip
- [x] C1: Chủ shop cho phép tải .zip (22/10). Giới hạn 16 màn/lần và canvas không nhận chọn nhiều màn bằng chuột ảo → tải TỪNG MÀN: bấm 1 màn trên cột (zoom 5%, cột x≈346) → Export (686,32) → .zip (510,409) → nút Export (609,571) → file `Downloads/stitch_t_n_tr_ng_t_n_dashboard.zip` (code.html + screen.png + DESIGN.md) → giải nén vào `design/stitch/admin/_raw/<may-tinh|dt>_<ten-man>/` rồi xóa zip. Nhận diện màn bằng grep chữ trong code.html (đỡ tốn hơn xem ảnh).
- [x] C2: Lấy mã toàn bộ màn Admin — xong 22/10: 38 thư mục trong `design/stitch/admin/_raw/` (19 máy tính + 18 điện thoại + 1 phương án phụ Nhân viên & quyền), tải theo nhóm qua Chrome, script scratchpad group.ps1 (không ghi đè, bỏ trùng)
- [x] C3: Lọc theo PRD — xong 22/10: bảng từng màn `design/stitch/admin/LOC_THEO_PRD.md`, luật chung `design/stitch/DA_LOAI_BO.md`; chọn ĐT Nhân viên & quyền `_2`
- [x] C4: Bảng màn → thư mục: `design/stitch/admin/README.md`

### Giai đoạn D — Bán hàng trên Stitch + tải mã + lọc
- [ ] 8 màn máy tính + 9 màn điện thoại theo canvas Bán hàng (thông tin liên hệ thật, ô địa chỉ Tỉnh → Phường/Xã, COD mặc định, VietQR "sắp có")

### Giai đoạn E — Code
- [x] Task 1.1: Next.js 16 + TS + Tailwind 4 + lucide (chưa dùng shadcn) ở gốc dự án; `.env.local` đã trong `.gitignore`; tắt cacheComponents; chạy `npm run dev` (cấu hình `.claude/launch.json`). Chưa commit (chờ chủ shop cho phép)
- [x] Dựng giao diện Admin từ mã đã lọc (dữ liệu mẫu, tự co giãn) — xong 23/10: đủ 19 màn có nội dung mẫu (`components/admin/MockWorkspace.tsx`, `AdvancedScreens.tsx`; phần lớn do công cụ ngoài làm 22/10 22:38–00:40, đã kiểm tra lại). Đã sửa: lề trong thẻ (`Card pad`), nút ≥44px trên ĐT, bộ lọc Đơn hàng. Còn: dữ liệu mẫu, nút chưa bấm được (chờ backend)
- [x] Dựng giao diện Bán hàng — xong 23/10 (dữ liệu mẫu): dựng lại theo `docs/GIAO_DIEN_BAN_GIAO.md` B0–B10 trong `app/(store)/` (trang chủ, danh mục, tìm kiếm, chi tiết SP, giỏ, thanh toán, cảm ơn, tra cứu đơn, chính sách, báo giá, 404); dữ liệu `lib/mock/store.ts`; bản nháp cũ của công cụ ngoài cất ở `design/_storefront-cu/`. Còn: ảnh thật, phí ship, đổi trả (chờ chủ shop), nối backend
- [ ] Backend theo `docs/DEV_PLAN.md` (Supabase `ztbwxfzklznpqbofbwlk`, RLS từ đầu)
  - [x] 1.2–1.4 (23/10): migration `supabase/migrations/*` (bảng + RLS mọi bảng + hàm `private.has_perm` + hàm nghiệp vụ đặt hàng/tra cứu/trừ-hoàn tồn có khóa dòng + seed quyền/danh mục/SP mẫu); `lib/supabase/*`, `lib/auth.ts`, `proxy.ts` chặn /admin; đăng nhập SĐT/email thật; menu theo quyền; 3 tài khoản thử (mật khẩu ở `.env.local`); `scripts/kiem-thu-bao-mat.mjs` 39/39 đạt
  - [ ] Nối trang bán hàng vào DB (SP, đặt hàng, tra cứu, báo giá)
  - [ ] Nối các màn Admin vào DB — XONG: đơn, tồn kho, nhật ký, sản phẩm (danh sách + sửa). CÒN: Tổng quan, Kiểm kho + đếm ĐT, Nhân viên & quyền, Cài đặt, Báo cáo, Khuyến mãi, Danh mục, Bán tại quầy, Nhập Excel
  - [ ] Nhập Excel thật (1.5 / 2.3)
- [ ] Chụp ảnh mọi màn ở 1440px và 440px → báo chủ shop
