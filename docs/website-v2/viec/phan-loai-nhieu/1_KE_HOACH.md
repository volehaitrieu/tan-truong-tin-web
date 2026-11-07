# Một sản phẩm thuộc nhiều phân loại

Ngày 07/11/2026. Trạng thái: PHƯƠNG ÁN CHỜ CHỦ SHOP DUYỆT. Chưa viết mã, migration hay ghi dữ liệu.

## Quyết định đã chốt

- Tên sản phẩm theo nguồn Internet khớp đúng model; không ép tên theo phân loại, không suy đoán thông số thiếu.
- Một quạt được gắn nhiều phân loại. Chọn nhiều loại trong bộ lọc là HOẶC: thuộc ít nhất một loại được chọn; mỗi sản phẩm chỉ xuất hiện một lần.
- Excel dùng một cột `Phân loại`, dấu chấm phẩy: `Quạt sàn; Quạt công nghiệp`.
- Ô có nội dung thay toàn bộ danh sách cũ sau khi xác nhận. Ô trống hoặc thiếu cột giữ nguyên danh sách hiện có.
- Xuất Excel theo cùng định dạng để nhập lại được.

## Mục tiêu và giới hạn

Giữ một sản phẩm, SKU, giá, tồn kho và lịch sử đơn hàng duy nhất. Nhiều phân loại chỉ là nhiều liên kết để tìm/lọc; không nhân bản sản phẩm. Giữ cấu trúc Đồ gia dụng → Quạt trong tấm Danh mục, không đưa phân loại vào lưới Danh mục con.

Đây là nâng cấp dữ liệu và luồng nhập/xuất/lọc, không chỉ đổi checkbox. Tài liệu này không cho phép chạy migration, deploy, commit/push hay nhập 100 quạt lên dữ liệu thật. Các thay đổi đang có của phan-loai và loc-va-thanh-day phải được giữ và đối chiếu trước khi triển khai.

## Rà hiện trạng tại worktree website-v2

- `products.category_id` là một khóa ngoại tới `categories`. Phân loại hiện dùng các nút cấp 3 trong cây categories.
- `lib/catalog.ts` suy một chuỗi `classification` từ nhánh cha; `lib/mock/store.ts` cũng khai báo một chuỗi.
- `lib/excel/parse-products.ts` chỉ đọc một tên tối đa 80 ký tự. Không thể đưa chuỗi nhiều tên vào đây rồi coi là đã nâng cấp.
- Nhập Excel và xác nhận trong `app/admin/(shell)/nhap-excel/actions.ts` đang đổi một category_id. Các mục chờ hiện giải tên đường dẫn, không có danh sách ID nhiều phân loại.
- `lib/admin/product-export.ts` xuất một loại suy từ category_id.
- `ProductBrowser.tsx` đang đếm và so khớp một chuỗi. Menu danh mục đếm sản phẩm theo danh mục con.
- `ProductForm.tsx` và actions quản trị cũng ghi category_id: phải xử lý để sửa tên/giá không vô tình xóa các phân loại mới.
- Chưa truy vấn dữ liệu thật: chưa kết luận số sản phẩm/mục chờ hiện có trên Supabase.

## So sánh cách lưu và lựa chọn đề xuất của Codex

1. Nhân bản sản phẩm theo từng loại: loại bỏ vì gây lệch tồn kho, mã hàng và đơn hàng.
2. Lưu chuỗi hoặc mảng tên trong products: ít thay đổi ban đầu nhưng khó kiểm loại hợp lệ, đổi tên, tránh trùng và ràng buộc theo Danh mục con.
3. **Đề xuất: bảng liên kết nhiều-nhiều**, tái sử dụng phân loại cấp 3 trong categories. Không tạo thêm hệ phân loại trùng tên.

Thiết kế đích: category_id của sản phẩm trỏ Danh mục con cấp 2; bảng `product_classifications` chứa product_id + classification_id trỏ categories cấp 3. Khóa ghép duy nhất chống trùng, chỉ mục chiều ngược phục vụ lọc. Xóa sản phẩm xóa các liên kết; xóa phân loại đang được dùng phải bị chặn. Mọi loại phải thuộc đúng Danh mục con của sản phẩm. Sản phẩm chưa có phân loại được phép giữ danh sách rỗng.

Đây là lựa chọn kỹ thuật đề xuất, chưa phải quyết định đã được chủ shop duyệt. Áp dụng mô hình chung cho sản phẩm, nghiệm thu bằng Quạt trước.

## Nhập, đối chiếu và xuất Excel

- Tách đúng dấu `;`, trim và gộp khoảng trắng; bỏ tên trùng không phân biệt hoa/thường, giữ dấu tiếng Việt để tránh gộp nhầm. Không tự bỏ dấu hoặc suy phân loại theo tên sản phẩm.
- Mỗi tên tối đa 80 ký tự, tối đa 20 loại/sản phẩm (giới hạn đề xuất). Báo lỗi dòng khi vượt, không âm thầm cắt chuỗi. Chuỗi chỉ có dấu phân cách là lỗi, không có nghĩa xóa.
- File cũ có một tên vẫn hợp lệ. Cột `Phân loại (nhiều)` trong file đối chiếu cũ không tự động nhập: hướng dẫn chuyển nội dung đã rà sang `Phân loại` và dấu `;`. Không tự chuyển các dấu phẩy thành phân cách.
- Dòng trùng SKU trong một file: báo lỗi các dòng trùng, không chọn dòng cuối âm thầm.
- Tên loại chưa tồn tại trong đúng Danh mục con: hiển thị là loại mới trong xem trước; chỉ tạo khi người có quyền xác nhận. Tạo lại đồng thời phải dùng cùng một loại, không sinh bản sao theo slug khác.
- Sản phẩm đã có: đối chiếu tập hợp đầy đủ cũ/mới, thứ tự khác nhau không là thay đổi. Một mục chờ `Phân loại` chứa toàn bộ tập hợp mới và ảnh chụp tập hợp cũ. Không tick = không đổi.
- Ô trống/missing: không tạo thay đổi phân loại. SP mới ô trống: chưa có phân loại. Đổi Danh mục con khi còn phân loại cũ không tương thích và ô trống: chặn dòng, yêu cầu cung cấp phân loại hợp lệ; không tự xóa trái quy tắc giữ nguyên.
- Khi đổi cả Danh mục con và phân loại, chúng là một nhóm phụ thuộc cần xác nhận cùng nhau. Không cho áp dụng phân loại sang sai cha.
- Lưu payload có phiên bản với ID các loại đã tồn tại, tên các loại mới, ID cha, tập hợp cũ và mới. Không dùng chuỗi tên hiển thị làm khóa. Kiểm lại quyền, cha và trạng thái mới nhất khi xác nhận; nếu dữ liệu đã bị người khác sửa, giữ mục chờ và yêu cầu tải lại đối chiếu.
- Thay danh sách bằng một giao dịch DB: kiểm quyền, khóa sản phẩm, tạo loại thiếu, đổi category_id và liên kết, ghi nhật ký, đánh dấu/xóa đúng mục chờ. Lỗi giữa chừng phải giữ toàn bộ tập hợp cũ; không xóa trước rồi thêm qua nhiều yêu cầu riêng.
- SP mới: tạo sản phẩm + phân nhóm trong cùng giao dịch, để không thêm sản phẩm nửa chừng. Không thay nghiệp vụ tồn/giá; các thao tác đó giữ quyền và hàm chuyên biệt hiện có.
- Xuất tất cả loại, sắp ổn định theo tên tiếng Việt rồi nối `; `. Một sản phẩm vẫn là một dòng. Cột Phân loại thuộc nhóm cột Phân nhóm như hiện tại.
- Xóa hết phân loại không nằm trong bản này: ô trống đã chốt là giữ nguyên, không đặt ký hiệu xóa ngầm.

## Lọc, đếm và giao diện đề xuất

- Dùng danh sách `{id, name, slug}` cho phân loại trong dữ liệu giao diện. Chọn nhiều ID là HOẶC trong nhóm; giữa Phân loại, Thương hiệu, Điều khiển, Giá là VÀ.
- URL mới dùng ID ổn định; URL tên cũ được đối chiếu theo ngữ cảnh Danh mục con, không tự chọn nếu tên mơ hồ. ID không hợp lệ không được biến thành hiển thị tất cả âm thầm.
- Mỗi loại đếm số product_id duy nhất. Tổng kết quả là hợp tập hợp sản phẩm, không cộng số trên các checkbox. Đếm các lựa chọn theo các bộ lọc nhóm khác, bỏ qua lựa chọn trong chính nhóm Phân loại.
- Cùng một sản phẩm có nhiều loại vẫn chỉ có một thẻ, một dòng giỏ hàng theo SKU, một lần tính trong menu danh mục và phân trang.
- Giữ bố cục bộ lọc và tấm Danh mục đã duyệt. Trong bảng xem trước/đối chiếu Excel, hiển thị danh sách `Quạt sàn; Quạt công nghiệp` và đầy đủ cũ → mới. Mẫu hiển thị thực tế phải lập ở bước 2 và được duyệt trước khi viết mã.
- Bản đầu quản lý nhiều loại qua Excel; chưa thêm trình chọn nhiều loại vào form sửa sản phẩm. Form lưu tên/giá phải giữ liên kết. Nếu đổi danh mục gây mất tương thích, báo lỗi có hướng dẫn dùng Excel; câu chữ cũng đưa vào khung duyệt.

## Phân quyền và chuyển đổi

- Bật RLS cho bảng liên kết. Khách chỉ đọc liên kết của sản phẩm được phép hiển thị; nhân viên đọc theo quyền hiện có. Không mở quyền ghi cho khách, không dùng service-role ở trình duyệt.
- Tạo loại/thay danh sách cần quyền `edit_products`; nhập cần `import_excel`. Giữ kiểm quyền giá/tồn của luồng hiện hành; không mở rộng quyền bằng nâng cấp này.
- RPC ưu tiên security invoker; ràng buộc sai cha cũng phải được chặn ở DB với mọi đường ghi, không chỉ TypeScript. Việc đổi cha/xóa nút categories phải không làm hỏng liên kết hiện hữu.
- Trước chuyển đổi: kiểm cây sai cấp/chu trình, loại trùng chuẩn hóa, sản phẩm gắn cấp sâu hơn 3, sản phẩm gắn cấp gốc, và các mục chờ category kiểu cũ. Bất thường thì báo danh sách và dừng chuyển các dòng đó, không suy đoán.
- Backfill loại cấp 3 hiện có thành một liên kết, chuyển category_id về cấp 2 tương ứng. SP đã ở cấp 2/không danh mục giữ nguyên, không tạo loại giả. SP ở cấp gốc giữ nguyên nếu không có liên kết, không ép xuống một mục con.
- Có cửa sổ tạm ngừng thao tác sửa/nhập sản phẩm khi chuyển đổi. Hoàn tất hoặc yêu cầu xem trước lại các mục chờ category kiểu cũ; không để xác nhận bằng bộ giải cũ sau cutover. Các mục chờ không liên quan được giữ nguyên.
- Kiểm trên DB thử bằng dữ liệu giả trước; chụp mapping category_id cũ và liên kết để phục hồi. Khi chủ shop cho phép mới chạy migration và đưa mã mới lên đồng bộ. Không cho mã cũ ghi trở lại category cấp 3 sau chuyển đổi.
- Rollback không được âm thầm bỏ các loại đã thêm: nếu có dữ liệu nhiều loại phát sinh, lưu toàn bộ và khóa ghi, ưu tiên sửa tiến; chỉ khôi phục snapshot khi đã đối chiếu và chủ shop chấp thuận.

## Phạm vi cần lập danh sách tệp ở bước 2

Migration mới; kiểu Product và loader catalog; parser Excel; import actions, ImportClient, ReviewTable và kiểu import_changes; export; ProductBrowser; actions/form quản trị và đường ghi danh mục liên quan. Rà mọi chỗ dùng category_id/classification trước khi chốt danh sách. Không sửa StoreShell/globals.css hoặc giỏ hàng nếu chỉ cần kiểm không nhân bản. Không tự ghi đè công việc đang dở.

## Kiểm chứng bắt buộc khi triển khai

1. A thuộc Sàn+Công nghiệp, B chỉ Sàn, C chỉ Công nghiệp: chọn cả hai trả A/B/C đúng 3 thẻ, tổng 3; lọc thêm hãng/giá cho kết quả giao đúng.
2. File một loại, nhiều loại, trống, thiếu cột, chỉ dấu `;`, loại lặp, quá dài, SKU trùng, sai cha, đổi cha, loại mới và tên gần giống có dấu.
3. Nhập lại file xuất không thay đổi; thay danh sách bỏ được loại cũ; trống giữ nguyên; không tick giữ nguyên.
4. Lỗi giữa giao dịch, thiếu quyền, xác nhận hai lần và hai người xác nhận đồng thời: không mất/nhân đôi loại, không xóa nhầm mục chờ.
5. Chuyển dữ liệu cũ bảo toàn SKU/giá/tồn/đơn; kiểm khách và từng vai trò, SP ẩn không lộ liên kết.
6. Form sửa tên/giá giữ các loại; đổi danh mục không tương thích bị chặn; menu, URL cũ, số lượng, giỏ hàng, phân trang không bị nhân đôi.
7. TypeScript, ESLint tệp sửa; build khi môi trường cho phép; xem điện thoại 375px và desktop, bàn phím và trạng thái lỗi.

## Nguồn kỹ thuật đã đối chiếu

- Mã hiện tại và các tệp nêu ở mục hiện trạng, chỉ đọc cục bộ.
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/functions
- Changelog markdown chưa tải được qua công cụ web (content-type không hỗ trợ); phải kiểm lại bản cập nhật liên quan trước khi triển khai thực tế.

## Bước tiếp theo

Rà soát độc lập 07/11/2026: người rà đọc ở vai trò kỹ sư nhận bàn giao, kết luận không còn câu hỏi quan trọng ở cấp phương án; đủ cơ sở lập kế hoạch chi tiết và mẫu giao diện. Đây là rà tài liệu, chưa phải kiểm thử mã hay dữ liệu thật.

Chủ shop duyệt phương án này → lập khung giao diện/mẫu và kế hoạch triển khai chi tiết → duyệt mẫu → viết mã và migration chỉ ở dạng tệp → kiểm/rà → xin quyết định riêng cho dữ liệu thật và deploy. Không cần chốt lại bốn quy tắc nhập/lọc đã đồng ý.
