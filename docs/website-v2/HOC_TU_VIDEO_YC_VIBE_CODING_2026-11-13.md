# Học từ video "Common Mistakes With Vibe Coded Websites" (Y Combinator)

- Nguồn: https://www.youtube.com/watch?v=DNSXlBmukck — kênh Y Combinator, 37 phút, mục Design Review.
- Người nói: Aaron Epstein (YC) và Raphael Schaad (đồng sáng lập Cron, nay là Notion Calendar).
- Cách học: đọc toàn bộ lời thoại tự động (tiếng Anh) của video. Mình không xem được hình ảnh, nên phần nhận xét về hình dựa trên lời mô tả của hai người nói.
- Ngày: 13/11/2026.

## 1. Video nói gì

Hai người xem 6 trang web của các startup YC làm bằng công cụ AI, rồi chỉ ra chỗ hay và chỗ dở. Ý chính: AI giúp làm gì cũng dễ, nên người làm phải tự chọn lọc. "Dễ làm không có nghĩa là đáng làm" — bạn là người biên tập, không bấm "chấp nhận tất cả".

## 2. Những điều học được

| # | Bài học | Ý trong video |
|---|---|---|
| 1 | **Hiệu ứng vì hiệu ứng là thừa** | Đường kẻ chạy theo khi cuộn, sao băng, nút chạy theo con trỏ: làm vì AI làm hộ dễ quá, không giúp khách hiểu sản phẩm, còn kéo mắt khỏi nội dung. |
| 2 | **Không để nội dung tự chạy theo giờ** | Khối nội dung tự đổi theo bộ đếm giờ, khách không kịp đọc, không biết bấm vào đâu. Cuộn trang đã là chuyển động, không cần thêm hiện dần (fade-in) cho từng khối; cuộn nhanh còn có thể lướt qua nội dung chưa kịp hiện. |
| 3 | **Không chiếm quyền cuộn trang** | Trang giữ khách lại ở một chỗ để chạy hoạt ảnh ("như lội trong mật"), khách không biết mình đã đọc tới đâu. |
| 4 | **Hiệu ứng rê chuột phải làm nút nổi lên, không làm nó mờ đi** | Trình duyệt đã đổi con trỏ thành bàn tay. Nếu thêm hiệu ứng thì chỉ sáng hơn một chút. Không giấu thông tin hay chức năng quan trọng sau rê chuột, vì điện thoại không có rê chuột. |
| 5 | **Dòng tiêu đề chính (H1) phải nói rõ** | Ngay màn đầu: đây là gì, cho ai, vì sao họ nên quan tâm, và một nút hành động. |
| 6 | **Thứ bậc chữ gọn** | Không chèn thêm nhãn nhỏ phía trên tiêu đề ("Meet X") làm thành 4–5 kiểu chữ. |
| 7 | **Dấu hiệu "do AI làm"** | Dải màu tím, emoji làm biểu tượng, lưới thẻ có biểu tượng phía trên (bento 3×2), bảng số liệu giả với các ô màu đỏ/vàng/xanh, số "10x" bịa đặt. Không sai, nhưng ai cũng dùng nên mất bản sắc và mất lòng tin ("họ làm web bằng AI, vậy sản phẩm thật có tốt không?"). |
| 8 | **Nhất quán hình ảnh** | Mỗi phần trang một kiểu là dấu hiệu ghép từ nhiều lần nhờ AI. Ảnh phải nét và chất lượng cao. |
| 9 | **Kiểm tra kỹ (QA) từng tương tác** | Các trang có lỗi nhỏ (chọn sai mục, phần bấm được phần không) mà người viết tay sẽ thấy ngay. Người làm phải tự bấm thử từng thứ. |
| 10 | **Bắt đầu từ thương hiệu, không từ thứ AI đưa ra** | Chọn màu, thương hiệu, thông điệp trước rồi đưa cho AI, thay vì nhận đầu ra rồi sửa. Thời gian AI tiết kiệm được nên dùng để nghĩ thông điệp và sản phẩm. |
| 11 | **Trang web là kênh kiếm khách** | Mục đích là khách hiểu và mua, không phải để trông "ngầu". |
| 12 | **Thanh điều hướng trên nền thay đổi** | Đầu trang trong suốt đặt trên ảnh hoặc video sẽ khó đọc khi nền đổi màu. |
| 13 | **Dùng AI đúng chỗ thì rất tốt** | Ví dụ được khen: hoạt ảnh trên thẻ giúp củng cố đúng điều sản phẩm muốn nói, hoặc cho khách thử sản phẩm ngay trên trang. |

## 3. Đối chiếu với website Tân Trường Tín

Đánh dấu: ✅ đang làm đúng · ⚠️ nên xem lại · ❌ đang mắc.

| Bài học | Hiện trạng web | Đánh giá |
|---|---|---|
| Không dải màu tím, không emoji | Màu trắng ấm + xanh cobalt, biểu tượng lucide | ✅ |
| Không chiếm quyền cuộn | Không có | ✅ |
| Không số liệu bịa | Không có cam kết hay số "10x"; voucher trống thay vì mã giả | ✅ |
| Ảnh thật, nét | 24 SP mẫu và 10 ảnh ngành nền trắng; quạt/ấm còn dùng hình minh họa SVG | ⚠️ cần ảnh tự chụp |
| **Nội dung tự chạy theo giờ** | Băng ngành hàng trang chủ **tự chuyển sau 4 giây** (vừa làm theo yêu cầu) | ⚠️ đúng điều video phê bình. Đã có dừng khi chạm/rê và tôn trọng giảm chuyển động, nhưng khách vẫn có thể đang đọc thì ô bị chuyển |
| **Hiện dần khi cuộn** | Thẻ sản phẩm có hiệu ứng `anim-card-in` khi tải thêm; trang có `page-enter` mờ dần | ⚠️ nhẹ, nhưng nên kiểm tra không có nội dung nào bị ẩn chờ hiện |
| Hiệu ứng gây chú ý | Vòng sáng nút ☰ chạy 3 lần, một lần duy nhất cho khách mới | ✅ chấp nhận được: có mục đích (giúp tìm menu), không lặp lại |
| **H1 nói rõ là gì, cho ai** | H1 trang chủ đang **ẩn** (`sr-only`), khách chỉ thấy banner "Chọn đúng món, mua thật dễ" | ⚠️ banner chưa nói rõ shop bán gì, ở đâu. Nên ghi rõ "Điện nước, kim khí, quạt, gia dụng tại Nha Trang" |
| Không giấu chức năng sau rê chuột | Nút so sánh, yêu thích luôn hiện | ✅ |
| Không lưới thẻ có biểu tượng | Đã bỏ thẻ ngành biểu tượng ngôi nhà, thay bằng ảnh sản phẩm | ✅ |
| Nhất quán | Hệ thiết kế v2 dùng chung; giao diện máy tính chưa rà kỹ sau đợt đổi | ⚠️ |
| QA từng tương tác | Đã thử trên máy thử; chưa thử trên điện thoại thật | ⚠️ |
| Bắt đầu từ thương hiệu | Màu và luật thiết kế có từ `docs/DESIGN.md`; logo đang hoãn | ⚠️ |

## 4. Đề xuất áp dụng (xếp theo lợi ích)

1. **Nói rõ shop bán gì ngay màn đầu.** Đổi câu banner thành nội dung có thông tin: bán gì, ở Nha Trang, cách mua (gọi/Zalo khi đang tạm ngưng đặt hàng). Giữ một nút hành động chính. Việc nhỏ, lợi nhiều.
2. **Xem lại tự chuyển của băng ngành hàng.** Hai hướng: (a) bỏ tự chuyển, chỉ vuốt; hoặc (b) giữ tự chuyển nhưng dừng hẳn sau khi khách đã vuốt hoặc chạm một lần. Mình nghiêng về (b) vì vẫn giữ ý bạn muốn khách thấy đủ ngành.
3. **Kiểm tra hiện dần.** Bảo đảm mọi nội dung hiện ngay khi trang tải, hiệu ứng chỉ là phần trang trí.
4. **QA trên điện thoại thật** (Android và iPhone): bấm thử từng nút, menu ☰, kéo băng ngành, giỏ hàng, tra cứu đơn. Ghi lỗi vào một danh sách.
5. **Ảnh tự chụp** cho sản phẩm chính và 10 ô ngành, cùng góc chụp, cùng nền.
6. **Rà giao diện máy tính** để chắc hai khổ màn hình cùng một ngôn ngữ thiết kế.
7. **Khi làm Voucher hay khuyến mãi**: chỉ đăng số liệu thật (giá, % giảm, hạn), không dùng chữ "siêu", "khủng", "10x".

## 5. Những gì không áp dụng

- Phần lớn video nói về trang giới thiệu startup phần mềm (sản phẩm demo, bảng số liệu). Web Tân Trường Tín là cửa hàng bán lẻ, nên phần "cho khách thử sản phẩm ngay trên trang" chỉ áp dụng gián tiếp qua bộ lọc, so sánh, kiểm tra phí ship.
