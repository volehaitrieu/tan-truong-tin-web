"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ReceiptText, ShoppingCart, TicketPercent } from "lucide-react";
import { CartCount } from "@/components/storefront/CartControls";

// Thanh dưới (điện thoại). Danh mục đã chuyển lên nút ☰ ở đầu trang; chỗ cũ dành cho Voucher.
export function MobileBottomNav() {
  const pathname = usePathname();
  const inRoute = (route: string) => pathname === route || pathname.startsWith(`${route}/`);
  const links = [
    { href: "/", label: "Trang chủ", icon: House, active: pathname === "/" },
    { href: "/voucher", label: "Voucher", icon: TicketPercent, active: inRoute("/voucher") },
    { href: "/gio-hang", label: "Giỏ hàng", icon: ShoppingCart, active: inRoute("/gio-hang") || inRoute("/thanh-toan") },
    { href: "/tra-cuu", label: "Tra cứu đơn", icon: ReceiptText, active: inRoute("/tra-cuu") },
  ];
  return (
    <nav data-mobile-nav="" aria-label="Điều hướng nhanh" className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] text-xs md:hidden">
      {links.map((item) => (
        <Link key={item.href} href={item.href} aria-current={item.active ? "page" : undefined} className={`mx-1 my-1 flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl transition-colors duration-150 motion-reduce:transition-none ${item.active ? "bg-brand-tint font-semibold text-brand" : "text-ink-2 hover:bg-brand-tint hover:text-brand"}`}>
          <span className="relative"><item.icon className="size-5" aria-hidden />{item.href === "/gio-hang" && <CartCount placement="nav" />}</span>{item.label}
        </Link>
      ))}
    </nav>
  );
}
