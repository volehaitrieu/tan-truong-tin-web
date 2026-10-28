# Kiến trúc MVP và chi phí công cụ hội đồng AI

**Ngày khảo sát:** 26-10-2026. Giá USD niêm yết; có thể thay đổi theo quốc gia, thuế, loại tài khoản và mức sử dụng. Đây là nghiên cứu định hướng, không phải báo giá hay tư vấn pháp lý/thuế.

## Khuyến nghị

Bắt đầu bằng một MVP local-first trên máy của bạn, sau đó mới host dashboard nếu cần truy cập từ thiết bị khác hoặc chia sẻ với nhân sự. Hệ thống có thể dùng một bảng điều khiển chung cho task, thảo luận, kế hoạch, artifact, Git diff, phê duyệt và audit log, nhưng cần adapter riêng cho từng nhà cung cấp.

Lưu ý quan trọng: các gói ChatGPT, Claude và Google AI không tự động biến thành API cho ứng dụng của bạn. Muốn điều phối ổn định cần dùng API hoặc CLI/SDK chính thức. GUI tự click có thể dễ hỏng khi giao diện đổi, cần đăng nhập/MFA, hoặc không phù hợp điều khoản. Claude Code cho phép dùng qua một số gói Claude; Anthropic Console API có cách tính phí riêng. Antigravity có app/CLI/SDK và quyền API tính theo mức dùng.

### Kiến trúc theo giai đoạn

1. **Local MVP:** ứng dụng điều phối chạy local; SQLite lưu task, sự kiện và phê duyệt; Git/repository lưu mã và diff; adapter gọi CLI/SDK khi có hỗ trợ; xuất báo cáo Markdown/JSON. Bắt đầu với GitHub Free, chưa cần Actions tự động.
2. **Dashboard từ xa:** Next.js trên Vercel; Supabase Auth/Postgres/Realtime lưu tài khoản, task và event log; GitHub App với quyền tối thiểu; runner tiếp tục chạy trên máy local để thao tác repo. Chỉ đẩy metadata và nội dung được chọn lên cloud.
3. **Mở rộng sau:** runner trong sandbox/container/worktree cô lập, queue, nhiều người dùng, chính sách retention, theo dõi chi phí, phân quyền và SSO. Đây là phần tăng đáng kể công sức và bề mặt tấn công.

### Thành phần giao diện và quy trình

- Bảng task: Backlog → Plan → In progress → Review → Approved/Rejected.
- Discussion log: nội dung, agent/model, thời gian, task ID, tài liệu tham chiếu, usage/chi phí nếu provider trả về; phân biệt nội dung AI và nội dung người dùng duyệt.
- Plan/artifacts: kế hoạch phiên bản hóa, báo cáo bảo mật, ảnh tham khảo, kết quả kiểm tra gắn với task.
- Git view: branch, commit, diff; ban đầu chỉ đọc. Mỗi agent sửa trên branch/worktree riêng, không ghi chung working tree.
- Approval gates riêng: duyệt plan, cấp quyền chạy lệnh, duyệt diff, tạo PR và triển khai. Người dùng quyết định merge/deploy.
- Audit trail append-only ghi thay đổi trạng thái, lần gọi model/tool, quyền, kết quả/lỗi, người duyệt và thời điểm; không ghi secrets.
- Security reviewer: chỉ kiểm tra repo/website được ủy quyền; bắt đầu bằng static/dependency scan và staging. Findings cần bằng chứng, mức độ, tái hiện an toàn và patch branch riêng. Không tự khai thác hệ thống bên thứ ba hay vá production.

## Local-first và hosted

| Chủ đề | Local-first | Vercel + Supabase + GitHub |
|---|---|---|
| Code/runner | Ở máy người dùng, dễ giới hạn luồng dữ liệu; máy phải bật và cần backup | Dashboard truy cập từ xa; runner vẫn cần quyền repo hoặc phải dựng sandbox cloud |
| Dữ liệu | Có thể giữ local; cần bảo vệ máy và sao lưu | Tiện cộng tác nhưng thêm cloud provider, token, webhook, retention và phân quyền |
| Hạ tầng | Gần $0 nếu đã có máy; vẫn có AI, điện, Internet, backup | Gói trả phí cơ bản khoảng $45/tháng trước AI, domain, thuế và overage |
| Độ phức tạp | Thấp hơn để thử nghiệm một người | Cao hơn: secrets, deploy, database migration, webhook, quota và ứng phó sự cố |

Khuyến nghị giữ code và runner local trong pilot. Nếu cần xem từ xa, host dashboard và metadata trước. Chỉ chuyển source code sang cloud runner sau khi có sandbox, secret isolation, network egress policy, backup và retention rõ ràng.

## Giá từ nguồn chính thức

| Dịch vụ | Giá hiện hành được thấy | Ghi chú |
|---|---|---|
| GitHub Free | $0 | Private repositories; quota Actions/storage có giới hạn. GitHub Team $4/user/tháng nếu cần protected branches, code owners, nhiều reviewer và required reviews. |
| Vercel Hobby | $0 | Chỉ dành cho mục đích cá nhân/phi thương mại. |
| Vercel Pro | $20/tháng, có $20 usage credit | Overage tính theo tài nguyên; niêm yết USD chưa gồm thuế. Nếu dashboard phục vụ hoạt động cửa hàng/kinh doanh, không mặc định dùng Hobby; kiểm tra đúng mục đích với điều khoản. |
| Supabase Free | $0 | Tối đa 2 project active; project có thể pause sau 1 tuần không hoạt động; quota giới hạn, không nên coi là SLA/backup production. |
| Supabase Pro | Từ $25/tháng | Một project đầu tiên, $10 compute credits, 250GB egress, 100GB file storage và 100K MAU theo pricing hiện thấy; overage và compute/project thêm có thể tăng hóa đơn. Có spend cap. |
| OpenAI API | Theo model, token và tool usage | Trang API hiện ra giá GPT-5.3-Codex $1.75 input / $0.175 cached input / $14 output mỗi 1M tokens. Usage thay đổi theo model, prompt, số vòng và tool; ChatGPT subscription không phải API credit. |
| Claude | Pro $20/tháng; $17/tháng khi trả năm; Max từ $100/tháng | Anthropic nói giá chưa gồm applicable taxes. Claude Code usage theo subscription có giới hạn; Console/API usage được tính riêng. |
| Antigravity | Individual $0/tháng với basic weekly rate limits | Antigravity blog tháng 5/2026 công bố giá Mỹ Google AI Pro $20/tháng và Ultra $100/$200; Google Antigravity API là usage-based. Giá checkout Việt Nam cần kiểm tra trực tiếp. |
| ChatGPT | Free/Go/Plus/Business/Enterprise; giá theo thị trường/plan | Xem checkout tài khoản Việt Nam; không trộn phí subscription với API billing. |

**Phép cộng hạ tầng tham khảo:** Vercel Pro $20 + Supabase Pro $25 = khoảng **$45/tháng** trước AI, thuế, domain, email, usage vượt mức và dự án Supabase bổ sung. Đây chỉ là phép cộng giá plan nền, không phải tổng bill được đảm bảo. Supabase compute credit chỉ áp dụng compute; Vercel usage credit có thể bị tiêu hết.

**Chi phí AI không thể chốt trước khi đo.** Có hai lựa chọn: dùng các app/CLI subscriptions theo quota; hoặc cho dashboard gọi API, mỗi provider tính riêng theo mức dùng. Hạn chế context, chỉ gửi file cần thiết, cache summaries, ghi usage và đặt budget/caps. Đo 2–4 tuần pilot rồi mới xác định ngân sách thực tế.

## Việt Nam và các khoản dễ bị quên

- Nhà cung cấp có thể cộng VAT/thuế tùy billing address; Vercel nêu rõ giá USD chưa gồm VAT/GST/thuế áp dụng, Anthropic cũng cảnh báo thuế.
- Giá Google/AI có thể bản địa hóa theo quốc gia và chu kỳ thanh toán. Trang Google One tiếng Việt cho thấy tính năng theo khu vực nhưng lần khảo sát này không trích xuất được số tiền cụ thể. Xem checkout trực tiếp với tài khoản/phương thức Việt Nam.
- Ngân hàng có thể thu phí chuyển đổi USD/transaction; không nằm trong giá nhà cung cấp.
- Nếu dùng kinh doanh, lưu hóa đơn và hỏi kế toán về chứng từ/thuế; ghi chú này không phải tư vấn thuế.
- Không gửi mật khẩu, secret, dữ liệu đơn hàng hoặc thông tin cá nhân khách tới model/API nếu chưa đánh giá điều khoản dữ liệu và retention.

## Giới hạn quyền agent nên đặt

1. Chỉ kiểm tra website/repo thuộc quyền sở hữu hoặc được ủy quyền; ưu tiên staging/tài khoản thử.
2. Designer không cần production secrets; reviewer chỉ đọc diff; implementer chỉ ghi branch; security tool có allowlist target.
3. Mặc định chỉ đọc; quyền shell/browser/API nguy hiểm có timeout, xác nhận và audit. Không chạy lệnh chỉ vì model đề xuất.
4. Không cho agent tự merge, deploy, sửa production schema, secrets hay tài khoản. Con người duyệt từng cổng.
5. Dùng GitHub App/token quyền nhỏ nhất; không ghi token vào log hoặc file repo; có cách thu hồi/rotate.
6. Không để nhiều agent sửa chung một working tree. Một người sở hữu quyết định merge.
7. Gắn nguồn/bằng chứng và nhãn confirmed/likely/unverified cho findings.
8. Quy định retention, export, backup và xóa dữ liệu; xóa prompt chứa secrets.

## Có thể để sau

- Đăng nhập nhiều người, SSO, billing per seat và role tổ chức.
- Agent debate tự động không giới hạn; pilot nên tuần tự: lập plan → review → người dùng duyệt → implement → review diff.
- Realtime chat phức tạp, avatar/phòng họp, voice, biểu đồ chi phí nâng cao.
- Cloud runner, container fleet, auto-scale, browser chạy không giám sát.
- Pentest khai thác chủ động, auto-fix production, auto-merge/deploy.
- Vector DB/RAG toàn repo, fine-tuning; ban đầu tìm kiếm Git và tóm tắt task thường đủ.
- Vercel add-ons, Supabase Team/PITR/Log Drains, GitHub Team cho đến khi có nhu cầu.

## Quyết định cần chốt trước khi xây

1. Chỉ bạn dùng hay có nhân viên?
2. Task/log/diff có thể lưu cloud không, hay code phải ở local?
3. Điều phối dùng API theo usage hay CLI/app subscriptions tại máy?
4. Phạm vi security là repo local, staging hay production được ủy quyền?
5. Agent chỉ sửa branch, hay bạn muốn thêm quyền nào? Khuyến nghị bạn duyệt PR và tự deploy.
6. Trần ngân sách tháng cho hạ tầng, subscriptions, API và overage?

## Nguồn chính thức

- [Vercel pricing](https://vercel.com/pricing) — Hobby/Pro, usage credit, thuế và mục đích dùng.
- [Vercel Terms](https://vercel.com/legal/terms) — Hobby cho cá nhân/phi thương mại.
- [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines) — commercial usage và overage.
- [Supabase pricing](https://supabase.com/pricing) — quotas, compute, overage.
- [Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase) — cách tính project/compute.
- [GitHub plans](https://github.com/pricing) và [included usage](https://docs.github.com/en/billing/reference/product-usage-included).
- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) và [ChatGPT plans](https://chatgpt.com/pricing/).
- [Anthropic pricing](https://www.anthropic.com/pricing) và [Claude Code with Pro/Max](https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan).
- [Google Antigravity pricing](https://www.antigravity.google/pricing), [plan changes](https://antigravity.google/blog/changes-to-antigravity-plans/) và [Google AI plans Vietnam](https://one.google.com/intl/vi_vn/about/google-ai-plans/).
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).

> Giá và quota đã được tra cứu tại các trang trên vào ngày ghi ở đầu file; xác nhận lại tại checkout trước khi mua hoặc triển khai.
