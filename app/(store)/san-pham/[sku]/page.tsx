import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, FileText, Store, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { BuyBox } from "@/components/storefront/CartControls";
import { ProductCard, ProductImage, StockBadge } from "@/components/storefront/ProductCard";
import { PRODUCTS, findCategory, findProduct } from "@/lib/mock/store";
import { formatVnd } from "@/lib/shop";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[sku]">): Promise<Metadata> {
  const { sku } = await params;
  return { title: findProduct(sku)?.name ?? "Không tìm thấy sản phẩm" };
}

export default async function ProductPage({ params }: PageProps<"/san-pham/[sku]">) {
  const { sku } = await params;
  const p = findProduct(sku);
  if (!p) notFound();
  const cat = findCategory(p.cat)!;
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.sku !== p.sku).slice(0, 4);
  const more = related.length ? related : PRODUCTS.filter((x) => x.sku !== p.sku).slice(0, 4);

  return (
    <>
      <Breadcrumb items={[{ label: cat.name, href: `/danh-muc/${cat.slug}` }, { label: p.name }]} />
      <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-md bg-sunk">
            <ProductImage p={p} sizes="(max-width: 768px) 100vw, 600px" priority />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`relative aspect-square overflow-hidden rounded bg-sunk ${i === 0 ? "ring-2 ring-brand" : "opacity-70"}`}>
                <Image src={p.image} alt="" fill sizes="96px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand">{p.brand}</p>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight sm:text-[32px]">{p.name}</h1>
          <p className="num mt-2 text-[13px] text-ink-2">Mã hàng: {p.sku}</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
            <b className="num text-[30px] font-extrabold text-danger">{formatVnd(p.price)}</b>
            {p.old && <del className="num text-ink-2">{formatVnd(p.old)}</del>}
            <span className="text-sm text-ink-2">/ {p.unit.toLowerCase()}</span>
          </div>
          <StockBadge stock={p.stock} className="mt-2 text-sm" />
          {!p.stock && <p className="mt-1 text-sm text-ink-2">Shop sẽ gọi báo thời gian có hàng.</p>}
          <BuyBox sku={p.sku} name={p.name} available={p.stock} />
          <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-[12.5px]">
            {[
              [Store, "Lấy tại cửa hàng"],
              [Truck, "Giao nội thành"],
              [Banknote, "COD · VietQR sắp có"],
            ].map(([Icon, t]) => {
              const I = Icon as typeof Store;
              return (
                <li key={t as string} className="rounded-md bg-white px-2 py-3"><I className="mx-auto mb-1 size-5 text-brand" aria-hidden />{t as string}</li>
              );
            })}
          </ul>
          <Link href={`/bao-gia?sku=${p.sku}`} className="mt-4 flex min-h-11 items-center gap-2 text-sm font-semibold text-brand hover:underline">
            <FileText className="size-4" aria-hidden />Mua số lượng lớn? Gửi yêu cầu báo giá
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="rounded-md bg-white p-5" aria-labelledby="h-thong-so">
          <h2 id="h-thong-so" className="text-lg font-bold">Thông số</h2>
          <dl className="mt-2 divide-y divide-line text-sm">
            {[["Thương hiệu", p.brand], ["Đơn vị tính", p.unit], ...p.specs].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-ink-2">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
            ))}
          </dl>
        </section>
        <section className="rounded-md bg-white p-5" aria-labelledby="h-mo-ta">
          <h2 id="h-mo-ta" className="text-lg font-bold">Mô tả & bảo hành</h2>
          <p className="mt-2 text-[15px] leading-6 text-ink-2">{p.name} — {p.spec.toLowerCase()}. Phù hợp dùng trong gia đình, phòng trọ và công trình nhỏ. Cần tư vấn chọn loại, gọi shop {""}
            <a href="tel:0948732064" className="font-semibold text-brand">0948 732 064</a>.
          </p>
          <p className="mt-3 text-sm"><b>Bảo hành:</b> {p.warranty}</p>
        </section>
      </div>

      <section className="mt-10" aria-labelledby="h-lien-quan">
        <h2 id="h-lien-quan" className="mb-4 text-[22px] font-extrabold">{related.length ? `Cùng danh mục ${cat.name}` : "Có thể bạn cần"}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {more.map((x) => <ProductCard key={x.sku} p={x} />)}
        </div>
      </section>
    </>
  );
}
