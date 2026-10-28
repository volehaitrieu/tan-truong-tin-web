# Nguyễn Kim: khảo sát trải nghiệm trang chủ, danh mục và mặt hàng

## 1. Trang chủ và đường vào danh mục trên di động

### Takeaway
Ảnh người dùng gửi về Nguyễn Kim phản ánh đúng hướng thiết kế đã được quan sát trên trang di động chính thức: thanh công cụ đỏ ưu tiên menu, tìm kiếm và giỏ hàng; khu sản phẩm đặt danh mục trực quan bằng ảnh và tên. Nên học cách đưa danh mục phổ biến và tìm kiếm lên đầu luồng, nhưng dùng hệ thống phân cấp danh mục thật của cửa hàng mình, không sao chép nguyên cách sắp xếp hay tài sản hình ảnh của Nguyễn Kim.

### Cited Findings
- Trang chủ di động chính thức hiện có thanh tìm kiếm với lời nhắc “Bạn cần tìm gì hôm nay?”, sau đó đưa các danh mục như Tủ lạnh, Máy lạnh, Máy giặt, Điện thoại, Tivi, Nồi cơm điện, Quạt và Laptop ra thành các liên kết riêng. Bên dưới là vùng khuyến mãi/tin tức, điểm tin ưu đãi và danh sách “Tìm kiếm nhiều nhất”. [Trang chủ di động Nguyễn Kim](https://m.nguyenkim.com/)
- Ảnh người dùng gửi cho thấy một màn hình danh mục dạng hai vùng: danh mục cấp cao cuộn dọc bên trái và lưới biểu tượng danh mục con bên phải. Đây là tham chiếu trực quan do người dùng cung cấp; bản trích xuất trang hiện hành không thể xác nhận chính xác tương tác của menu này.
- Trang chủ máy tính chính thức có ô tìm kiếm, tra cứu đơn hàng, giỏ hàng, đăng nhập và thanh liên kết nhanh tới danh mục. Trang chủ di động giữ tìm kiếm và liên kết danh mục nhưng giản lược nhiều mục trên thanh đầu trang. [Trang chủ Nguyễn Kim](https://www.nguyenkim.com/)
- Trang chủ di động đồng thời hiển thị khối tin/ưu đãi và danh sách từ khóa tìm kiếm phổ biến; các danh mục sản phẩm khác nhau cũng được liên kết trực tiếp từ khu này. [Trang chủ di động Nguyễn Kim](https://m.nguyenkim.com/)

### Inferences
- **Nên áp dụng:** ô tìm kiếm nổi bật; lối tắt cho các nhóm hàng thường dùng; danh mục trực quan có nhãn rõ ràng; điểm vào ưu đãi/từ khóa phổ biến khi dữ liệu hệ thống có căn cứ.
- **Nên điều chỉnh cho dự án:** chỉ ưu tiên danh mục và truy vấn thực sự có sản phẩm; trên màn hình hẹp có thể dùng lưới danh mục hai hoặc ba cột và bộ chọn nhóm hàng cuộn ngang/dọc, thay vì ép một bảng menu desktop thu nhỏ vào mobile.
- Ảnh danh mục người dùng gửi phù hợp để nghiên cứu cách chia không gian, nhưng cần kiểm chứng bằng thiết bị thật trước khi kết luận rằng menu nhiều cột hai vùng hoạt động tốt ở mọi kích thước.

### Gaps
- Công cụ trình duyệt tự động không khởi chạy được Chrome trên máy này (Chrome thoát với lỗi Crashpad), vì vậy chưa thể thao tác trực tiếp menu, đóng/mở danh mục, cuộn hay đo kích thước vùng chạm. Khảo sát tương tác ở đây dựa trên cấu trúc trang chính thức được tải và ảnh người dùng cung cấp, không phải kiểm thử thao tác đầy đủ.
- Không xác nhận được carousel trên trang chủ tự chuyển, vuốt, hoặc điều hướng tới những URL nào khi thao tác thực tế.

## 2. Trang danh mục, lọc và thẻ mặt hàng

### Takeaway
Điểm có thể học từ trang danh mục Nguyễn Kim là giúp khách bắt đầu bằng những thuộc tính quen thuộc của ngành hàng, cung cấp sắp xếp đơn giản, rồi cho người dùng so sánh các mặt hàng ngay trong danh sách. Trang di động trình bày bộ lọc trước danh sách; tuy nhiên, bộ lọc có nhiều giá trị nên dự án nên gom theo nhóm và cho biết tiêu chí đang áp dụng, thay vì bê nguyên số lượng tùy chọn dài.

### Cited Findings
- Trang Tivi di động có nút/nhãn “Lọc”, nhóm lựa chọn thương hiệu, nhóm kích thước và thứ tự sắp xếp gồm bán chạy, giá tăng dần, giá giảm dần. [Danh mục Tivi di động](https://m.nguyenkim.com/tivi.c)
- Trang Tivi máy tính dùng nhãn “Bộ lọc”, hiển thị thương hiệu và kích thước, rồi có sắp xếp theo bán chạy, giá thấp đến cao và giá cao đến thấp. [Danh mục Tivi máy tính](https://www.nguyenkim.com/tivi.c)
- Trang Điều hòa máy tính đưa thương hiệu và công suất (HP/BTU) thành lối lọc đầu tiên, sau đó đặt các sản phẩm cùng giá niêm yết, mức giảm, giá đang bán, số lượng bán hoặc suất ưu đãi và điều khiển “So sánh” trong danh sách. [Danh mục Điều hòa](https://www.nguyenkim.com/dieu-hoa.c)
- Thẻ hàng Tivi có tên sản phẩm cụ thể, giá trước/giá hiện tại, phần trăm giảm, thông tin đã bán và nút So sánh. Một số thẻ có nhãn chương trình khuyến mãi hoặc ưu đãi số lượng giới hạn. [Danh mục Tivi](https://www.nguyenkim.com/tivi.c)
- Ảnh người dùng gửi về trang chủ Nguyễn Kim cho thấy nhóm biểu tượng danh mục dưới khu quảng bá sản phẩm. Trang chính thức đang tải có các lối tắt danh mục tương ứng và vùng khuyến mãi, dù vị trí/chi tiết trên website có thể thay đổi theo chiến dịch. [Trang chủ di động Nguyễn Kim](https://m.nguyenkim.com/)

### Inferences
- **Nên áp dụng:** bộ lọc dựa theo nhu cầu thật của từng ngành hàng — ví dụ thương hiệu, khoảng giá và thông số có trong dữ liệu; sắp xếp theo bán chạy/giá; chip hiển thị và xóa tiêu chí đang chọn; số kết quả sau lọc; thẻ hàng cho thấy giá hiện tại và thông tin giảm giá dễ phân biệt.
- Với dự án bán vật tư điện nước, mỗi loại hàng cần bộ thuộc tính riêng: ví dụ đường kính/chiều dài/áp lực cho ống, công suất/điện áp cho thiết bị, vật liệu hoặc thương hiệu khi dữ liệu có. Không dùng nguyên bộ lọc TV (kích thước inch) hoặc điều hòa (HP/BTU).
- Có thể học cách làm thẻ sản phẩm dễ quét, nhưng cần tránh để huy hiệu khuyến mãi, tồn kho, lượt bán và so sánh lấn át tên hàng, thông số thiết yếu và hành động mua.
- Ảnh biểu tượng ngành hàng ở trang chủ phù hợp với những danh mục có hình minh họa nhận diện tốt; với vật tư nhỏ, khó phân biệt qua icon, có thể ưu tiên tên nhóm và ảnh thật ở kích thước đủ lớn.

### Gaps
- Bản trích xuất HTML xác nhận các lựa chọn hiển thị nhưng không chứng minh thao tác chọn bộ lọc có cập nhật URL, giữ trạng thái sau tải lại hay mở dạng drawer trên màn hình hẹp. Chrome không chạy được trong môi trường kiểm tra nên chưa thử trực tiếp các hành vi này.
- Chưa thu được bằng chứng đáng tin để xác nhận danh sách desktop dùng cùng giao diện và số cột ở nhiều chiều rộng; cần kiểm tra bằng thiết bị thật nếu bố cục desktop là mục tiêu chính.
- Chưa xác định được dữ liệu “đã bán” và giới hạn suất ưu đãi lấy từ nguồn cập nhật nào; không nên sao chép chỉ báo này nếu dự án không có dữ liệu đáng tin tương đương.

## 3. Trang chi tiết mặt hàng và độ tin cậy của thông tin

### Takeaway
Trang chi tiết Nguyễn Kim kết hợp bộ ảnh, điểm nổi bật, thông số có cấu trúc, giá/khuyến mãi, trạng thái còn hàng, điểm trưng bày, giỏ hàng và trả góp. Có thể học cách chia nội dung thành các lớp để người mua quét nhanh rồi xem sâu; mọi giá, đánh giá, số đã bán, thời hạn khuyến mãi, tồn kho và cam kết phải lấy từ dữ liệu chính xác, cập nhật, tránh tạo cảm giác tin cậy bằng con số minh họa.

### Cited Findings
- Trang chi tiết máy tính cho sản phẩm Tivi có breadcrumb quay về Trang chủ/ngành hàng; bộ sưu tập nhiều ảnh; phần đặc điểm nổi bật; thông số kỹ thuật dạng tên trường–giá trị; phần giải thích sản phẩm; đánh giá và gợi ý mặt hàng liên quan. [Trang chi tiết Tivi — Nguyễn Kim](https://www.nguyenkim.com/smart-ai-tivi-samsung-mini-led-4k-55-inch-ua55m77h-UA55M77H)
- Cùng trang có tên/mã sản phẩm, điểm và số đánh giá, số đã bán, so sánh, giá cũ/mức giảm/giá hiện tại, trạng thái còn hàng, xem điểm trưng bày, voucher, lựa chọn khuyến mãi, mua ngay/thêm giỏ, trả góp và số tư vấn. [Trang chi tiết Tivi — Nguyễn Kim](https://www.nguyenkim.com/smart-ai-tivi-samsung-mini-led-4k-55-inch-ua55m77h-UA55M77H)
- Trang chi tiết di động tải cùng URL sản phẩm. Phần văn bản được trích xuất cho thấy bộ ảnh có điều khiển Previous/Next và chỉ báo 1/7, sau đó là nội dung sản phẩm, đánh giá và sản phẩm liên quan. Nội dung trích xuất trên mobile không thể hiện khối giá và nút mua như bản desktop; không thể kết luận rằng các thành phần đó bị thiếu trên giao diện thực tế, vì có thể phụ thuộc vùng nhìn, trạng thái tải hoặc cách công cụ trích văn bản xử lý. [Trang chi tiết Tivi di động](https://m.nguyenkim.com/smart-ai-tivi-samsung-mini-led-4k-55-inch-ua55m77h-UA55M77H)
- Tại thời điểm khảo sát (26/10/2026), trang chi tiết đang trích xuất ghi chương trình dự kiến đến hết 23/10/2026, tức ngày kết thúc đã qua; danh mục và trang chi tiết cũng đưa ra các giá/số đã bán khác nhau cho cùng mã sản phẩm trong nội dung được thu thập ở các lần tải. Đây là dấu hiệu dữ liệu có thể thay đổi theo thời điểm, phiên bản hoặc cache, không phải số liệu nên đem làm chuẩn thiết kế. [Trang chi tiết Tivi — Nguyễn Kim](https://www.nguyenkim.com/smart-ai-tivi-samsung-mini-led-4k-55-inch-ua55m77h-UA55M77H); [Danh mục Tivi](https://www.nguyenkim.com/tivi.c); [Danh mục Tivi di động](https://m.nguyenkim.com/tivi.c)
- Trang chi tiết desktop ghi “5” nhưng đồng thời “0 đánh giá” và “Chưa có đánh giá”. Đây là mâu thuẫn nội bộ trong nội dung hiển thị/trích xuất; cần xem số đánh giá là chưa xác minh thay vì khẳng định người mua đã chấm điểm. [Trang chi tiết Tivi — Nguyễn Kim](https://www.nguyenkim.com/smart-ai-tivi-samsung-mini-led-4k-55-inch-ua55m77h-UA55M77H)

### Inferences
- **Nên áp dụng:** ảnh sản phẩm kèm điều khiển gallery; tên hàng/mã hàng; giá và trạng thái mua dễ tìm; thông số chuẩn hóa theo nhóm; điểm nổi bật ngắn; mô tả chi tiết và mặt hàng liên quan; ưu tiên hiển thị trạng thái có nguồn dữ liệu rõ.
- Với dự án, thông số phải phản ánh mẫu sản phẩm thật; các trường không có dữ liệu nên được ẩn hoặc ghi rõ chưa có thông tin, không điền giả. Giá, tồn kho, khả năng giao/lắp và điều kiện khuyến mãi cần gắn với nguồn dữ liệu và thời gian hiệu lực.
- Không nên lấy đánh giá “5”, số lượt bán, cam kết “rẻ nhất”, “miễn phí toàn quốc”, hoặc huy hiệu ưu đãi làm nội dung mẫu nếu không thể xác minh trong hệ thống của dự án. Trường hợp Nguyễn Kim tự mâu thuẫn về đánh giá và hiển thị ưu đãi đã qua hạn là lý do cụ thể để ưu tiên tính đúng và thời hạn hiển thị trên hiệu ứng trang trí.
- Mẫu bố cục đáng cân nhắc cho sản phẩm vật tư: ảnh và mua hàng ở vùng đầu; ngay dưới là hàng thông số chính (quy cách, vật liệu, đơn vị, tồn kho); sau đó mới tới mô tả, hướng dẫn lắp đặt/sử dụng và mặt hàng tương thích. Đây là đề xuất suy ra từ cấu trúc trang detail quan sát được và đặc thù danh mục của dự án.

### Gaps
- Chưa kiểm chứng được hành vi gallery khi chạm/ vuốt, nút thêm vào giỏ, chọn quà/khuyến mãi, voucher, điểm trưng bày hoặc phần đánh giá. Không tạo đơn hàng hay thực hiện giao dịch trong khảo sát.
- Không thể xác định liệu khác biệt giá, lượt bán, thời hạn khuyến mãi và số đánh giá là lỗi đồng bộ thật, dữ liệu theo phiên/ngữ cảnh, hay sai số do nội dung cache/trích xuất; cần đối chiếu giao diện hiển thị trực tiếp và nguồn dữ liệu sản phẩm trước khi dùng làm kết luận về chất lượng hệ thống.

