# Nhà cung cấp AI: tích hợp, khả năng tự động hóa và chi phí

**Ngày tra cứu:** 2026-10-26 (UTC/local report date). **Đối tượng:** kiến trúc công cụ điều phối ba vai trò AI cho dự án Tân Trường Tín.  
**Phạm vi:** chỉ dùng tài liệu và bảng giá chính thức của OpenAI, Google và Anthropic. Giá USD trước thuế; biến động theo khu vực, model, mức dùng và thay đổi bảng giá. Không có ước tính tổng chi phí cố định vì chưa chốt số lượt, token, mức tự động hóa hay retention.

## Tóm tắt điều hành

- **OpenAI:** ChatGPT UI/subscription và OpenAI API là hai hệ thống tính phí riêng. Có thể gọi model qua Responses API/SDK và tích hợp tool phía server. Tài khoản ChatGPT Plus không tự cấp ngân sách API. Dùng model làm “security reviewer” chỉ là phân tích bằng LLM; không thay thế scanner chuyên dụng hay kiểm thử xâm nhập có phạm vi được cho phép.
- **Google Antigravity:** sản phẩm giờ có CLI và Python Agent SDK chính thức, ngoài app/IDE. Vì vậy không còn chỉ là giao diện cần tự động hóa bằng click. SDK nhận Gemini API key hoặc có thể route qua Google Cloud/Vertex (Agent Platform); cần xác minh entitlement và bảng giá cho đúng luồng trước khi vận hành. Antigravity phù hợp vai trò UI/UX agent; chất lượng thiết kế vẫn cần người duyệt và kiểm tra trên thiết bị thật.
- **Claude Code:** có CLI chính thức, chế độ `-p`/SDK cho gọi theo lệnh và có thể xác thực qua Claude Pro/Max hoặc Anthropic Console API pay-as-you-go. Gói Pro/Max áp dụng giới hạn dùng chung với Claude; API Console trả tiền theo mức sử dụng riêng. CLI không tự tạo ra dịch vụ hội đồng nhiều agent; cần lớp điều phối, quyền file/git, lưu phiên và nhật ký.
- **Khuyến nghị:** dựng MVP dạng bảng điều khiển nội bộ, với mỗi agent là một adapter riêng; bắt đầu bằng gọi người dùng khởi chạy/đọc kết quả, không cấp quyền tự đẩy production. Chỉ tiến tới API PAYG hoặc chạy tự động sau khi có giới hạn ngân sách, sandbox và luồng phê duyệt.

## Bảng so sánh đường tích hợp

| Nhà cung cấp / vai trò | Đường được nhà cung cấp hỗ trợ | Tính phí chính | Lưu ý cho hội đồng |
|---|---|---|---|
| OpenAI / phân tích bảo mật | OpenAI Responses API (HTTP/official SDK), tool calling; ChatGPT app riêng | API token + công cụ; ChatGPT subscription riêng | Không có bằng chứng từ nguồn được trích ở đây rằng ChatGPT consumer UI là API nền cho app bên thứ ba. Không tự động hóa giao diện người dùng bằng cách chia sẻ thông tin đăng nhập. |
| Google Antigravity / UI agent | Antigravity CLI (`agy`), Python SDK `google-antigravity`, app/IDE; SDK hỗ trợ Gemini API key hoặc route Gemini Enterprise/Vertex | Gemini API token/tools hoặc Google Cloud/Agent Platform theo billing phù hợp; subscription/seat tùy luồng và gói | SDK là runtime agent có tool execution, hooks/policies, MCP và delegation; cần cấu hình allow/deny và sandbox. Không suy ra rằng subscription cá nhân cho phép ứng dụng bên ngoài dùng quota vô hạn. |
| Anthropic / lead + coding | Claude Code CLI; `claude -p`/SDK; Anthropic Console API hoặc Claude Pro/Max login; cũng hỗ trợ Bedrock/Vertex cho enterprise | Pro/Max subscription với hạn mức dùng chung, hoặc Console API credits PAYG; cloud provider nếu route qua cloud | Tách adapter tương tác khỏi logic điều phối; API key chỉ ở server/secret store. Claude Code là coding agent local, cần quy tắc workspace và human approval. |

## Chi tiết theo nhà cung cấp

### OpenAI / ChatGPT và API

**Đã xác minh từ nguồn chính thức**

- OpenAI API hỗ trợ Responses cho request model, tool use, văn bản/hình ảnh và tương tác trạng thái; API có official client libraries và gọi HTTP trực tiếp. API key phải được giữ bí mật, không nhúng vào browser/client. [API overview](https://developers.openai.com/api/reference/overview)
- ChatGPT và API platform có hệ thống billing riêng; API trả riêng theo model/tính năng. Plus không bao gồm API usage. [Billing separation](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform), [ChatGPT Plus](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus)
- Trang trợ giúp OpenAI hiện nêu ChatGPT Plus **US$20/tháng** (có thể khác theo nơi mua/thuế). [Plus pricing](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus)
- API tính theo token model và các công cụ liên quan. Bảng giá cập nhật có giá token, search, file search và hosted containers; mức cụ thể cần chọn model. [API pricing](https://developers.openai.com/api/docs/pricing)

**Áp dụng vai trò security**

LLM có thể đọc kết quả SAST/DAST, cấu hình, log và diff, nhóm phát hiện, giải thích ảnh hưởng, đề xuất bản vá và review bản vá. Nhưng phát hiện đáng tin cậy cần kiểm tra bằng công cụ và bằng chứng: scanner/dependency audit, kiểm thử trong staging có quyền, và review của người. Đừng giao cho mô hình quyền quét/xâm nhập website bên thứ ba, production tùy tiện, hay tự merge/deploy. Đây là khuyến nghị kiến trúc/an toàn, không phải cam kết của OpenAI về một dịch vụ pentest tự động.

### Google Antigravity

**Đã xác minh từ nguồn chính thức**

- Google Antigravity cung cấp **App, CLI, IDE và Python SDK**; tài liệu phân biệt SDK lập trình, CLI tương tác terminal và app điều phối agent. [Antigravity docs home](https://www.antigravity.google/docs/home/), [product overview](https://antigravity.google/product/antigravity-sdk?platform=linux)
- SDK cài qua `pip install google-antigravity`, nhận `GEMINI_API_KEY`; cấu hình `vertex=True` với project/location để gọi Gemini Enterprise API/Vertex. SDK cung cấp runtime có quản lý context/tool execution, safety policies và delegation. [SDK overview](https://www.antigravity.google/docs/sdk/overview)
- CLI/App hỗ trợ cấu hình quyền; `default` yêu cầu xem diff tương tác, `accept-edits` tự chấp nhận edit, `auto` là preview với terminal sandbox. [Agent settings](https://antigravity.google/docs/agent-settings?authuser=6)
- Gemini API billing dựa trên input/output/cached tokens và storage; Google AI Studio miễn phí trừ khi dùng paid API key/paid feature. Agentic loops vẫn tính token inference. [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing), [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing?authuser=6)
- Google Cloud có bảng giá Agent Platform riêng, nhưng đó là hạ tầng/model service và không nên nhầm với giá seat/subscription. [Agent Platform pricing](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing?authuser=0). Gemini Enterprise developer tools yêu cầu billing account được liên kết và subscription/seat phù hợp. [Gemini Enterprise developer tools](https://docs.cloud.google.com/gemini/enterprise/docs/ai-developer-tools-overview)

**Áp dụng vai trò design**

Antigravity có thể chạy agent trên workspace, đọc/sửa code và nối MCP/skills. Với vai trò designer nên cho phép đọc repo, asset và browser preview; yêu cầu diff, screenshots/preview, rationale và responsive review. Giữ quyền ghi trong branch/worktree tách biệt, và bắt buộc review người trước khi hợp nhất. Hiệu ứng hoặc component do agent tạo không nên mặc định được coi là nhẹ/accessibile; đo hiệu năng, reduced-motion và trải nghiệm thực tế.

**Chi phí còn cần chốt**

Không đưa con số subscription Antigravity/Google AI cá nhân vào bảng chi phí này vì các tài liệu đã kiểm tra cho thấy nhiều đường xác thực/billing khác nhau, và pricing phụ thuộc country/plan/enterprise entitlement. Trước khi bật SDK/CLI, cần xem trong tài khoản Google thực tế: product tier, quota, model routing, project billing và mức phí token/tool. Không dùng thông tin “public preview miễn phí” từ bài blog cũ như giá hiện hành.

### Anthropic / Claude Code

**Đã xác minh từ nguồn chính thức**

- Claude Code cài và chạy trong terminal. Có các lựa chọn auth: Anthropic Console với billing API, Claude Pro/Max, hoặc các nền tảng enterprise như Bedrock/Vertex. [Claude Code setup](https://docs.anthropic.com/en/docs/claude-code/getting-started)
- CLI có chế độ `claude -p` chạy prompt rồi kết thúc, và có thể tiếp nhận input qua pipe; tài liệu gọi là query via SDK. [CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- Anthropic nêu Pro US$20/tháng và Max từ US$100/tháng; giá/thuế/khu vực có thể khác. Claude Code usage nằm trong hạn mức subscription dùng chung với Claude khi đăng nhập theo plan. [Anthropic pricing](https://www.anthropic.com/pricing?subjects=claude&type=product), [Claude Code Pro/Max usage](https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)
- Anthropic Console API dùng prepaid usage credits, áp dụng cả API/Workbench/Claude Code nếu dùng Console; credits có hạn sử dụng và theo điều khoản là không hoàn tiền. [API credit billing](https://support.anthropic.com/en/articles/8977456-how-do-i-pay-for-my-api-usage)
- Giá API thay đổi theo model và tokens; dùng bảng giá chính thức thay vì con số cũ. [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing)

**Áp dụng vai trò lead/coder**

Claude Code phù hợp để thực hiện tác vụ code phức tạp trong repo và có cách gọi non-interactive. Nhưng “lãnh đạo”/chia việc xuyên suốt nhiều vendor là trách nhiệm của orchestrator do ta xây, không phải tính năng tự động mặc định của Claude Code. Dùng `-p` để gửi brief và thu kết quả có thể là adapter khởi đầu; kiểm tra hỗ trợ SDK/permission modes theo phiên bản CLI hiện dùng.

## Mô hình chi phí thực tế cần dự trù

Tách riêng bốn hạng mục để không tính nhầm:

1. **Gói người dùng:** ChatGPT Plus/Claude Pro/Max/Google AI hoặc Gemini Enterprise nếu cần UI/app/seat. Không mặc định gói đó cung cấp API cho backend.
2. **API inference:** tokens input/output, reasoning/agent loops, cache, model; chi phí phát sinh theo từng vendor/project.
3. **Công cụ/hạ tầng:** browser automation, storage, logs, database, cloud runners, preview deployments, scan services, backup và network egress.
4. **Vận hành và kiểm soát:** thời gian review người, staging, xử lý false positive, cập nhật SDK, giới hạn ngân sách/alert và lưu trữ dữ liệu.

Chi phí token có thể được ước tính sau khi lấy mẫu một chu kỳ công việc thực tế (ví dụ một issue UI và một security review), lưu token counts từng vendor, rồi ngoại suy theo số lượt/tháng. API dùng token không có một “giá gói ba AI” cố định. Nên đặt budget cap/alerts ở từng vendor, hạn chế auto-recharge, và ghi chi phí theo project/correlation ID.

## Khuyến nghị thiết kế hội đồng (đề xuất, không phải yêu cầu vendor)

1. **Giao diện quản trị** chỉ là lớp quan sát/điều khiển; điều phối chạy ở backend. Không để API keys hoặc token OAuth trong frontend.
2. **Adapters độc lập:** `openai`, `antigravity`, `claude-code`; chuẩn hóa job input/output (role, branch, scope, status, token/cost, artifacts, citations, diff).
3. **Quyền theo vai trò:** Design agent viết vào branch riêng; lead agent mở task/đánh giá; security agent đọc scan evidence và tạo findings. Không agent nào deploy production hoặc tự áp dụng DB migrations.
4. **Quy trình hai pha:** thảo luận/plan → người duyệt → sandbox branch execution → kiểm tra chéo (security/design/code) → người duyệt merge/deploy.
5. **Security testing:** chỉ thử trên domain/repo người dùng sở hữu hoặc đã cho phép, ưu tiên local/staging và scanner tiêu chuẩn. Không biến prompt “hacker” thành quyền xâm nhập tự động.
6. **Dữ liệu:** repo có thể chứa credentials, customer information và database dump. Secret scanning, redaction, least privilege, retention limits, audit log và đánh giá data processing theo điều khoản từng vendor là điều kiện trước khi kết nối.
7. **MVP:** chưa cần mô hình hội thoại thời gian thực giữa agents. Chạy tuần tự: Claude lập kế hoạch → Antigravity đề xuất/sửa UI → OpenAI rà diff và kết quả scanner → Claude tổng hợp; lưu mỗi artifact và yêu cầu người duyệt giữa các chặng. Điều này giảm rối, lặp token và rủi ro xung đột file.

## Nguồn chính thức đã tra cứu

**OpenAI**

- [API overview](https://developers.openai.com/api/reference/overview)
- [API pricing](https://developers.openai.com/api/docs/pricing)
- [ChatGPT/API billing separation](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform)
- [ChatGPT Plus pricing and API exclusion](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus)

**Google**

- [Antigravity product surfaces](https://www.antigravity.google/docs/home/)
- [Antigravity SDK overview](https://www.antigravity.google/docs/sdk/overview)
- [Antigravity CLI/app settings and execution permissions](https://antigravity.google/docs/agent-settings?authuser=6)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing?authuser=6)
- [Gemini API billing](https://ai.google.dev/gemini-api/docs/billing)
- [Gemini Enterprise Agent Platform pricing](https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing?authuser=0)
- [Gemini Enterprise AI developer tools requirements](https://docs.cloud.google.com/gemini/enterprise/docs/ai-developer-tools-overview)

**Anthropic**

- [Claude Code installation/auth choices](https://docs.anthropic.com/en/docs/claude-code/getting-started)
- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- [Claude pricing](https://www.anthropic.com/pricing?subjects=claude&type=product)
- [Pro/Max Claude Code access and limits](https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)
- [Console API usage credits](https://support.anthropic.com/en/articles/8977456-how-do-i-pay-for-my-api-usage)
- [Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing)

## Ghi chú độ tin cậy

Tài liệu Google Antigravity SDK/CLI trong các nguồn hiện tại là sản phẩm mới và một số tính năng được đánh dấu preview; phải kiểm tra lại hỗ trợ nền tảng, region, model availability, entitlement và giá đúng Google account trước khi thiết kế tích hợp production. Giá Anthropic/OpenAI/Gemini đều thay đổi, có thể khác theo thuế, vùng xử lý, model, tool, cache và tier. Mọi giá trên là thông tin vendor, không phải báo giá hoặc cam kết tổng chi phí.
