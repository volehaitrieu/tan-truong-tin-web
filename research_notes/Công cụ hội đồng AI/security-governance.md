# Bảo mật và quản trị cho công cụ hội đồng AI

**Ngày khảo sát:** 2026-10-26  
**Phạm vi:** Công cụ cá nhân điều phối ChatGPT/OpenAI, Antigravity và Claude Code để thảo luận, lập kế hoạch, chỉnh sửa kho mã, rà soát bảo mật và giao diện. Đây là khuyến nghị thiết kế, không phải đánh giá bảo mật hệ thống hiện tại. Không có hoạt động kiểm thử cửa hàng đang chạy.

## Kết luận điều hành

Nên thiết kế công cụ này như một **bàn điều phối có người kiểm soát**, không phải ba tác nhân cùng quyền truy cập tự do. Mỗi tác nhân chỉ nhận phần dữ liệu cần thiết; mọi chỉnh sửa diễn ra trên nhánh/worktree dùng một lần; kiểm thử bảo mật chỉ chạy trong môi trường staging/local được cho phép; mọi thay đổi đều qua diff, kiểm tra tự động và người dùng duyệt trước khi merge hoặc triển khai.

Không nên trao cho mô hình quyền tự triển khai bản vá lên production. Tác nhân có thể tìm và đề xuất bản vá, tạo nhánh/PR và chạy kiểm tra an toàn; chủ dự án quyết định merge/deploy. Một mô hình “hacker tự xâm nhập và tự vá” dễ nhầm lẫn giữa rà soát mã có kiểm soát với quét/tấn công website thật và có nguy cơ làm gián đoạn dịch vụ, thay đổi dữ liệu hoặc vượt quá phạm vi được phép.

## Bắt buộc theo phạm vi pháp lý và dịch vụ

Các điểm dưới đây là điều kiện sử dụng an toàn/phạm vi được phép, không phải khẳng định rằng mọi nơi có cùng luật. Khi mở rộng ra bên ngoài hệ thống của chủ dự án, cần xin phép chủ thể có thẩm quyền và rà soát quy định áp dụng tại Việt Nam.

- **Chỉ kiểm thử mục tiêu có thẩm quyền và có phạm vi bằng văn bản.** Xác định tên miền/IP, tài khoản thử nghiệm, thời gian, loại kiểm tra, giới hạn tải, hành động bị cấm, liên hệ khẩn cấp và điều kiện dừng. Không cho agent tự suy ra phạm vi từ một URL hoặc nội dung trang. OWASP WSTG yêu cầu tester giữ trong phạm vi engagement đã định; WSTG cũng phân biệt sản xuất, kiểm thử hồi quy và hoạt động assessment theo authorization/rules of engagement.
- **Điều khoản dữ liệu phụ thuộc đúng sản phẩm và cách truy cập.** Không đánh đồng ChatGPT cá nhân với OpenAI API, Claude Code qua tài khoản người dùng với Claude API/commercial, hoặc Gemini API miễn phí với Gemini API trả phí. Trước khi gửi repo, đọc điều khoản/retention hiện hành cho đúng sản phẩm, khu vực, gói và cấu hình. Ngày khảo sát, tài liệu OpenAI nói API data không được dùng train theo mặc định, abuse-monitoring logs có thể lưu tối đa 30 ngày; Anthropic API thường xóa input/output trong 30 ngày (ngoại lệ theo policy/law và một số model/thoả thuận); Gemini unpaid có thể dùng nội dung để cải thiện sản phẩm và cho phép human review, trong khi Paid Services không dùng prompts/responses để cải thiện sản phẩm nhưng vẫn có logging giới hạn cho an toàn. Các chính sách thay đổi theo thời gian, cần xác minh trước khi triển khai.
- **Không đưa secrets hoặc thông tin khách hàng vào prompt.** API key, mật khẩu, token Supabase, cookie, dữ liệu đơn hàng/khách hàng, dữ liệu backup và production DB dump phải được loại khỏi ngữ cảnh gửi đến model. Nếu phát hiện secret trong repo thì xử lý/rotate, không sao chép secret vào hội thoại hay log.

## Khuyến nghị kiến trúc và kiểm soát

### 1. Cách ly tác nhân và quyền tối thiểu

- Mỗi AI có adapter riêng với danh sách công cụ được cho phép; không chia sẻ một shell toàn quyền hay token admin giữa các agent.
- Mặc định cấp **read-only** để phân tích. Khi cần sửa mã, tạo worktree/branch riêng với quyền ghi chỉ trong checkout đó; không mount toàn bộ ổ đĩa người dùng, thư mục credentials, `.ssh`, browser profile hoặc thư mục cloud sync.
- Tác nhân bảo mật có thể đọc mã, đề xuất truy vấn và chạy SAST/dependency scans trên bản sao; không cấp quyền xoá/sửa dữ liệu production, thay đổi DNS, reset mật khẩu, ghi database, deploy, merge, rotate secrets hay tạo user.
- Tác vụ có quyền ghi chỉ được nâng cấp qua bước xác nhận tường minh, có phạm vi và thời hạn; quyền không tự được agent mở rộng.
- Với container Linux, ưu tiên môi trường ephemeral, non-root, không privileged, bỏ capabilities không cần, giới hạn CPU/RAM/time/network, dùng seccomp mặc định; Docker cảnh báo daemon và bind mounts có thể cho container quyền thay đổi file host. Container giúp giảm phạm vi nhưng không phải ranh giới tuyệt đối.

### 2. Prompt injection và nội dung không đáng tin

- Mọi file repo, issue, website, kết quả tìm kiếm, log, nội dung PR và output từ agent là **dữ liệu không đáng tin**, kể cả `AGENTS.md`, `SKILL.md`, README hoặc nội dung trông như system prompt. Không để nội dung đó cấp quyền hay thay đổi chính sách.
- Tách dữ liệu khỏi lệnh trong orchestration/UI; gắn nguồn và provenance cho nội dung; giới hạn agent chỉ đọc đúng thư mục/file cần thiết.
- Không dựa vào system prompt làm authorization. Quyền thực thi phải do policy engine/tool layer kiểm tra độc lập theo allowlist. OWASP nêu prompt injection, insecure output handling, sensitive-information disclosure và excessive agency là rủi ro chính; prompt injection cũng có thể đến gián tiếp qua web/file.
- Mọi lệnh do model đề xuất phải được parser/policy kiểm tra; cấm shell tùy ý theo mặc định. Không thực thi tool arguments bằng cách nối chuỗi, không để output mô hình tự quyết định đích mạng hay đường dẫn file.
- Đừng coi “nhiều AI đồng ý” là bằng chứng an toàn: chúng có thể cùng mắc lỗi, chia sẻ nguồn prompt độc hại hoặc lặp lại giả định sai. Dùng kiểm tra độc lập, evidence và reviewer con người.

### 3. Bảo vệ secrets và dữ liệu

- Dùng secret manager hoặc secret store của nền tảng; inject theo từng job ở mức tối thiểu, ngắn hạn và scoped. Tránh file `.env` trong context, ghi log, gửi đến model hoặc để trong artifact/PR.
- Quét secret trước khi gửi context, trước commit và trong CI; bật secret scanning/push protection nếu gói GitHub hỗ trợ. GitHub push protection chặn một số secret được nhận diện nhưng không phát hiện mọi loại credential, nên không thay thế secret hygiene.
- Chỉ gửi các file cần thiết; cân nhắc tắt gửi ảnh, dữ liệu cá nhân, lịch sử hội thoại dài và nội dung bí mật. Ưu tiên API/business plan khi chính sách của sản phẩm phù hợp hơn, nhưng vẫn đọc retention terms thực tế.
- Đặt thời hạn lưu ngắn cho prompts, diff, logs và artifacts; cho phép xóa theo task; mã hóa lưu trữ và truyền tải; xác định ai có quyền xem logs.
- Với repo công khai, code vẫn có thể chứa thông tin nội bộ, token test còn hiệu lực, URL private hoặc lỗ hổng chưa công bố; public không có nghĩa là mọi thứ an toàn để gửi.

### 4. Quy trình sửa mã và duyệt

1. Người dùng mô tả mục tiêu/phạm vi và chấp thuận tác vụ.
2. Tác nhân lập kế hoạch cùng các rủi ro, không sửa file production trực tiếp.
3. Mỗi agent làm trên nhánh/worktree riêng; chủ trì tích hợp thay đổi, xử lý xung đột và xem diff.
4. CI chạy lint/typecheck/build và các security checks phù hợp trên nhánh. Không để agent tự bỏ qua lỗi hoặc xóa test/check.
5. Rà soát PR bằng người thật; yêu cầu check thành công và review trước merge; bật protected branch, chặn force push/bypass khi phù hợp.
6. Deploy qua staging trước; smoke check thủ công; production chỉ sau khi người có thẩm quyền duyệt và có rollback plan.
7. Nếu phát hiện lỗ hổng nghiêm trọng: báo cáo kín, giới hạn quyền truy cập, không công khai chi tiết trước khi vá.

GitHub protected branches hỗ trợ yêu cầu review, status checks, giải quyết conversation và hạn chế ai push. Tính năng và mức bảo vệ phụ thuộc plan/repo; cần xác minh gói hiện tại.

### 5. Kiểm thử bảo mật website

- Bắt đầu bằng **static review trên mã và dependency audit**; tiếp đó chạy scanner trên local/staging với dữ liệu giả lập.
- Nếu cần dynamic testing, dùng domain staging riêng, tài khoản thử nghiệm, backup/rollback, giới hạn tốc độ/request, thời gian được duyệt và kill switch. Không chạy tải nặng, fuzzing sâu, brute force, social engineering, ghi/xóa dữ liệu, thử thanh toán thật, truy cập dữ liệu khách hoặc test hệ thống bên thứ ba.
- Luôn có allowlist cố định ở tầng tool/network; chặn egress tới mọi host khác mặc định. Không cho một nội dung website ra lệnh agent mở URL khác hay tải payload.
- Báo cáo phải ghi phạm vi, thời gian, phương pháp, bằng chứng đã khử nhạy cảm, mức độ tin cậy, ảnh hưởng, bước tái hiện an toàn, khuyến nghị, và việc có/không được vá. Tách “phát hiện”, “đã xác minh”, “giả thuyết”.
- Bản vá do AI đề xuất không đồng nghĩa đã đóng lỗ hổng; phải xem xét regression, auth/access controls, migration/data risks và xác minh fix trong staging.

### 6. Nhật ký và khả năng kiểm toán

Ghi cho từng tác vụ: ai khởi chạy, mục tiêu/phạm vi, agent/model/version, tools được cấp, files/context đã gửi (ưu tiên metadata hoặc hashes, tránh lưu nội dung nhạy cảm), commands/tool calls, thời điểm, chi phí/token, diff/commit/PR ID, kết quả checks, approvals, từ chối/chặn, và hành động cuối cùng. Dùng logs append-only hoặc có integrity controls, quyền truy cập giới hạn, retention ngắn có chủ đích. Không log giá trị secret, toàn bộ môi trường tiến trình hoặc raw customer data. Giao diện cần cho người dùng dừng tác vụ, revoke token, xem diff và biết rõ model nào nhận dữ liệu gì.

## Rủi ro và giới hạn thực tế

- **Không có cơ chế prompt nào đảm bảo agent miễn nhiễm prompt injection.** Phòng thủ quan trọng là giảm quyền, cô lập, kiểm soát mạng/tool và cần người duyệt.
- **Sandbox có thể cấu hình sai.** Bind mount, Docker socket, shared credential, quyền filesystem quá rộng hoặc egress tự do có thể phá vỡ mục đích cách ly.
- **Tự vá và tự deploy tạo rủi ro vận hành cao.** Bản vá security có thể làm hỏng checkout, authentication, migration hoặc chính sách RLS; rollback và người duyệt vẫn cần thiết.
- **Logs cũng là dữ liệu nhạy cảm.** Diff có thể làm lộ secret; tool logs có thể chứa URL có token hoặc output từ file bí mật.
- **Chi phí tăng theo nhiều lượt trao đổi và context dài.** Cần giới hạn token, lượt phản biện, thời gian chạy và ngân sách theo ngày/task; yêu cầu agent dừng khi đạt giới hạn.
- **“Ba AI cùng bàn” không đảm bảo ba hệ thống độc lập.** Nếu chúng nhận cùng prompt/code, có thể có cùng blind spot. Yêu cầu nguồn/evidence và cho agent rà độc lập trước khi đọc kết luận người khác.

## Mức triển khai đề xuất

**Giai đoạn 1 – an toàn, ít chi phí vận hành:** dashboard điều phối thủ công; gửi yêu cầu đến từng công cụ/API theo lượt; người dùng copy/duyệt kết quả; Git diff/branch; không chạy lệnh tự do và không kết nối production.

**Giai đoạn 2 – hỗ trợ repo có kiểm soát:** kết nối GitHub với quyền tối thiểu; tạo branch/PR; agent đọc repo được chọn và chạy allowlist checks trong runner ephemeral; secret scrubber, budget cap, logs, approval gates.

**Giai đoạn 3 – security testing staging:** thêm staging riêng, dữ liệu giả, network allowlist, rate limits, kill switch, quy tắc engagement, backup/rollback. Không tự động quét production.

**Không khuyến nghị:** cấp quyền admin cho tất cả agent; chia sẻ mật khẩu cá nhân; tự merge/deploy; cho agent chạy pentest production tự chủ; dùng nội dung AI làm chứng cứ duy nhất để khẳng định lỗ hổng đã sửa.

## Nguồn chính thức đã tham khảo

1. OWASP, Top 10 for LLM Applications (2025): https://owasp.org/www-project-top-10-for-large-language-model-applications/
2. OWASP, Prompt Injection: https://genai.owasp.org/glossary/prompt-injection/
3. OWASP AI Exchange, General Controls (least privilege, approval, authorization outside prompts): https://github.com/OWASP/www-project-ai-security-and-privacy-guide/blob/main/content/ai_exchange/content/docs/1_general_controls.md
4. OWASP Web Security Testing Guide, Introduction and scope: https://wstg.owasp.org/latest/2-Introduction/ and https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/01-Information_Gathering/00-Information_Gathering_Overview/
5. NIST AI Risk Management Framework and Generative AI Profile (NIST AI 600-1): https://www.nist.gov/itl/ai-risk-management-framework and https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
6. OpenAI API data controls: https://developers.openai.com/api/docs/guides/your-data
7. Anthropic API data retention: https://platform.claude.com/docs/en/manage-claude/api-and-data-retention and https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data
8. Google Gemini API Additional Terms, data use: https://ai.google.dev/gemini-api/terms and ZDR/retention: https://ai.google.dev/gemini-api/docs/zdr
9. GitHub protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
10. GitHub secret scanning/push protection: https://docs.github.com/en/code-security/concepts/secret-security/about-alerts
11. GitHub Codespaces security and secrets guidance: https://docs.github.com/en/codespaces/reference/security-in-github-codespaces
12. Docker Engine security and seccomp: https://docs.docker.com/engine/security/ and https://docs.docker.com/engine/security/seccomp

**Ghi chú thời điểm:** Các trang vendor và tài liệu sống có thể thay đổi. Nội dung trên phản ánh nội dung truy cập ngày 2026-10-26; xác minh lại điều khoản, mô hình được bao phủ, retention, tính năng và giá trước khi cấu hình thật.
