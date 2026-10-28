# Mốc so sánh (baseline) — Bước 0, kế hoạch nâng cấp desktop v4

Ghi ngày **26-10-2026**, trên `npm run dev` (Next.js 16.4.2), Chrome headless, DPR 1. Đây là mốc trước khi triển khai desktop, không phải trạng thái mã hiện tại.
Thư mục này **không vào git** (xem `.hallmark/.gitignore`).

## Ảnh baseline desktop — `shots/baseline/`

Ảnh full-page, đúng bề ngang khung nhìn, chụp bằng puppeteer-core (cài ngoài repo, không đụng `package.json`).

| Tệp | Màn | Bề ngang | Kích thước ảnh |
|---|---|---|---|
| `trang-chu-1440.png` | `/` | 1440px | 1440 × 5009 |
| `trang-chu-1280.png` | `/` | 1280px | 1280 × 5009 |
| `danh-muc-1440.png` | `/danh-muc` | 1440px | 1440 × 2985 |
| `danh-muc-1280.png` | `/danh-muc` | 1280px | 1280 × 2985 |
| `danh-muc-quat-1440.png` | `/danh-muc/quat` | 1440px | 1440 × 3081 |
| `danh-muc-quat-1280.png` | `/danh-muc/quat` | 1280px | 1280 × 3081 |

## Mốc Hallmark

- `before.json` + `before.txt` — bản ghi chính thức, dùng cho `--kept` về sau.
  Chạy lại ngày 26-10 **có tầng render** (lần trước thiếu): 14 FAIL, 30 REFLEX, 3 WARN.
  Ghi nhận 72 liên kết, 54 trường, 38 handler và 1 trang đã dựng.
- `before/` — 5 ảnh Hallmark tự chụp trang chủ (1280×800, 1440×900, 1920×1080 ở phần đầu; 1440 và 375 full page).
- `before-run-2.log` — nhật ký lần chạy đầy đủ.
- `before-url-danh-muc.txt` — 15 FAIL, 26 REFLEX, 3 WARN.
- `before-url-danh-muc-quat.txt` — 16 FAIL, 23 REFLEX, 2 WARN.
- `before-url-tim-kiem-query-quat.txt` — 16 FAIL, 23 REFLEX, 2 WARN.

Bốn tệp trên phủ đủ **cả 4 màn dùng `ProductBrowser`**, đúng yêu cầu kiểm tra của Bước 2.

## Bản ghi cũ (giữ lại để đối chiếu)

`truoc-khi-chay-lai/` giữ `before.json` + `before.txt` của phiên 25-10: **11 FAIL, 2 REFLEX, 1 WARN**,
chỉ 20 liên kết và 3 trường. Lần đó tầng render **không chạy** (máy chưa có puppeteer) và
`http://localhost:3000` **đọc không được** (chưa bật `npm run dev`) — xem `before-home.txt`.
Chênh lệch giữa hai bản **không phải là lỗi mới sinh ra**: cùng 26 tệp nguồn, bản mới chỉ thấy thêm
các lỗi chỉ lộ ra khi trang được dựng thật (tương phản màu, số chữ trên một màn, chiều cao nút,
khoảng cách giữa các khối, cỡ tiêu đề mục).

## Chạy lại cách nào

```bash
npm run dev     # phải bật trước, nếu không tầng URL sẽ đọc không được

export HALLMARK_PUPPETEER="C:/Users/Hai Trieu/.ttt-shot-tools/deps"
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"

node .agents/skills/hallmark/scripts/sloplint.mjs "app/(store)" components/storefront app/globals.css \
  --scope page --render --url http://localhost:3000 --kept     # --kept để so với mốc này

node "C:/Users/Hai Trieu/.ttt-shot-tools/bin/shot.mjs" .hallmark/shots/sau 1440 \
  http://localhost:3000/ trang-chu \
  http://localhost:3000/danh-muc danh-muc \
  http://localhost:3000/danh-muc/quat danh-muc-quat
```

## Bản after desktop — AI-001 (26-10-2026)

- Ảnh after cuối cùng (build production, sau chỉnh sửa cuối): `.hallmark/shots/after/final/` — trang chủ, `/danh-muc`, `/danh-muc/quat` ở cả 1280px và 1440px.
- Preview production local hiện chạy tại `http://localhost:3101/`; để xem các màn còn lại thêm `/danh-muc`, `/danh-muc/quat`, hoặc `/tim-kiem?query=quat`.
- Build production thành công; cả bốn route trả HTTP 200 và lưới còn hiển thị khi JavaScript tắt.
- Hallmark sau trên bốn route ghi 6 FAIL, 95 REFLEX, 10 WARN. Các FAIL 58 (mật độ chữ) và 73 (chồng chữ thông số/giá) đã có trong baseline route tương ứng. `--kept` chỉ đối chiếu được một phần vì baseline cũ ghi URL `localhost:3000`, còn lượt after chạy ở cổng `3101`; xem kết quả hiện hành trong `.hallmark/before.txt` và so từng route với các tệp `before-url-*.txt`.
- Đây không phải chứng nhận Hallmark sạch; các lỗi 58/73 còn là điểm thiết kế baseline cần quyết định nếu muốn xử lý ở task riêng.

## Phản hồi chủ shop — vòng desktop tiếp theo (26-10-2026)

- Bản desktop đang xem trên `http://localhost:3000/`.
- Xác nhận hai danh mục con rỗng: Đèn tuýp (danh mục Đèn chiếu sáng) và Quạt hút / thông gió (danh mục Quạt). Chip rỗng đã được ẩn trong menu và bộ lọc; dữ liệu không thay đổi.
- Nút quay lại cạnh breadcrumb đã thử và hoạt động từ trang chủ vào trang Đèn rồi quay lại.
- Độ rộng thẻ dải giảm giá dùng cùng phép tính với lưới 4 cột.
- HTML production `.next/server/app/index.html` có 14 thuộc tính `loading="lazy"` cho ảnh thẻ sản phẩm; ảnh hero vẫn ưu tiên tải.
- `npx next build --webpack` thành công; ESLint mục tiêu đạt. Lệnh build mặc định Turbopack panic khi tạo tiến trình phụ trong sandbox; build webpack thay thế đạt. Hallmark render chạy sau khi cho phép Chrome headless ngoài sandbox; kết quả được ghi ở phần sau. Không tuyên bố Hallmark sạch.
- Chờ chủ shop duyệt desktop; không commit, deploy hay làm mobile.

### Hallmark sau phản hồi desktop

Render bằng Chrome headless đã chạy trên `http://localhost:3000/`: 5 FAIL, 28 REFLEX, 3 WARN trên các route storefront đã quét và một trang đã dựng. Bốn FAIL nguồn đã có từ baseline, ngoài phạm vi sửa: dấu gạch ở báo giá, màu literal ở checkout/tra cứu và chữ hoa ở mã đơn. Một FAIL render là mật độ 108 từ trong màn đầu trang chủ, không do bốn chỉnh sửa phản hồi desktop. Kết quả này chưa làm Hallmark sạch; ảnh `localhost-3000-*` là ảnh lượt kiểm tra.
