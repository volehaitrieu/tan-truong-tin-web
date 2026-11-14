import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutGrid, ReceiptText, ShoppingCart, TicketPercent, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { StoreSearch } from "@/components/storefront/StoreSearch";
import { HeaderSearchToggle } from "@/components/storefront/HeaderSearchToggle";
import { CartCount } from "@/components/storefront/CartControls";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { HeaderMenuButton } from "@/components/storefront/HeaderMenuButton";
import { StoreBackButton } from "@/components/storefront/StoreBackButton";
import { FloatActions } from "@/components/storefront/FloatActions";
import { CompareBar } from "@/components/storefront/compare/CompareBar";
import { getCategoryMenu } from "@/lib/catalog";
import { SHOP } from "@/lib/shop";

export const POLICIES = [
  ["doi-tra", "Đổi trả"],
  ["bao-hanh", "Bảo hành"],
  ["van-chuyen", "Vận chuyển"],
  ["thanh-toan", "Thanh toán"],
  ["bao-mat", "Bảo mật"],
  ["gioi-thieu", "Giới thiệu"],
] as const;

export async function StoreShell({ children }: { children: ReactNode }) {
  const categoryMenu = await getCategoryMenu();
  return (
    <div className="store flex min-h-screen flex-col pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:gap-6">
          <HeaderMenuButton menu={categoryMenu} />
          <Link href="/" className="hdr-logo -ml-2 shrink-0 lg:ml-0" aria-label="Tân Trường Tín — Trang chủ">
            {/* Điện thoại: chữ thương hiệu như thiết kế v2 (logo ảnh đang hoãn); máy tính vẫn dùng logo hiện có */}
            <span className="flex flex-col leading-tight md:hidden">
              <span className="text-lg font-bold tracking-tight text-[#17324d]">Tân Trường Tín</span>
              <span className="text-xs text-ink-2">Điện nước · Quạt · Gia dụng</span>
            </span>
            <span className="hidden md:block"><Logo size={40} subtitle={SHOP.tagline} subtitleClassName="hidden lg:block" tone="ink" /></span>
          </Link>
          <div className="hidden min-w-0 flex-1 sm:block"><StoreSearch /></div>
          {/* Máy tính không có thanh dưới: đưa Danh mục và Voucher lên đầu trang */}
          <Link href="/danh-muc" className="hidden min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:underline lg:flex">
            <LayoutGrid className="size-4" aria-hidden />Danh mục
          </Link>
          <Link href="/voucher" className="hidden min-h-11 shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:underline lg:flex">
            <TicketPercent className="size-4" aria-hidden />Voucher
          </Link>
          <Link href="/tra-cuu" className="ml-auto hidden min-h-11 items-center gap-1.5 text-sm font-medium text-brand hover:underline sm:ml-0 md:flex">
            <ReceiptText className="size-4" aria-hidden />Tra cứu đơn
          </Link>
          {/* Điện thoại: tìm kiếm thu nhỏ + Tài khoản ở góc phải, giỏ hàng chỉ nằm ở thanh dưới */}
          <HeaderSearchToggle />
          <Link href="/tai-khoan" aria-label="Tài khoản" title="Tài khoản" className="hdr-acct flex min-h-11 items-center gap-1.5 rounded-full text-sm font-medium text-brand hover:bg-brand-tint sm:ml-auto md:ml-0 md:px-1">
            <span className="hdr-acct-dot grid size-11 place-items-center rounded-full bg-sunk text-ink md:size-8 md:bg-brand md:text-white"><UserRound className="size-[22px] md:size-[18px]" aria-hidden /></span><span className="hidden md:inline">Tài khoản</span>
          </Link>
          {/* Máy tính không có thanh dưới nên vẫn giữ nút giỏ hàng ở đầu trang */}
          <Link href="/gio-hang" aria-label="Giỏ hàng" className="relative hidden size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-sunk md:grid">
            <ShoppingCart className="size-6" aria-hidden />
            <CartCount />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-10 pt-5">
        <StoreBackButton />
        {children}
      </main>

      <StoreFooter />

      {/* Nút nổi Zalo + Gọi */}
      <FloatActions />

      {/* Thanh so sánh sản phẩm (chỉ hiện khi đã chọn món) */}
      <CompareBar />

      {/* Thanh đáy điện thoại */}
      <MobileBottomNav />
    </div>
  );
}
