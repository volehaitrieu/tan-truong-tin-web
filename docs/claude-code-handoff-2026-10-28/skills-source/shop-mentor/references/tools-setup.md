# Cài đặt công cụ bên ngoài

Luôn hỏi người dùng trước khi cài. Kiểm tra trước: skill đã có trong danh sách skill của phiên chưa — có rồi thì không cài lại.

## Đã cài sẵn cho Claude Code (toàn máy, 2026-10-21)
| Công cụ | Vị trí | Kiểm tra |
|---|---|---|
| `ponytail-review`, `ponytail-audit` | `~/.claude/skills/` (chỉ 2 skill, **không** cài plugin Ponytail để tránh hook bật thường trực) | Có trong danh sách skill |
| `caveman` | `~/.claude/skills/caveman` (chỉ skill, không cài CLI/proxy → không gửi dữ liệu) | Có trong danh sách skill |
| `playwright-cli` | npm toàn máy `@playwright/cli` + skill `~/.claude/skills/playwright-cli` | `playwright-cli --version` |

Nếu thiếu (máy khác / cài lại):
- Ponytail: tải `skills/ponytail-review/SKILL.md` và `skills/ponytail-audit/SKILL.md` từ github.com/DietrichGebert/ponytail vào `~/.claude/skills/<tên>/SKILL.md`.
- Caveman: chép thư mục `skills/caveman` từ github.com/JuliusBrussee/caveman vào `~/.claude/skills/caveman`.
- Playwright: `npm install -g @playwright/cli@latest` rồi `playwright-cli install --skills --global`.

## Impeccable — cài theo từng dự án (giai đoạn 3)
Vì Impeccable ghi `PRODUCT.md`, `DESIGN.md`, thư mục `.impeccable/` và hook riêng cho dự án, chỉ cài khi dự án shop đã có thư mục:

```bash
npx impeccable install --providers=claude --scope=project
npx impeccable telemetry off
```
- Lần đầu chạy, nó tải bộ máy (engine) từ trang release GitHub của pbakaus/impeccable về `~/.impeccable/bin` — bình thường.
- Tắt telemetry để không gửi thống kê lựa chọn thiết kế.
- Thêm khối `.gitignore` theo README của Impeccable để không commit ảnh chụp/tệp tạm.
- Sau khi cài: `/impeccable init`, đưa nội dung `docs/PRD.md` làm thông tin sản phẩm. Dùng chung một `DESIGN.md` ở gốc dự án (shop-mentor đọc file này thay cho `docs/DESIGN.md` nếu đã có).

## Playwright CLI — lưu ý khi chạy
- Chạy dev server trước (`npm run dev`), rồi `playwright-cli open http://localhost:3000`. Không mở được `file://`.
- Mỗi lần thử dùng một phiên riêng: `playwright-cli -s=<tên> ...`, xong thì `playwright-cli -s=<tên> close`.
- Mobile: `playwright-cli resize 390 844`.
- Lấy ref nút bằng `playwright-cli find "Thêm vào giỏ"` hoặc `snapshot`; bấm bằng `click <ref>`.

## Context-mode (để sau)
Plugin + hook giữ dữ liệu lớn ngoài bộ nhớ hội thoại. Chỉ đề xuất khi người dùng hay bị hết lượt / Claude quên giữa chừng: `/plugin marketplace add mksglu/context-mode` rồi `/plugin install context-mode@context-mode`. Lưu ý trùng một phần với claude-mem đã cài.
