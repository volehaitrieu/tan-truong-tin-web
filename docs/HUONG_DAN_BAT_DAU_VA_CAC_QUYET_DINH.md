# Hướng dẫn bắt đầu và các quyết định đã chốt

**Dự án:** Tân Trường Tín  
**Cập nhật:** 26-10-2026  
**Mục đích:** giúp chủ shop hoặc một công cụ AI khác tiếp tục đúng tiến trình, không hỏi lại những điều đã chốt và không làm vượt phạm vi.

## Đọc theo thứ tự

1. Tài liệu này — quyết định hiện hành và cách bắt đầu task tiếp theo.
2. `docs/PROJECT_DOSSIER.md` — tóm lược toàn bộ dự án, trạng thái và việc còn mở.
3. `docs/PRD.md` — yêu cầu/nghiệp vụ đã duyệt.
4. `docs/DESIGN.md` — bộ nhận diện và quy tắc thiết kế gốc.
5. `docs/superpowers/specs/2026-10-26-desktop-storefront-design.md` — phạm vi và hướng redesign desktop.
6. `docs/AI_TASK_BOARD.md` — trạng thái task và nhật ký bàn giao giữa các AI.
7. `docs/MENTOR_LOG.md` — lịch sử dự án; dùng để bổ sung bối cảnh, không thay cho trạng thái đã xác minh hiện tại.

## Quyết định chủ shop đã chốt

### Trang chủ và khám phá sản phẩm

- Giữ **bố cục trang chủ v3** đã duyệt và thứ tự các khu vực theo `docs/DESIGN.md`.
- Nâng cấp **trang chủ và khu khám phá sản phẩm**, gồm điều hướng danh mục, danh sách/bộ lọc và thẻ sản phẩm.
- Bắt đầu với **desktop**. Chỉ thiết kế/chỉnh responsive cho mobile sau khi chủ shop xem và duyệt desktop.
- Ảnh Điện Máy Xanh và Nguyễn Kim do chủ shop cung cấp là tham khảo cho hành vi/bố cục: cách đi vào danh mục và cách quét thông tin mặt hàng. Không sao chép logo, bảng màu, nội dung quảng cáo, hình sản phẩm hay mã của họ.
- Dùng ảnh/dữ liệu/chức năng thật của Tân Trường Tín. Giữ nguyên route, lọc, tìm kiếm, sắp xếp, giỏ hàng, trạng thái tồn và thông tin cửa hàng; không tự tạo đánh giá, số đã bán hoặc khẳng định thương mại.
- Dùng Hallmark và Taste xuyên suốt công việc giao diện. Ưu tiên cảm giác chỉn chu, có cá tính; hiệu ứng chuyển động nhẹ, nhanh, có hỗ trợ `prefers-reduced-motion`. Có thể tạo cảm giác bề mặt bóng nhẹ bằng phân tầng nền, ảnh nền sản phẩm, viền/focus/hover tinh tế; tránh hiệu ứng nặng và tránh tự ý đổi màu/logo/brand tokens.
- Lazy loading đã được chấp thuận: để ảnh ngoài vùng nhìn tải trễ bằng cơ chế native nếu cần; không trì hoãn ảnh hero/LCP hoặc ảnh đang hiện đầu trang. Kiểm tra cách `next/image` hiện tại trước khi thêm cấu hình để tránh làm thừa.

### Cách phối hợp AI

- **Claude Code:** lập kế hoạch, chia bước, code các phần phức tạp và tích hợp. Task đầu tiên chỉ khảo sát/lập kế hoạch, chưa sửa tệp.
- **Antigravity:** đề xuất và thực hiện nâng cấp giao diện hoặc thay đổi nhẹ sau khi kế hoạch được chủ shop duyệt.
- **ChatGPT:** rà soát phòng thủ trên diff/repository hoặc staging được phép; nêu bằng chứng, mức độ và đề xuất. Không tự xâm nhập mục tiêu tùy ý.
- **Chủ shop:** duyệt kế hoạch, xem desktop, quyết định chấp nhận thay đổi, và duyệt merge/deploy. Không AI nào tự triển khai production.
- Ponytail review được dùng để rà thay đổi đã code; không thay thế việc chủ shop xem giao diện desktop.
- Hiện tại quy trình là **thủ công, local, không API/dashboard**: chủ shop chuyển brief và kết quả giữa công cụ rồi ghi trạng thái vào bảng. Dùng quota/gói tài khoản sẵn có; lượt API hoặc công cụ trả phí phát sinh ngoài quy trình này không được mặc định bật.

## Việc kế tiếp — AI-001

Mở `docs/AI_TASK_BOARD.md`. Task `AI-001` đã được điền sẵn: Claude Code khảo sát desktop storefront và viết kế hoạch. Gửi prompt dưới đây cho Claude Code cùng dự án/repository:

```text
Hãy thực hiện task AI-001 theo docs/HUONG_DAN_BAT_DAU_VA_CAC_QUYET_DINH.md và bản đề xuất docs/superpowers/specs/2026-10-26-desktop-storefront-design.md.

Ở bước này chỉ đọc/khảo sát giao diện desktop hiện tại và lập kế hoạch. Chưa sửa file, chưa chạy migration, không truy cập/ghi dữ liệu production và không deploy.

Hãy nêu route/component liên quan, hiện trạng có thể xác minh, thứ tự thực hiện, tệp dự kiến thay đổi, tiêu chí hoàn thành, cách xem trước desktop cho tôi duyệt và rủi ro. Giữ bố cục trang chủ v3, chỉ trong phạm vi desktop homepage + product discovery, bảo toàn chức năng/dữ liệu hiện có. Đề xuất dùng Hallmark và Taste trong bước thiết kế; không làm mobile cho tới khi tôi duyệt desktop. Dừng sau khi lưu kế hoạch Markdown trong docs/superpowers/plans/ để tôi duyệt.
```

### Sau khi nhận kế hoạch

1. Ghi đường dẫn kế hoạch vào task `AI-001`, chuyển trạng thái sang `Chờ bạn duyệt`.
2. Nếu kế hoạch đúng phạm vi, chủ shop phản hồi duyệt. Nếu chưa, ghi các điểm cần sửa và yêu cầu Claude cập nhật plan; chưa giao Antigravity implement.
3. Sau khi duyệt plan, giao Antigravity thực hiện đúng phần desktop. Ghi tệp/nhánh và đường dẫn preview vào bảng.
4. Xem preview desktop, ghi sửa đổi nếu cần. Lặp tới khi chủ shop chấp nhận.
5. Chạy các kiểm tra đã thống nhất và dùng Ponytail review; nhờ ChatGPT rà diff nếu có thay đổi bảo mật/logic liên quan.
6. Chỉ sau khi desktop được duyệt mới mở task mobile riêng. Merge/deploy là quyết định riêng của chủ shop.

## Ghi chú an toàn và điểm phải xác minh

- Không đưa mật khẩu, API key, cookie, `.env.local`, dữ liệu khách hàng hay database dump vào task, prompt, nhật ký hoặc ZIP. Luân chuyển mật khẩu từng được dán trong hội thoại.
- Kiểm thử bảo mật chỉ trên code của dự án hoặc staging được ủy quyền, có phạm vi rõ. Không tự pentest website production.
- Tài liệu lịch sử không thống nhất về trạng thái triển khai (một báo cáo ghi bản thử trên máy, nhật ký khác ghi đã đưa lên Vercel). Trước mọi thay đổi live, hãy xác minh lại URL, chứng chỉ, biến môi trường và backup.
- Trạng thái áp dụng migration mới nhất lên Supabase production cũng chưa xác minh trong lần tổng hợp này. Không chạy lại migration chỉ dựa trên hồ sơ cũ.
- Gói AI task board không tạo liên lạc tự động giữa ba dịch vụ và không cung cấp API miễn phí; đây chỉ là quy trình chuyển giao thủ công.
