# Lộ trình chi tiết 10 giai đoạn

Mỗi giai đoạn gồm: **Mục tiêu · Câu hỏi cần hỏi · Lựa chọn thường gặp · Đầu ra · Done khi**. Đầu mỗi giai đoạn, tóm tắt cho người dùng giai đoạn này làm gì và vì sao, rồi đưa lựa chọn.

## Mục lục
0. Khởi động & Idea Brief
1. Nghiên cứu thị trường & chọn MVP
2. 4 tài liệu cốt lõi
3. Thương hiệu & thiết kế UI
4. Dựng nền dự án
5. Database & Auth
6. Storefront
7. Admin cửa hàng
8. Thanh toán, vận chuyển, thông báo
9. Kiểm thử, bảo mật, deploy
10. Vận hành & tăng trưởng

---

## 0. Khởi động & Idea Brief
**Mục tiêu:** hiểu shop bán gì, cho ai, đang bán ở đâu.
**Hỏi:** Bán sản phẩm gì (vật lý / số / dịch vụ)? Bao nhiêu mã SP (dưới 50 / 50-500 / hơn 500)? Khách là ai? Hiện bán qua kênh nào (Facebook, Shopee, Zalo, cửa hàng)? Ai sẽ quản trị (một mình / có nhân viên)? Ngân sách & thời hạn?
**Đầu ra:** bảng Idea Brief (mẫu ở `templates.md`). Nếu người dùng chưa có ý tưởng: hỏi sở thích/nghề nghiệp, gợi ý 3-5 mô hình (shop handmade, đồ ăn đặt trước, cho thuê trang phục, mỹ phẩm, sách cũ...).
**Skill:** `superpowers:brainstorming`.
**Done khi:** người dùng xác nhận Idea Brief; các ô chưa rõ ghi "chưa chốt".

## 1. Nghiên cứu thị trường & chọn MVP
**Mục tiêu:** chọn phạm vi nhỏ nhất bán được hàng thật.
**Lựa chọn MVP điển hình:**
- **A. Catalog + đặt hàng qua form/Zalo** — không giỏ hàng, không thanh toán online. Nhanh nhất (1-2 tuần).
- **B. Shop cơ bản** — giỏ hàng, checkout COD + chuyển khoản VietQR, admin quản lý SP & đơn. Phổ biến nhất.
- **C. Shop đầy đủ** — thêm tài khoản khách, thanh toán online (PayOS/VNPay), mã giảm giá, tồn kho theo biến thể, dashboard.
**Phân loại tính năng:** P0 phải có → P1 nên có → P2 để sau → P3 bỏ cũng được.
**Skill:** `anthropic-skills:deep-research` hoặc `marketing:competitive-brief` (xem đối thủ), `superpowers:brainstorming`.
**Done khi:** có danh sách "làm" và "cố tình chưa làm".

## 2. 4 tài liệu cốt lõi
Tạo trong `docs/`: `PRD.md`, `DESIGN.md`, `DEV_PLAN.md`, `PROGRESS.md` (+ `MENTOR_LOG.md`). Mẫu ở `templates.md`. Mỗi task trong DEV_PLAN mô tả Trigger → Response → Error → Done.
**Skill:** `superpowers:writing-plans` cho DEV_PLAN.
**Done khi:** người dùng đọc và duyệt cả 4 file. Tạo từng file một, duyệt rồi mới sang file sau.

## 3. Thương hiệu & thiết kế UI
**Hỏi:** cảm giác thương hiệu (tối giản / ấm áp / sang trọng / trẻ trung)? Có logo, màu, website tham khảo chưa? Khách chủ yếu dùng điện thoại?
**Trang cần thiết kế:** Trang chủ (Hero → Danh mục nổi bật → SP bán chạy → Lý do chọn shop → Đánh giá → CTA → Footer), Danh sách SP, Chi tiết SP, Giỏ hàng, Checkout, Tra cứu đơn; Admin: Dashboard, Bảng SP, Form SP, Bảng đơn.
**Quy tắc:** quy tắc 3 giây cho trang chủ; mobile-first (đa số khách VN mua qua điện thoại); nút "Thêm vào giỏ" luôn dễ thấy.
**Lựa chọn:** (A) mô tả → `design-taste-frontend` dựng thẳng bằng code; (B) phác bằng Google Stitch / v0 rồi chuyển code; (C) dựa trên theme/website tham khảo người dùng gửi.
**Skill:** cài Impeccable cho dự án (hỏi trước, xem tools-setup.md) → `/impeccable init` (từ PRD) → `/impeccable shape` / `craft` cho trang chủ (chính); `design-taste-frontend` khi cần hình minh họa / cảm giác thủ công (phụ); `small-business:brand-style`, `design:ux-copy`.
**Done khi:** `DESIGN.md` có màu, font, spacing, component chính; người dùng duyệt mockup trang chủ.

## 4. Dựng nền dự án
**Các bước (mỗi bước hỏi trước):** kiểm tra Node.js/Git → `npx create-next-app@latest` (TypeScript, Tailwind, App Router) → cài shadcn/ui → tạo Supabase project (hoặc dùng Supabase MCP) → `.env.local` với `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `@supabase/ssr` tạo client cho server/browser → đẩy lên GitHub.
**Cấu trúc gợi ý:** `app/(shop)/...` cho storefront, `app/admin/...` cho admin, `lib/supabase/`, `components/`.
**Skill:** `run` (chạy thử), `built-in-browser` (xem localhost).
**Done khi:** trang chủ trống chạy ở localhost, đã kết nối Supabase, đã có repo GitHub.

## 5. Database & Auth
**Mục tiêu:** dữ liệu shop an toàn ngay từ đầu.
Dùng mẫu `ecommerce-schema.md`. Xác định nhu cầu Record / Query / Track cho từng bảng. Đề xuất mức độ: (A) tối giản (products, orders, order_items), (B) chuẩn (thêm categories, variants, customers/profiles, addresses), (C) đầy đủ (thêm inventory_movements, coupons, reviews).
**Auth:** khách có thể mua không cần tài khoản (guest checkout) — hỏi người dùng. Admin đăng nhập bằng email; phân quyền qua bảng `profiles.role`.
**Skill:** Supabase MCP (`list_tables`, `apply_migration`, `get_advisors` kiểm tra bảo mật), `data:sql-queries`.
**Done khi:** migration chạy được, RLS bật cho mọi bảng, `get_advisors` không còn cảnh báo bảo mật, có dữ liệu mẫu 5-10 SP.

## 6. Storefront
Thứ tự gợi ý (mỗi mục là 1 task, làm và duyệt từng cái):
1. Danh sách SP + lọc theo danh mục + tìm kiếm
2. Trang chi tiết SP (ảnh, biến thể size/màu, tồn kho, mô tả)
3. Giỏ hàng (lưu localStorage hoặc Zustand; hỏi người dùng)
4. Checkout (thông tin người nhận, địa chỉ tỉnh/huyện/xã, ghi chú, phương thức thanh toán)
5. Tạo đơn qua Server Action / Route Handler — **tính tổng tiền ở server**, không tin giá từ trình duyệt
6. Trang cảm ơn + tra cứu đơn bằng mã đơn + số điện thoại
7. SEO cơ bản: metadata, Open Graph ảnh SP, sitemap, JSON-LD Product
**Skill:** `superpowers:executing-plans`, `superpowers:test-driven-development` (logic tính tiền, tồn kho), `/impeccable craft` + `harden checkout` + `adapt`, `ponytail-review` sau mỗi task, `playwright-cli` đi thử luồng mua hàng ở 390px.
**Done khi:** đặt được một đơn thử từ đầu đến cuối trên điện thoại.

## 7. Admin cửa hàng
Bảo vệ toàn bộ `/admin` bằng middleware + kiểm tra role ở server.
Module (chọn theo MVP): Dashboard (doanh thu hôm nay/tuần, số đơn mới, SP sắp hết) · Sản phẩm (CRUD, upload ảnh lên Supabase Storage, nhập hàng loạt từ Excel) · Tồn kho (điều chỉnh, lịch sử) · Đơn hàng (lọc theo trạng thái, đổi trạng thái: Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành / Hủy, in phiếu) · Khách hàng · Mã giảm giá · Nhân viên & phân quyền.
**Skill:** `/impeccable craft` / `layout` (màn hình admin), `data:build-dashboard`, `dataviz`, `anthropic-skills:xlsx` (import/export), `small-business:inventory-planner`, `ponytail-review` sau mỗi module, `playwright-cli` thử: người lạ vào `/admin` bị chặn, đổi trạng thái đơn.
**Done khi:** chủ shop tự thêm SP, xử lý đơn mà không cần mở Supabase.

## 8. Thanh toán, vận chuyển, thông báo
Xem `vn-ecommerce.md`. Lựa chọn thường gặp: (A) COD + VietQR chuyển khoản, xác nhận thủ công; (B) thêm PayOS (tự xác nhận qua webhook); (C) cổng VNPay/MoMo (cần đăng ký doanh nghiệp).
Webhook thanh toán chạy ở Route Handler hoặc Supabase Edge Function, luôn **xác minh chữ ký**.
Thông báo đơn mới: Telegram Bot (dễ nhất), email (Resend), Zalo OA (cần đăng ký).
**Skill:** `claude-api` nếu thêm AI (tư vấn SP, viết mô tả), `security-review`, `ponytail-review` (webhook, tiền), `playwright-cli` (thanh toán sandbox).
**Done khi:** đơn thử thanh toán ở chế độ test/sandbox cập nhật đúng trạng thái.

## 9. Kiểm thử, bảo mật, deploy
Checklist: luồng mua hàng trên mobile/desktop · giá trị âm/số lượng vượt tồn kho · người lạ vào `/admin` · RLS (thử đọc đơn người khác) · ảnh lớn · tốc độ (Lighthouse) · trạng thái lỗi & trống.
Hệ thống đèn: 🟢 chạy tốt · 🟡 lỗi nhỏ · 🔴 hỏng — sửa 🔴 trước.
Deploy: GitHub → Vercel, cấu hình env, domain riêng, Supabase Auth redirect URL.
**Skill:** `ponytail-audit` (rà toàn repo, sửa Must fix trước), `playwright-cli` (chạy lại toàn bộ luồng + ảnh mobile), `/impeccable audit` + `polish`, `security-review`, `design:accessibility-review`, `marketing:seo-audit`, `superpowers:verification-before-completion`.
**Done khi:** web live trên domain, đơn thật đầu tiên đặt thành công.

## 10. Vận hành & tăng trưởng
Chọn 1-2 mục mỗi lần: SEO & hiển thị trên AI search · nội dung blog/SP · bài mạng xã hội · email chăm sóc khách · quảng cáo · đánh giá & uy tín · dự báo nhập hàng · dòng tiền · báo cáo tuần.
**Skill:** `small-business:seo-ai-visibility`, `marketing:content-creation`, `small-business:social-content-engine`, `marketing:email-sequence`, `marketing:campaign-plan`, `small-business:ad-manager`, `small-business:review-reputation`, `small-business:restock`, `small-business:cash-flow-snapshot`, `marketing:performance-report`.
