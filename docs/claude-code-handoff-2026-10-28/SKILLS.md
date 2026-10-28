# Skills để Claude Code tiếp quản

## Cách nạp

Claude Code hỗ trợ skill dạng thư mục có `SKILL.md`; cấp project dùng `.claude/skills/<tên>/SKILL.md`, cấp cá nhân dùng `~/.claude/skills/<tên>/SKILL.md`. Nạp khi phù hợp hoặc gọi `/tên-skill`. Tài liệu chính thức đã tra khi soạn hồ sơ: https://code.claude.com/docs/en/skills (28-10-2026). Cách nạp skill không đồng nghĩa cấp quyền tools/MCP.

Gói `skills-source/` có bản sao nguyên nguồn của 7 skill cùng tài nguyên đi kèm (52 file). Nguồn gốc nằm trong `SKILL_PROVENANCE.json`; checksum gói trong `FILE_MANIFEST.csv`. Không tự cài vào Claude trong lượt này. Có thể xem diff bản nguồn với skill đang cài trước khi chọn cập nhật.

## Bộ cốt lõi đã đóng gói

| Skill | Dùng khi | Ưu tiên |
|---|---|---|
| commerce-content-review | Mọi quyết định sản phẩm/ecommerce, nội dung, kỹ thuật, chăm sóc khách hàng: phản biện dựa bằng chứng | User yêu cầu áp dụng xuyên suốt |
| shop-mentor | Bối cảnh shop, lộ trình, giải thích tiếng Việt, log tiến độ, điều phối | Dùng để giữ bối cảnh nghiệp vụ |
| frontend-ui-engineering | Form thêm/sửa, ảnh, tương tác, responsive, accessibility | Cần cho công việc hiện tại |
| supabase | Auth, Storage, migrations, RLS và các truy vấn liên quan | Cần cho upload/storage |
| supabase-postgres-best-practices | SQL, transaction, index, hiệu năng DB, tối ưu truy vấn | Nạp khi sửa SQL, không cần đọc mọi reference mỗi lượt |
| ponytail-review | Review một thay đổi: logic, dữ liệu, bảo mật, test, scale | Sau đợt code |
| ponytail-audit | Rà toàn repo trước mốc phát hành lớn | Tùy thời điểm, không chạy audit toàn repo cho mỗi chỉnh nhỏ |

Các skill là chỉ dẫn, không phải package npm/Python. Không cần cài PyYAML để dùng trực tiếp Markdown; chỉ cài nếu công cụ kiểm tra frontmatter thực sự cần.

## Cài có kiểm soát

Trong PowerShell, từ repo:

```powershell
& '.\docs\claude-code-handoff-2026-10-28\Install-Skills.ps1' -ProjectRoot '.'
```

Script chỉ sao chép 7 thư mục skill vào `.claude/skills`. Nếu đã có skill cùng tên ở project hoặc thư mục cá nhân, script bỏ qua và báo để so sánh; không ghi đè. Không sửa permissions/settings/hooks, không cài plugin hay MCP, không gọi mạng, không đổi execution policy. Nếu Windows chặn script, đọc lỗi/cơ chế quản lý máy và chọn cách cài thích hợp; không tắt chính sách toàn máy một cách máy móc.

Nếu giải nén gói ở nơi khác, truyền `-ProjectRoot 'C:\Users\Hai Trieu\Documents\tan-truong-tin-web'` đúng repo; không đặt default theo vị trí ZIP.

Đã thấy các thư mục cá nhân Claude như shop-mentor, ponytail-review, ponytail-audit, playwright-cli và nhiều skill thiết kế; danh sách thực tế ở `CLAUDE_SKILLS_EXISTING.txt`. Đây chỉ là kiểm kê thư mục, chưa chứng minh tất cả skill/plugin đang được Claude nạp hoặc nội dung giống bản đóng gói.

## Quy tắc tránh xung đột

- Hướng dẫn user mới nhất và phạm vi đã đồng ý quyết định việc làm. Shop Mentor có bước hỏi trước; user đã xác nhận và nói bắt đầu phần ảnh/tạo sản phẩm, không hỏi lại từ đầu các điểm đó.
- Commerce review yêu cầu phản biện có lý do, không kéo dài xác nhận cho việc đủ rõ. Không tự nhận thâm niên người thật.
- Các skill nguồn có thể nhắc tools/skill không có trong Claude hiện tại. Kiểm tra khả năng thật, dùng công cụ tương đương phù hợp; không giả vờ đã gọi Codex-only tools hoặc agent.
- Chỉ chọn một hướng dẫn thiết kế chính cùng lúc. Giữ `docs/DESIGN.md`; không trộn Hallmark, Taste, UI-UX Pro Max và các style khác để tự redesign toàn bộ admin.
- Không cho nhiều agent cùng sửa một vùng file. Không cài hook tự chạy test/commit/deploy từ skill nếu chưa xem tác động.
- Skills không tự tạo kết nối Supabase, không chuyển secrets và không khôi phục memory cũ. Claude cần kết nối công cụ phù hợp riêng.
- Kiểm chứng code bằng typecheck/build/test có ý nghĩa theo rủi ro. Việc phiên trước chưa test không phải quy định phải tiếp tục bỏ test. Tránh script test đụng dữ liệu thật hoặc seed lại sản phẩm user đã xóa.

## Skills tùy chọn, chưa tự cài

| Nhóm | Skill/bộ nguồn hiện có | Khi nên dùng |
|---|---|---|
| Thiết kế | `.agents/skills/frontend-design`, `design-taste-frontend`, `hallmark` trong repo | Khi user mở lại phần thiết kế; các thư mục này bị gitignore, clone sạch có thể thiếu |
| Workflow | Bộ Superpowers 7.0.0 tại cache Codex: brainstorming, writing-plans, systematic-debugging, verification-before-completion, requesting-code-review, using-git-worktrees… | Cài đúng bộ tương thích Claude để giữ dependencies tương đối; không chỉ copy một SKILL.md có link sang sibling bị thiếu |
| Review/module | Matt Pocock: code-review, diagnosing-bugs, domain-modeling, codebase-design, writing-for-agents | Khi cần review sâu hoặc sửa mô hình nghiệp vụ |
| Browser | playwright-cli; skill browser của môi trường Claude thực tế | Test UI; không copy Codex CUA/IAB tool contract rồi giả định Claude có các API đó |
| Excel | xlsx / spreadsheets tương thích môi trường | Khi phân tích/sửa workbook; tránh đóng gói gói artifact/runtime Codex thành skill Claude thuần |
| Nội dung | copywriting, seo-content-brief, write-content | Sau khi sản phẩm/chính sách thật rõ; chưa ưu tiên SEO khi đang chặn index |
| Bộ nhớ | claude-mem, handoff, mem-search | Tùy chọn cần plugin/backend riêng. Hồ sơ này không cam kết memory tự đồng bộ giữa các app |

Danh mục nguồn trong cache có thể thay đổi khi plugin nâng cấp. Dùng bản đóng gói cho 7 skill chính; với nhóm tùy chọn, xác minh nguồn và hướng dẫn cài chính thức thay vì đoán lệnh marketplace. Gói cũ `exports/ttt-ai-skills-pack.zip` vẫn còn nhưng chưa được kiểm lại, không ưu tiên hơn gói mới này.
