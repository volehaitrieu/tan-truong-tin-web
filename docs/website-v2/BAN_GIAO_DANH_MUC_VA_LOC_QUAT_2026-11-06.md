# Bàn giao Claude Code — Danh mục điện thoại và lọc quạt

Ngày: 06/11/2026  
Ngôn ngữ làm việc: tiếng Việt

## Mục tiêu và trạng thái

Tiếp tục phần Danh mục đã được chủ shop duyệt theo mẫu **A — ô nhóm hàng lớn**. Phần giao diện đã có mã trong worktree bên dưới. Việc cập nhật phân loại cho 100 sản phẩm trên Supabase **chưa được thực hiện** và đang chờ chủ shop xác nhận rõ.

### Đang làm ở đâu

- Worktree: `C:\Users\Hai Trieu\Documents\tan-truong-tin-web\.claude\worktrees\website-v2`
- Nhánh: `worktree-website-v2`
- Đây là worktree của Website v2, không phải thư mục gốc đang chạy nhánh `codex/desktop-storefront-upgrade`.
- Các thay đổi danh mục hiện còn chưa commit. Không đổi nhánh, reset, dọn hoặc ghi đè các thay đổi khác trong worktree.

### Yêu cầu đã chốt

- Trên điện thoại, khách mở **Danh mục** và thấy các nhóm hàng đang có sản phẩm. Nhóm chưa có hàng tự ẩn; khi có hàng sẽ tự xuất hiện.
- Chạm **Đồ gia dụng** để bung các mục con có hàng. “Gia dụng” đổi thành “Đồ gia dụng” trên giao diện, không đổi tên trong cơ sở dữ liệu.
- Chọn **Quạt** để xem danh sách quạt trước; sau đó khách mới dùng bộ lọc.
- Bộ lọc cần có loại quạt, điều khiển và thương hiệu. Thương hiệu phải lấy từ danh sách quạt đang xem; không đưa thương hiệu nhóm khác vào.
- Một số thông số chưa được cập nhật. Không tự suy đoán dữ liệu còn thiếu; báo bằng tiếng Việt.
- Giao diện desktop `/danh-muc` đang có được giữ lại. Các URL lọc cũ như `/danh-muc?industry=...` và `?brand=...` vẫn được hỗ trợ.

## Những gì đã làm trong mã

- `components/storefront/CategoryIndexClient.tsx`: trang nhóm danh mục dạng ô lớn, bung/thu mục con, hiển thị số sản phẩm.
- `components/storefront/CategoryDrawer.tsx`, `components/storefront/StoreShell.tsx`: tab Danh mục ở thanh đáy điện thoại chuyển tới trang Danh mục; tab được đánh dấu khi đang ở trang danh mục.
- `app/(store)/danh-muc/page.tsx`: điện thoại thấy các nhóm hàng; desktop vẫn dùng trang tất cả sản phẩm. Giữ hỗ trợ URL lọc cũ.
- `app/(store)/danh-muc/[slug]/page.tsx`: hỗ trợ đường dẫn danh mục con như `/danh-muc/quat`; trang quạt chỉ nhận sản phẩm Quạt và dùng danh mục gốc để giữ ngữ cảnh lọc.
- `lib/catalog.ts`, `lib/mock/store.ts`: chỉ trả các nhóm/mục con có sản phẩm; ánh xạ tên hiển thị “Đồ gia dụng”; giữ thêm `classification` từ cấp danh mục sâu trên sản phẩm.
- `components/storefront/ProductBrowser.tsx`: thêm bộ lọc “Loại quạt” từ `classification`; bộ lọc điều khiển lấy từ thông số thật, gom một số cách ghi tương đương, vẫn hiện các giá trị khác theo dữ liệu; hiện ghi chú khi sản phẩm thiếu thông tin điều khiển. Thương hiệu được tạo từ chính danh sách sản phẩm của trang hiện tại.
- `app/(store)/page.tsx`, `components/storefront/ShopBanner.tsx`: menu danh mục trên trang chủ lấy mục con từ cây Danh mục; nút “Xem quạt” đi tới trang quạt.
- `docs/MENTOR_LOG.md`: đã ghi nhật ký đợt làm việc.

### Giới hạn hiện tại của bộ lọc loại quạt

Mã đã đọc được danh mục sâu nhưng loại quạt chỉ xuất hiện khi `products.category_id` được gán tới các danh mục con sâu (ví dụ Quạt đứng, Quạt treo tường). Hiện 100 sản phẩm vẫn nằm ở danh mục chung “Quạt”; do đó bộ lọc loại quạt chưa có dữ liệu để hiện cho tới khi chủ shop duyệt cập nhật này. Bộ lọc điều khiển/thương hiệu dựa trên thông số và thương hiệu hiện có.

### Sửa bổ sung Codex (06/11/2026)

- Đã tách bộ lọc “Điều khiển” và ghi chú “Một số sản phẩm chưa có thông tin điều khiển” khỏi điều kiện có `classification`/“Loại quạt”. Trên trang chỉ gồm quạt, bộ lọc điều khiển hiện ngay cả khi chưa cập nhật phân loại sâu.
- Loại quạt vẫn chỉ hiện khi dữ liệu `classification` có thật; không suy đoán hay tự gán danh mục cho 100 sản phẩm.
- Kiểm tra sau sửa: `npx tsc --noEmit` và ESLint `ProductBrowser.tsx` chạy cùng các tệp giỏ/thanh toán, đạt.

## Đối chiếu dữ liệu — chỉ đọc

- Workbook đã được đọc cục bộ với đúng hai cột **Mã hàng hóa** và **Phân loại**. Workbook có các cột khác, gồm giá nhập: không đọc, không đưa vào tệp bàn giao và không gửi workbook cho dịch vụ ngoài.
- Có 100 mã khác nhau; truy vấn chỉ đọc trên Supabase khớp 100/100 sản phẩm, không thiếu mã, không có nhãn phân loại không khớp danh mục đích.
- Phân bố theo cột Phân loại:

| Danh mục con | Số sản phẩm |
|---|---:|
| Quạt treo tường | 27 |
| Quạt đứng | 25 |
| Quạt sàn | 20 |
| Quạt lửng | 17 |
| Quạt bàn | 5 |
| Quạt trần | 4 |
| Quạt hộp | 2 |
| **Tổng** | **100** |

- Cây danh mục đã có đủ 7 danh mục đích. Hiện chúng chưa có sản phẩm được gán; 100 quạt vẫn ở danh mục chung “Quạt”.
- Không có thao tác ghi/xóa dữ liệu, chạy migration, deploy, commit hay push trong đợt này.

## Kiểm tra và giới hạn kiểm chứng

- `npx tsc --noEmit`: đạt.
- ESLint các tệp đã sửa: đạt, không có lỗi/cảnh báo.
- `git diff --check`: không phát hiện lỗi khoảng trắng; Git có cảnh báo chuẩn hóa LF/CRLF trên một số tệp Windows.
- `npm run build` dùng Turbopack: dừng bởi lỗi nội bộ khi tiến trình con xử lý CSS thoát.
- Kiểm tra chéo `npx next build --webpack`: không hoàn tất vì môi trường không phân giải được `fonts.googleapis.com` khi tải Be Vietnam Pro (`getaddrinfo ENOTFOUND`). Chưa có bằng chứng build thành công.
- Chưa xem giao diện này trong trình duyệt và chưa thử trên điện thoại thật.
- Không chạy test tự động.

## Việc Claude Code cần làm tiếp

1. Đọc `AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, `docs/BAN_GIAO_TIEP_TUC.md` và `docs/website-v2/BAN_GIAO_2026-11-06.md`; sau đó kiểm tra `git status` và diff của đúng worktree này. Hướng dẫn Next.js 16.4.2 nằm trong `node_modules/next/dist/docs/` và phải đọc trước khi sửa tiếp.
2. Giữ nguyên các tệp ngoài phạm vi đã có sẵn trong worktree, gồm `.superpowers/`, `lib/ui-effects.ts`, `public/shop/` và các tài liệu khác.
3. Không chạy build lặp lại để thử mạng. Nếu cần xác nhận build, trước tiên xử lý khả năng môi trường không truy cập Google Fonts; không thay font hoặc cấu hình chỉ để lách lỗi khi chưa được chủ shop duyệt.
4. Xin chủ shop xác nhận trước khi cập nhật dữ liệu Supabase. Việc đang chờ là chỉ đổi `products.category_id` cho đúng 100 quạt theo cột Phân loại, khớp SKU, giữ nguyên giá/tồn/thông số và các bảng khác. Sau khi được duyệt, lập câu lệnh có kiểm tra trước/sau và chỉ cập nhật các mã khớp; không áp migration vì việc này không cần đổi schema.
5. Sau khi dữ liệu được duyệt và cập nhật, kiểm tra lại số lượng từng danh mục con, typecheck/ESLint/build nếu môi trường cho phép, rồi báo rõ kết quả. Chưa deploy, commit, push hoặc gộp `main` nếu chủ shop chưa yêu cầu.

## Không gộp với việc Nhập Excel tồn kho

Việc **Nhập Excel đọc cột Tồn** là task riêng trên worktree `...\.claude\worktrees\nhap-excel-ton`, nhánh `feature/nhap-excel-ton-kho`, với bàn giao riêng tại `docs/website-v2/BAN_GIAO_2026-11-06.md`. Các thay đổi ở worktree đó chưa được kiểm tra trong đợt Danh mục này; không chép hoặc gộp chúng vào nhánh Website v2 khi chưa có yêu cầu.
