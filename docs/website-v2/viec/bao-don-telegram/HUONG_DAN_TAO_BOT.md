# Tạo bot Telegram báo đơn — hướng dẫn cho chủ shop

Mất khoảng 10 phút. **Không gửi mã bot (token) cho ai, kể cả vào chat với Claude.** Mã này như chìa khóa: ai có nó thì gửi tin được nhân danh bot của bạn.

## Bước 1 — Tạo bot (điện thoại hoặc máy tính)
1. Mở Telegram, tìm **@BotFather** (có dấu tích xanh), bấm Start.
2. Gõ `/newbot`.
3. Tên hiển thị: `Tân Trường Tín báo đơn`. Tên đăng nhập của bot phải kết thúc bằng `bot`, ví dụ `tantruongtin_don_bot` (nếu bị trùng, thêm số).
4. BotFather trả về một dòng **token**, dạng `123456789:AAH...`. **Chép lại cẩn thận, chỉ để cho bạn.**

## Bước 2 — Tạo nhóm nhận tin
1. Tạo **nhóm mới** tên `Báo đơn Tân Trường Tín`, chỉ mời người cần nhận đơn (tin có tên và số điện thoại khách).
2. Thêm bot `tantruongtin_don_bot` vào nhóm (tìm bằng tên đăng nhập).
3. Nhắn một tin bất kỳ vào nhóm, ví dụ `chào bot`.
4. Quay lại BotFather: gõ `/mybots` → chọn bot → **Bot Settings** → **Allow Groups?** → **Turn groups off** (để không ai khác thêm được bot vào nhóm lạ).

## Bước 3 — Lấy mã nhóm (chat id)
Trên trình duyệt máy tính của bạn, mở địa chỉ sau, thay `TOKEN` bằng token của bạn (chỉ bạn nhìn thấy, đừng chụp màn hình gửi người khác):

`https://api.telegram.org/botTOKEN/getUpdates`

Tìm đoạn `"chat":{"id":-100xxxxxxxxxx` — số bắt đầu bằng dấu trừ (thường là `-100...`) là **chat id** của nhóm. Chép lại.

## Bước 4 — Dán vào cấu hình (không dán vào mã)
**Trên máy bạn (để thử):** mở tệp `.env.local` ở thư mục dự án (tệp này không bao giờ lên GitHub), thêm 3 dòng:
```
TELEGRAM_BOT_TOKEN=token_cua_ban
TELEGRAM_CHAT_ID=-100xxxxxxxxxx
SITE_URL=https://tantruongtin.com
```
Khởi động lại máy chủ thử.

**Trên web thật (Vercel):** vào dự án `tan-truong-tin-web` → Settings → Environment Variables → thêm 3 biến trên, chọn **Production**, bật **Sensitive** cho `TELEGRAM_BOT_TOKEN`. Sau đó phải **deploy lại** thì biến mới có hiệu lực.

## Bước 5 — Thử
Vào trang quản trị → **Cài đặt** → mục "Thông báo đơn mới qua Telegram" → bấm **Gửi tin thử**. Nhóm sẽ nhận một tin trong vài giây. Nếu báo lỗi, đọc dòng báo lỗi (sai token, bot chưa vào nhóm, sai chat id…).

## Về an toàn
- Nếu nghi token bị lộ: vào BotFather → `/revoke` để đổi token, rồi dán token mới.
- Tin báo đơn có tên, số điện thoại và địa chỉ khách; chỉ để người trong shop thấy.
- Nếu Telegram lỗi, đơn của khách **vẫn được lưu** và hiện trong trang quản trị; chỉ là bạn không nhận được tin. Nên thỉnh thoảng mở mục Đơn hàng để chắc không sót.
