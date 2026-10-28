import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/storefront/CartControls";
import { FavoriteButton } from "@/components/storefront/FavoriteButton";
import { discountPct, type Product } from "@/lib/mock/store";
import { formatVnd } from "@/lib/shop";

export function StockBadge({ stock, className = "" }: { stock: boolean; className?: string }) {
  return (
    <p className={`flex items-center gap-1.5 text-[13px] ${stock ? "text-ok" : "text-ink"} ${className}`}>
      <span className={`size-2 rounded-full ${stock ? "bg-ok" : "bg-ask"}`} aria-hidden />
      {stock ? "Còn hàng" : "Liên hệ"}
    </p>
  );
}

export function ProductImage({ p, sizes, priority = false }: { p: Product; sizes: string; priority?: boolean }) {
  const pct = discountPct(p);
  return (
    <>
      <Image src={p.image} alt={`Ảnh minh họa: ${p.name}`} fill sizes={sizes} priority={priority} loading={priority ? undefined : "lazy"} className="product-art object-cover" />
      <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-ink-2">Ảnh minh họa</span>
      {pct > 0 && <span className="num absolute right-2 top-2 rounded bg-danger px-1.5 py-0.5 text-xs font-bold text-white">-{pct}%</span>}
    </>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="product-card flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-surface">
      <div className="relative aspect-square overflow-hidden bg-sunk">
        <Link href={`/san-pham/${p.sku}`} className="absolute inset-0" tabIndex={-1} aria-hidden>
          <ProductImage p={p} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        </Link>
        <FavoriteButton sku={p.sku} name={p.name} />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs font-semibold text-brand">{p.brand}</p>
        <h3 className="mt-0.5">
          <Link href={`/san-pham/${p.sku}`} className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 hover:text-brand">{p.name}</Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-[12.5px] text-ink-2">{p.spec}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <b className="num text-lg font-extrabold text-danger">{formatVnd(p.price)}</b>
          {p.old ? <del className="num text-xs text-ink-2">{formatVnd(p.old)}</del> : <span className="text-xs text-ink-2">/ {p.unit.toLowerCase()}</span>}
        </div>
        <StockBadge stock={p.stock} className="mt-1" />
        <div className="mt-auto">
          <AddToCartButton sku={p.sku} name={p.name} available={p.stock} />
        </div>
      </div>
    </article>
  );
}
