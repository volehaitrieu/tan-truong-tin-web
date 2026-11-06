# Giỏ hàng + Thanh toán — 2. Khung và bố cục (Claude Code, 06/11/2026)

> Trạng thái: **ĐÃ DUYỆT** — chủ shop chọn qua bản mẫu ngày 06/11/2026.
> Codex tự chọn chi tiết thị giác theo `docs/DESIGN.md` (màu token, bo góc, khoảng cách). Không đổi luồng, dữ liệu, câu chữ dưới đây khi chưa ghi lý do.

## Quyết định của chủ shop (06/11)
| Câu hỏi | Chọn |
|---|---|
| Trang thanh toán trên điện thoại | **Một trang cuộn**, đánh số 1-2-3-4, thanh dính đáy |
| Thanh dính đáy giỏ hàng | **Tiền hàng + nút Đặt hàng + nút Chat Zalo nhỏ** (phương án C) |
| Ô email | **Bỏ hẳn** khỏi biểu mẫu (không gửi `email` lên `placeOrder`; kiểu `email?` trong `PlaceOrderInput` giữ nguyên) |
| Món hết hàng | **Vẫn cho đặt**, nhãn "Đặt trước — shop gọi báo ngày có hàng" |
| Phí nội thành | **Đúng**: thẻ chọn ghi "20.000₫ · miễn phí từ 500.000₫", lấy từ `innerFee`/`freeFrom` |
| Ý kiến thêm | Thông tin đặt hàng phải có **ảnh, tên và thông tin liên quan của sản phẩm**, tham khảo các web bán hàng lớn; dùng taste-skill |

## Hướng thiết kế (taste-skill, quy tắc màn ứng dụng — chủ shop yêu cầu)
Đây là màn để **làm việc** (điền, kiểm, bấm), không phải trang quảng cáo: không hiệu ứng xuất hiện, không gradient, không bóng đổ cho thứ đứng yên (chỉ thanh dính và bảng nổi được có bóng nhẹ), không nhãn chữ in hoa nhỏ phía trên tiêu đề, không đánh số kiểu "01/02".
- **Đánh số bước** 1-2-3-4 được, vì là thứ tự điền thật: viết trong tiêu đề ("1. Người nhận"), không làm thành huy hiệu tròn trang trí.
- **Ô nhập**: nhãn đặt trên ô (14px, đậm 500), không dùng chữ mờ thay nhãn; ô cao 48px (điện thoại, dễ chạm), nền trắng, viền 1px `--line`; 16px giữa các ô.
- **Tách vùng bằng bậc màu nền** (`--ground` → `--surface` → `--sunk`), không viền đậm. Bo góc chọn một cách và giữ nhất quán (đề xuất 12px cho khối, 8px cho ô, nút tròn hẳn như nút hiện có).
- **Số tiền**: căn phải, chữ số đều (`.num`, tabular), mọi số tiền trong một khối kết thúc trên cùng một mép phải. Định dạng `formatVnd` sẵn có. Giá bán màu `--danger` theo DESIGN.md.
- **Ảnh sản phẩm**: ô ảnh cố định (giỏ 80px, tóm tắt thanh toán 56px), bo 8px, nền `--sunk`; chữ bắt đầu cùng một mép sau ảnh (12px). Ảnh minh họa chung giữ nhãn "Ảnh minh họa" như thẻ sản phẩm.
- **Một nút chính** mỗi màn (Đặt hàng, màu `--brand`); nút Zalo là nút phụ viền.
- **Tham khảo** cách các sàn lớn (Shopee, Tiki, Điện Máy Xanh, Thế Giới Di Động) trình bày dòng hàng trong giỏ/thanh toán: ảnh trái, tên 2 dòng, thông tin phụ một dòng xám, giá + số lượng bên phải. **Chỉ tham khảo bố cục**, không chép giao diện, màu hay chữ của họ.

## Dòng sản phẩm (dùng ở giỏ và tóm tắt thanh toán)
```
┌────┐ Quạt đứng Lifan Đ-16B 16in      ← tên, tối đa 2 dòng, bấm mở trang SP
│ảnh │ Lifan · Quạt đứng                ← thương hiệu · loại (nếu có dữ liệu)
│80px│ [Đặt trước — shop gọi báo…]      ← chỉ khi hết hàng
└────┘ 450.000₫ / cái   [−][ 2 ][+]  Xóa
                         Thành tiền 900.000₫   ← căn phải
```
- Thông tin phụ chỉ lấy từ dữ liệu có thật: `brand`, `sub`/`classification`, `unit`; thiếu thì bỏ dòng, **không tự điền**.
- Ở tóm tắt thanh toán (gọn hơn): ảnh 56px, tên 2 dòng, "× 2 · 450.000₫", thành tiền căn phải; không có nút sửa số lượng, có link "Sửa giỏ hàng" → `/gio-hang`.

## Tệp Codex được sửa
- `components/storefront/CartControls.tsx` — **chỉ** `CartPanel` và hàm phụ mới dùng riêng cho giỏ. Không đổi `addToCart`, `useCart`, `useCartLines`, `BuyBox`, `AddToCartButton`, `CartCount`, khóa `ttt-cart-v2`.
- `components/storefront/CheckoutForm.tsx` — giao diện; giữ nguyên đối tượng gửi `placeOrder` và `PlacedOrder`/`ORDER_KEY`.
- `app/(store)/gio-hang/page.tsx`, `app/(store)/thanh-toan/page.tsx`.
- Được tạo tệp mới trong `components/storefront/` nếu cần (ghi tên vào bàn giao).
- **Không** sửa `StoreShell.tsx`, `globals.css`, `actions.ts`, `lib/*`, `supabase/*`. Cần thì ghi yêu cầu vào bàn giao.

---

## Màn A — Giỏ hàng `/gio-hang`

### Điện thoại (375px)
```
┌───────────────────────────────┐
│ Giỏ hàng (3 món)              │ h1 + số món (tổng số lượng)
├───────────────────────────────┤
│ [ảnh] Tên sản phẩm 2 dòng…    │
│ 80px  450.000₫ / cái          │
│       [Đặt trước] (nếu hết)   │ nhãn màu ask
│       [ − ] [ 2 ] [ + ]  Xóa  │ ô số gõ được, 1–999
├───────────────────────────────┤
│ … các món khác …              │
├───────────────────────────────┤
│ Mua thêm sản phẩm →           │ link
│                               │
│ (khoảng trống để không bị     │
│  thanh dính che)              │
╞═══════════════════════════════╡ THANH DÍNH, ngay trên thanh đáy 64px
│ Tiền hàng        1.350.000₫   │
│ Phí ship tính ở bước sau      │
│ [Zalo] [     Đặt hàng      ]  │ Zalo = nút phụ viền → https://zalo.me/0948732064; Đặt hàng = nút chính 48px
└───────────────────────────────┘
```
### Desktop (≥ 1024px)
Giữ 2 cột như hiện tại: danh sách trái, khung "Tóm tắt đơn hàng" phải dính khi cuộn. Không dùng thanh dính đáy.

### Hành vi
- Nút − ở số lượng 1: không xóa ngay; hỏi gọn ngay tại dòng "Xóa món này? [Xóa] [Giữ]" (tránh bấm nhầm trên điện thoại). Nút "Xóa" riêng thì xóa luôn và hiện thông báo "Đã xóa … [Hoàn tác]" 5 giây.
- Ô số lượng: gõ được, ngoài 1–999 thì kẹp lại; bỏ trống khi rời ô = trở về số cũ.
- Món có `stock` = false: nhãn **"Đặt trước"** + dòng "Shop sẽ gọi báo ngày có hàng". (Nếu chủ shop chọn 2b: nhãn "Tạm hết hàng", nút Đặt hàng bị khóa kèm câu "Xóa món tạm hết để đặt hàng".)
- Món trong giỏ không còn bán (có trong `rows` nhưng không có trong `lines`): hiện 1 dòng "1 món không còn bán đã được bỏ khỏi giỏ" và xóa khỏi giỏ.

### Trạng thái
| Trạng thái | Hiển thị |
|---|---|
| Đang tải | Khung xương (skeleton) 2 dòng đúng chiều cao dòng thật + thanh dính xám — không nhảy bố cục |
| Trống | Giữ khối hiện có: icon, "Giỏ hàng của bạn đang trống", "Chọn vài món cần mua rồi quay lại đây để đặt hàng.", nút "Xem sản phẩm" → `/danh-muc` |
| Lỗi tải giá | "Chưa tải được giá. Kiểm tra mạng rồi thử lại." + nút "Thử lại" |

---

## Màn B — Thanh toán `/thanh-toan`

### Điện thoại (375px) — một cột, thứ tự:
```
┌───────────────────────────────┐
│ Thông tin đặt hàng            │ h1
│ ▸ Đơn hàng (3 món) 1.350.000₫ │ khối thu gọn, chạm để xem từng món
├───────────────────────────────┤
│ 1. Người nhận                 │
│   Họ tên *                    │
│   Số điện thoại *             │
│   (không có ô Email)          │
├───────────────────────────────┤
│ 2. Cách nhận hàng             │ 3 thẻ chọn, ≥ 56px
│  ◉ Đến cửa hàng lấy · 0₫      │   379 đường 2/4, Nha Trang
│  ○ Giao nội thành · 20.000₫   │   miễn phí từ 500.000₫ (theo câu hỏi 3)
│  ○ Gửi đi tỉnh · phí báo sau  │   SPX, GHTK
├───────────────────────────────┤
│ 3. Địa chỉ (ẩn khi lấy tại    │
│    cửa hàng)                  │
│   Tỉnh/TP *   Phường/Xã *     │
│   Số nhà, tên đường *         │
├───────────────────────────────┤
│ Ghi chú (không bắt buộc)      │
├───────────────────────────────┤
│ 4. Thanh toán                 │
│  ◉ Tiền mặt khi nhận (COD)    │
│  ○ VietQR — Sắp có (mờ)       │
├───────────────────────────────┤
│ Tiền hàng           1.350.000₫│ bảng tính đầy đủ
│ Phí ship                0₫    │
│ Tạm tính            1.350.000₫│
╞═══════════════════════════════╡ THANH DÍNH đáy
│ Tạm tính 1.350.000₫           │
│ [         Đặt hàng          ] │
│ Shop sẽ gọi xác nhận trước khi│
│ giao.                         │
└───────────────────────────────┘
```
### Desktop
Giữ 2 cột: biểu mẫu trái, khung đơn hàng phải dính (danh sách món mở sẵn, tiền, nút Đặt hàng).

### Hành vi
- Bấm Đặt hàng khi có lỗi: cuộn và đặt con trỏ vào ô lỗi đầu tiên (giữ cách hiện tại), thanh dính hiện "Còn N ô cần sửa".
- Đang gửi: nút khóa, chữ "Đang gửi đơn…"; không cho bấm lần 2.
- Lỗi máy chủ: hiện **ngay trên nút Đặt hàng trong thanh dính** (điện thoại) / trong khung phải (desktop), `role="alert"`, giữ nguyên chữ máy chủ trả về.
- Chọn "Giao nội thành" mà phường ngoài Nha Trang: giữ thông báo hiện có "Địa chỉ này ngoài Nha Trang — chọn “Gửi đi tỉnh”." và thêm nút nhỏ "Chuyển sang Gửi đi tỉnh".
- Chữ phí ship trên thẻ chọn và trong bảng tính phải lấy cùng một nguồn (`innerFee`, `freeFrom`); `innerFee` = null thì ghi "phí báo khi xác nhận".
- Giỏ trống: giữ khối hiện có ("Giỏ hàng đang trống nên chưa đặt hàng được." + "Xem sản phẩm").
- Món đặt trước: hiện nhãn "Đặt trước" trong danh sách món.

### Không đổi
- Kiểm tra ô (họ tên, SĐT 10 số bắt đầu 0, phường/xã, số nhà) và câu báo lỗi hiện có.
- Đối tượng gửi `placeOrder`; lưu `ORDER_KEY` rồi chuyển `/cam-on`; `clearCart()` sau khi thành công.

## Khả năng truy cập
- Thanh dính không che ô đang nhập khi bàn phím mở (ẩn thanh dính khi một ô nhập đang được chọn trên điện thoại, hoặc cho nó đi theo `visualViewport`).
- Mỗi nhóm chọn dùng `fieldset/legend`; nhãn gắn với ô; vùng thông báo `aria-live="polite"` cho đổi số lượng/xóa.
- Chữ ≥ 13px cho nội dung, ≥ 12px cho chú thích.
