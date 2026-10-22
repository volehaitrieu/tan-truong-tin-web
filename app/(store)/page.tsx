import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Banknote, BedDouble, ChevronRight, CookingPot, HardHat, Hammer, MapPin, Phone, QrCode, Store, Truck } from "lucide-react";
import { CategoryIcon } from "@/components/storefront/CategoryIcon";
import { ProductBrowser } from "@/components/storefront/ProductBrowser";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Rail } from "@/components/storefront/Rail";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/lib/mock/store";
import { SHOP } from "@/lib/shop";

const NEEDS = [
  { icon: BedDouble, title: "Phòng trọ", body: "Bóng đèn, ổ cắm, móc treo", href: "/danh-muc/den" },
  { icon: Hammer, title: "Sửa nhà", body: "Ống nước, keo, dụng cụ", href: "/danh-muc/ong-nuoc" },
  { icon: CookingPot, title: "Bếp & gia đình", body: "Ấm đun, đồ bếp, quạt", href: "/danh-muc/gia-dung" },
  { icon: HardHat, title: "Công trình", body: "Dây cáp, ống, máy khoan", href: "/danh-muc/day-cap-dien" },
];

export default function Home() {
  const sale = PRODUCTS.filter((p) => p.old);
  return (
    <>
      <h1 className="sr-only">Tân Trường Tín — điện nước, kim khí, dụng cụ, quạt, gia dụng tại Nha Trang</h1>

      {/* Menu danh mục | Banner | Dịch vụ */}
      <section className="grid gap-3 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_220px]">
        <nav aria-label="Danh mục hàng hóa" className="group/menu relative hidden rounded-md bg-white py-2 lg:block">
          {CATEGORIES.map((c) => (
            <div key={c.slug} className="group/item">
              <Link href={`/danh-muc/${c.slug}`} className="flex min-h-10 items-center gap-3 px-4 text-[13.5px] hover:bg-brand-tint hover:text-brand group-hover/item:bg-brand-tint group-hover/item:text-brand">
                <CategoryIcon icon={c.icon} className="size-4 text-brand" />
                <span className="flex-1">{c.name}</span>
                <ChevronRight className="size-4 text-ink-2" aria-hidden />
              </Link>
              <div className="invisible absolute left-full top-0 z-20 ml-2 grid min-h-full w-[640px] grid-cols-3 gap-5 rounded-md border border-line bg-white p-5 opacity-0 shadow-lg transition-opacity duration-150 group-hover/item:visible group-hover/item:opacity-100">
                <div>
                  <b className="text-sm">Danh mục con</b>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.subs.map((s) => <Link key={s} href={`/danh-muc/${c.slug}`} className="rounded-full bg-sunk px-3 py-1.5 text-[13px] hover:bg-brand-tint hover:text-brand">{s}</Link>)}
                  </div>
                </div>
                <div>
                  <b className="text-sm">Thương hiệu</b>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[...new Set(PRODUCTS.filter((p) => p.cat === c.slug).map((p) => p.brand))].map((b) => (
                      <Link key={b} href={`/tim-kiem?query=${encodeURIComponent(b)}`} className="rounded-full bg-sunk px-3 py-1.5 text-[13px] hover:bg-brand-tint hover:text-brand">{b}</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <b className="text-sm">Khoảng giá</b>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Dưới 100.000₫", "100.000₫ – 500.000₫", "Trên 500.000₫"].map((x) => (
                      <Link key={x} href={`/danh-muc/${c.slug}`} className="rounded-full bg-sunk px-3 py-1.5 text-[13px] hover:bg-brand-tint hover:text-brand">{x}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className="relative flex min-h-[280px] overflow-hidden rounded-md bg-brand-tint">
          <div className="relative z-10 flex flex-col justify-center p-6 sm:max-w-[60%] sm:p-9">
            <p className="text-sm font-semibold text-brand">{SHOP.tagline}</p>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight text-brand-deep sm:text-[36px]">Cần sửa nhà? Có ngay ở Tân Trường Tín.</h2>
            <p className="mt-3 text-[15px] leading-6 text-ink-2">Ống nước, dây điện, quạt, dụng cụ — đến lấy tại 379 đường 2/4 hoặc đặt giao trong Nha Trang.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#tat-ca" className="inline-flex h-11 items-center gap-2 rounded-md bg-gold px-5 font-bold text-gold-ink">Xem sản phẩm <ArrowRight className="size-4" aria-hidden /></a>
              <a href="tel:0948732064" className="inline-flex h-11 items-center gap-2 rounded-md border border-brand bg-white px-5 font-semibold text-brand"><Phone className="size-4" aria-hidden />Gọi shop</a>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[42%] sm:block">
            <Image src="/ai/hardware-hero.jpg" alt="" fill priority sizes="(max-width: 1024px) 40vw, 360px" className="object-cover" />
          </div>
        </div>

        <ul className="hidden gap-3 xl:grid">
          {[
            [Store, "Lấy tại cửa hàng", "Đặt trước, đến lấy ngay"],
            [Truck, "Giao nội thành", "Trong Nha Trang"],
            [Banknote, "Trả khi nhận hàng", "COD · VietQR sắp có"],
          ].map(([Icon, t, b]) => {
            const I = Icon as typeof Store;
            return (
              <li key={t as string} className="flex items-center gap-3 rounded-md bg-white p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-tint text-brand"><I className="size-5" aria-hidden /></span>
                <span><b className="block text-sm">{t as string}</b><span className="text-[13px] text-ink-2">{b as string}</span></span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Danh mục */}
      <section className="mt-10" aria-labelledby="h-danh-muc">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="h-danh-muc" className="text-[22px] font-extrabold sm:text-[26px]">Danh mục hàng hóa</h2>
          <Link href="/danh-muc" className="flex min-h-11 items-center gap-1 text-sm font-semibold text-brand">Tất cả <ArrowRight className="size-4" aria-hidden /></Link>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:grid-cols-8">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/danh-muc/${c.slug}`} className="flex flex-col items-center rounded-md bg-white px-1 py-3 text-center hover:bg-brand-tint sm:py-4">
              <span className="grid size-12 place-items-center rounded-full bg-brand-tint text-brand sm:size-14"><CategoryIcon icon={c.icon} className="size-6" /></span>
              <span className="mt-2 line-clamp-2 text-[12px] font-semibold leading-4 sm:text-[13px]">{c.name}</span>
              <span className="num mt-0.5 hidden text-xs text-ink-2 sm:block">{c.count} mặt hàng</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mua theo nhu cầu */}
      <section className="mt-10" aria-labelledby="h-nhu-cau">
        <h2 id="h-nhu-cau" className="mb-4 text-[22px] font-extrabold sm:text-[26px]">Mua theo nhu cầu</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {NEEDS.map(({ icon: Icon, title, body, href }) => (
            <Link key={title} href={href} className="flex items-center gap-3 rounded-md bg-white p-4 hover:bg-brand-tint">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-gold-tint text-gold-ink"><Icon className="size-5" aria-hidden /></span>
              <span className="min-w-0"><b className="block text-[15px]">{title}</b><span className="line-clamp-1 text-[13px] text-ink-2">{body}</span></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Đang giảm giá */}
      {sale.length > 0 && (
        <section className="mt-10" aria-labelledby="h-giam-gia">
          <h2 id="h-giam-gia" className="mb-4 text-[22px] font-extrabold sm:text-[26px]">Sản phẩm đang giảm giá</h2>
          <Rail label="Sản phẩm đang giảm giá">
            {sale.map((p) => <ProductCard key={p.sku} p={p} />)}
          </Rail>
        </section>
      )}

      {/* Tất cả sản phẩm */}
      <section id="tat-ca" className="mt-10 scroll-mt-32" aria-labelledby="h-tat-ca">
        <h2 id="h-tat-ca" className="mb-4 text-[22px] font-extrabold sm:text-[26px]">Tất cả sản phẩm</h2>
        <ProductBrowser products={PRODUCTS} />
      </section>

      {/* Thương hiệu */}
      <section className="mt-10" aria-labelledby="h-thuong-hieu">
        <h2 id="h-thuong-hieu" className="mb-4 text-[22px] font-extrabold sm:text-[26px]">Thương hiệu</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {BRANDS.map((b) => (
            <Link key={b} href={`/tim-kiem?query=${encodeURIComponent(b)}`} className="flex h-12 shrink-0 items-center rounded-md bg-white px-5 text-sm font-bold text-ink-2 hover:text-brand">{b}</Link>
          ))}
        </div>
      </section>

      {/* Cách mua */}
      <section className="mt-10 rounded-md bg-white p-5 sm:p-7" aria-labelledby="h-cach-mua">
        <h2 id="h-cach-mua" className="text-[22px] font-extrabold sm:text-[26px]">Cách mua hàng</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-[3fr_2fr]">
          <div>
            <b className="text-sm text-ink-2">3 cách nhận hàng</b>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                [Store, "Đến cửa hàng lấy", "Miễn phí · đặt trước để shop soạn sẵn"],
                [Truck, "Giao nội thành", "Trong Nha Trang · phí theo khu vực"],
                [MapPin, "Gửi đi tỉnh", "Qua SPX, GHTK · phí báo khi xác nhận"],
              ].map(([Icon, t, b]) => {
                const I = Icon as typeof Store;
                return (
                  <li key={t as string} className="rounded-md bg-ground p-4">
                    <I className="size-5 text-brand" aria-hidden />
                    <b className="mt-2 block text-sm">{t as string}</b>
                    <p className="mt-1 text-[13px] text-ink-2">{b as string}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <b className="text-sm text-ink-2">2 cách trả tiền</b>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              <li className="rounded-md bg-ground p-4"><Banknote className="size-5 text-brand" aria-hidden /><b className="mt-2 block text-sm">Tiền mặt khi nhận (COD)</b></li>
              <li className="rounded-md bg-ground p-4">
                <QrCode className="size-5 text-brand" aria-hidden />
                <b className="mt-2 block text-sm">Chuyển khoản VietQR</b>
                <span className="mt-1 inline-block rounded-full bg-gold-tint px-2 py-0.5 text-xs font-medium text-gold-ink">Sắp có</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ghé cửa hàng */}
      <section className="mt-10 grid overflow-hidden rounded-md bg-brand-tint sm:grid-cols-2" aria-labelledby="h-cua-hang">
        <div className="p-6 sm:p-8">
          <h2 id="h-cua-hang" className="text-[22px] font-extrabold text-brand-deep sm:text-[26px]">Ghé cửa hàng</h2>
          <p className="mt-3 flex gap-2 text-[15px]"><MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />379 đường 2/4, phường Bắc Nha Trang, tỉnh Khánh Hòa</p>
          <p className="mt-2 text-[15px] text-ink-2">Mở cửa {SHOP.hours} hằng ngày</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="tel:0948732064" className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-deep"><Phone className="size-4" aria-hidden />{SHOP.phone}</a>
            <a href="https://www.google.com/maps/search/?api=1&query=379+%C4%91%C6%B0%E1%BB%9Dng+2%2F4+Nha+Trang" target="_blank" rel="noopener" className="inline-flex h-11 items-center rounded-md border border-brand bg-white px-5 font-semibold text-brand">Chỉ đường</a>
          </div>
        </div>
        <div className="grid min-h-48 place-items-center bg-sunk p-6 text-center text-sm text-ink-2">
          <span><Store className="mx-auto mb-2 size-8 text-brand" aria-hidden />Ảnh mặt tiền cửa hàng<br />(chờ chủ shop gửi ảnh)</span>
        </div>
      </section>
    </>
  );
}
