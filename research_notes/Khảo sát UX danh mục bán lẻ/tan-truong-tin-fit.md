# Fit UX danh mục bán lẻ: Tân Trường Tín

## 1. Điểm mạnh và nền tảng đang có

### Takeaway
Tân Trường Tín đã có nền tảng mua sắm khá đầy đủ cho một cửa hàng địa phương: điều hướng theo danh mục, bộ lọc có đếm số kết quả, trạng thái hàng, thông số theo danh mục, sắp xếp, phân trang tăng dần và giao diện bộ lọc trên điện thoại. Nên giữ các quy tắc thương hiệu đã duyệt và nâng cấp cách dẫn khách vào danh mục, cách trình bày mặt hàng, cùng khả năng chia sẻ/khôi phục trạng thái lọc.

### Cited Findings
- Thiết kế v1.0 đã được đánh dấu “đã duyệt”; quy định màu sáng xanh lá/vàng, Be Vietnam Pro, giới hạn nội dung 1240px, lưới 8 danh mục/desktop và 4/mobile, card sản phẩm, bộ lọc, menu và sheet lọc di động. — [docs/DESIGN.md](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/docs/DESIGN.md)
- Trang chủ hiện có menu danh mục desktop, banner, lưới danh mục, “Mua theo nhu cầu”, hàng giảm giá, khối “Tất cả sản phẩm”, thương hiệu và thông tin cách mua/cửa hàng. — [app/(store)/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/page.tsx)
- `ProductBrowser` hỗ trợ lọc theo danh mục, danh mục con, thương hiệu, bốn khoảng giá, trạng thái/tình trạng giảm giá và tối đa bốn nhóm thông số khi vào một danh mục cố định; lựa chọn trong cùng nhóm dùng OR, giữa các nhóm dùng AND. Bộ lọc hiển thị số lượng kết quả theo lựa chọn, chip lọc đang bật, xóa lọc, sắp xếp và thêm 12 sản phẩm mỗi lần. — [ProductBrowser.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductBrowser.tsx)
- Trên màn hình nhỏ, bộ lọc mở thành sheet từ cạnh dưới với nút “Xem N sản phẩm”; drawer danh mục riêng trượt từ trái và đóng khi đổi đường dẫn. — [ProductBrowser.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductBrowser.tsx); [CategoryDrawer.tsx](file:///C:/Users/Hai%20Trieu%20Tin/Documents/tan-truong-tin-web/components/storefront/CategoryDrawer.tsx)
- Thẻ hàng hiển thị thương hiệu, tên tối đa hai dòng, thông số, giá/giá cũ, tình trạng và hành động thêm giỏ; có nhãn minh họa và nhãn giảm giá. Không thêm sao đánh giá hay số đã bán khi chưa có dữ liệu thật là quy tắc thiết kế hiện hành. — [ProductCard.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductCard.tsx); [docs/DESIGN.md](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/docs/DESIGN.md)
- Danh mục và sản phẩm storefront lấy từ Supabase qua client công khai chịu RLS; dữ liệu map về kiểu `Category`/`Product`, sản phẩm sale áp dụng theo thời gian, thông số lấy từ attributes cộng với dòng thông số cũ, và ảnh chọn theo thứ tự ưu tiên. Trang chủ và trang danh mục cấu hình làm mới dữ liệu mỗi 60 giây. — [lib/catalog.ts](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/lib/catalog.ts); [app/(store)/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/page.tsx); [app/(store)/danh-muc/[slug]/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/danh-muc/%5Bslug%5D/page.tsx)
- Trang danh mục có breadcrumb, tiêu đề và tái sử dụng `ProductBrowser`; trang tất cả hàng có breadcrumb và chip danh mục. — [app/(store)/danh-muc/[slug]/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/danh-muc/%5Bslug%5D/page.tsx); [app/(store)/danh-muc/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/danh-muc/page.tsx)
- Ảnh người dùng gửi cho Điện máy XANH thể hiện một giao diện danh mục kiểu mega-menu: danh mục cha thành cột điều hướng, vùng nội dung có tiêu đề nhóm và lưới loại hàng kèm ảnh. Ảnh người dùng gửi cho Nguyễn Kim thể hiện header tìm kiếm nổi bật, banner khuyến mại lớn, sau đó là lưới lối tắt ngành hàng có ảnh. — Ảnh tham chiếu do người dùng đính kèm trong cuộc trò chuyện (không có URL nguồn kèm theo; ghi nhận như quan sát hình ảnh, chưa xác thực hành vi trực tiếp trên website).

### Inferences
- Tái sử dụng `ProductBrowser` là lợi thế kiến trúc: có thể cải thiện trải nghiệm danh mục và sản phẩm mà không phải xây lại thuật toán lọc từ đầu.
- Hình Điện máy XANH là tham chiếu tốt cho “chọn ngành hàng/nhánh hàng nhanh”; hình Nguyễn Kim phù hợp hơn với “khám phá nhanh trên trang chủ” (banner chiến dịch + danh mục trực quan), chưa đủ để kết luận về thiết kế card/chi tiết mặt hàng.
- Điểm khác biệt nên là sự rõ ràng và đáng tin của cửa hàng địa phương, không sao chép nguyên màu đỏ, chiến dịch hoặc nội dung thương mại của chuỗi lớn.

### Gaps
- Chưa kiểm tra được bằng thao tác trực tiếp trên hai website; phân tích thiết kế đối thủ ở đây chỉ dựa trên hai ảnh chụp do người dùng gửi.
- Chưa có số liệu analytics về lượt vào theo danh mục, truy vấn tìm kiếm, tỷ lệ lọc, thêm giỏ hoặc bỏ trang để xác định điểm nghẽn kinh doanh.
- Chưa xác minh quy mô thực của catalog, tỷ lệ hàng có ảnh thật, tỷ lệ thiếu thương hiệu/thông số, hoặc mức độ cập nhật tồn kho.

## 2. Khoảng cách UX và rủi ro so với nhu cầu tham chiếu

### Takeaway
Khoảng trống chính không phải thiếu các bộ lọc cơ bản, mà là sự kết nối giữa danh mục → nhánh hàng → kết quả và chất lượng dữ liệu để các lối tắt thật sự có tác dụng. Tránh làm đẹp bằng nội dung giả; ưu tiên làm cho cấu trúc danh mục, trạng thái lọc và thông tin tin cậy nhất quán trên desktop lẫn điện thoại.

### Cited Findings
- Menu mega trên trang chủ tạo các chip danh mục con, thương hiệu và khoảng giá nhưng các chip khoảng giá hiện chỉ trỏ tới trang danh mục, không truyền điều kiện giá; chip danh mục con cũng trỏ tới trang danh mục cha mà không truyền nhánh con. — [app/(store)/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/page.tsx)
- Menu desktop được ẩn dưới breakpoint `lg`; drawer di động chỉ liệt kê danh mục cha và đường dẫn “Xem tất cả”, không triển khai nhánh con bên trong drawer. — [app/(store)/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/page.tsx); [CategoryDrawer.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/CategoryDrawer.tsx)
- Trạng thái bộ lọc, thứ tự sắp xếp và số sản phẩm đang hiển thị được giữ trong state phía client của `ProductBrowser`, không đọc/ghi vào query string trong component này; thao tác làm mới hoặc chia sẻ URL vì vậy không mang theo lựa chọn lọc/sắp xếp của thành phần này. — [ProductBrowser.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductBrowser.tsx)
- Bộ lọc desktop nằm trong `aside` nền trắng, nhưng không có lớp sticky trong component; spec thiết kế yêu cầu cột trái 250px sticky. — [ProductBrowser.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductBrowser.tsx); [docs/DESIGN.md](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/docs/DESIGN.md)
- Thông số động lấy từ `p.specs` nhưng chỉ ưu tiên các nhãn tiếng Việt cụ thể `Loại quạt`, `Sải cánh`, `Công suất`, `Điều khiển`, sau đó lấy thêm tối đa bốn nhãn đầu tiên còn lại. Nhãn attributes không được chuẩn hóa/ánh xạ thống nhất sẽ tạo nhóm facet rời rạc. — [ProductBrowser.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductBrowser.tsx); [lib/catalog.ts](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/lib/catalog.ts)
- `getCategories` đếm sản phẩm ở cấp danh mục cha; không có số đếm theo từng nhánh con trong kiểu Category được trả về. — [lib/catalog.ts](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/lib/catalog.ts); [lib/mock/store.ts](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/lib/mock/store.ts)
- `ProductImage` luôn gắn nhãn “Ảnh minh họa”, kể cả khi `lib/catalog` đã chọn ảnh đầu tiên từ `product_images`; thiết kế guideline nói nhãn chỉ dùng khi chưa có ảnh thật. — [ProductCard.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductCard.tsx); [lib/catalog.ts](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/lib/catalog.ts); [docs/DESIGN.md](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/docs/DESIGN.md)
- Khi chưa có ảnh, mapper hiện dùng chung `/ai/hardware-hero.jpg`; guideline dự kiến ảnh minh họa theo danh mục con và cần nhãn rõ ràng. — [lib/catalog.ts](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/lib/catalog.ts); [docs/DESIGN.md](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/docs/DESIGN.md)
- Homepage badge “COD · VietQR sắp có” nhưng khối cách mua cũng mô tả “Gửi đi tỉnh”, giao nội thành và lấy tại cửa hàng; các lời hứa này cần đối chiếu chính sách đang vận hành trước khi tăng độ nổi bật. — [app/(store)/page.tsx](file:///C:/Users/Hai%20Trieu%20Tin/Documents/tan-truong-tin-web/app/%28store%29/page.tsx); [docs/DESIGN.md](file:///C:/Users/Hai%20Trieu%20Tin/Documents/tan-truong-tin-web/docs/DESIGN.md)
- Trang chủ và trang danh mục đều lấy tập sản phẩm rồi truyền vào component client; `getProducts` giới hạn kết quả ở 5.000 dòng và `ProductBrowser` thực hiện lọc/sort ở client. Tác động hiệu năng thực tế chưa được đo và phụ thuộc quy mô catalog/ảnh. — [lib/catalog.ts](file:///C:/Users/Hai%20Trieu%20Tin/Documents/tan-truong-tin-web/lib/catalog.ts); [ProductBrowser.tsx](file:///C:/Users/Hai%20Trieu%20Tin/Documents/tan-truong-tin-web/components/storefront/ProductBrowser.tsx)

### Inferences
- Lối tắt danh mục nên dẫn tới đúng trạng thái đã chọn thay vì chỉ đưa khách sang trang có thể phải lọc lại; URL có thể đóng vai trò lưu/khôi phục trạng thái để hỗ trợ chia sẻ và quay lại.
- Sự khác biệt giữa “ảnh thật” và “ảnh minh họa” cần được biểu diễn trong dữ liệu để tránh làm giảm niềm tin và giúp ưu tiên đầu tư nội dung ảnh.
- Cần chuẩn hóa metadata attributes theo category schema trước khi mở rộng nhiều facet; nếu không, facet sẽ thiếu nhãn thống nhất, khó hiểu và đếm kết quả không đáng tin.
- Các thông tin giao nhận/thanh toán là cam kết vận hành; xác nhận tính đúng trước khi dùng làm điểm bán nổi bật.
- Nếu catalog tăng, nên đo tải trang, kích thước JSON/ảnh, độ trễ filter và thời gian phản hồi trước khi chuyển lọc sang server; chưa có cơ sở để kết luận phải đổi kiến trúc ngay.

### Gaps
- Không có dữ liệu về kích thước tải trang, Core Web Vitals, tốc độ lọc hay độ trễ Supabase ở máy khách.
- Chưa biết tất cả danh mục, schema thuộc tính, bản ghi thiếu thuộc tính và quy tắc tồn kho thực tế; chưa kiểm tra chất lượng dữ liệu trong production.
- Chưa xác minh API/trạng thái query hiện có ngoài `ProductBrowser`; trước khi đề xuất URL state toàn hệ thống cần rà thêm trang tìm kiếm và điều hướng.
- Chưa có bằng chứng chính sách COD/chuyển tỉnh hiện tại để xác định copy nào cần sửa.

## 3. Định hướng nâng cấp theo giai đoạn

### Takeaway
Đề xuất làm theo bốn giai đoạn nghiên cứu/thiết kế/triển khai có thể duyệt riêng: xác nhận dữ liệu và luồng hiện tại; cải thiện gateway danh mục theo tham chiếu Điện máy XANH và Nguyễn Kim; làm rõ danh sách hàng và lọc; cuối cùng đo kiểm khả năng dùng, tính đúng và hiệu năng. Tại thời điểm báo cáo đây là định hướng, chưa có thay đổi mã nguồn.

### Cited Findings
- Các ràng buộc thương hiệu đã duyệt gồm màu xanh/vàng, nền sáng, Be Vietnam Pro, không gradient, không số liệu giả, thông tin địa phương thật và card có giá/tình trạng/hành động. — [docs/DESIGN.md](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/docs/DESIGN.md)
- Trang danh mục hiện đã là route riêng, dùng breadcrumb + tiêu đề + `ProductBrowser` với category filter cố định; đây là điểm mở rộng có sẵn cho chip nhánh con/đường dẫn sâu hơn. — [app/(store)/danh-muc/[slug]/page.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/app/%28store%29/danh-muc/%5Bslug%5D/page.tsx)
- Bộ lọc đã có số lượng facet, nhóm giá/thương hiệu/tình trạng/thông số, chip đang chọn, sorting, pagination và mobile sheet, nên giai đoạn listing cần tập trung vào sự rõ ràng và trạng thái thay vì thay thế toàn bộ. — [ProductBrowser.tsx](file:///C:/Users/Hai%20Trieu/Documents/tan-truong-tin-web/components/storefront/ProductBrowser.tsx)
- Trang chủ đã có banner, lưới danh mục 8 cột/4 cột và hàng sản phẩm sale, đây là các khu vực có thể tổ chức lại theo thứ tự ưu tiên khám phá mà không cần tạo taxonomy mới. — [app/(store)/page.tsx](file:///C:/Users/Hai%20Trieu%20Tin/Documents/tan-truong-tin-web/app/%28store%29/page.tsx)

### Inferences
1. **Giai đoạn 0 — kiểm kê và xác nhận nguồn dữ liệu.** Đếm danh mục/nhánh/sản phẩm, tỷ lệ có ảnh/giá/brand/spec, xác nhận chính sách tồn kho và giao nhận; thống kê hành vi nếu analytics đã bật. Chốt taxonomy thật và điều kiện “ảnh thật/ảnh minh họa”. Không thay đổi cấu trúc DB chỉ để khớp ảnh tham chiếu.
2. **Giai đoạn 1 — thiết kế lối vào danh mục.** Trên desktop, cân nhắc mô hình danh mục cha rõ ràng + lưới nhánh hàng có ảnh/icon, học cấu trúc nhóm của ảnh Điện máy XANH; trên mobile dùng trang/drawer hoặc sheet phù hợp viewport, cho phép đi thẳng tới nhánh hàng và có đường quay lại dễ hiểu. Giữ brand xanh/vàng và kiểm tra với mẫu v3 đã duyệt.
3. **Giai đoạn 2 — trang khám phá mặt hàng.** Trên homepage, đặt lối vào danh mục và một campaign hero chỉ khi shop có chiến dịch thật; danh mục trực quan kiểu Nguyễn Kim có thể truyền cảm hứng cho khám phá nhanh, nhưng tránh banner lấn át nhu cầu tìm sản phẩm cơ bản. Trên trang category, thêm mô tả/chip nhánh hàng khi dữ liệu tồn tại, và đảm bảo chip lọc thực sự áp dụng điều kiện.
4. **Giai đoạn 3 — lọc, card và định hướng kết quả.** Chuẩn hóa facet theo schema; đồng bộ trạng thái lọc/sắp xếp quan trọng vào query string; làm số lượng và trạng thái hết lựa chọn dễ hiểu; hiển thị đúng nhãn ảnh theo dữ liệu; giữ tiêu chí giá/tồn kho và thông tin phục vụ quyết định mua. Không thêm rating, số bán, khuyến mãi hay tồn kho khẩn cấp giả.
5. **Giai đoạn 4 — kiểm chứng trước khi phát hành.** Rà soát các luồng desktop/điện thoại: mở danh mục, chọn nhánh, lọc, bỏ lọc, back/forward, chia sẻ URL, không có kết quả, thêm giỏ. Kiểm tra keyboard/focus/touch target, tải ảnh và hiệu năng với catalog thực. Chỉ chốt thay đổi sau khi chủ shop duyệt bản thiết kế cụ thể và phạm vi.

### Gaps
- Chưa có xác nhận mới rằng mẫu trang chủ v3 đã duyệt được phép thay đổi cấu trúc; nếu thay thứ tự hoặc mô hình trang, cần trình phương án để duyệt trước khi viết mã.
- Chưa có quyết định ưu tiên kinh doanh (điện nước, kim khí, gia dụng hay quạt) để sắp thứ tự danh mục/nhu cầu.
- Chưa có ảnh sản phẩm thật và ảnh cửa hàng đầy đủ; quyết định dùng lưới ảnh theo danh mục cần dựa vào tài sản có sẵn và quy định ảnh trong design guideline.
- Chưa có số đo trước/sau hoặc tiêu chí thành công (ví dụ tỷ lệ vào category, filter-to-cart, tìm thấy sản phẩm); cần chọn chỉ số trước khi tuyên bố UX tốt hơn.

