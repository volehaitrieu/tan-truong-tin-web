# Dùng tham chiếu bán lẻ để dẫn khách

Điện máy XANH cho thấy cách dẫn người mua nhanh từ nhóm ngành sang nhánh hàng; Nguyễn Kim bổ sung cách đưa tìm kiếm, danh mục phổ biến, bộ lọc ngành hàng và thông tin sản phẩm lên trước mắt. Tân Trường Tín đã có nền tảng danh mục, bộ lọc, sắp xếp và thẻ hàng, nên hướng phù hợp là nối các bước đó liền mạch hơn thay vì xây lại từ đầu. Trọng tâm nên là lối vào danh mục hoạt động đúng, bộ lọc theo thuộc tính thật của từng loại vật tư, cùng thông tin sản phẩm đáng tin cậy. Đây là báo cáo khảo sát và định hướng; chưa có thay đổi mã nguồn.

## Quan sát trực tiếp cho thấy hai mô hình phục vụ hai nhu cầu

**Điện máy XANH dùng menu phủ hai vùng:** danh sách nhóm ngành nằm bên trái, vùng bên phải đổi nội dung theo nhóm được chọn. Khi mở “Điện lạnh, điện máy”, 11 liên kết nhánh hàng hiện dưới dạng hình và nhãn; chọn nhóm không đổi URL, còn chọn nhánh dẫn tới trang ngành hàng. Trang này cung cấp thêm một chỉ mục danh mục đầy đủ, trong khi hướng dẫn mua hàng đặt lọc hãng, giá và tìm nâng cao ở trang danh mục. ([Điện máy XANH](https://www.dienmayxanh.com/), [chỉ mục danh mục](https://www.dienmayxanh.com/danh-muc-nhom-hang/), [hướng dẫn mua hàng](https://www.dienmayxanh.com/huong-dan-mua-hang))

**Nguyễn Kim ưu tiên tìm kiếm và khám phá nhanh trên di động:** trang chủ đặt tìm kiếm cùng các lối tắt ngành hàng gần đầu luồng, sau đó là nội dung khuyến mãi và truy vấn phổ biến. Trang Tivi có bộ lọc thương hiệu/kích thước và sắp xếp; trang Điều hòa dùng thương hiệu/công suất, đồng thời đưa giá và so sánh vào danh sách. Trang chi tiết sản phẩm xếp ảnh, điểm nổi bật, thông số, giá, tình trạng hàng và hành động mua thành các lớp nội dung. ([Trang chủ di động](https://m.nguyenkim.com/), [danh mục Tivi](https://www.nguyenkim.com/tivi.c), [danh mục Điều hòa](https://www.nguyenkim.com/dieu-hoa.c), [chi tiết Tivi](https://www.nguyenkim.com/smart-ai-tivi-samsung-mini-led-4k-55-inch-ua55m77h-UA55M77H))

Những quan sát này gồm thao tác trực tiếp bằng CUA trên menu Điện máy XANH và các trang danh sách/lọc/chi tiết của Nguyễn Kim. Một lượt thử riêng bằng Playwright không khởi chạy được Chrome do lỗi Crashpad; đó là giới hạn của công cụ tự động ở lượt thử ấy, không có nghĩa là không thể tương tác với website. Ảnh danh mục trên điện thoại do chủ cửa hàng cung cấp là tư liệu tham khảo riêng, chưa dùng để khẳng định cách bố trí hiện hành tại mọi kích thước màn hình.

## Diễn giải: Tân Trường Tín đã có bộ lọc, nhưng lối tắt chưa luôn giữ ý định mua

Hiện có danh mục riêng, `ProductBrowser` với lọc danh mục/nhánh, thương hiệu, khoảng giá, trạng thái và thông số, số lượng kết quả, chip lọc, sắp xếp, tải thêm; trên điện thoại bộ lọc mở thành sheet. Thẻ hàng đã có giá, thông số, trạng thái và hành động thêm giỏ. Các quy tắc thương hiệu đã duyệt dùng xanh/vàng, Be Vietnam Pro, nền sáng và không dùng dữ liệu bán hàng giả. ([ProductBrowser](../components/storefront/ProductBrowser.tsx), [ProductCard](../components/storefront/ProductCard.tsx), [thiết kế đã duyệt](../docs/DESIGN.md))

Kiểm tra cấu trúc hiện có ghi nhận một số lối tắt danh mục con hoặc khoảng giá trên trang chủ chỉ tới danh mục mà không áp dụng nhánh hay điều kiện giá; drawer di động liệt kê danh mục cha nhưng chưa mở nhánh con; lựa chọn lọc/sắp xếp trong `ProductBrowser` không được giữ trong URL. Thông số phụ thuộc vào nhãn thuộc tính nhất quán, còn nhãn “Ảnh minh họa” chưa phân biệt ảnh thật với ảnh dự phòng. ([trang chủ](../app/%28store%29/page.tsx), [CategoryDrawer](../components/storefront/CategoryDrawer.tsx), [ProductBrowser](../components/storefront/ProductBrowser.tsx), [ProductCard](../components/storefront/ProductCard.tsx), [catalog](../lib/catalog.ts))

Diễn giải từ các phát hiện này: **nút thắt chính là sự liền mạch giữa danh mục, nhánh hàng và kết quả, cùng độ tin cậy của dữ liệu**, chứ không phải thiếu bộ lọc cơ bản. Đây là đánh giá từ mã/giao diện, không phải kết luận dựa trên hành vi hay chuyển đổi đo được của khách hàng.

## Khuyến nghị: nối lối vào, bộ lọc và thông tin mặt hàng

Trước tiên, kiểm kê danh mục, nhánh, ảnh, giá, thương hiệu, tồn kho và thuộc tính đang có; xác nhận chính sách giao nhận/thanh toán và nội dung khuyến mãi nào còn hiệu lực. Việc này quyết định danh mục nào nên nổi bật, ảnh nào là ảnh thật, và thông tin nào cửa hàng có thể cam kết.

Tiếp theo, phác thảo lối vào danh mục theo hai tham chiếu: desktop có thể dùng nhóm cha và lưới nhánh hàng kiểu Điện máy XANH; trang chủ điện thoại có thể làm rõ ô tìm kiếm và một số nhóm hàng phổ biến theo cách Nguyễn Kim. Mỗi lối tắt phải dẫn tới đúng danh mục/nhánh; ưu đãi chỉ xuất hiện khi có chương trình thật. Giữ nhận diện xanh/vàng và bố cục v3 đã duyệt làm đường cơ sở; trình phương án nếu muốn đổi cấu trúc lớn. Không sao chép màu đỏ, banner, ảnh hay cây danh mục của các chuỗi.

Ở trang kết quả, giữ lại bộ lọc đang hoạt động rồi làm chúng dễ hiểu và đáng tin hơn: chuẩn hóa thuộc tính theo từng nhóm vật tư; hiển thị rõ tiêu chí đã chọn và số mặt hàng còn lại; cân nhắc lưu bộ lọc/sắp xếp vào URL để tải lại, quay lại hoặc chia sẻ mà vẫn giữ lựa chọn. Trên thẻ và trang chi tiết, đưa quy cách, vật liệu/đơn vị, giá và trạng thái có dữ liệu lên trước; phân biệt ảnh thật với ảnh thay thế. Chỉ thêm so sánh, đánh giá, lượt bán, tồn kho khẩn cấp hay ưu đãi khi hệ thống có nguồn dữ liệu cập nhật tương ứng.

## Giới hạn khảo sát và bước xác nhận cần thiết

Khảo sát đối thủ được thực hiện ngày 26/10/2026. Giá, số lượng bán và khuyến mãi là dữ liệu biến động; tại một lần trích xuất Nguyễn Kim có mâu thuẫn giữa điểm đánh giá và số đánh giá, chương trình ghi ngày kết thúc đã qua, cùng các giá/lượt bán khác nhau giữa trang danh mục và chi tiết. Không thể kết luận nguyên nhân là dữ liệu, phiên hiển thị hay cache; vì vậy chúng không được dùng làm chuẩn nội dung. ([danh mục Tivi](https://www.nguyenkim.com/tivi.c), [Tivi di động](https://m.nguyenkim.com/tivi.c), [chi tiết Tivi](https://www.nguyenkim.com/smart-ai-tivi-samsung-mini-led-4k-55-inch-ua55m77h-UA55M77H))

Chưa đo vùng chạm, khả năng tiếp cận bàn phím, độ trễ, hiệu năng, tỷ lệ chuyển đổi hay chất lượng dữ liệu production. Cũng chưa kiểm chứng đầy đủ menu của Điện máy XANH trên viewport điện thoại thật hoặc hành vi vuốt/lọc trên mọi kích thước máy. Sau khi chốt phương án, nên kiểm tra các luồng mở menu → chọn nhánh → lọc → xóa lọc → quay lại/chia sẻ URL trên máy tính và điện thoại, rồi so với chỉ số analytics nếu có.

## Kết luận

Hướng nâng cấp tốt nhất là kết hợp **điều hướng hai tầng của Điện máy XANH** với **tìm kiếm và lối tắt khám phá của Nguyễn Kim**, nhưng đặt trên taxonomy, thương hiệu và dữ liệu thật của Tân Trường Tín. Lợi thế hiện tại là bộ lọc và luồng danh mục đã tồn tại; cơ hội lớn nhất là bảo đảm mỗi lối tắt giữ đúng ý định người mua, rồi làm rõ thuộc tính và độ tin cậy của mặt hàng. Báo cáo này đưa ra cơ sở để duyệt thiết kế và phạm vi tiếp theo, chưa triển khai giao diện.
