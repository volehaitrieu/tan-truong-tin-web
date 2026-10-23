# Mentor Log — Tân Trường Tín

## [2026-10-20] Giai đoạn 0 — Khởi động & Idea Brief
- **Đã làm:** vạch lộ trình 10 giai đoạn; tư vấn đặc thù shop đa ngành (cây danh mục, thuộc tính theo ngành, biến thể, tìm kiếm/lọc); hỏi và chốt Idea Brief.
- **Skill/công cụ đã dùng:** `shop-mentor` (lộ trình, đặc thù VN), `superpowers:brainstorming` (hỏi từng câu, tóm tắt lại để kiểm tra), công cụ hỏi lựa chọn.
- **Quyết định:**
  - 1 shop nhiều ngành (không làm sàn) vì đơn giản hơn nhiều.
  - Ngành: gia dụng & nhà cửa, dụng cụ sửa chữa, điện tử & công nghệ · hơn 1.000 SP.
  - Chủ shop + vài nhân viên → cần phân quyền.
  - Tồn kho hướng A: trang quản trị web là sổ kho chính, nhập lần đầu từ Excel, sau thêm "Bán tại quầy".
  - Giao hàng: tự giao/Grab nội thành, SPX Express + GHTK đi tỉnh, đến cửa hàng lấy.
  - Thanh toán: COD + VietQR (sau nâng lên PayOS).
  - Admin nằm ở `/admin` trong cùng dự án.
- **Thay đổi file/DB:** tạo `docs/IDEA_BRIEF.md`, `docs/MENTOR_LOG.md`.
- **Còn treo / rủi ro:** ngân sách & thời hạn; phân quyền chi tiết; cách tính phí ship; giao diện, logo, tên miền. Rủi ro lệch tồn kho giữa cửa hàng và web cho đến khi có "Bán tại quầy".
- **Tiếp theo:** Giai đoạn 1 — nghiên cứu đối thủ & chọn phạm vi MVP (P0/P1/P2).

## [2026-10-20] Giai đoạn 1 — Khảo sát dữ liệu & sở thích giao diện
- **Đã làm:** đọc sheet `DMHH` trong `KHO XHD (1).xlsx` (chỉ đọc, không đọc sheet `TON KHO`, không sửa file gốc). Ghi nhận web tham khảo.
- **Skill/công cụ đã dùng:** script Python đọc xlsx (thư viện chuẩn, không cài thêm gói) để thống kê cột, đơn vị tính, giá, phân nhóm thử theo từ khóa.
- **Phát hiện chính:**
  - 3.575 mã hàng; cột: Mã, Tên, Đơn vị tính, Đơn giá, Thuế GTGT. Cột "Loại hàng hóa" để trống → **chưa có danh mục**, không có thương hiệu, ảnh, mô tả.
  - Nhóm thử theo từ khóa: Điện–đèn ~705 · Nước–ống–van ~671 · Dụng cụ & máy ~472 · Quạt–điện máy ~344 · Kim khí ~305 · Gia dụng bếp ~293 · Sơn–keo ~102 · Công nghệ ~46 · Chưa phân loại ~637.
  - 35 đơn vị tính, có chỗ viết lệch (kg/Kg, m/Mét). Mã hàng 2 kiểu (chữ liền không dấu và HH###), không trùng. 2 mã giá 0đ. Giá trung vị 66.000đ.
- **Quyết định:** menu danh mục dạng **dọc** (mở rộng sang phải như CellphoneS), bố trí nhóm hàng dễ chọn như Nguyễn Kim; bộ lọc kiểu CellphoneS (thương hiệu, nhu cầu, khoảng giá, thông số). Mục tiêu: đơn online đầu tiên sau ~1 tháng (khoảng 2026-11-20); 5-6 giờ/ngày.
- **Còn treo / rủi ro:** thiếu danh mục/ảnh/thương hiệu cho 3.575 mã là khối việc lớn nhất; Idea Brief cần cập nhật (ngành thực tế nghiêng về điện nước – kim khí – dụng cụ) — chờ chủ shop đồng ý.
- **Tiếp theo:** chủ shop chọn phương án MVP.

## [2026-10-20] Giai đoạn 1 — Chốt MVP A & đọc file kho quạt
- **Đã làm:** đọc file `Quạt_tttt_-_cập_nhật_thông_số_chi_tiết (Đã Sửa).xlsx` (sheet Import_SanPham + HuongDan, chỉ đọc). Cập nhật `docs/IDEA_BRIEF.md` (ngành thực tế, dữ liệu hàng hóa, MVP A, bố cục tham khảo, thời hạn).
- **Skill/công cụ đã dùng:** script Python đọc xlsx (thư viện chuẩn).
- **Phát hiện chính (file quạt):**
  - ~183 mã quạt, 46 cột. Danh mục dạng cha > con (`Quạt > Quạt treo tường`…, 8 loại). 14+ thương hiệu (Lifan, ChingHai, Senko, Asia, Kim Cương, Hali…).
  - Thông số gần đủ: sải cánh, công suất, số cánh, tốc độ gió, điều khiển, điện áp; ít hơn: xuất xứ, bảo hành, kích thước, khối lượng.
  - 113 mã có link ảnh từ web hãng; ~91 dòng thiếu SKU; 60+ dòng "Cần rà soát/xác nhận".
  - Giá ghi dạng nghìn đồng (480 = 480.000đ?) — chưa xác nhận. Có cột **giá nhập** → chỉ chủ shop được xem.
  - File nhắc tới "hệ thống Kho Mộc" — chưa rõ đây là app chủ shop đang dùng hay không.
- **Quyết định:** MVP phương án A. Cách lưu thông số: thuộc tính linh hoạt theo danh mục; file quạt là mẫu chuẩn cho ngành khác.
- **Còn treo / rủi ro:** Kho Mộc là gì; đơn vị giá; quyền dùng ảnh từ web hãng (nên tải về lưu trên Storage của shop, không link thẳng); SKU thiếu.
- **Tiếp theo:** trả lời câu hỏi treo → Giai đoạn 2 viết `PRD.md`.

## [2026-10-20] Giai đoạn 1 — Bỏ Kho Mộc
- **Quyết định:** chủ shop chọn **bỏ app Kho Mộc**, làm hệ thống kho mới hoàn toàn trong admin web. Dữ liệu Excel vẫn dùng để nhập.
- **Thay đổi file:** thêm dòng "App kho cũ" vào `docs/IDEA_BRIEF.md`.
- **Còn treo:** đơn vị giá (giả định nghìn đồng); cách xử lý ảnh từ web hãng.
- **Tiếp theo:** Giai đoạn 2 — chọn cách viết `PRD.md`.

## [2026-10-20] Giai đoạn 2 — Viết PRD (bản nháp v0.1)
- **Đã làm:** tạo `docs/PRD.md`: tổng quan, 5 mục tiêu, 4 vai trò, 3 luồng chính, 20 tính năng storefront + 25 tính năng admin xếp P0-P3, ngoài phạm vi, yêu cầu phi chức năng, chỉ số, mốc 4 tuần, 10 câu hỏi chưa chốt.
- **Skill/công cụ đã dùng:** `shop-mentor` (mẫu PRD, đặc thù VN).
- **Quyết định:** chủ shop chọn viết PRD đầy đủ một lần rồi duyệt.
- **Đề xuất trong PRD chờ duyệt:** trừ tồn khi đơn "Đã xác nhận"; AI (Claude API) gợi ý danh mục/thương hiệu; giá lưu bằng đồng (số nguyên); 3 vai trò Chủ/Đơn/Kho.
- **Còn treo:** 10 câu hỏi ở mục 10 của PRD.
- **Tiếp theo:** chủ shop duyệt PRD → trả lời câu hỏi treo → `DESIGN.md`.

## [2026-10-21] Giai đoạn 2 — Chốt PRD v1.0
- **Đã làm:** cập nhật `docs/PRD.md` lên v1.0 (đã duyệt): thêm mục 10 "Quyết định đã chốt", mục 11 "Câu hỏi chưa chốt"; sửa S8 (Liên hệ khi hết hàng, giá gồm VAT), thêm S8b (ảnh minh họa), sửa A10.
- **Skill/công cụ đã dùng:** `caveman` (bật trả lời ngắn theo yêu cầu chủ shop), `shop-mentor`.
- **Quyết định:** giá Excel = nghìn đồng · giá gồm VAT · hết hàng → "Liên hệ", vẫn đặt được · SP chưa có ảnh → ảnh minh họa · đồng ý 3 đề xuất (trừ tồn khi xác nhận, 3 vai trò, AI phân loại).
- **Còn treo:** cách tạo ảnh minh họa; SP có ảnh minh họa có hiện ngay lên web không; phí ship; phân quyền chi tiết; ngân sách.
- **Tiếp theo:** `DESIGN.md`.

## [2026-10-21] Giai đoạn 2 — Chốt ảnh minh họa
- **Đã làm:** tư vấn bản quyền ảnh (không dùng/không xóa watermark ảnh shop khác; ảnh hãng nên xin nhà phân phối). Cập nhật `PRD.md` (G2, S8b, mục 11) và `IDEA_BRIEF.md` (phạm vi MVP).
- **Skill/công cụ đã dùng:** `caveman`, `shop-mentor`.
- **Quyết định:** tạm dùng **ảnh minh họa theo danh mục con** cho toàn bộ SP; mọi mã có danh mục + giá > 0 hiện lên web ngay; chủ shop gửi ảnh thật sau.
- **Diễn giải của Mentor (chủ shop có thể sửa):** "ảnh minh họa" = 1 hình vẽ dùng chung cho mỗi danh mục con, không phải ảnh AI riêng từng SP.
- **Rủi ro:** web toàn ảnh minh họa có thể giảm tỉ lệ mua → ưu tiên ảnh thật cho món bán chạy.
- **Tiếp theo:** `DESIGN.md`.

## [2026-10-21] Giai đoạn 3 — Phong cách & bộ thiết kế chủ shop gửi
- **Đã làm:** hỏi 4 câu phong cách; xem ảnh cửa hàng + 9 ảnh thiết kế chủ shop gửi (logo, trang chủ, danh mục, tìm kiếm, chi tiết SP, đăng nhập/đăng ký/OTP, admin 15+ màn hình, mobile, thiệp cảm ơn).
- **Skill/công cụ đã dùng:** `small-business:brand-style` (nguyên tắc thu thập thương hiệu bằng lời/ảnh, xem trước rồi mới lưu), `caveman`.
- **Quyết định:** cảm giác **tin cậy, chuyên nghiệp** · mật độ **cân bằng** · ngay dưới menu là **lưới danh mục có icon**.
- **Phát hiện:**
  - Biển hiệu thật: nền **đen**, chữ **vàng**. Bộ thiết kế + logo: **xanh lá** (logo 3 vòng tròn: tia điện, sóng nước, lá, mái nhà), nền kem, slogan "Chất lượng tạo niềm tin – Dịch vụ tạo khác biệt".
  - Logo đang là ảnh có nền ô caro "giả trong suốt" → cần vẽ lại dạng SVG.
  - Thiết kế có phần ngoài PRD/không đúng thực tế: tài khoản khách + OTP + đăng nhập Google/Facebook/Zalo, yêu thích, sao đánh giá & "đã bán 1.2k+", đa ngôn ngữ, so sánh, danh mục Thời trang/Làm đẹp/Thể thao, "Hỗ trợ 24/7", "giao toàn quốc", địa chỉ mẫu ở TP.HCM.
- **Còn treo:** chọn màu chủ đạo (xanh lá theo logo hay đen-vàng theo biển hiệu); có giữ các phần ngoài PRD không.
- **Tiếp theo:** chủ shop chọn hướng dựng mẫu.

## [2026-10-21] Giai đoạn 3 — Mẫu trang chủ v1
- **Đã làm:** dựng `mockup/trang-chu.html` (+ `mockup/cua-hang.webp`), publish thành artifact riêng tư https://claude.ai/artifact/E5Vo4W6s1hL8aqcbgrWthg. Kiểm tra trên trình duyệt ở 1440px và 375px (không tràn ngang). Thêm `.claude/launch.json` để xem thử local.
- **Skill/công cụ đã dùng:** `taste-skill` (luật house style: không gradient, không số liệu bịa, tiêu đề ≤ 2 dòng), Artifact quickstart (hướng dẫn trang), built-in browser (kiểm tra desktop/mobile).
- **Quyết định:** chuẩn xanh lá theo logo + nhấn vàng theo biển hiệu; sửa toàn bộ điểm trong bảng (bỏ đánh giá/đã bán bịa, địa chỉ thật, danh mục thật, bỏ tài khoản khách/yêu thích/đa ngôn ngữ, menu dọc mở sẵn).
- **Nội dung trang:** menu dọc 8 nhóm + bảng con (danh mục con, thương hiệu, khoảng giá); banner; lưới 8 danh mục có số mặt hàng thật; 4 lối vào theo nhu cầu; 31 quạt thật lọc theo loại; 10 món gia đình từ DMHH; thương hiệu dạng chữ; 3 cách nhận + 2 cách thanh toán; ảnh cửa hàng thật; tìm kiếm không dấu chạy thử được; giỏ hàng đếm thử.
- **Còn treo:** số điện thoại, giờ mở cửa, số nhà, Zalo (đang để "mẫu"); logo vẽ lại tạm bằng SVG đơn giản, chưa phải bản chính thức; chủ shop chưa duyệt mẫu.
- **Tiếp theo:** chủ shop xem mẫu, góp ý → chỉnh → viết `DESIGN.md`.

## [2026-10-21] Giai đoạn 3 — Mẫu trang chủ v2 (bộ lọc)
- **Góp ý chủ shop:** thương hiệu 1 hàng có nút trái/phải + vuốt; bỏ "Quạt điện đang bán" và "Hàng gia đình hay mua" (trùng lưới danh mục), thay bằng "Tất cả sản phẩm" và "Sản phẩm đang giảm giá"; chưa có bộ lọc.
- **Đã làm:** sửa `mockup/trang-chu.html`, publish lại (version 2, cùng link). Thêm: hàng trượt giảm giá + thương hiệu (nút trái/phải tự mờ khi hết, vuốt cảm ứng); khối Tất cả sản phẩm với bộ lọc danh mục, loại quạt, thương hiệu, khoảng giá, sải cánh (chỉ hiện khi chọn Quạt), tình trạng, đang giảm giá — có số đếm, chip bỏ lọc, sắp xếp, "Xem thêm"; điện thoại: nút "Bộ lọc" mở bảng từ dưới lên. Bấm danh mục/thương hiệu → tự lọc. Kiểm tra 1440px và 375px.
- **Thay đổi PRD:** thêm S16b, S16c, A15b (giá khuyến mãi, P0); S5 nâng từ P1 lên P0.
- **Skill/công cụ đã dùng:** `taste-skill` (luật house style), built-in browser.
- **Còn treo:** % giảm giá trên mẫu là số mẫu; chủ shop chưa duyệt v2.
- **Tiếp theo:** duyệt v2 → `DESIGN.md`.

## [2026-10-21] Giai đoạn 3 — Mẫu trang chủ v3 (sáng, lọc từ menu)
- **Góp ý chủ shop:** áp dụng bộ lọc ở menu danh mục tương tự mục Tất cả sản phẩm; giao diện sáng hơn, không tối.
- **Đã làm:** chip trong bảng con menu dọc (danh mục con, thương hiệu, khoảng giá) và ngăn kéo điện thoại giờ bấm được → lọc thẳng mục Tất cả sản phẩm. Bộ lọc thêm "Danh mục con" cho mọi nhóm (thay "Loại quạt"), khoảng giá dùng chung 1 bộ. Bỏ chế độ tối: trang luôn sáng; topbar, banner, ô nhu cầu, khối cửa hàng chuyển sang nền sáng. Kiểm tra 1440px (máy ở chế độ tối vẫn hiện sáng) và 375px; publish version 3 cùng link.
- **Quyết định:** web chỉ dùng **giao diện sáng** (ghi vào DESIGN.md).
- **Skill/công cụ đã dùng:** built-in browser.
- **Tiếp theo:** duyệt v3 → `DESIGN.md`.

## [2026-10-21] Giai đoạn 2/3 — DESIGN.md v1.0
- **Đã làm:** chủ shop duyệt mẫu trang chủ v3. Tạo `docs/DESIGN.md`: tính cách thương hiệu, 14 token màu (chỉ giao diện sáng), font Be Vietnam Pro + thang cỡ chữ, khoảng cách/bo góc/điểm ngắt, 15 thành phần, bố cục 6 nhóm trang (trang chủ, danh mục, chi tiết, giỏ/checkout, cảm ơn/tra cứu, admin), quy tắc ảnh, giọng văn, danh sách không được làm, việc còn treo.
- **Skill/công cụ đã dùng:** `caveman`; nội dung lấy từ mẫu v3 + quy tắc `taste-skill` đã áp dụng.
- **Quyết định:** mẫu v3 là chuẩn giao diện.
- **Còn treo:** logo SVG chính thức; thông tin liên hệ thật; bộ ảnh minh họa đủ danh mục con; mẫu trang chi tiết/checkout/admin.
- **Tiếp theo:** `DEV_PLAN.md` (skill `superpowers:writing-plans`) → `PROGRESS.md`.

## [2026-10-21] Giai đoạn 2 — Chốt phí ship (một phần) & phân quyền
- **Quyết định:**
  - Ship đi tỉnh (SPX/GHTK): **nhân viên báo phí khi xác nhận đơn**.
  - Ship nội thành + ngưỡng miễn phí: **làm sau** → admin có phần cài đặt; khi chưa cài thì cũng "báo phí sau".
  - NV kho: **xem** mọi thông tin SP, kể cả giá nhập; **chưa được sửa** gì. NV đơn: không hủy đơn, không giảm giá trong đơn. Chủ shop sẽ mở thêm quyền sau.
- **Đề xuất của Mentor đã ghi vào PRD:** quyền làm dạng bảng bật/tắt theo vai trò (A2); NV đơn nhập phí ship (A12b); VietQR chỉ hiện sau khi có phí ship (S11b).
- **Thay đổi file:** `docs/PRD.md` (vai trò, S11, S11b, A2, A12b, yêu cầu bảo mật giá nhập, mục 10-11).
- **Còn treo:** mức phí nội thành, ngưỡng miễn phí ship.
- **Tiếp theo:** `DEV_PLAN.md`.

## [2026-10-21] Giai đoạn 2 — DEV_PLAN.md (nháp) + PROGRESS.md
- **Đã làm:** chủ shop đồng ý 3 đề xuất (bảng quyền bật/tắt, NV đơn nhập phí ship, VietQR sau khi có phí ship). Tạo `docs/DEV_PLAN.md`: ràng buộc chung, 5 rủi ro cần test, cấu trúc thư mục, bảng dữ liệu, Sprint 0-4 (26 task, mỗi task Trigger → Response → Error → Done + skill), việc của chủ shop, phần để sau. Tạo `docs/PROGRESS.md` theo DEV_PLAN.
- **Skill/công cụ đã dùng:** `superpowers:writing-plans` (định dạng: ràng buộc chung, Review Focus, cấu trúc file, tự rà soát độ phủ PRD → thêm Task 2.8 danh mục & thương hiệu).
- **Ghi chú:** kế hoạch code chi tiết từng bước (test trước) sẽ viết đầu mỗi sprint vào `docs/superpowers/plans/`.
- **Còn treo:** chủ shop duyệt DEV_PLAN; chọn cách thực thi.
- **Tiếp theo:** Sprint 0 — tạo tài khoản GitHub, Vercel, Supabase; kiểm tra Node/Git.

## [2026-10-21] Giai đoạn 2 — Chốt các câu hỏi quan trọng, DEV_PLAN v1.1
- **Quyết định:** phát hành 2 đợt (Đợt 1: trang bán hàng đầy đủ + admin tối thiểu; Đợt 2: admin còn lại) · **kiểm đếm hết tồn kho trước khi mở bán** · số lượng chỉ số nguyên · nút "Báo giá số lượng lớn" thay giá sỉ · Mentor phân loại 3.400 mã trong phiên, xuất Excel duyệt · báo đơn qua Telegram.
- **Thay đổi file:** `DEV_PLAN.md` v1.1 (mục Thứ tự phát hành; task mới 1.5, 3.8, 4.0; bỏ 2.4; ràng buộc kiểm đếm + số nguyên) · `PRD.md` (S16d, mục "Chốt thêm") · `PROGRESS.md`.
- **Skill/công cụ đã dùng:** công cụ hỏi lựa chọn, `superpowers:writing-plans` (cập nhật kế hoạch).
- **Rủi ro:** kiểm đếm 3.575 mã là việc dài nhất, quyết định ngày mở bán.
- **Còn treo:** tên miền (chủ shop hỏi ý nghĩa); phí ship nội thành; VAT cho khách online.
- **Tiếp theo:** chốt tên miền → duyệt DEV_PLAN → Sprint 0.

## [2026-10-21] Giai đoạn 9 (chuẩn bị) — Tư vấn tên miền
- **Đã làm:** tra phí theo Thông tư 10/2025/TT-BTC (hiệu lực 3/5/2025): phí duy trì .vn cấp 2 = 350.000đ/năm, .com.vn = 250.000đ/năm (chưa gồm lệ phí đăng ký 1 lần + phí dịch vụ nhà đăng ký). Kiểm tra DNS ngày 2026-10-21: tantruongtin.vn, tantruongtin.com.vn, tantruongtin.com đều chưa có bản ghi (có vẻ còn trống, cần xác nhận whois khi mua).
- **Skill/công cụ đã dùng:** WebSearch, WebFetch, nslookup.
- **Đề xuất:** mua `tantruongtin.vn` đứng tên chủ shop, trước ngày mở bán công khai. Chủ shop tự mua (Mentor không nhập giấy tờ/thanh toán).
- **Còn treo:** chủ shop chọn nhà đăng ký và mua.

## [2026-10-21] Sprint 0 — Task 0.1 Tài khoản & công cụ
- **Quyết định:** duyệt DEV_PLAN v1.1, cách thực thi **Native**. Project Supabase cũ "TanTruongTin'sWeb" (29 bảng trống, thiết kế cũ bắt khách đăng nhập, FIFO, điểm, voucher) **giữ nguyên, không dùng**. Không có code cũ. Thư mục dự án cố định: `Documents\tan-truong-tin-web`.
- **Đã làm:** kiểm tra máy: Node v24.21.0, npm 11.19.0, Git 2.55 (đã cấu hình tên/email), Supabase CLI 2.115.0. Tạo project Supabase **mới** `tan-truong-tin-web` (id `ztbwxfzklznpqbofbwlk`, region ap-southeast-1 Singapore, gói miễn phí $0/tháng).
- **Skill/công cụ đã dùng:** Supabase MCP (`list_organizations`, `list_projects`, `list_tables`, `get_cost`, `confirm_cost`, `create_project`).
- **Còn treo:** chủ shop tạo tài khoản Vercel (đăng nhập bằng GitHub); chuyển phiên sang thư mục cố định.
- **Tiếp theo:** Task 1.1 dựng dự án Next.js trong thư mục cố định.

## [2026-10-21] Giai đoạn 3 — Canvas thiết kế Admin (kiểu Stitch)
- **Yêu cầu:** chủ shop muốn xem bản thiết kế "chắc chắn làm được" như Google Stitch; **ưu tiên Admin trước** (tồn kho, nhập Excel, tải ảnh kèm thông tin), trang bán hàng sau.
- **Đã làm:** tạo canvas Design riêng tư "Thiết kế Tân Trường Tín" (https://claude.ai/artifact/9hbAUJokC937LsVrHWRs3C) với 16 màn: đăng nhập, tổng quan, sản phẩm (danh sách + sửa), nhập Excel 3 bước, ảnh hàng loạt (từ link Excel + kéo thả theo SKU), tồn kho (điều chỉnh có lý do + lịch sử), kiểm kho (máy tính + 2 màn điện thoại, đếm mù), danh mục & bộ thông số, đơn hàng (danh sách + chi tiết), nhân viên & bảng quyền. Menu và nút luồng chính bấm chuyển màn được. Mỗi nhóm màn có ghi chú "LÀM BẰNG" (thư viện, bảng dữ liệu, quyền, lỗi).
- **Skill/công cụ đã dùng:** Artifact type "Design" (canvas), `superpowers:writing-plans`/plan mode (kế hoạch đã duyệt), quy tắc `DESIGN.md`.
- **Giả định cần chủ shop xác nhận:** (1) "tải ảnh kèm thông tin" = ảnh từ link/tệp + thông tin từ Excel, không tự lấy thông tin từ web hãng; (2) NV kho được **đếm** trong đợt kiểm kho (khác "chỉ xem") — cần để kiểm đếm hết trước mở bán; (3) thêm tính năng mới: đợt kiểm kho + đếm trên điện thoại, đếm mù; (4) xóa SP không có, chỉ Ẩn.
- **Còn treo:** chủ shop duyệt canvas; sau duyệt cập nhật DEV_PLAN v1.2 (Admin trước), PRD, PROGRESS; rồi vẽ Trang 2 (bán hàng).

## [2026-10-21] Giai đoạn 3 — Chủ shop trả lời 4 giả định
- **Chốt:** (2) NV kho được đếm trong đợt kiểm kho · (4) không xóa SP, chỉ Ẩn.
- **Làm rõ (1):** "tải ảnh kèm thông tin" = **tải VỀ máy một ảnh thông tin sản phẩm** (ảnh SP + thông số + giá + logo, liên hệ) để gửi khách qua Zalo/Messenger khi được hỏi. Đây là **tính năng mới** (khác màn upload ảnh). Mentor đề xuất thêm màn "Ảnh thông tin SP" vào canvas — chờ chủ shop đồng ý.
- **(3):** chủ shop hỏi giải thích tính năng đợt kiểm kho + đếm trên điện thoại + đếm mù → đã giải thích trong chat.
- **Tiếp theo:** chủ shop góp ý trực tiếp trên canvas; Mentor đọc bình luận khi được báo.

## [2026-10-21] Giai đoạn 3 — Canvas Admin v2: ảnh thông tin SP, tồn từ Excel, logo
- **Quyết định:** đồng ý màn "Ảnh thông tin sản phẩm" + nút icon tải · Excel sẽ có cột Tồn kho + Tồn tối thiểu → cảnh báo sắp hết · chủ shop gửi logo gốc.
- **Đã làm:** canvas version 18: thêm màn 15 (ảnh thông tin 1080×1080, tùy chọn giá/thông số, tải PNG, sao chép Zalo, tải nhiều .zip); nút icon tải ở danh sách SP (mỗi dòng + thanh hàng loạt) và trang sửa SP; nhập Excel có 2 cột tồn; Tổng quan thêm thẻ "Sắp hết hàng"; tồn kho đổi cột "Tồn tối thiểu"; thay logo mới trên 14 màn. Lưu logo gốc `docs/brand/logo-goc.webp` và bản vẽ lại `docs/brand/logo-mark.svg` (màu phẳng, đơn giản hóa). Cập nhật PRD (A18 lên P0, thêm A26, A27, mục chốt thêm).
- **Skill/công cụ đã dùng:** Artifact Design canvas, built-in browser (xem logo SVG).
- **Lưu ý:** logo gốc là ảnh AI có nền ô caro "giả trong suốt", độ phân giải thấp → bản SVG là vẽ lại gần đúng, không trùng 100%. Muốn chuẩn tuyệt đối cần nhà thiết kế vector hóa.
- **Còn treo:** chủ shop góp ý canvas; DEV_PLAN v1.2 (Admin trước); vẽ Trang 2 bán hàng.

## [2026-10-21] Giai đoạn 3 — Logo trong suốt từ file gốc
- **Đã làm:** đọc thư mục `OneDrive\Desktop\Tân Trường Tín` (10 file; chỉ `logo.png` là logo, 1024×1024 RGB, ô caro in sẵn). Theo lựa chọn A của chủ shop: cài Pillow 13.0.0 (pip --user), tách nền ô caro bằng độ bão hòa màu (nền xám/đen → trong suốt, mép làm mềm), cắt sát logo. File gốc **không bị sửa**.
- **Kết quả (docs/brand/):** `logo-trong-suot.png` (651×651, nền trong suốt, giữ đúng hình + màu chuyển gốc), `logo-512.png`, `logo-64-favicon.png`, `_kiem-tra-logo.png` (xem trên nền trắng / xanh nhạt / tối). Giữ `logo-mark.svg` (bản vẽ lại) làm dự phòng.
- **Lưu ý:** mép logo hơi răng cưa nhẹ do ảnh gốc là JPEG-hóa; đủ dùng cho web và ảnh gửi khách, chưa đủ để in khổ lớn (biển hiệu) → khi cần in nên làm vector chuyên nghiệp.
- **Còn treo:** chủ shop duyệt logo; thay logo trong canvas + mẫu trang chủ bằng file PNG mới.

## [2026-10-21] Giai đoạn 3 — Áp dụng logo chính thức
- **Quyết định:** chủ shop duyệt logo PNG trong suốt.
- **Đã làm:** tải `logo-512.png` lên kho ảnh của canvas, thay logo trên 15 màn admin + ảnh thông tin SP (canvas version 19); thay logo header/footer mẫu trang chủ (artifact version 4, thêm `mockup/logo-512.png`); thêm mục **1b. Logo** vào `DESIGN.md` (file nào dùng ở đâu, ngoại lệ màu chuyển sắc, kích thước tối thiểu, quy tắc dùng); `PROGRESS.md`: Logo ✅.
- **Skill/công cụ đã dùng:** Artifact (upload asset, publish).
- **Còn treo:** góp ý canvas; DEV_PLAN v1.2 (Admin trước); Trang 2 bán hàng; vector logo cho in ấn.

## [2026-10-21] Giai đoạn 3 — Duyệt Admin, DEV_PLAN v1.2, vẽ trang Bán hàng
- **Quyết định:** chủ shop duyệt các màn admin; đổi thứ tự: **Admin trước, trang bán hàng sau**.
- **Đã làm:**
  - `DEV_PLAN.md` v1.2: Đợt 1 = Admin chạy thật (~7/11, deploy địa chỉ tạm để nhân viên kiểm kho trên điện thoại); Đợt 2 = Trang bán hàng (~20/11). Thêm Task 2.9 (ảnh thông tin SP), 2.10 (đợt kiểm kho + đếm điện thoại); ràng buộc tồn kho từ Excel; quyền NV kho xem + đếm. `PROGRESS.md` cập nhật mốc + task mới.
  - Canvas (version 22): thêm trang **"Bán hàng"** riêng (canvas có 2 trang: Quản trị / Bán hàng). 8 màn máy tính (trang chủ, danh mục + bộ lọc, chi tiết SP, giỏ, thanh toán, đặt thành công, tra cứu + VietQR, báo giá số lượng lớn) + 9 màn điện thoại (thêm màn bộ lọc dạng bảng trượt). Nối link luồng mua hàng; mỗi nhóm có ghi chú "LÀM BẰNG". Ảnh cửa hàng thật + logo chính thức.
- **Skill/công cụ đã dùng:** `superpowers:writing-plans` (cập nhật DEV_PLAN), Artifact Design canvas.
- **Còn treo:** chủ shop duyệt trang Bán hàng; chính sách đổi trả 7 ngày (đang ghi "chờ chủ shop chốt"); thông tin liên hệ, ngân hàng VietQR thật.
- **Tiếp theo:** duyệt thiết kế → bắt đầu Sprint 1 (Task 1.1 dựng dự án Next.js).

## [2026-10-21] Thông tin cửa hàng + câu hỏi ô địa chỉ
- **Thông tin thật:** SĐT/Zalo chính 0948 732 064 · phụ 0793 783 379 · mở cửa 7:45 – 20:30 · 379 đường 2/4, phường Bắc Nha Trang, tỉnh Khánh Hòa.
- **Để sau:** VietQR (tạm chưa hiện QR, chỉ COD + chuyển khoản báo sau) · chính sách đổi trả.
- **Chủ shop:** chưa code vì sắp hết hạn mức sử dụng; tiếp tục phiên sau.
- **Hỏi:** ô địa chỉ dạng chọn (không gõ tay) như CellphoneS → Mentor đề xuất: ô chọn có tìm kiếm Tỉnh → Phường/Xã (địa giới mới 2 cấp) + ô số nhà/đường; nội thành chỉ hiện phường của Khánh Hòa; gợi ý bản đồ (Goong) để sau. Chờ chủ shop chọn.
- **Việc phiên sau:** cập nhật thông tin thật vào canvas/mẫu + settings; chốt cách làm ô địa chỉ; bắt đầu Task 1.1.

## [2026-10-21] Giai đoạn 3 — Thông tin thật + ô địa chỉ (canvas Bán hàng)
- **Chủ shop chọn:** B (cập nhật thông tin thật + vẽ lại ô địa chỉ trước, duyệt sau).
- **Đã làm (canvas, bản 23):** thay "cần cập nhật" bằng 379 đường 2/4 · 0948 732 064 (Hotline/Zalo) · 0793 783 379 (phụ) · 7:45–20:30 ở thanh trên cùng, khối cửa hàng, chân trang (trang chủ, danh mục, chi tiết, trang chủ ĐT); trang cảm ơn (máy tính + ĐT) thêm dòng "Cần gấp? Gọi 0948 732 064".
- **Ô địa chỉ:** ô chọn có tìm kiếm Tỉnh → Phường/Xã + ô số nhà/đường. Máy tính: ví dụ đi tỉnh (Lâm Đồng, gõ "da lat"). Điện thoại: nội thành, tỉnh khóa Khánh Hòa (biểu tượng ổ khóa), danh sách phường Nha Trang. Tên phường là dữ liệu mẫu, chưa tra nguồn.
- **Thêm (theo quyết định đã chốt):** thanh toán mặc định COD, VietQR hiện "sắp có" (không chọn được); trang cảm ơn máy tính bỏ bước quét VietQR.
- **Mẫu trang chủ** `mockup/trang-chu.html` (bản 5): thông tin thật ở thanh trên, khối cửa hàng, chân trang.
- **Skill:** shop-mentor (mentor tự sửa trực tiếp, không gọi thêm skill để tiết kiệm lượt).
- **Còn sót:** mẫu trang chủ + trang Tra cứu đơn vẫn còn nhắc VietQR/mã QR; chính sách đổi trả "chờ chủ shop chốt".
- **Việc tiếp theo:** chủ shop duyệt trang Bán hàng trên canvas → Task 1.1.

## [2026-10-21] Xem ảnh giao diện Bán hàng
- **Chủ shop hỏi:** xem ảnh kết quả cuối, chưa cần code.
- **Đã làm:** chụp 17 màn Bán hàng (8 máy tính + 9 điện thoại) thành PNG ở `mockup/anh-giao-dien/` (dựng lại trên máy rồi chụp bằng Edge chạy ẩn, vì trình duyệt trong app chưa đăng nhập claude.ai).
- **Sửa nhỏ khi xem ảnh (canvas bản 24):** danh sách phường trên máy tính nay nổi đè lên ô bên dưới (trước đó để hở khoảng trắng); VietQR trên điện thoại cũng đổi thành "sắp có".
- **Skill:** shop-mentor (không gọi thêm).
- **Việc tiếp theo:** chủ shop duyệt Bán hàng → Task 1.1.

## [2026-10-21] Thử Google Stitch — màn Admin Tổng quan
- **Chủ shop chọn:** C (mentor điều khiển Stitch trong trình duyệt app, chủ shop tự đăng nhập Google), làm Admin trước.
- **Đã làm:** tạo project Stitch "Tân Trường Tín Dashboard" (chế độ Web): màn Tổng quan 1280×1334 (4 thẻ số liệu, biểu đồ doanh thu 7 ngày, đơn cần xử lý, bảng sắp hết hàng) + bộ màu/chữ theo DESIGN.md. Link: https://stitch.withgoogle.com/projects/7867520432298205303
- **Sự cố:** lỡ bấm nút ▷ nên Stitch tạo một bản prototype; đã dừng một màn đang tạo thêm. Stitch vẽ trên khung canvas nên mentor không chụp ảnh nét được, chủ shop tự xem/phóng to trong trình duyệt.
- **Skill:** shop-mentor + trình duyệt trong app.
- **Việc tiếp theo:** chủ shop so bản Stitch với canvas Admin đã duyệt, quyết định giữ canvas hay lấy ý tưởng từ Stitch.

## [2026-10-22] Chốt cách làm xuyên đêm (Stitch → code)
- **Đã làm trên Stitch (project 7867520432298205303):** 12 màn Admin: Tổng quan, Sản phẩm, Sửa SP, Nhập Excel, Duyệt gợi ý AI, Ảnh thông tin SP (Stitch tự thêm "Gửi Zalo OA" → bỏ), Tồn kho, Kiểm kho, Đếm kho ĐT, Danh mục & thương hiệu, Đơn hàng, Chi tiết đơn. Còn: Bán tại quầy, Khuyến mãi, Báo cáo, Nhân viên & quyền, Nhật ký, Cài đặt, Đăng nhập.
- **Chủ shop cho toàn quyền dùng máy, không hỏi lại; chỉ hỏi khi xong giao diện + backend.** Thứ tự: giao diện Admin → giao diện Bán hàng → backend. Hiệu ứng nhẹ. Admin phải dùng tốt trên iPhone 17 Pro Max. Tránh hết token: lưu tiến độ sau mỗi bước.
- **Đã đăng nhập:** Stitch, GitHub CLI (tài khoản volehaitrieu), Supabase CLI. Chưa: Vercel, Telegram bot, Claude API key.
- **Chốt:** (1) lọc tính năng thừa trong mã tải từ Stitch; (3) được viết Next.js và code khác khi cần; (4) việc treo để nhãn "chờ chủ shop"; (5) AI gợi ý: giao diện trước; (6) giữ màn Stitch dư. (2) cách làm Admin trên điện thoại: đang giải thích, chờ chốt.

- **Chốt điểm 2:** B — vẽ bản điện thoại (iPhone 17 Pro Max) cho mọi màn Admin. Kế hoạch chi tiết: `docs/OVERNIGHT_PLAN.md`. Claude API: chưa thấy key trên máy (chờ chủ shop lưu vào `.env.local`).
- [loop 22/10] Bán tại quầy đã có trên Stitch (tạo trước đó). Gửi Stitch màn Khuyến mãi. Lưu ý: ô nhập Stitch bấm Enter = xuống dòng, phải bấm nút gửi.
- [loop 22/10 01:15] Khuyến mãi xong. Gửi Stitch màn Báo cáo. Hạn mức: 5h 58%, tuần 29%.
- [loop 22/10 ~01:20] Báo cáo vẫn đang tạo trên Stitch → chờ, chưa gửi Nhân viên & quyền. Hạn mức: 5h 64%, tuần 30%.
- [loop 22/10 01:24] Báo cáo xong. Gửi Stitch màn Nhân viên & quyền (4 vai trò, ma trận công tắc 12 quyền). Hạn mức: 5h 65%, tuần 30%.
- [loop 22/10 01:30] Nhân viên & quyền xong. Gửi Nhật ký thao tác THẤT BẠI: Tab×7 mở nhầm menu tài khoản Google (bố cục Stitch đổi khi đang mở 1 màn); sau đó khung trình duyệt vẽ sai/quá nhỏ (cửa sổ app có thể đang thu nhỏ). Không có gì bị sửa. Lượt sau: tải lại trang, chụp màn hình, gửi lại. Hạn mức: 5h 67%, tuần 30%.
- [loop 22/10 01:50] Lượt 01:40 không chạy. Mở lại Stitch: 'Sorry, we hit a snag' + nút Sign in → trình duyệt trong app đã mất đăng nhập Google. Chờ chủ shop đăng nhập lại; Nhật ký thao tác vẫn chưa gửi. Hạn mức: 5h 70%, tuần 31%.
- [loop 22/10 01:55] Chủ shop đăng nhập lại Stitch. Đã gửi màn Nhật ký thao tác. Cách gửi mới: bấm ô nhập (400,728 khung 800x820), gõ, zoom tìm nút mũi tên ↑ rồi bấm (có thể phải bấm 2 lần vì ô nhập nở ra); KHÔNG dùng Tab×7.
- [loop 22/10 02:00] Nhật ký thao tác xong. Gửi Stitch màn Cài đặt (5 thẻ: thông tin shop thật, giao hàng/phí ship 'Chờ chủ shop', COD + VietQR 'Sắp có', Telegram, đổi trả 'Chờ chủ shop'). Hạn mức: 5h 73%, tuần 31%.
- [loop 22/10 02:05] Cài đặt xong trên Stitch. Hạn mức 5h 91% (≥85%) → tạm dừng, chờ reset ~04:00. Bước kế: màn Đăng nhập. Tuần 33%.
- [loop 22/10 04:03] Hạn mức reset (5h 0%, tuần 34%). Gửi Stitch màn Đăng nhập → xong Giai đoạn A (19 màn máy tính). Tách Giai đoạn B thành 18 màn điện thoại, mỗi lượt 1 màn.
- [loop 22/10 04:08] Đăng nhập (máy tính) xong → Giai đoạn A hoàn tất. Gửi Stitch bản ĐT màn Đăng nhập (440x956). Nút ↑ dời sang ≈570,630 sau khi ô nhập nở ra. Hạn mức 5h 2%, tuần 34%.
- [loop 22/10 04:13] ĐT Đăng nhập xong nhưng Stitch vẽ khung rộng (dự án chế độ Web). Gửi ĐT Tổng quan, prompt nhấn mạnh 'portrait 440px, NOT desktop-width' — kiểm tra lượt sau xem có hẹp đúng không.
- [loop 22/10 04:18] ĐT Tổng quan xong, khung dọc 440 đúng (nhờ 'NOT desktop-width'). Stitch tự thêm 'Trạng thái ca làm việc' + nút 'Kiểm kết cuối ca' → lọc ở Giai đoạn C. Gửi ĐT Sản phẩm.
- [loop 22/10 04:23] ĐT Sản phẩm xong (khung dọc, nút + Thêm SP nổi, không thừa). Gửi ĐT Sửa SP (1 cột, mục thu gọn, thanh Lưu dính đáy).
- [loop 22/10 04:28] ĐT Sửa SP xong (Stitch thêm 'tự lưu nháp' → ghi DA_LOAI_BO). Gửi ĐT Nhập Excel (bước 2 Xem trước, thẻ dòng lỗi). Hạn mức 5h 8%.
- [loop 22/10 04:33] ĐT Nhập Excel xong (không thừa). Gửi ĐT Duyệt gợi ý AI. Hạn mức 5h 9%, tuần 35%.
- [loop 22/10 04:38] ĐT Duyệt gợi ý AI xong. Gửi ĐT Ảnh thông tin SP (cấm nút Gửi Zalo OA). Hạn mức 5h 11%, tuần 35%.
- [loop 22/10 04:43] ĐT Ảnh thông tin SP xong (chỉ nút Tải PNG, không Zalo OA). Gửi ĐT Tồn kho (bảng điều chỉnh thành bottom sheet). Hạn mức 5h 12%, tuần 35%.
- [loop 22/10 04:48] ĐT Tồn kho xong. Gửi ĐT Kiểm kho (góc nhìn chủ shop, nút Chốt chỉ chủ shop). Mẹo mới: Stitch gửi bằng Ctrl+Enter. Hạn mức 5h 13%.
- [loop 22/10 04:53] ĐT Kiểm kho xong. Gửi ĐT Danh mục & thương hiệu bằng Ctrl+Enter — chạy tốt ngay lần đầu. Hạn mức 5h 15%.
- [loop 22/10 04:58] ĐT Danh mục xong (ghi DA_LOAI_BO: ô 'bộ lọc POS'). Gửi ĐT Đơn hàng (Ctrl+Enter OK). Hạn mức 5h 16%.
- [loop 22/10 05:03] ĐT Đơn hàng xong. Gửi ĐT Chi tiết đơn (ô phí ship, VietQR 'Sắp có', không Hủy/Giảm giá). Hạn mức 5h 18%, tuần 36%.
- [loop 22/10 05:08] ĐT Chi tiết đơn xong. Gửi ĐT Bán tại quầy (lưới 2 cột, giỏ thành thanh dính đáy + bottom sheet). Hạn mức 5h 19%.
- [loop 22/10 05:13] ĐT Bán tại quầy xong (ghi DA_LOAI_BO: in hóa đơn K80). Gửi ĐT Khuyến mãi. Hạn mức 5h 21%.
- [loop 22/10 05:18] ĐT Khuyến mãi xong. Gửi ĐT Báo cáo. Hạn mức 5h 22%, tuần 36%.
- [loop 22/10 05:23] ĐT Báo cáo xong. Gửi ĐT Nhân viên & quyền. Hạn mức 5h 24%.
- [loop 22/10 05:28] ĐT Nhân viên & quyền xong (2 phương án; mô tả quyền Cài đặt nhắc 'máy in LAN' → đã có trong DA_LOAI_BO). Gửi ĐT Nhật ký thao tác. Hạn mức 5h 25%.
- [loop 22/10 05:33] ĐT Nhật ký xong (không máy in). Gửi ĐT Cài đặt — màn ĐT cuối cùng. Hạn mức 5h 27%, tuần 37%.
- [loop 22/10 05:39] ĐT Cài đặt xong → Giai đoạn B hoàn tất (18 màn ĐT). Xem Export Stitch: chọn màn → AI Studio/Figma/MCP/Netlify/Lovable/Bolt/.zip. Chưa tải gì. Dừng vòng lặp chờ chủ shop chọn .zip hay MCP.
- [22/10 ~09:30] Chủ shop cho phép lấy mã 'bằng cách cần' → chọn .zip. Mở lại Stitch: lại mất đăng nhập ('hit a snag' + Sign in) — có vẻ mất mỗi khi khung trình duyệt bị đóng. Chờ chủ shop đăng nhập lại.
- [22/10 20:15] Chủ shop đăng nhập lại + cho tải .zip. Stitch giới hạn 16 màn/lần; chọn nhiều màn bằng chuột ảo không được → tải từng màn. Màn đầu: Sửa SP (máy tính) → design/stitch/admin/_raw/may-tinh_sua-sp/. Mỗi lượt ~4 màn.
- [22/10 20:25] Chủ shop dừng lại vì lo file zip trùng tên ghi đè. Kiểm tra: chưa có gì bị ghi đè (2 màn đã lưu khác nhau: may-tinh_sua-sp, may-tinh_nhap-excel; lần tải thứ 3 chưa ra file). Thêm chốt an toàn vào script: chỉ giải nén khi có đúng 1 zip, không giải nén đè, tên thư mục trùng thì thêm _2. Không đụng các zip cũ tháng 9-10 (portal/storefront) trong Downloads.
- [22/10 13:35] Tải tiếp: 3 lần bấm Export .zip (màn Duyệt gợi ý AI) đều không ra file trong Downloads, dù bảng Export đóng bình thường. 2 lần đầu trong phiên (Sửa SP, Nhập Excel) tải được → nghi trình duyệt app chặn tải nhiều lần hoặc đang chờ chủ shop cho phép. Script đổi sang chữ không dấu (PowerShell 5.1 đọc sai UTF-8). Dừng, hỏi chủ shop.
- [22/10 13:45] Clipboard cũng không nhận mã của màn Duyệt gợi ý AI; thử màn khác thì tải .zip vẫn được → lỗi riêng màn đó (Stitch xuất thất bại im lặng). Đã lưu thêm: may-tinh_anh-thong-tin-sp (3/37). Màn Duyệt AI để thử lại sau.
- [22/10 13:55] Nguyên nhân thật: trình duyệt trong app mở hộp 'Lưu' của Windows cho mỗi lần tải (thuộc cửa sổ Claude) — Claude không được phép tự bấm hộp này. Hướng: chuyển sang Chrome của chủ shop (Claude in Chrome tự lưu vào Downloads), hoặc chủ shop bấm Lưu từng lần.
- [22/10 ~13:55] Chuyển sang Chrome của chủ shop (Claude in Chrome): kéo khung chọn được nhiều màn, xuất .zip theo nhóm (mỗi màn 1 thư mục con, không đè). Script group.ps1: trùng nội dung thì bỏ, trùng tên thì _2. Đã có 15 thư mục màn trong _raw. Nhóm 3 kẹt ở file .tmp trong Downloads — Chrome đang chờ chủ shop cho phép tải nhiều file.
- [22/10] Nhóm 3 về sau khi chủ shop cho phép tải nhiều file: thêm 5 màn ĐT (Bán tại quầy, Chi tiết đơn, Danh mục, Khuyến mãi, Đơn hàng) → 20 màn. Tab Chrome bị tải lại, chụp màn hình treo 3 lần → dừng, nhờ chủ shop đưa cửa sổ Chrome lên trước.
- [22/10] Chủ shop yêu cầu tạm hoãn tải Stitch (đang 20 màn) để chạy 'npx getdesign@latest add claude'.
- [22/10] Chuyển DESIGN.md (getdesign 'claude') sang design/tham-khao/DESIGN-claude.md — chỉ tham khảo; docs/DESIGN.md vẫn là chuẩn. Tiếp tục tải Stitch qua Chrome.
- [22/10] Chủ shop bỏ file DESIGN của getdesign (claude): đã xoá design/tham-khao/DESIGN-claude.md. docs/DESIGN.md vẫn là chuẩn duy nhất.
- [22/10] Xong C2: đủ mã 19 màn máy tính + 18 màn điện thoại (+1 phương án phụ) trong design/stitch/admin/_raw, mục lục ở design/stitch/admin/README.md. Bước kế: C3 lọc theo PRD + DA_LOAI_BO.
- [22/10] Xong C3: quét chữ 38 màn → loại ca/két, máy in K80, Zalo OA, lưu nháp, nhân bản SP, công nợ, chi nhánh, 'POS' đồng bộ, vai trò 'Quản lý'; sửa dữ liệu giả (124 Đường 2/4 → 379, 0905 → 0948 732 064). Chọn ĐT Nhân viên _2. Giai đoạn C xong; kế: Giai đoạn D (Bán hàng trên Stitch).
- [22/10] Tạo docs/GIAO_DIEN_BAN_GIAO.md: file bàn giao giao diện tự đủ (không phụ thuộc Stitch) cho công cụ AI khác — thông tin shop, màu/chữ/khoảng cách, 19 màn Admin + 10 trang Bán hàng, điều cấm. Tiếp: Giai đoạn E (code Admin).
- [22/10] Giai đoạn E bắt đầu: dựng Next.js 16 ở gốc dự án; khung Admin + Đăng nhập + Tổng quan theo docs/GIAO_DIEN_BAN_GIAO.md, dữ liệu mẫu lib/mock. build/tsc/lint sạch; xem ở 1440 và 440px ổn.
- [22/10 ~23:40] Lập docs/CHU_SHOP_CAN_CHUAN_BI.md: danh sách việc chủ shop cần chuẩn bị (phí ship, đổi trả, ảnh SP, VietQR, Telegram, API key, Vercel, tên miền, nhân viên, Excel SP). Hạn mức 5h 94% → chờ reset ~01:10 23/10.
- [23/10 ~01:45] Hạn mức reset (5h 1%, tuần 49%). Phát hiện công cụ ngoài đã dựng 12 màn Admin còn lại + một phần Bán hàng (22/10 22:38–00:40, không ghi log); chủ shop xác nhận đã dừng. Kiểm tra: tsc/lint/build sạch, 19 màn Admin trả 200, không tràn ngang ở 440px. Sửa: thẻ thiếu lề trong (thêm Card pad, 17 thẻ/9 màn), nút bút Sửa + nút lọc đơn ≥44px, bộ lọc Đơn hàng bỏ 'Danh mục/Hiển thị' → 'Cách giao'. Chưa commit.
- [23/10] Giao diện Bán hàng: kiểm tra bản nháp của công cụ ngoài → lỗi: mã SP sai vẫn hiện quạt, URL lạ không báo 404, tiêu đề 'quat', 2 thẻ h1/trang, bộ lọc/ô tìm (máy tính)/thanh toán/tra cứu không chạy, thiếu nút nổi Zalo/Gọi, phông bị đổi sang Manrope, hiệu ứng >200ms, banner dùng gradient, chữ in hoa giãn cách. Dựng lại trong app/(store)/ (11 trang + 404) theo GIAO_DIEN_BAN_GIAO B0–B10; trả lại phông Be Vietnam Pro. Đã thử: thêm giỏ → thanh toán (báo lỗi dưới ô) → cảm ơn → tra cứu TTT000123/0908 123 456; 440px không tràn ngang. tsc/lint/build sạch. Chưa commit.
- [23/10 ~02:40] Rà ảnh 66 màn (docs/anh-giao-dien/dt|mt). Đã sửa: thanh Lưu ở Sửa SP bị thanh đáy ĐT che + lệch trái máy tính; thẻ Trạng thái hiển thị thiếu lề; ô tích màu thương hiệu; biểu đồ Báo cáo trống trên ĐT; 'SP bán chạy' hiện nhầm DS sản phẩm → bảng xếp hạng; nút ‹ › chỉ hiện khi trượt được; gợi ý SĐT ở thanh toán. CÒN LÀM: Khuyến mãi + Kiểm kho đang dùng nhầm bảng sản phẩm (cần bảng riêng theo GIAO_DIEN_BAN_GIAO A9, A15); Tồn kho bản ĐT thiếu nút Điều chỉnh + bảng điều chỉnh (A8); Chi tiết đơn: địa chỉ 'Gửi đi tỉnh' lại ghi Khánh Hòa; Nhân viên: 2 nút Thêm nhân viên trùng. Sau đó chụp lại ảnh → backend. Chủ shop giao toàn quyền đến hết dự án (UI → backend → thử vai khách → thử tấn công → vá bảo mật).
- [23/10 ~03:30] Backend bước 1: Supabase có lược đồ + RLS + hàm nghiệp vụ + seed; đăng nhập thật + phân quyền menu; kiểm thử bảo mật 39/39 đạt (NV đơn không đọc giá nhập, NV kho không sửa giá, khách không sửa giá/đọc đơn, xác nhận 2 lần chỉ trừ tồn 1 lần, server tự tính tiền). Ghi chú: CLI không lộ khóa sb_secret đầy đủ → dùng khóa service_role (legacy) trong .env.local. Hạn mức 5h ~60%.
- [23/10 ~04:00] Trang bán hàng nối Supabase thật (SP, gợi ý tìm, giỏ lấy giá DB, đặt hàng, tra cứu, báo giá). Thử E2E ở 440px: đặt đơn TTT001002 → tra cứu ra đúng; /admin chưa đăng nhập → trang đăng nhập. Đã commit+push. Kế: nối các màn Admin vào DB.
- [23/10 ~04:20] Admin Đơn hàng nối DB thật (danh sách, chi tiết, xác nhận/giao/hủy, phí ship, đã thu tiền, in phiếu). Phát hiện + vá: các trang Admin chỉ ẩn menu chứ chưa chặn khi gõ thẳng URL → thêm requireStaff(quyền) cho mọi trang. Sửa: đăng nhập sai bị xóa mất SĐT đã gõ. E2E NV đơn/NV kho đạt. Đã commit+push.
- [23/10 ~04:35] Admin Tồn kho nối DB (thẻ tóm tắt, danh sách, điều chỉnh tồn qua adjust_stock, lịch sử). Thử: Van bi Miha 15→20 (để lại +5 trong lịch sử như dữ liệu thử). Kiểm thử bảo mật chạy lại vẫn đạt. Đã cập nhật tác vụ hẹn giờ 06:15 với trạng thái mới.
- [23/10 ~04:45] LỖI THẬT tìm thấy: trigger nhật ký ép kiểu sai → mọi lần sửa SP/giá nhập/quyền đều thất bại. Đã vá (migration 0500) + thêm bài kiểm thử dương (chủ shop sửa được giá, có ghi nhật ký) → 40/40. Màn Nhật ký thao tác nối DB. Hạn mức 5h ~88% → dừng, chờ reset 06:10 (tác vụ hẹn giờ 06:15 tự chạy tiếp).
- [23/10 ~06:30] Admin Sản phẩm nối DB: danh sách (tìm không dấu, lọc danh mục/trạng thái, phân trang 50), sửa SP (giá + giá nhập chỉ người có quyền edit_price, tồn tối thiểu, ẩn/hiện). Thử E2E chủ shop: lưu được, giá KM ≥ giá bán bị chặn. Kiểm thử bảo mật 43/43 (thêm: sửa tồn tối thiểu, ghi giá nhập theo quyền). Kế: Tổng quan số liệu thật.
- [23/10 ~11:30] Chủ shop gửi file chuẩn: KHO XHD (chỉ đọc DMHH) + Quạt (Đã Sửa). Nạp 90 SP thử (~4/danh mục con, 14 quạt có thông số + giá nhập). Tồn = 0 vì không đọc TON KHO → web hiện 'Liên hệ'. Sửa lỗi nhúng danh mục cha (trang Quạt 0 SP, ảnh minh họa sai). 8 SP mẫu cũ (QUA-HALI-TR2…) vẫn còn để bài kiểm thử chạy.
