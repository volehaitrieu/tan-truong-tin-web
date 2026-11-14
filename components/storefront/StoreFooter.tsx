import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { SHOP } from "@/lib/shop";

const MAPS = "https://www.google.com/maps/search/?api=1&query=379+%C4%91%C6%B0%E1%BB%9Dng+2%2F4+Nha+Trang";
// Tạm dùng trang cá nhân của chủ shop cho tới khi có Fanpage
const FACEBOOK = "https://www.facebook.com/trieu.vo.697369";

const GROUPS: { title: string; links: [string, string][] }[] = [
  { title: "Chính sách", links: [["/chinh-sach#doi-tra", "Đổi trả"], ["/chinh-sach#bao-hanh", "Bảo hành"], ["/chinh-sach#van-chuyen", "Vận chuyển"], ["/chinh-sach#thanh-toan", "Thanh toán"], ["/chinh-sach#bao-mat", "Bảo mật"]] },
  { title: "Hỗ trợ", links: [["/tra-cuu", "Tra cứu đơn"], ["/danh-muc", "Danh mục"], ["/voucher", "Voucher"], ["/chinh-sach#gioi-thieu", "Giới thiệu"]] },
];
const PAYMENTS = ["Tiền mặt", "Chuyển khoản", "VietQR"];

// Chân trang theo cách các shop lớn làm (tổng đài lên đầu, nhóm liên kết có tiêu đề, mạng xã hội, cách thanh toán).
// Thông tin pháp lý (ĐKKD) và huy hiệu Bộ Công Thương: chưa có, thêm khi chủ shop cung cấp và đã thông báo.
export function StoreFooter() {
  return (
    <footer className="mt-10 bg-surface text-ink">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-8 md:grid-cols-[1.4fr_1fr_1fr] md:py-12">
        {/* Khối hỗ trợ: việc khách cần nhất ở cuối trang là gọi, nhắn, tìm đường */}
        <section aria-labelledby="f-ho-tro" className="rounded-2xl bg-[#17324d] p-5 text-white md:row-span-2">
          <h2 id="f-ho-tro" className="text-lg font-bold">Cần hỗ trợ? Gọi ngay</h2>
          <a href="tel:0948732064" className="mt-3 flex min-h-11 items-center gap-2 text-[22px] font-extrabold tracking-tight"><Phone className="size-5" aria-hidden />{SHOP.phone}</a>
          <p className="text-sm text-white/80">Số phụ: <a href="tel:0793783379" className="font-semibold text-white underline-offset-2 hover:underline">{SHOP.phone2}</a></p>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/85"><Clock className="size-4 shrink-0" aria-hidden />Mở cửa {SHOP.hours} hằng ngày</p>
          <p className="mt-1.5 flex gap-2 text-sm text-white/85"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />{SHOP.address}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a href="https://zalo.me/0948732064" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-white text-sm font-bold text-[#17324d] hover:bg-[#e8f0f1]"><MessageCircle className="size-4" aria-hidden />Nhắn Zalo</a>
            <a href={MAPS} target="_blank" rel="noopener" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-white/10 text-sm font-bold text-white hover:bg-white/20"><MapPin className="size-4" aria-hidden />Chỉ đường</a>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6 md:contents">
          {GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="text-sm font-bold">{g.title}</h2>
              <ul className="mt-1">
                {g.links.map(([href, label]) => (
                  <li key={href}><Link href={href} className="flex min-h-10 items-center text-sm text-ink-2 hover:text-brand">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:col-span-2">
          <div>
            <h2 className="text-sm font-bold">Thanh toán</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {PAYMENTS.map((p) => <li key={p} className="rounded-lg bg-sunk px-3 py-1.5 text-[13px] font-medium">{p}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold">Kết nối</h2>
            <ul className="mt-2 flex flex-wrap gap-2 text-[13px] font-semibold">
              <li><a href={FACEBOOK} target="_blank" rel="noopener" className="flex min-h-10 items-center rounded-lg bg-sunk px-3 hover:bg-brand-tint hover:text-brand">Facebook</a></li>
              <li><a href="https://zalo.me/0948732064" className="flex min-h-10 items-center rounded-lg bg-sunk px-3 hover:bg-brand-tint hover:text-brand">Zalo</a></li>
            </ul>
          </div>
        </div>
      </div>
      <p className="bg-ground px-4 py-4 text-center text-xs text-ink-2">© 2026 {SHOP.name} · Nha Trang</p>
    </footer>
  );
}
