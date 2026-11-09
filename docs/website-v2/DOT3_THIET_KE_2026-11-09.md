# Đợt 3 — Thiết kế khuyến mãi và mã giảm giá

Ngày: 09/11/2026. Worktree: website-v2, nhánh worktree-website-v2, nền commit 1e4b213.
Trạng thái: CHỈ THIẾT KẾ. Chủ shop đã duyệt 4 quy tắc kinh doanh bên dưới; chi tiết kỹ thuật và thay đổi DB trong tài liệu này là đề xuất chờ duyệt. Chưa sửa mã ứng dụng, chưa tạo/chạy migration, chưa ghi DB, commit, push hoặc deploy.

## 1. Quy tắc đã được chủ shop duyệt

1. Một mã mỗi đơn; không giảm thêm trên sản phẩm đang có giá khuyến mãi.
2. Mã giảm tiền hàng, không giảm phí giao; ngưỡng miễn phí giao tính trên tiền hàng sau giảm.
3. Ghi nhận lượt khi tạo đơn thành công; đơn do shop xác nhận hủy được hoàn lượt đúng một lần và có lịch sử.
4. Giới hạn tổng lượt mỗi mã; chưa giới hạn mỗi người vì chưa có tài khoản khách xác thực.

Không thay đổi giao diện lớn. Giữ nền #fffbf7, nút #1b1b1b, ưu tiên 375px, chữ >=12px và vùng bấm >=40px. Đợt 4–5 chưa thuộc phạm vi.

## 2. Đã đối chiếu mã nguồn, chưa đối chiếu DB thật

- products đã có sale_price, sale_from, sale_to; ProductForm và actions sản phẩm đã có ô nhập, kiểm giá giảm thấp hơn giá bán.
- lib/catalog.ts dùng ngày UTC; private.effective_price trong migration dùng current_date. Cần một định nghĩa ngày Việt Nam thống nhất, không phụ thuộc múi giờ máy chạy.
- place_order tính lại giá sản phẩm trong Postgres và ghi unit_price vào order_items; chưa có mã giảm giá trong payload của ứng dụng hiện tại.
- orders có subtotal, shipping_fee; nhiều màn quản trị cộng trực tiếp hai trường này. lib/admin/reports.ts cộng subtotal làm doanh thu hàng.
- order_set_status khóa đơn, kiểm quyền và có luồng hủy/hoàn tồn. Hoàn lượt mã phải thêm vào cùng giao dịch, kể cả đơn hủy khi còn pending.
- ThankYou đọc bản đơn từ sessionStorage và truyền order.total cho BankQr. Phải đổi nguồn dữ liệu xác nhận/QR sang kết quả đơn đã lưu được đọc lại qua luồng tra cứu, không coi số tiền trong storage là nguồn đáng tin.
- Các kết luận trên dựa trên tệp trong worktree; lịch sử migration có thể khác DB đang chạy. Chưa kết nối DB hoặc chạy kiểm thử tạo đơn.

## 3. Cách tính tiền đề xuất

Ký hiệu: S = tổng tiền hàng theo giá đang có hiệu lực; E = phần tiền hàng đủ điều kiện dùng mã; D = giảm từ mã; N = S - D; F = phí giao.

- Hàng có khuyến mãi đang hiệu lực vẫn tính vào S nhưng không tính vào E. Giỏ hỗn hợp vẫn áp mã cho phần E; không từ chối toàn bộ giỏ.
- Đề xuất điều kiện đơn tối thiểu của mã kiểm trên E. Hiển thị rõ “Áp dụng từ … tiền hàng chưa khuyến mãi”. Đây là chi tiết đề xuất, không ghi là chủ shop đã chốt.
- Mã phần trăm: D = min(E, floor(E × phần_trăm / 100), trần_giảm nếu có). Tính một lần trên E, làm tròn xuống đơn vị đồng.
- Mã số tiền: D = min(E, số_tiền_của_mã). Không cho tiền hàng âm. E=0 hoặc D=0 thì báo mã chưa áp dụng được, không tiêu lượt.
- Tổng khi phí giao đã biết = N + F. Phí giao chưa biết là null, hiển thị “Tiền hàng sau giảm …; phí giao báo sau”, không thay null bằng 0 và gọi đó là tổng cuối cùng.
- Ngưỡng miễn phí giao áp dụng N, giữ nguyên phạm vi giao hàng hiện có; không tự mở rộng ra mọi tỉnh.
- Ví dụ dữ liệu giả: hàng giá thường 500.000đ + hàng đang giảm còn 300.000đ, mã 10% => S=800.000đ, E=500.000đ, D=50.000đ, N=750.000đ. Phí giao cộng sau, không bị giảm bởi mã.

Ngày sản phẩm: bắt đầu 00:00 ngày Từ, kết thúc hết ngày Đến theo Asia/Ho_Chi_Minh. Chương trình mới yêu cầu đủ hai ngày, ngày kết thúc không trước ngày bắt đầu; không tự sửa chương trình cũ thiếu ngày. Ngày thiếu trong dữ liệu cũ cần kiểm kê và báo chủ shop trước khi siết ràng buộc.

Mã mới: ngày bắt đầu/kết thúc và tổng lượt tối đa bắt buộc; giao diện nhập ngày Việt Nam, DB lưu timestamptz theo khoảng [starts_at, ends_at). Giới hạn có hiệu lực tại thời điểm kiểm cuối sau khi chờ khóa. Hết hạn không cần tác vụ định kỳ để đổi cờ: tính từ thời gian mỗi lần đọc/đặt hàng.

Giá thông thường trên thẻ và giá khuyến mãi không bao gồm mã riêng của khách. Không đưa giá sau mã lên thẻ vì khách khác có điều kiện khác nhau.

## 4. Giao diện khách và quản trị

### Giỏ hàng / thanh toán — 375px

Trong phần tóm tắt: [Nhập mã giảm giá] [Áp dụng], sau đó Tiền hàng / Giảm giá (mã) / Tiền hàng sau giảm / Phí giao / Tổng nếu biết đủ phí.

Trạng thái: chưa nhập; đang kiểm; đã áp dụng + nút Bỏ mã; mã không dùng được; chưa đủ tiền hàng; không có món đủ điều kiện; mã đã hết hạn/hết lượt; lỗi kết nối. Có role=status cho phản hồi, role=alert cho lỗi cần xử lý; nhãn ô nhập hiển thị, focus không tự nhảy khi kiểm xong.

- Đổi số lượng, bỏ/thêm hàng, đổi cách giao hoặc quay lại trang: tính lại trên máy chủ. Không dùng kết quả phản hồi cũ ghi đè giỏ mới. Không cho đặt khi kết quả tiền đang chờ cập nhật.
- Chỉ lưu chuỗi mã để tiện đi tiếp; mọi số tiền lưu trong trình duyệt chỉ là hiển thị tạm, phải được máy chủ xác nhận lại.
- Bấm Áp dụng không giữ/trừ lượt. Không hứa mã còn lượt đến lúc đặt.
- Nếu mã không còn hợp lệ khi đặt: chưa tạo đơn, giải thích và cho bỏ mã hoặc đổi mã. Không tự tạo đơn không giảm giá.
- Nếu giá/phí thay đổi: trả bảng tiền mới, chưa ghi đơn; khách xem lại và bấm xác nhận lần nữa.
- Thanh đáy hiện tổng theo kết quả máy chủ; không thêm thanh nổi mới. Trên điện thoại khi nhập và bàn phím mở, giữ cách ẩn thanh đặt hàng hiện có, bảo đảm thấy lỗi tại ô mã.

### Quản trị

- Tận dụng form sản phẩm hiện có. Tách quyền sửa khuyến mãi thành kiểm tra chủ shop tại server và DB; quyền sửa giá thường hiện có không tự đồng nghĩa được đổi khuyến mãi.
- Mục Mã giảm giá: mã (chữ Latin/số/gạch nối, chuẩn hóa viết hoa), loại giảm, giá trị, mức đơn tối thiểu, trần giảm cho mã %, hai ngày, tổng lượt, bật/tắt; hiển thị lượt đã dùng ròng và lịch sử đã dùng/đã hoàn.
- Chỉ chủ shop tạo/sửa/tắt mã; không có nút xóa mã đã dùng. Không đổi tên mã sau tạo để giữ lịch sử rõ ràng. Không hạ giới hạn dưới số lượt đang dùng.
- Mọi thay đổi có ghi nhận người/thời gian. Đơn cũ không tính lại khi sửa mã.
- Excel có Giá khuyến mãi / Từ ngày / Đến ngày và bản xem trước: thiếu cột = giữ nguyên, ô trống = không thay đổi; thao tác xóa chương trình phải được đánh dấu riêng, không tự suy từ ô rỗng. Đọc/ghi trường khuyến mãi cần quyền chủ shop cả ở hàm nhập DB. Tiền tính bằng đồng; không áp nhầm quy tắc nhân 1.000 từ các cột giá nhập cũ sang cột mới.
- Về giới hạn theo người: người mua có thể dùng nhiều lần, mỗi lần vẫn chiếm một lượt; không trình bày như chương trình một người một lần.

## 5. Nội dung thay đổi DB dự kiến — chưa phải SQL để chạy

| Đối tượng | Trường/ràng buộc dự kiến | Mục đích |
|---|---|---|
| private.promotion_codes | id; code unique; kind percent/fixed; value; min_eligible_subtotal; max_discount nullable; starts_at; ends_at; usage_limit; used_count; enabled; created_by; timestamps | Luật chương trình; không công khai danh sách mã |
| private.promotion_redemptions | order_id unique; promotion_id; discount_amount; redeemed_at; released_at; released_by | Một mã mỗi đơn, hoàn đúng một lần |
| private.checkout_requests | request_key UUID unique; payload_fingerprint; order_id unique; created_at | Gửi lại cùng lần đặt không tạo đơn/trừ lượt lần hai |
| public.orders | promotion_id nullable; promotion_code_snapshot; promotion_rule_snapshot; discount_amount bigint default 0 | Giữ subtotal cũ là trước mã; lưu khoản giảm bất biến |
| public.order_items | promotion_discount bigint default 0 | Phân bổ giảm mã để báo cáo theo sản phẩm cộng khớp tổng đơn |

Ràng buộc: số tiền nguyên không âm; 0 <= discount_amount <= subtotal; percent trong 1..100; giá trị fixed >0; usage_limit >0; 0 <= used_count <= usage_limit; ends_at > starts_at; mã chỉ chứa ký tự được cho phép và giới hạn độ dài (đề xuất 3..32). FK giữ lịch sử, không xóa dây chuyền chương trình/đơn đã có lượt sử dụng.

Phân bổ giảm vào dòng hàng đủ điều kiện: chia theo tỷ trọng E, lấy phần nguyên, phân phối đồng dư theo phần lẻ lớn nhất với thứ tự SKU ổn định để phá hòa. Tổng phân bổ phải đúng D; dòng đang giảm giá nhận 0. Giữ unit_price trước mã và subtotal hiện hữu; báo cáo doanh thu tiền hàng ròng = subtotal - discount_amount. Đơn cũ được mặc định giảm 0, không tính lại giá cũ.

Các hàm dự kiến:
- quote_order: chỉ đọc, tính toàn bộ bảng tiền từ SKU/số lượng/cách giao/mã; không tạo đơn hoặc giữ lượt. Trả dữ liệu tối thiểu, không trả cấu hình riêng hay danh sách mã. Đầu vào có giới hạn độ dài/số dòng.
- place_order: dùng cùng một lõi tính giá với quote_order; kiểm chốt trong giao dịch, ghi đơn, khoản giảm, redemption và request_key cùng nhau.
- order_set_status: bổ sung hoàn lượt khi chuyển sang cancelled hợp lệ, trong cùng giao dịch đổi trạng thái/hoàn tồn.
- lookup_order và kết quả place_order: bổ sung khoản giảm, tiền hàng ròng, phí giao và tổng/giá trị chưa xác định; kiểm mã đơn + SĐT như hiện tại, không mở đường đọc đơn tùy ý.
- RPC quản trị mã: kiểm private.is_owner bên trong hàm, không chỉ ẩn nút trên giao diện. Chủ shop sửa rule/limit dùng cùng khóa hàng mã như đặt đơn.
- private.effective_price và lõi giá thống nhất ngày Việt Nam; rà cả POS và preview quản trị vì đang dùng chung tính giá. Mã voucher đợt này chỉ áp cho đơn web, không tự thêm vào bán quầy.

Quyền: private không mở qua Data API; thu hồi quyền trực tiếp của anon/authenticated lên bảng nội bộ, bật RLS phòng thủ. Hàm công khai chỉ cấp EXECUTE cần thiết, revoke mặc định PUBLIC. Hàm đặc quyền bắt buộc search_path rỗng, tên đối tượng đầy đủ và kiểm quyền/đầu vào bên trong; không dùng service-role để né quyền. Không cho client sửa used_count, redemption, discount của đơn. Rà quyền sửa đơn/cột hiện có để tránh lách qua cập nhật trực tiếp.

Không dùng việc truy cập RPC quản trị thành công bằng service-role làm bằng chứng phân quyền đúng. Không cho guest đọc toàn bộ mã; đầu kiểm mã có giới hạn yêu cầu và thông báo không tiết lộ cấu hình riêng. Cần kiểm cả đường gọi RPC trực tiếp, không chỉ lớp Next.js.

## 6. Đặt hàng, cạnh tranh lượt, hủy đơn

1. Chuẩn hóa đầu vào và request_key ngẫu nhiên cho một lần đặt. Fingerprint ràng buộc toàn bộ nội dung chuẩn hóa: khách/giỏ/mã/cách giao/địa chỉ và phương thức thanh toán liên quan.
2. Chống hai yêu cầu cùng key chạy đồng thời bằng khóa giao dịch + unique. Nếu đã có đơn và fingerprint khớp, trả lại kết quả tối thiểu của đơn; nếu khác, báo xung đột. Kiểm này trước khi tính lại giá/hạn mã cho lần gửi lại đã thành công.
3. Đọc/khóa sản phẩm và cấu hình ảnh hưởng tiền theo thứ tự ổn định; khóa hàng mã khi dùng mã, kiểm lại enabled/thời hạn/số lượt sau khi có khóa. Rà thứ tự khóa chung với hủy đơn và sửa chương trình để tránh vòng chờ.
4. Tính lại bảng tiền hoàn toàn trong DB. expected_quote từ trình duyệt chỉ để phát hiện khách đang xem giá cũ, không là nguồn tính tiền hoặc bằng chứng đủ điều kiện.
5. Giá khác/mã không hợp lệ => chưa tạo đơn và chưa tăng lượt; trả lỗi/trích dẫn giá mới phù hợp. Một quote từ trước không giữ giá hoặc giữ lượt.
6. Thành công => đơn + dòng hàng + snapshot + tăng used_count + redemption + request cùng commit. Lỗi giữa chừng phải rollback toàn bộ.
7. Chờ khóa quá lâu => lỗi có thể thử lại với cùng key, không tạo key mới chỉ vì mất mạng. Khi thay nội dung đặt sau kết quả thất bại rõ ràng mới tạo key mới. Không tự gửi đơn lại khi chưa biết lần trước đã thành công hay chưa.
8. Thông báo đơn dựa trên dữ liệu đơn đã lưu. Replay không phát thông báo như đơn mới; lỗi thông báo không làm mất đơn. Đảm bảo gửi tin tuyệt đối một lần cần cơ chế hàng đợi riêng, không tuyên bố có trong đợt này.

Hủy đơn: giữ kiểm quyền cancel_orders hiện có, khóa đơn, kiểm trạng thái chuyển hợp lệ, khóa mã; đánh dấu released_at chỉ khi đang null và giảm used_count đúng một lần. Thao tác hủy lỗi thì không hoàn lượt. Ghi order_events cả đổi trạng thái và hoàn mã. Mã đã hết hạn/tắt vẫn ghi hoàn lượt nhưng không tự bật lại; đơn cancelled không tự hồi sinh. Không hoàn tiền thanh toán tự động — hoàn lượt mã khác với hoàn tiền.

Chống spam đặt đơn giả: giữ các giới hạn đặt hàng hiện có; tổng lượt không phải giới hạn theo người. Không hứa loại bỏ được việc đặt giả chiếm lượt, đặc biệt khi chưa có tài khoản xác thực. Không thêm thời hạn tự hủy đơn trong đợt này.

## 7. Các điểm ứng dụng phải đồng bộ

- lib/catalog.ts, lib/admin/preview.ts và phần đọc giá: ngày Việt Nam, cache không vượt qua mốc đổi giá; giỏ/quote luôn đọc giá mới, tính lại khi quay lại tab hoặc bắt đầu đặt. Không chỉ dựa revalidate sau sửa admin vì chương trình còn hết hạn tự nhiên.
- ProductForm/actions và import/export: quyền, ngày, đơn vị tiền, kiểm tra giá giảm, xem trước thay đổi.
- Giỏ, CheckoutForm, actions.ts, ThankYou, BankQr, tra cứu: cùng DTO tiền từ server. Trang cảm ơn đọc lại đơn qua kiểm tra đang có (mã + SĐT), storage chỉ giúp giữ tham chiếu.
- Phí giao chưa xác định: đề xuất QR thu tiền hàng sau giảm, nhãn “Chưa gồm phí giao”; phí biết rõ thì QR bằng tổng sau giảm + phí. Trường hợp cần thu thêm sau thanh toán là nghiệp vụ hiện có, không tự tạo giao dịch ngân hàng.
- Quản trị danh sách/chi tiết/in phiếu, báo cáo tổng và báo cáo sản phẩm, Telegram: dùng số giảm/snapshot. Không đổi subtotal thành tiền sau mã vì sẽ làm sai cách cộng hiện có.
- Mã và giảm giá trên bản lưu đơn là nguồn hiển thị lịch sử; không dùng sản phẩm/mã hiện tại để dựng lại số tiền đơn cũ.

## 8. Kiểm thử bắt buộc trước đưa lên web

Thuần/offline: giỏ hỗn hợp; không có E; ngưỡng E; mã phần trăm/số tiền/trần giảm; làm tròn và phân bổ đồng dư; phí null/0/có phí; miễn phí giao sau giảm; lịch Việt Nam qua nửa đêm; ngày nhuận/ngày sai; ngày trống dữ liệu cũ; chuẩn hóa mã; payload xấu; không sửa đầu vào.

DB cô lập được duyệt: lượt cuối có hai đơn đồng thời chỉ một đơn nhận mã; rollback không tiêu lượt; duplicate request trả một đơn; cùng key khác payload bị từ chối; hủy hai lần chỉ hoàn một lượt; hủy pending; hủy đồng thời với đặt mới; tắt/hết hạn trong lúc chờ khóa; guest/staff không được sửa mã/bộ đếm/khoản giảm; private không lộ dữ liệu. Không chạy các ca này trên DB thật trong giai đoạn thiết kế.

Giao diện 375px: trạng thái nhập mã, focus và thông báo; thay số lượng khi quote cũ chưa về; nút đặt khóa đúng; mã hết lượt ngay lúc đặt; bàn phím không che lỗi; tổng thanh đáy trùng tóm tắt; F5/Back; storage hỏng; QR/tra cứu/phiếu/báo cáo khớp số tiền; sản phẩm cũ không mã vẫn đặt được; chức năng so sánh đợt 2 không bị ảnh hưởng.

Hồi quy khi có mã triển khai: tsc, ESLint tệp sửa và đúng 5 script đã được phép (26 kiểm thử nền). Kiểm thử mới chỉ chạy sau khi kiểm nội dung là thuần/offline; không dùng wildcard scripts/*.mjs. Chưa chạy kiểm thử nào ở bước thiết kế.

## 9. Trình tự triển khai và cổng duyệt

1. Chủ shop duyệt tài liệu này, đặc biệt điều kiện đơn tối thiểu tính trên E và cách QR khi chưa biết phí giao.
2. Đọc đối chiếu schema/hàm/quyền thực tế bằng luồng chỉ đọc; không in secrets. Chốt danh sách tệp và soạn SQL migration cụ thể cho chủ shop xem. Chưa tự chạy migration.
3. Sau khi được duyệt viết mã: triển khai trên worktree, kiểm thuần, kiểm quyền/đồng thời trên DB cô lập nếu có quyền và môi trường. Không coi dữ liệu thật là môi trường thử.
4. Migration thật, commit/push và deploy là các hành động riêng cần quyền rõ ràng. Chưa có quyền nào cho các hành động này trong lần thiết kế.
5. Phát hành tương thích: DB bổ sung trước, app mới sau, chương trình mã vẫn tắt tới khi kiểm đủ. Sau khi có đơn dùng mã không rollback về app cũ chưa biết discount_amount vì sẽ hiển thị sai tiền; nếu lỗi thì tắt áp mã mới và dùng bản vá vẫn đọc được đơn giảm giá.

Không ghi đè lịch sử đơn hay xóa dữ liệu để rollback. Không tự xử lý các việc treo về ảnh, tài khoản thử, tồn kho, SEO hoặc chính sách.

## 10. Tài liệu kỹ thuật đã tham khảo

- Next.js đóng gói trong worktree: Mutating Data, Data Security; Server Actions phải kiểm quyền và dữ liệu khi nhận yêu cầu trực tiếp.
- https://supabase.com/docs/guides/database/functions — quyền thực thi hàm, security invoker/definer và search_path.
- https://www.postgresql.org/docs/current/explicit-locking.html — khóa hàng/giao dịch và thứ tự khóa để tránh deadlock.
- Changelog Markdown Supabase chưa đọc được bằng công cụ web (không hỗ trợ content-type); cần kiểm lại các thay đổi liên quan trước triển khai. Chưa xác minh phiên bản/schema Supabase thực tế.
