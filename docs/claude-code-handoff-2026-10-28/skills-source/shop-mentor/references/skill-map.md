# Bản đồ skill theo giai đoạn

Luôn kiểm tra skill có trong danh sách khả dụng của phiên trước khi đề xuất. Nếu không có, ghi "(không có sẵn — Mentor tự làm)" trong đề xuất.

| Nhu cầu | Skill / công cụ | Giai đoạn | Ghi chú |
|---|---|---|---|
| Làm rõ ý tưởng, tính năng mới | `superpowers:brainstorming` | 0, 1, bất kỳ tính năng mới | Hỏi từng câu, chốt thiết kế trước khi code |
| Nghiên cứu đối thủ, thị trường | `anthropic-skills:deep-research`, `marketing:competitive-brief` | 1 | Cần nhiều nguồn → deep-research |
| Tên shop, domain | Shopify `generate-business-names`, `generate-domain-names` (nếu có) | 0 | Chỉ để gợi ý tên/kiểm tra domain, stack vẫn là Next.js |
| Viết kế hoạch triển khai | `superpowers:writing-plans` | 2, đầu mỗi tính năng lớn | Ra DEV_PLAN chia task nhỏ |
| Thực thi kế hoạch | `superpowers:executing-plans`, `superpowers:subagent-driven-development` | 6, 7 | Dừng sau mỗi task để người dùng duyệt |
| Thương hiệu | `small-business:brand-style`, `ui-ux-pro-max:brand` | 3 | |
| Thiết kế trang công khai | **Impeccable** `/impeccable craft` (chính); `design-taste-frontend` (phụ — hình minh họa, cảm giác thủ công) | 3, 6 | Impeccable cài theo dự án, xem tools-setup.md. Tốn token → dùng cho trang quan trọng |
| Thiết kế màn hình admin | **Impeccable** `/impeccable craft` / `layout`; `ui-ux-pro-max:ui-ux-pro-max` | 7 | |
| Làm chắc form & checkout | `/impeccable harden checkout` | 6, 8 | Lỗi, trạng thái trống, chữ tràn |
| Tối ưu điện thoại | `/impeccable adapt` | 6, 9 | |
| Hoàn thiện trước deploy | `/impeccable audit` + `/impeccable polish` | 9 | |
| Design system / token | `design:design-system`, `ui-ux-pro-max:design-system` | 3 | Ghi vào DESIGN.md |
| Chữ trên giao diện | `design:ux-copy` | 3, 6 | Nút, thông báo lỗi, trạng thái trống |
| Banner, ảnh khuyến mãi | `ui-ux-pro-max:banner-design`, Canva (nếu đã kết nối) | 10 | |
| Database, migration, RLS | Supabase MCP: `list_tables`, `apply_migration`, `execute_sql`, `get_advisors`, `generate_typescript_types` | 5 | `apply_migration` thay đổi DB thật → luôn hỏi |
| Câu SQL báo cáo | `data:sql-queries`, `data:write-query` | 5, 7 | |
| Dashboard admin | `data:build-dashboard`, `dataviz`, `data:create-viz` | 7 | |
| Nhập/xuất Excel sản phẩm | `anthropic-skills:xlsx` | 7 | |
| Tính năng AI (chatbot tư vấn, viết mô tả SP) | `claude-api` | 8, 10 | Dùng model Claude mới nhất |
| Chạy & xem thử app | `run`, `built-in-browser` | 4-9 | |
| Robot thử luồng mua hàng / admin | `playwright-cli` | 6, 7, 9 | Qua localhost; chụp 390px; ghi thành test chạy lại |
| Viết test | `superpowers:test-driven-development` | 6, 7, 8 | Ưu tiên logic tiền, tồn kho, trạng thái đơn |
| Sửa lỗi | `superpowers:systematic-debugging` | bất kỳ | Tìm nguyên nhân gốc trước khi sửa |
| Kiểm tra trước khi báo xong | `superpowers:verification-before-completion` | mọi task | |
| Review code | `ponytail-review` (chính), `code-review`, `superpowers:requesting-code-review` | cuối mỗi tính năng | Sửa "Must fix" trước khi sang task mới |
| Rà toàn dự án | `ponytail-audit` | 9 | Một lần trước deploy |
| Tiết kiệm token khi code/debug | `caveman` | 4-9 | Chỉ khi người dùng đồng ý; báo cáo + bảng lựa chọn vẫn đầy đủ |
| Bảo mật | `security-review` + Supabase `get_advisors` | 5, 8, 9 | |
| Truy cập (a11y) | `design:accessibility-review` | 9 | |
| SEO kỹ thuật | `marketing:seo-audit` | 9, 10 | |
| SEO / AI search | `small-business:seo-ai-visibility` | 10 | |
| Nội dung, blog, mô tả SP | `marketing:content-creation`, `marketing:draft-content` | 10 | |
| Mạng xã hội | `small-business:social-content-engine` | 10 | |
| Email marketing | `marketing:email-sequence` | 10 | |
| Kế hoạch chiến dịch | `marketing:campaign-plan` | 10 | |
| Quảng cáo | `small-business:ad-manager` | 10 | |
| Đánh giá khách | `small-business:review-reputation` | 10 | |
| Tồn kho, nhập hàng | `small-business:inventory-planner`, `small-business:restock` | 7, 10 | |
| Dòng tiền | `small-business:cash-flow-snapshot` | 10 | |
| Báo cáo hiệu quả | `marketing:performance-report`, `small-business:report-builder` | 10 | |
| Chăm sóc khách / FAQ | `customer-support:kb-article`, `customer-support:draft-response` | 10 | |
| Git branch / hoàn tất | `superpowers:using-git-worktrees`, `superpowers:finishing-a-development-branch` | 4-9 | |
| Lưu ghi nhớ dài hạn | memory của Claude (nếu có) | mọi lúc | Lưu sở thích người dùng, quyết định lớn |

## Cách trình bày skill trong đề xuất
Mỗi phương án ghi rõ: `Skill: <tên> — <để làm gì>`. Ví dụ:
> **A ⭐ Thiết kế trang chủ bằng code ngay** — Skill: `design-taste-frontend` (chọn hướng thẩm mỹ + dựng trang) → `built-in-browser` (chụp màn hình cho bạn xem).
