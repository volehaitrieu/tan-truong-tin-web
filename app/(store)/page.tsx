import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { BrandRotator } from "@/components/storefront/BrandRotator";
import { ShopBanner } from "@/components/storefront/ShopBanner";
import { FadeImage } from "@/components/storefront/FadeImage";
import { CategoryIcon } from "@/components/storefront/CategoryIcon";
import { ProductBrowserShell } from "@/components/storefront/ProductBrowserShell";
import { getCategories, getProducts } from "@/lib/catalog";
import { SHOP } from "@/lib/shop";
import { listProduct } from "@/lib/mock/store";

// Dữ liệu từ Supabase, làm mới mỗi 60 giây
export const revalidate = 60;

export default async function Home() {
  const [CATEGORIES, PRODUCTS] = await Promise.all([getCategories(), getProducts()]);
  const brandCounts = new Map<string, number>();
  for (const p of PRODUCTS) if (p.brand) brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  const BRANDS = [...brandCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "vi"));
  const INDUSTRIES = [...new Set(PRODUCTS.map((p) => p.industry.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));
  // Danh sách ở trang chủ: xen kẽ các ngành hàng (ngành đông sản phẩm trước) để trang đầu thấy đủ ngành, thay vì xếp theo tên.
  const byIndustry = new Map<string, typeof PRODUCTS>();
  for (const p of PRODUCTS) { const key = p.industry.trim() || "-"; byIndustry.set(key, [...(byIndustry.get(key) ?? []), p]); }
  const groups = [...byIndustry.values()].sort((a, b) => b.length - a.length);
  const SHOWCASE: typeof PRODUCTS = [];
  for (let i = 0; groups.some((g) => i < g.length); i++) for (const g of groups) if (i < g.length) SHOWCASE.push(g[i]);
  return (
    <>
      {/* Đánh dấu trang đã áp bảng màu mới (xem khối .store:has([data-theme-v2]) trong globals.css) */}
      <div hidden data-theme-v2 />
      <h1 className="sr-only">Tân Trường Tín: điện nước, kim khí, dụng cụ, quạt, gia dụng tại Nha Trang</h1>

      <ShopBanner />

      {/* Ngành hàng lấy từ sản phẩm thật; hai ngành hiện có không tạo cột điều hướng trống trên máy tính. */}
      <section aria-labelledby="h-danh-muc">
        <div className="min-w-0">
          <div className="mb-3 flex items-end justify-between">
            <h2 id="h-danh-muc" className="text-lg font-bold sm:text-[22px]">Danh mục</h2>
            <a href="#tat-ca" className="flex min-h-11 items-center gap-1 text-sm font-semibold text-brand">Tất cả sản phẩm <ArrowRight className="size-4" aria-hidden /></a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {INDUSTRIES.map((industry) => {
              const count = PRODUCTS.filter((p) => p.industry.trim() === industry).length;
              const icon: "fan" | "home" = /quạt/i.test(industry) ? "fan" : "home";
              return (
                <Link key={industry} href={`/danh-muc?industry=${encodeURIComponent(industry)}`} className="flex min-h-24 min-w-0 items-center justify-between gap-1 overflow-hidden rounded-2xl border border-line bg-surface py-3 pl-3 pr-2 shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-brand-line hover:bg-brand-tint active:bg-brand-tint sm:pl-4">
                  <span className="min-w-0">
                    <span className="block break-words text-[13px] font-bold leading-5 text-ink [overflow-wrap:anywhere] sm:text-sm">{industry}</span>
                    <span className="num mt-1 block text-xs text-ink-2">{count} sản phẩm</span>
                  </span>
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-sunk text-brand"><CategoryIcon icon={icon} className="size-6" /></span>
                </Link>
              );
            })}
          </div>
          {INDUSTRIES.length === 0 && <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-2">Danh sách ngành hàng đang được cập nhật.</p>}
        </div>
      </section>

      {/* Tất cả sản phẩm */}
      <section id="tat-ca" className="mt-10 scroll-mt-32" aria-labelledby="h-tat-ca">
        <ProductBrowserShell products={SHOWCASE.map(listProduct)} categories={CATEGORIES} showSort={false} showSale />
      </section>

      {/* Thương hiệu: 4 hãng một lần, tự sang 4 hãng kế tiếp sau 3 giây (BrandRotator) */}
      <section className="mt-10" aria-labelledby="h-thuong-hieu">
        <h2 id="h-thuong-hieu" className="mb-3 text-lg font-bold sm:text-[22px]">Thương hiệu</h2>
        <BrandRotator brands={BRANDS} />
      </section>

      {/* Ghé cửa hàng */}
      <section className="mt-10 grid overflow-hidden rounded-xl border border-line bg-sunk sm:grid-cols-2" aria-labelledby="h-cua-hang">
        <div className="p-5 sm:p-8">
          <h2 id="h-cua-hang" className="text-lg font-bold sm:text-[22px]">Ghé cửa hàng</h2>
          <p className="mt-3 flex gap-2 text-[15px]"><MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />379 đường 2/4, phường Bắc Nha Trang, tỉnh Khánh Hòa</p>
          <p className="mt-2 flex gap-2 text-[15px] text-ink-2"><Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />Mở cửa {SHOP.hours} hằng ngày</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <a href="tel:0948732064" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-deep active:scale-[0.98]"><Phone className="size-4" aria-hidden />Gọi ngay {SHOP.phone}</a>
            <a href="https://www.google.com/maps/search/?api=1&query=379+%C4%91%C6%B0%E1%BB%9Dng+2%2F4+Nha+Trang" target="_blank" rel="noopener" className="inline-flex h-12 items-center justify-center rounded-full border border-brand bg-white px-6 font-semibold text-brand hover:bg-brand-tint">Chỉ đường</a>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-sunk sm:aspect-auto sm:min-h-full">
          <FadeImage src="/shop/mat-tien.webp" alt="Mặt tiền cửa hàng Tân Trường Tín, 379 đường 2/4, Nha Trang" sizes="(min-width: 640px) 50vw, 100vw" />
        </div>
      </section>
    </>
  );
}
