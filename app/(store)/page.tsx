import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, CookingPot, Fan, House, MapPin, Phone, Store } from "lucide-react";
import { CategoryIcon } from "@/components/storefront/CategoryIcon";
import { ProductBrowserShell } from "@/components/storefront/ProductBrowserShell";
import { BrandCarousel } from "@/components/storefront/BrandCarousel";
import { getCategories, getProducts } from "@/lib/catalog";
import { SHOP } from "@/lib/shop";

// Dữ liệu từ Supabase, làm mới mỗi 60 giây
export const revalidate = 60;

export default async function Home() {
  const [CATEGORIES, PRODUCTS] = await Promise.all([getCategories(), getProducts()]);
  const NAV_CATEGORIES = CATEGORIES.filter((category) => category.slug === "gia-dung");
  const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand).filter(Boolean))];
  const INDUSTRIES = [...new Set(PRODUCTS.map((p) => p.industry.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));
  // Hai tên danh mục con chủ shop đã cung cấp trong Excel; sau khi nhập, dùng các tên thực có trên sản phẩm.
  const MENU_SUBS = INDUSTRIES.length ? INDUSTRIES : ["Quạt", "Ấm siêu tốc"];
  return (
    <>
      <h1 className="sr-only">Tân Trường Tín: điện nước, kim khí, dụng cụ, quạt, gia dụng tại Nha Trang</h1>

      {/* Menu danh mục | Banner | Dịch vụ */}
      <section className="grid items-start gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Danh mục hàng hóa" className="relative hidden min-h-[280px] rounded-md bg-brand-tint p-2 lg:block">
          {NAV_CATEGORIES.map((c) => (
            <div key={c.slug} className="group/item relative rounded-md transition-colors hover:bg-white/70 focus-within:bg-white/70">
              <Link href={`/danh-muc/${c.slug}`} className="flex min-h-11 items-center gap-3 rounded-md py-2 pl-3 pr-12 text-[13.5px] hover:text-brand">
                <CategoryIcon icon={c.icon} className="size-4 text-brand" />
                <span className="flex-1">Đồ gia dụng</span>
              </Link>
              <ChevronRight className="pointer-events-none absolute right-3 top-3.5 size-4 text-brand" aria-hidden />
              <div aria-label="Danh mục con Đồ gia dụng" className="invisible absolute left-full top-0 z-20 w-[560px] rounded-md border border-line bg-surface p-4 opacity-0 shadow-lg transition-opacity duration-150 group-hover/item:visible group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:opacity-100">
                <b className="text-sm">Danh mục con</b>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {MENU_SUBS.map((sub) => {
                    const Icon = /quạt/i.test(sub) ? Fan : /ấm|bếp/i.test(sub) ? CookingPot : House;
                    const count = PRODUCTS.filter((p) => p.industry.trim() === sub).length;
                    // Chưa có sản phẩm mang ngành này: mở danh mục con cùng tên trong Đồ gia dụng (Quạt, Ấm siêu tốc theo migration 20261027000100).
                    const fallbackHref = `/danh-muc/${c.slug}?sub=${encodeURIComponent(sub)}`;
                    return <Link key={sub} href={count ? `/danh-muc?industry=${encodeURIComponent(sub)}` : fallbackHref} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-3 text-center transition-colors hover:border-brand hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                      <span className="grid size-10 place-items-center rounded-md bg-sunk text-brand"><Icon className="size-5" aria-hidden /></span>
                      <span className="text-[13px] font-semibold leading-4">{sub}</span>
                      <span className="num text-xs text-ink-2">{count ? `${count} sản phẩm` : "Xem sản phẩm"}</span>
                    </Link>;
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="relative flex min-h-[280px] overflow-hidden rounded-md bg-brand-tint">
          <div className="relative z-10 flex flex-col justify-center p-6 sm:max-w-[60%] sm:p-9">
            <p className="text-sm font-semibold text-brand">{SHOP.tagline}</p>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight text-brand-deep sm:text-[36px]">Cần sửa nhà? Có ngay ở Tân Trường Tín.</h2>
            <p className="mt-3 text-[15px] leading-6 text-ink-2">Ống nước, dây điện, quạt, dụng cụ: đến lấy tại 379 đường 2/4 hoặc đặt giao trong Nha Trang.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#tat-ca" className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-5 font-bold text-gold-ink hover:bg-gold-hover active:opacity-90">Xem sản phẩm <ArrowRight className="size-4" aria-hidden /></a>
              <a href="tel:0948732064" className="inline-flex h-11 items-center gap-2 rounded-md border border-brand bg-white px-5 font-semibold text-brand active:opacity-90"><Phone className="size-4" aria-hidden />Gọi shop</a>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[42%] sm:block">
            <Image src="/ai/hardware-hero.jpg" alt="" fill priority sizes="(max-width: 1024px) 40vw, 360px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Ngành hàng: lấy theo dữ liệu Excel đã nhập */}
      <section className="mt-10" aria-labelledby="h-danh-muc">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="h-danh-muc" className="text-[22px] font-extrabold sm:text-[26px]">Ngành hàng</h2>
          <a href="#tat-ca" className="flex min-h-11 items-center gap-1 text-sm font-semibold text-brand">Tất cả <ArrowRight className="size-4" aria-hidden /></a>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {INDUSTRIES.map((industry) => {
            const count = PRODUCTS.filter((p) => p.industry.trim() === industry).length;
            const icon: "fan" | "home" = /quạt/i.test(industry) ? "fan" : "home";
            return (
            <Link key={industry} href={`/danh-muc?industry=${encodeURIComponent(industry)}`} className="flex min-w-0 flex-col items-center rounded-md border border-line bg-surface px-2 py-3 text-center transition-colors duration-150 hover:border-brand-line hover:bg-brand-tint sm:py-4">
              <span className="grid size-12 place-items-center rounded-md bg-sunk text-brand sm:size-14"><CategoryIcon icon={icon} className="size-6" /></span>
              <span className="mt-2 line-clamp-2 text-[13px] font-semibold leading-4 sm:text-sm">{industry}</span>
              <span className="num mt-0.5 text-xs text-ink-2">{count} sản phẩm</span>
            </Link>
            );
          })}
        </div>
        {INDUSTRIES.length === 0 && <p className="rounded-md border border-line bg-surface p-4 text-sm text-ink-2">Danh sách ngành hàng đang được cập nhật.</p>}
      </section>

      {/* Tất cả sản phẩm */}
      <section id="tat-ca" className="mt-10 scroll-mt-32" aria-labelledby="h-tat-ca">
        <ProductBrowserShell products={PRODUCTS} categories={CATEGORIES} showSort={false} showSale />
      </section>

      {/* Thương hiệu */}
      <section className="mt-10" aria-labelledby="h-thuong-hieu">
        <h2 id="h-thuong-hieu" className="mb-4 text-[22px] font-extrabold sm:text-[26px]">Thương hiệu</h2>
        <BrandCarousel brands={BRANDS} />
      </section>

      {/* Ghé cửa hàng */}
      <section className="mt-10 grid overflow-hidden rounded-md bg-brand-tint sm:grid-cols-2" aria-labelledby="h-cua-hang">
        <div className="bg-brand-tint p-6 sm:p-8">
          <h2 id="h-cua-hang" className="text-[22px] font-extrabold text-brand-deep sm:text-[26px]">Ghé cửa hàng</h2>
          <p className="mt-3 flex gap-2 text-[15px]"><MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />379 đường 2/4, phường Bắc Nha Trang, tỉnh Khánh Hòa</p>
          <p className="mt-2 text-[15px] text-ink-2">Mở cửa {SHOP.hours} hằng ngày</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="tel:0948732064" className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-deep"><Phone className="size-4" aria-hidden />{SHOP.phone}</a>
            <a href="https://www.google.com/maps/search/?api=1&query=379+%C4%91%C6%B0%E1%BB%9Dng+2%2F4+Nha+Trang" target="_blank" rel="noopener" className="inline-flex h-11 items-center rounded-md border border-brand bg-white px-5 font-semibold text-brand">Chỉ đường</a>
          </div>
        </div>
        <div className="grid aspect-[16/9] place-items-center border-t border-line bg-sunk p-6 text-center text-sm text-ink-2 sm:border-l sm:border-t-0">
          <span><Store className="mx-auto mb-2 size-8 text-brand" aria-hidden />Ảnh mặt tiền cửa hàng<br />chờ chủ shop gửi ảnh</span>
        </div>
      </section>
    </>
  );
}
