import Link from "next/link";
import type { ReactNode } from "react";
import { Clock3, House, MapPin, MessageCircle, Phone, ReceiptText, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { StoreSearch } from "@/components/storefront/StoreSearch";
import { CartCount } from "@/components/storefront/CartControls";
import { CategoryDrawer } from "@/components/storefront/CategoryDrawer";
import { SHOP } from "@/lib/shop";

export const POLICIES = [
  ["doi-tra", "Đổi trả"],
  ["bao-hanh", "Bảo hành"],
  ["van-chuyen", "Vận chuyển"],
  ["thanh-toan", "Thanh toán"],
  ["bao-mat", "Bảo mật"],
  ["gioi-thieu", "Giới thiệu"],
] as const;

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="store flex min-h-screen flex-col pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
      <div className="bg-brand-tint text-[13px] text-ink-2">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-5 gap-y-1 px-4 py-2">
          <span className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-brand" aria-hidden />{SHOP.address}</span>
          <span className="flex items-center gap-1.5"><Clock3 className="size-3.5 shrink-0 text-brand" aria-hidden />{SHOP.hours} hằng ngày</span>
          <a className="hidden items-center gap-1.5 font-semibold text-brand sm:flex" href="tel:0948732064"><Phone className="size-3.5" aria-hidden />Hotline {SHOP.phone}</a>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-2.5 sm:gap-5">
          <Link href="/" className="shrink-0" aria-label="Tân Trường Tín — Trang chủ">
            <Logo size={40} subtitle={SHOP.tagline} subtitleClassName="hidden lg:block" />
          </Link>
          <div className="hidden min-w-0 flex-1 sm:block"><StoreSearch /></div>
          <Link href="/tra-cuu" className="ml-auto hidden min-h-11 items-center gap-1.5 text-sm font-medium text-brand hover:underline sm:ml-0 md:flex">
            <ReceiptText className="size-4" aria-hidden />Tra cứu đơn
          </Link>
          <Link href="/gio-hang" aria-label="Giỏ hàng" className="relative ml-auto grid size-11 shrink-0 place-items-center rounded-md bg-brand-tint text-brand hover:bg-[#d3eadc] sm:ml-0">
            <ShoppingCart className="size-5" aria-hidden />
            <CartCount />
          </Link>
        </div>
        <div className="px-4 pb-3 sm:hidden"><StoreSearch mobile /></div>
      </header>

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 pb-10 pt-5">{children}</main>

      <footer className="bg-brand-deep text-white">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo size={40} tone="light" subtitle={SHOP.tagline} />
            <p className="mt-4 text-sm italic text-white/80">“{SHOP.slogan}”</p>
            <p className="mt-3 text-sm text-white/80">{SHOP.address}</p>
            <p className="flex flex-wrap gap-x-4 text-sm text-white/80">
              <a href="tel:0948732064" className="inline-flex min-h-11 items-center hover:text-white">{SHOP.phone}</a>
              <a href="tel:0793783379" className="inline-flex min-h-11 items-center hover:text-white">{SHOP.phone2}</a>
            </p>
            <p className="mt-1 text-sm text-white/80">Mở cửa {SHOP.hours} hằng ngày</p>
          </div>
          <nav aria-label="Chính sách">
            <h2 className="font-semibold">Chính sách</h2>
            <ul className="mt-2 grid grid-cols-2 sm:grid-cols-1">
              {POLICIES.map(([id, label]) => (
                <li key={id}>
                  <Link href={`/chinh-sach#${id}`} className="flex min-h-11 items-center text-sm text-white/80 hover:text-white sm:min-h-9">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-semibold">Bản đồ</h2>
            <a
              href="https://www.google.com/maps/search/?api=1&query=379+%C4%91%C6%B0%E1%BB%9Dng+2%2F4+Nha+Trang"
              target="_blank"
              rel="noopener"
              className="mt-3 grid h-32 place-items-center rounded-md bg-white/10 text-sm text-white/90 hover:bg-white/15"
            >
              <span className="flex items-center gap-2"><MapPin className="size-5" aria-hidden />Mở Google Maps</span>
            </a>
          </div>
        </div>
        <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60">© 2026 Tân Trường Tín · Nha Trang</p>
      </footer>

      {/* Nút nổi Zalo + Gọi */}
      <div className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-3 z-40 flex flex-col gap-2 md:bottom-6 md:right-6">
        <a href="https://zalo.me/0948732064" aria-label="Nhắn Zalo cho shop" className="grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-deep">
          <MessageCircle className="size-6" aria-hidden />
        </a>
        <a href="tel:0948732064" aria-label="Gọi shop" className="grid size-12 place-items-center rounded-full bg-gold text-gold-ink shadow-lg">
          <Phone className="size-6" aria-hidden />
        </a>
      </div>

      {/* Thanh đáy điện thoại */}
      <nav aria-label="Điều hướng nhanh" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] text-[11px] text-ink-2 md:hidden">
        <Link href="/" className="flex h-16 flex-col items-center justify-center gap-1 hover:text-brand"><House className="size-5" aria-hidden />Trang chủ</Link>
        <CategoryDrawer />
        <Link href="/gio-hang" className="flex h-16 flex-col items-center justify-center gap-1 hover:text-brand">
          <span className="relative"><ShoppingCart className="size-5" aria-hidden /><CartCount /></span>Giỏ hàng
        </Link>
        <Link href="/tra-cuu" className="flex h-16 flex-col items-center justify-center gap-1 hover:text-brand"><ReceiptText className="size-5" aria-hidden />Tra cứu đơn</Link>
      </nav>
    </div>
  );
}
