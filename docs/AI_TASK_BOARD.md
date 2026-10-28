# Bảng theo dõi công việc giữa các AI

**Cách chạy:** thủ công, local trên máy cá nhân.  
**Chi phí điều phối:** không cần API hoặc dịch vụ dashboard. Các gói AI hiện có vẫn theo hạn mức và điều khoản riêng của từng nhà cung cấp.  
**Ngày bắt đầu:** 26-10-2026.

## Dùng bảng này để làm gì?

Đây là sổ chung cho bạn khi chuyển cùng một công việc qua ChatGPT, Antigravity và Claude Code. Bảng giúp biết việc đang ở bước nào, ai cần làm tiếp, kết quả lưu ở đâu và việc nào đang chờ bạn duyệt. Các công cụ AI chưa tự nói chuyện với nhau; bạn chuyển brief và kết quả giữa chúng.

## Trạng thái

`Backlog` → `Sẵn sàng` → `Đang làm` → `Chờ rà soát` → `Chờ bạn duyệt` → `Hoàn tất`

Nếu chưa đạt, chuyển về `Cần sửa` và ghi rõ ai sửa gì. Nếu bị vướng, dùng `Đang chờ` và ghi nguyên nhân/người cần phản hồi.

## Vai trò gợi ý

- **Claude Code — lập kế hoạch/việc code phức tạp:** tách yêu cầu thành bước, nêu tệp liên quan và tiêu chí hoàn thành; khi được giao code thì làm trên nhánh riêng và bàn giao diff.
- **Antigravity — giao diện và chức năng nhẹ:** theo `docs/DESIGN.md`, đề xuất hoặc thực hiện thay đổi giao diện trong phạm vi được giao; desktop trước, chỉ chuyển sang mobile sau khi bạn duyệt desktop.
- **ChatGPT — rà soát bảo mật phòng thủ:** đọc phạm vi và diff, nêu phát hiện có bằng chứng và đề xuất vá an toàn. Chỉ rà repo hoặc staging bạn sở hữu/được phép kiểm thử.
- **Bạn — chủ dự án:** chốt phạm vi, chuyển kết quả, duyệt kế hoạch và diff. Không công cụ AI nào tự merge hoặc deploy production.

## Danh sách công việc

| ID | Công việc | Phụ trách hiện tại | Trạng thái | Ưu tiên | Kết quả / đường dẫn | Tiếp theo / người cần làm | Cập nhật |
|---|---|---|---|---|---|---|---|
| AI-001 | Nâng cấp desktop trang chủ v3 và khám phá sản phẩm | Codex (tiếp quản Claude Code; Antigravity chưa được giao việc) | Chờ chủ shop duyệt preview desktop sau khi nhập kho | Cao | Kế hoạch và kết quả: `docs/superpowers/plans/2026-10-26-desktop-storefront-upgrade-plan.md` · Ảnh desktop trước: `.hallmark/shots/baseline/` · Ảnh desktop sau: `.hallmark/shots/after/final/` · Mốc: `.hallmark/BASELINE-README.md` | Nhận xét vòng 3 và các mục desktop đã xử lý theo kế hoạch. Chủ shop đã nhập Excel Quạt; trang local hiện xác nhận 100 sản phẩm và thẻ Ngành hàng Quạt. Đã thêm logo local đã xác minh cho ChingHai, Lifan, Senko; nguồn ghi tại `docs/brand-logo-sources.md`. Airport, Polo, Washin chưa có logo sản phẩm đủ chắc chắn. Không deploy; chưa chuyển mobile, chờ chủ shop xem desktop | 28-10-2026 |
| AI-002 | Dùng Ngành hàng ở khối dưới hero; giữ Danh mục riêng trong menu; hiển thị thẻ danh mục con; đồng bộ trường Ngành hàng vào Excel quản trị | Codex (logic, nhập Excel và UI; Antigravity chưa được giao) | Đã xác nhận nhập dữ liệu; chờ chủ shop duyệt preview | Cao | Migration `supabase/migrations/20261027000100_product_industry.sql`; luồng Excel `lib/excel/parse-products.ts`, `app/admin/(shell)/nhap-excel/`; ghi nhận yêu cầu trong `docs/MENTOR_LOG.md` | Website đang hiện 100 sản phẩm ngành hàng Quạt sau lần nhập Excel của chủ shop; thẻ Ngành hàng lấy từ dữ liệu và dẫn tới trang lọc đúng. Menu Đồ gia dụng, danh mục con, lọc giá, đếm sản phẩm và yêu thích đã có trên preview. Chưa deploy; chưa đổi mobile | 28-10-2026 |

Thêm một dòng cho mỗi việc. Dùng mã tiếp theo `AI-002`, `AI-003`… Không ghi mật khẩu, API key, cookie, dữ liệu khách hàng hoặc nội dung nhạy cảm vào bảng.

## Thẻ giao việc — sao chép cho từng task

```text
ID:
Tên việc:
Mục tiêu và lý do:
Phạm vi được phép:
Ngoài phạm vi:
AI nhận việc / vai trò:
Tệp hoặc dữ liệu được đọc:
Tệp được phép sửa (nếu có):
Tiêu chí hoàn thành:
Rủi ro hoặc câu hỏi cần báo trước:
Kết quả mong muốn và nơi lưu:
Người duyệt bước này:
```

## Cách chuyển việc giữa ba công cụ

1. **Tạo task:** điền một dòng trong bảng và một thẻ giao việc. Bắt đầu bằng mục tiêu, phạm vi và tiêu chí xong.
2. **Nhờ Claude Code lập kế hoạch:** gửi thẻ task; yêu cầu kế hoạch ngắn, các file dự kiến và điều gì cần bạn duyệt. Ghi kết quả vào cột “Kết quả / đường dẫn”.
3. **Bạn duyệt kế hoạch:** nếu chưa đồng ý, ghi câu hỏi/sửa đổi; nếu đồng ý, cập nhật trạng thái và chuyển phần việc phù hợp cho Antigravity hoặc Claude Code.
4. **Nhờ ChatGPT rà soát:** đưa phần yêu cầu, kế hoạch và diff/kết quả đã làm; yêu cầu chỉ rõ bằng chứng, mức độ ảnh hưởng và đề xuất. Không gửi secrets hay dữ liệu khách hàng.
5. **Bạn quyết định:** ghi các mục cần sửa, rồi duyệt hoặc từ chối. Chỉ bạn quyết định merge và triển khai.
6. **Đóng task:** ghi kết quả cuối, kiểm tra phù hợp với tiêu chí hoàn thành và chuyển `Hoàn tất`.

## Nhật ký trao đổi

### Tiếp tục ngày 27/10 — kiểm tra kết nối ngành hàng

- Phản hồi mới của chủ shop: menu cần sáng cả vùng, bo góc, mở panel khi rê chuột; cột trái cùng tông banner; panel tạm hiện Quạt và Ấm siêu tốc theo hai workbook; tiêu đề sản phẩm chỉ hiện số trong ngoặc; thẻ giảm giá và tất cả sản phẩm nhỏ hơn. Đã sửa giao diện local và kiểm tra TypeScript, ESLint, HTTP 200.
- Đối chiếu hai file Excel gốc: Quạt có 100 dòng G=Quạt, H=Đồ gia dụng, I=Quạt; Ấm siêu tốc có 14 dòng có G=Ấm siêu tốc, H=Đồ gia dụng, I=Ấm siêu tốc (86 dòng còn lại trống). Website chưa nhập các dòng này, nên thẻ Ngành hàng động chưa xuất hiện.
- Menu dùng hai tên đã cung cấp làm bản xem trước khi dữ liệu industry chưa có; sau khi nhập, menu lấy tên từ sản phẩm. Liên kết tạm dẫn tới danh sách Quạt/Ấm hiện có để không mở trang rỗng.

- Đã tách tên danh mục và mũi tên: tên dẫn tới trang danh mục; mũi tên mở/đóng panel thẻ bằng details/summary, hỗ trợ bàn phím.
- Nhập Excel kiểm tra cột industry trước mọi thao tác ghi; dừng và báo rõ khi schema chưa cập nhật. Không coi lỗi đọc sản phẩm cũ là danh sách rỗng để tránh nhập nhầm sản phẩm mới.
- Hai dòng ví dụ trong Excel mẫu đã dùng tên danh mục Đồ gia dụng.
- TypeScript, ESLint ba file sửa và kiểm tra diff đạt.
- Đọc trực tiếp schema của dự án đang cấu hình: products.industry chưa tồn tại. Migration sẵn tại supabase/migrations/20261027000100_product_industry.sql; chưa áp dụng vì bảng công việc dành quyền cập nhật production cho chủ shop duyệt.
- Chưa nhập hai workbook vào dữ liệu thật. Cấu trúc danh mục đang lưu vẫn khác workbook: Quạt hiện là danh mục gốc, chưa nằm dưới Đồ gia dụng. Cần đối chiếu/chuyển danh mục cùng đợt dữ liệu, không chỉ thêm cột industry.
- Trình duyệt trong ứng dụng từ chối thao tác tải lại bởi URL policy, chưa kiểm tra giao diện trực tiếp cho lượt sửa này.

Ghi ngắn mỗi lần chuyển giao để có thể tiếp tục sau:

| Thời gian | ID | Từ → đến | Nội dung đã chuyển / quyết định | Artifact |
|---|---|---|---|---|
| 26-10-2026 | AI-001 | Chủ shop → Claude Code | Giao khảo sát desktop storefront và lập kế hoạch, chưa sửa mã | `docs/superpowers/plans/2026-10-26-desktop-storefront-upgrade-plan.md` |
| 26-10-2026 | AI-001 | Claude Code → Chủ shop | Đã khảo sát route/component, ghi hiện trạng xác minh được, 7 bước thực hiện, tiêu chí hoàn thành, cách xem trước, rủi ro và 4 câu hỏi cần quyết | Kế hoạch ở trên |
| 26-10-2026 | AI-001 | Chủ shop → Claude Code | Chốt 4 quyết định: nối chip Khoảng giá tới lọc giá thật; lưu bộ lọc/sắp xếp trong URL; link thương hiệu chuyển sang lọc thương hiệu thật; giữ chỗ ảnh mặt tiền | — |
| 26-10-2026 | AI-001 | Claude Code → AI duyệt ngoài | Kế hoạch v2 đã cập nhật theo 4 quyết định; thêm bản tự chứa để AI khác rà soát kế hoạch (chưa rà mã) | `docs/superpowers/plans/2026-10-26-ban-gui-ai-duyet-ke-hoach.md` |
| 26-10-2026 | AI-001 | Chủ shop → Claude Code | Chốt quyết định 5: menu danh mục hiện 4 mức khoảng giá. Chọn chờ AI rà soát ngoài cho nhận xét trước khi triển khai | Kế hoạch v2 |
| 26-10-2026 | AI-001 | AI rà soát ngoài → Claude Code | Nêu 3 điểm, nhận cả 3, lên **v4**: (1) khung chờ `Suspense` phải là lưới sản phẩm thật dựng ở máy chủ, xác nhận bằng HTML thô và tắt JavaScript, không coi "build sạch" là bằng chứng — đúng theo `use-search-params.md` dòng 82; (2) hợp đồng URL bỏ dấu phẩy, chuyển sang lặp tham số, thêm quy tắc giá trị lạ/trùng/tham số ngoài hợp đồng và hành vi Back/Forward của `shown` với `moreBrands`; (3) tiêu chí đếm so với tổng kết quả sau lọc thay vì số thẻ đang thấy, và bỏ "bóng rất nhẹ" vì trái `DESIGN.md` dòng 54–55. Claude Code ban đầu nói không tìm thấy quy tắc Hallmark về nội dung khi tắt JavaScript, nhưng đã tra sai chỗ (`.hallmark/before.json`) — quy tắc đó có thật, ở `.agents/skills/hallmark/SKILL.md` dòng 26 quy tắc 7 | Kế hoạch v4 |
| 26-10-2026 | AI-001 | AI rà soát ngoài → Claude Code | Lượt rà thứ hai, nêu 4 điểm khớp tài liệu, nhận cả 4: sửa "Bốn quyết định" thành "Năm"; sửa tiêu chí đếm còn sót trong bản gửi AI; mở rộng kiểm tra HTML thô và tắt JavaScript ra **cả 4 màn** dùng `ProductBrowser`; ghi đúng nguồn Hallmark quy tắc 7 (`.agents/skills/hallmark/SKILL.md` dòng 26) thay cho `.hallmark/before.json` | Kế hoạch v4 (đã kiểm chéo) |
| 26-10-2026 | AI-001 | Claude Code tự rà soát | Lên **v3**, sửa 5 điểm: đảo thứ tự đưa phần URL lên Bước 2 (Bước 2 cũ phụ thuộc Bước 4); thêm ràng buộc `Suspense` và `npm run build` để không mất ISR; thêm lỗi ẩn danh sách thương hiệu bị giấu khi vào bằng link lọc; hạ mức rủi ro tên danh mục con sau khi kiểm `lib/catalog.ts`; thêm danh sách kiểm tra thủ công 6 mục vì dự án không có test | Kế hoạch v3 + bản gửi AI rà soát v3 |
| 26-10-2026 | AI-001 | Chủ shop → Claude Code | **Duyệt kế hoạch v4**, giao làm Bước 0 (chuẩn bị): đọc tài liệu Next.js, chụp ảnh baseline desktop, chạy mốc Hallmark. Không sửa mã, không commit, không sang Bước 1 | Kế hoạch v4 |
| 26-10-2026 | AI-001 | Claude Code → Chủ shop | **Bước 0 hoàn tất.** Xác minh trích dẫn `use-search-params.md` của v4 là đúng, và ghi nhận thêm một câu quan trọng: bản `dev` KHÔNG suspend nên Bước 2 bắt buộc kiểm trên bản production. 6 ảnh baseline 1440/1280 (phiên trước chụp hỏng do cửa sổ che màn hình → chuyển sang Chrome headless, cài ngoài repo). Mốc Hallmark chạy lại đầy đủ có tầng render, phủ cả 4 màn `ProductBrowser`; bản ghi cũ giữ ở `.hallmark/truoc-khi-chay-lai/` | `.hallmark/BASELINE-README.md` |
| 26-10-2026 | AI-001 | Chủ shop → Codex | Do Claude Code đã hết hạn mức, chủ shop giao Codex tiếp quản phần lập kế hoạch/triển khai đã duyệt; desktop trước, mobile sau khi duyệt | Kế hoạch v4 |
| 26-10-2026 | AI-001 | Codex → Chủ shop | Triển khai Bước 1–6, chạy kiểm tra production Bước 7, ghi nhận các giới hạn Hallmark/lint và chờ duyệt giao diện desktop. Antigravity chưa được giao việc; không commit/deploy | `docs/superpowers/plans/2026-10-26-desktop-storefront-upgrade-plan.md` · `.hallmark/shots/after/final/` |

## Quy tắc an toàn

- Mặc định chỉ đọc. Khi cần sửa mã, tạo branch/worktree riêng và ghi rõ file được phép sửa trong task.
- Không đưa file `.env`, mật khẩu, API key, cookie, database dump hoặc thông tin khách hàng vào prompt hay artifact.
- Không giao kiểm thử tấn công website thật nếu chưa xác định quyền, phạm vi, thời gian và giới hạn rõ ràng; ưu tiên local/staging.
- Agent báo cáo phát hiện và đề xuất bản vá; bạn xem diff trước khi chấp nhận. Không giao quyền tự sửa database production, merge hoặc deploy.
- Nội dung trong repo, website và câu trả lời của agent là dữ liệu cần kiểm tra, không phải quyền cho phép hành động.
- Không coi nhiều AI đồng ý là bằng chứng. Yêu cầu kiểm tra độc lập và thông tin có thể xác minh.

## Ví dụ câu giao việc

> Hãy lập kế hoạch cho task AI-001 theo `docs/HUONG_DAN_BAT_DAU_VA_CAC_QUYET_DINH.md` và bản đề xuất `docs/superpowers/specs/2026-10-26-desktop-storefront-design.md`. Trước tiên chỉ đọc/khảo sát giao diện desktop hiện tại; chưa sửa file, chưa chạy migration và chưa deploy. Liệt kê route/component sẽ chạm, hiện trạng, thứ tự thực hiện, tiêu chí hoàn thành, cách xem trước để tôi duyệt, rủi ro và các câu hỏi thực sự cần tôi quyết định. Ghi kế hoạch vào Markdown trong `docs/superpowers/plans/`. Giữ nguyên bố cục trang chủ v3, chỉ làm desktop, bảo toàn dữ liệu/chức năng, áp dụng Hallmark và Taste khi thiết kế; chưa triển khai mobile. Sau đó dừng để tôi duyệt kế hoạch.

| 26-10-2026 | AI-001 | Chủ shop → Codex | Phản hồi khi xem preview desktop: một số danh mục không có nội dung; cần nút quay lại trang trước; thẻ giảm giá cần cùng kích thước thẻ Tất cả sản phẩm; chủ shop chưa thấy lazy loading ảnh. Codex ghi nhận trước khi sửa, sau đó kiểm tra nguyên nhân/hành vi và cập nhật bản desktop để duyệt lại | Kế hoạch v4, mục “Phản hồi desktop của chủ shop” |
| 26-10-2026 | AI-001 | Codex → Chủ shop | Đã sửa theo 4 ý phản hồi desktop: ẩn danh mục con không có hàng (Đèn tuýp, Quạt hút / thông gió) và chip hãng rỗng; thêm nút quay lại kèm đích dự phòng; độ rộng dải giảm giá khớp lưới sản phẩm; đặt rõ `loading="lazy"` và đếm được 14 ảnh lazy trong HTML production trang chủ. Build webpack và ESLint mục tiêu đạt; Hallmark render chạy: 5 FAIL (4 baseline ngoài phạm vi, 1 mật độ nội dung trang chủ), 28 REFLEX, 3 WARN. Chờ duyệt lại desktop; chưa commit/deploy | Kế hoạch v4, mục 9 |
| 26-10-2026 | AI-002 | Chủ shop → Codex | Đề nghị thay khối “Danh mục hàng hóa” bằng các ngành hàng sản phẩm (ví dụ Quạt, Ấm siêu tốc, Máy sấy tóc, Nồi cơm, Nồi chiên không dầu), nhấn mạnh Ngành hàng khác Danh mục và muốn thêm cột “Ngành hàng” vào Excel; yêu cầu hỏi xác nhận trước rồi mới lập việc tiếp theo. Chưa rõ quan hệ ngành hàng–danh mục–sản phẩm, file Excel nguồn và danh sách đầy đủ | Đang chờ xác nhận |
| 26-10-2026 | AI-002 | Chủ shop → Codex | Xác nhận: (1) Ngành hàng là nhóm loại sản phẩm, tách riêng; Danh mục hiện tại giữ nguyên; bấm ngành hàng xem tất cả sản phẩm được gán vào ngành đó; (2) thêm cột vào Excel nhập/xuất sản phẩm trong trang quản trị; (3) danh sách ngành hàng là danh sách cố định do chủ shop cung cấp. Chờ chủ shop gửi danh sách tên ngành hàng trước khi lập brief triển khai | AI-002 |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Gửi workbook `Kho-App-Quạt.xlsx`; sau khi xác nhận phạm vi, Codex sửa bản sao cột J “Phân loại”, bỏ tiền tố `Quạt > ` ở 100 ô trong sheet SanPham. Đối chiếu xác nhận chỉ 100 giá trị J đổi, không ô/định dạng nào khác đổi; bản gốc giữ nguyên | `Kho-App-Quạt-da-bo-tien-to-phan-loai.xlsx` |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Chú thích giao diện: khối dưới hero phải hiển thị Ngành hàng từ Excel; bấm ngành hàng xem tất cả SP thuộc ngành đó. Menu bên trái là Danh mục; chủ shop dự định nhập danh mục dần, nêu hiện có Đồ gia dụng. Bấm tên danh mục xem tất cả SP theo danh mục; mũi tên mở panel chỉ có danh mục con, trình bày bằng thẻ theo tham khảo Điện Máy Xanh. Codex đối chiếu workbook: G=Ngành hàng (hiện chỉ Quạt), H=Danh mục (hiện chỉ Đồ gia dụng), I=Danh mục con (hiện chỉ Quạt), J=Phân loại (7 giá trị quạt). Website hiện đang lấy 8 danh mục gốc — cần chủ shop xác nhận cách chuyển | Chờ xác nhận |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Xác nhận: menu hiện chỉ hiển thị Đồ gia dụng; bấm tên danh mục mở mọi sản phẩm thuộc danh mục đó; mũi tên mở panel dạng thẻ chỉ chứa Danh mục con, bấm thẻ để xem/lọc sản phẩm theo danh mục con. Chủ shop sẽ gửi thêm ngành hàng, chưa chốt danh sách cố định | Chờ danh sách ngành hàng |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Gửi workbook bổ sung `Kho-App-Ấm siêu tốc.xlsx`; đọc cấu trúc thấy sheet SanPham có G=Ngành hàng với giá trị `Ấm siêu tốc`, H=Danh mục=`Đồ gia dụng`, I=Danh mục con=`Ấm siêu tốc`; chưa sửa workbook | Chờ thêm ngành hàng |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Chốt phạm vi danh sách ngành hàng khởi đầu: dùng `Quạt` và `Ấm siêu tốc` từ hai workbook đã gửi; các ngành hàng khác sẽ bổ sung về sau. Brief cần tính tới khả năng mở rộng danh sách; chưa bắt đầu code | Sẵn sàng lập brief |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Chốt cách mở rộng danh sách hiển thị: thẻ Ngành hàng được lấy từ các giá trị Ngành hàng trong Excel đã nhập; thêm giá trị mới qua dữ liệu Excel để ngành hàng mới xuất hiện trong danh sách | Brief AI-002 |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Chủ shop đồng ý cập nhật cơ sở dữ liệu và nhập hai workbook. Migration đã thêm `products.industry`, chuyển Quạt thành danh mục con của Đồ gia dụng, đổi tên danh mục con `am-binh-dun` thành Ấm siêu tốc (giữ slug cũ). Rà file: 100 dòng Quạt (1 SKU trùng giữa hai sản phẩm khác nhau; dòng thứ hai bị quy trình nhập bỏ qua để tránh gộp nhầm), 14 dòng Ấm siêu tốc; giá file Quạt theo nghìn đồng, file Ấm theo đồng. Đã chuẩn hóa parser để đổi giá file Quạt sang đồng. Chưa thực hiện import qua trang quản trị vì công cụ trình duyệt đang chặn URL local theo chính sách; không ghi thẳng dữ liệu qua SQL | Migration `20261027000100_product_industry.sql`; AI-002 |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Theo yêu cầu, đã xóa 98 sản phẩm khỏi cơ sở dữ liệu. Xác nhận trước khi xóa: không có đơn hàng/order_items; 1 movement nhập kho (+5 Van bi đồng Miha Φ21) bị xóa theo CASCADE. Đã xác minh products, inventory, product_costs, product_images, import_changes, inventory_movements và order_items đều còn 0 dòng. Danh mục vẫn giữ nguyên, sẵn sàng nhận sản phẩm mới | Supabase project `ztbwxfzklznpqbofbwlk` |
| 27-10-2026 | AI-002 | Chủ shop → Codex | Thêm nút Xóa từng sản phẩm ở bảng desktop và danh sách mobile trong quản trị. Server Action yêu cầu quyền `edit_products`, kiểm tra mã sản phẩm và chặn xóa nếu đã có dòng đơn hàng; hỏi xác nhận trước khi gửi yêu cầu, đồng thời báo rõ dữ liệu ảnh/giá nhập/tồn kho/lịch sử nhập kho sẽ bị xóa theo CASCADE. TypeScript, ESLint và `git diff --check` đạt | `components/admin/ProductTable.tsx`; `app/admin/(shell)/san-pham/actions.ts` |
| 27-10-2026 | AI-001 | Chủ shop → Codex | Chốt: giảm giá dùng chung bộ lọc với Tất cả SP; thêm giao diện tài khoản khách trước, chưa làm đăng nhập thật; nút dùng dạng “Xem thêm X / tổng”. Codex đã triển khai các thay đổi desktop theo phần đã chốt, còn kiểm tra trực quan và hoàn thiện nguồn logo hãng | Mục 10 trong kế hoạch AI-001 |
