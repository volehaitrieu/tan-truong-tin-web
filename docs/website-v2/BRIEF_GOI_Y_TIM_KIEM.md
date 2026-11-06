# Brief thiết kế ô tìm kiếm có gợi ý (mobile 375px)

Dùng cho Stitch (và Figma nếu cần). Chủ shop chưa duyệt để làm mã: đây là brief để vẽ mẫu, chưa phải bản chốt. Làm 2 hướng (A và B) cho CÙNG bộ màn hình bên dưới.

## Ý tưởng đã gom (từ trao đổi 5–6/11/2026)
1. Khách gõ từ khóa, hiện **5 sản phẩm đầu**, mỗi dòng có **tên và giá** (chưa có ảnh nhỏ: dữ liệu ảnh chưa đủ tốt, để đợt sau).
2. **Dòng ghim ở đáy tấm**: "Đã hiện 5/16 sản phẩm có từ khóa “senko”", kèm nút **"Xem thêm 5"**. Bấm thì hiện thêm 5 dòng; kéo xuống đáy cũng tự hiện thêm. Khi đã hiện đủ thì nút biến mất, dòng chữ còn.
3. Dòng cuối tấm: **"Xem tất cả N kết quả →"** (sang trang kết quả đầy đủ).
4. **Gợi ý ngành hàng**: chỉ khi từ khóa trùng tên một ngành hàng (ví dụ "ấm" → ngành "Ấm siêu tốc · 14 sản phẩm →"), hiện một nút tắt ở **đầu tấm**. Từ khóa như "senko" (toàn bộ kết quả cùng một ngành) thì không hiện nút ngành, tránh nhiễu. Tối đa 2–3 nút.
5. **Không có kết quả**: hiện lời nhắn + 2 nút (gọi shop, xem danh mục), không để tấm biến mất.
6. Trên điện thoại tấm gợi ý chỉ cao đến sát bàn phím, có **một vùng cuộn duy nhất** (không khung cuộn lồng trong khung cuộn). Dòng ghim đáy luôn thấy.

## Bối cảnh màn hình
Đầu trang đang ở trạng thái tìm kiếm mở: tên cửa hàng đã thu mất, ô tìm kiếm dài ra, bên phải ô có nút × (đóng), ngoài cùng là vòng tròn Tài khoản (nhỏ hơn lúc đóng). Bên dưới là tấm gợi ý, bên dưới nữa là vùng bàn phím điện thoại (vẽ khối xám trơn, không vẽ phím). Placeholder ô nhập: "Tìm ống nước, quạt…".

## Các màn hình cần vẽ (5 màn, mỗi hướng)
**Màn 1. Gõ "ấm" (có nút ngành hàng).**
- Nhãn nhỏ "Ngành hàng" + nút viên thuốc "Ấm siêu tốc · 14 sản phẩm →" ở đầu tấm.
- 5 dòng (tên, giá bên phải):
  - Ấm siêu tốc inoc 2 lớp 1.8L Sunhouse SHD1351 · 300.000₫
  - Ấm siêu tốc Inox 2 lớp 3L Sunhouse SHD1365 · 794.000₫
  - Ấm siêu tốc Inox 2 lớp 5L Sunhouse SHD1415 · 650.000₫
  - Ấm siêu tốc inox Sunhouse SHD1182 · 300.000₫
  - Ấm siêu tốc Inox Sunhouse SHD1183 · 300.000₫
- Dòng ghim đáy: "Đã hiện 5/14 sản phẩm có từ khóa “ấm”" + nút "Xem thêm 5".
- Dòng cuối: "Xem tất cả 14 kết quả →".

**Màn 2. Gõ "senko" (không có nút ngành).**
- 5 dòng:
  - Quạt bàn Senko B1612 47W - Nút vặn · 340.000₫
  - Quạt đứng công nghiệp Senko DCN1801 75W · 560.000₫
  - Quạt đứng công nghiệp Senko DCN1803 75W - Nút vặn · 560.000₫
  - Quạt đứng Senko DD1602 47W - Nút nhấn · 570.000₫
  - Quạt đứng Senko DR1608 65W - Remote · 750.000₫
- Dòng ghim đáy: "Đã hiện 5/16 sản phẩm có từ khóa “senko”" + "Xem thêm 5". Dòng cuối: "Xem tất cả 16 kết quả →".

**Màn 3. Sau khi bấm "Xem thêm 5" (từ màn 2).** 10 dòng; 5 dòng mới phân biệt nhẹ (chỉ một lớp màu, không đổi chữ), vùng danh sách cuộn được, dòng ghim đáy vẫn thấy: "Đã hiện 10/16 sản phẩm có từ khóa “senko”" + "Xem thêm 5". Năm dòng mới:
  - Quạt đứng Senko DTS1601 65W - Nút vặn · 495.000₫
  - Quạt lửng công nghiệp Senko LTS1631 65W - Nút vặn · 430.000₫
  - Quạt lửng Senko L1638 47W - Thân nhựa · 360.000₫
  - Quạt lửng Senko LS1630 47W - Thân sắt · 420.000₫
  - Quạt lửng Senko LTS1633 60W - Thân sắt · 450.000₫

**Màn 4. Đã hiện đủ (ví dụ 16/16).** Không còn nút "Xem thêm", dòng ghim chỉ còn chữ "Đã hiện 16/16 sản phẩm có từ khóa “senko”". (Vẽ phần cuối danh sách, không cần ghi hết 16 tên.)

**Màn 5. Gõ mà không có kết quả (ví dụ "xyz").**
- Tiêu đề: "Không thấy sản phẩm nào có “xyz”".
- Dòng phụ: "Thử gõ ngắn hơn hoặc bỏ dấu. Hoặc gọi shop để hỏi."
- Nút chính: "Gọi 0948 732 064". Nút phụ: "Xem danh mục sản phẩm".

## Nội dung chỉ được dùng những chữ ở trên
Không thêm sao đánh giá, nhãn giảm giá, "bán chạy", số lượt xem, ảnh sản phẩm, khẩu hiệu, hứa hẹn thời gian báo giá. Tên, giá, số đếm là dữ liệu thật trên web thử (lấy 6/11/2026). Giá "Ấm Mama 645.688₫" đang chờ chủ shop xác nhận nên không dùng trong mẫu.

## Bảng màu (đúng 6 màu, không thêm màu nào; xanh lá, đỏ không dùng trong các màn này)
Kem #FFFBF7 · Ngọc trai #ECE7E9 · Xám sương #D5D0D0 · Be xám #B8B2AB · Than #2F2F2F · Đen mực #181818. Chữ phụ #6B655E (chỉ dùng trên nền kem/ngọc trai). Không dùng trắng thuần #FFFFFF.

## Quy tắc chung
Font Be Vietnam Pro, lề 12–20px, bo 20px cho tấm và ô nhập, nút viên thuốc cao ≥ 44px, mỗi dòng sản phẩm cao ≥ 44px (tên tối đa 2 dòng), phẳng (không bóng đổ, không gradient), chỉ giao diện sáng, tương phản chữ ≥ 4,5:1. Giá nằm bên phải, chữ đậm, không xuống dòng.

## Hai hướng
- **Hướng A "Kem thoáng":** tấm gợi ý nền kem, viền xám sương, các dòng cách nhau bằng đường kẻ ngọc trai. Nút ngành hàng nền ngọc trai viền be xám. Dòng ghim đáy nền ngọc trai, chữ phụ xám; nút "Xem thêm 5" đen mực chữ kem. "Xem tất cả" là dòng chữ đậm đen mực.
- **Hướng B "Dải tầng":** tấm gợi ý nền ngọc trai; mỗi dòng sản phẩm là một thẻ kem bo 14px, cách nhau khoảng trắng 6px (không đường kẻ). Nút ngành hàng nền đen mực chữ kem. Dòng ghim đáy nền than chữ kem; nút "Xem thêm 5" nền kem chữ đen mực. "Xem tất cả" là nút viền be xám bo viên thuốc.

## Lệnh dán vào Stitch (rút gọn)
> Thiết kế 5 màn hình điện thoại 375px cho ô tìm kiếm có gợi ý của cửa hàng điện nước, quạt, gia dụng "Tân Trường Tín" (tiếng Việt, font Be Vietnam Pro). Dùng ĐÚNG 6 màu: kem #FFFBF7, ngọc trai #ECE7E9, xám sương #D5D0D0, be xám #B8B2AB, than #2F2F2F, đen mực #181818 (chữ phụ #6B655E), không dùng màu nào khác kể cả trắng thuần. Phẳng, không bóng đổ, không gradient. Chỉ dùng đúng chữ và số trong brief, không thêm nội dung, ảnh, sao đánh giá, khuyến mãi hay chân trang. Đầu trang ở trạng thái tìm kiếm mở (ô dài, nút ×, vòng tròn tài khoản nhỏ), tấm gợi ý bên dưới, khối xám bàn phím dưới cùng. Làm 2 hướng A và B như mô tả.
