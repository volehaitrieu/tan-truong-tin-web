import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, ChevronDown, ChevronRight, FileText, ShieldCheck, Store, Truck } from "lucide-react";
import { BuyBox } from "@/components/storefront/CartControls";
import { ProductCard, ProductImage, StockBadge } from "@/components/storefront/ProductCard";
import { getCategories, getProduct, getProducts } from "@/lib/catalog";
import { formatVnd } from "@/lib/shop";

// Dữ liệu từ Supabase, làm mới mỗi 60 giây
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[sku]">): Promise<Metadata> {
  const { sku } = await params;
  return { title: (await getProduct(sku))?.name ?? "Không tìm thấy sản phẩm" };
}

// Thông số nổi bật (học từ các sàn lớn): vài mục khách hay so sánh nhất, lấy từ chính dữ liệu của sản phẩm.
// Không có mục nào trong danh sách ưu tiên thì lấy những mục đầu, trừ các mục đã hiện ở đầu trang.
const HIGHLIGHT_KEYS = ["Loại quạt", "Công suất", "Sải cánh", "Tốc độ gió", "Điều khiển", "Hẹn giờ", "Số cánh", "Lưu lượng gió"];
const ALREADY_SHOWN = new Set(["Thương hiệu", "Đơn vị tính", "Model"]);
function pickHighlights(specs: [string, string][]) {
  const byKey = new Map(specs);
  const picked: [string, string][] = HIGHLIGHT_KEYS.filter((k) => byKey.has(k)).map((k) => [k, byKey.get(k)!]);
  for (const [k, v] of specs) {
    if (picked.length >= 6) break;
    if (!ALREADY_SHOWN.has(k) && !picked.some(([pk]) => pk === k)) picked.push([k, v]);
  }
  return picked.slice(0, 6);
}

export default async function ProductPage({ params }: PageProps<"/san-pham/[sku]">) {
  const { sku } = await params;
  const p = await getProduct(sku);
  if (!p) notFound();
  const [categories, all] = await Promise.all([getCategories(), getProducts()]);
  const cat = categories.find((c) => c.slug === p.cat) ?? { slug: p.cat, name: p.sub };
  const related = all.filter((x) => x.cat === p.cat && x.sku !== p.sku).slice(0, 4);
  const more = related.length ? related : all.filter((x) => x.sku !== p.sku).slice(0, 4);
  const highlights = pickHighlights(p.specs);
  const specRows: [string, string][] = [["Thương hiệu", p.brand], ["Đơn vị tính", p.unit], ...p.specs];
  // Mỗi hàng: biểu tượng, một dòng, liên kết sang trang Chính sách có sẵn của shop
  const policyRows = [
    { Icon: Store, text: "Lấy tại cửa hàng", href: "/chinh-sach#van-chuyen" },
    { Icon: Truck, text: "Giao nội thành", href: "/chinh-sach#van-chuyen" },
    { Icon: Banknote, text: "COD · VietQR sắp có", href: "/chinh-sach#thanh-toan" },
    { Icon: ShieldCheck, text: `Bảo hành: ${p.warranty}`, href: "/chinh-sach#bao-hanh" },
  ];

  return (
    <>
      {/* Đã áp bảng màu mới (cờ data-theme-v2, xem globals.css) */}
      <div hidden data-theme-v2 />
      <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-sunk">
            <ProductImage p={p} sizes="(max-width: 768px) 100vw, 600px" priority />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-2">{p.brand}</p>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight sm:text-[32px]">{p.name}</h1>
          <p className="num mt-2 text-[13px] text-ink-2">Mã hàng: {p.sku}</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
            <b className="num text-[32px] font-extrabold text-ink">{formatVnd(p.price)}</b>
            {p.old && <del className="num text-ink-2">{formatVnd(p.old)}</del>}
            <span className="text-sm text-ink-2">/ {p.unit.toLowerCase()}</span>
          </div>
          <StockBadge stock={p.stock} className="mt-2 text-sm" />
          {!p.stock && (
            <p className="mt-1 text-sm text-ink-2">
              Shop sẽ gọi báo thời gian có hàng.{" "}
              <a href="#cung-danh-muc" className="inline-flex min-h-11 items-center font-semibold text-ink underline underline-offset-[3px]">Xem sản phẩm cùng loại</a>
            </p>
          )}

          {highlights.length >= 3 && (
            <section aria-label="Thông số nổi bật" className="mt-5">
              <dl className="grid grid-cols-2 gap-2">
                {highlights.map(([k, v]) => (
                  <div key={k} className="min-w-0 rounded-2xl bg-sunk px-4 py-3">
                    <dt className="text-xs text-ink-2">{k}</dt>
                    <dd className="mt-0.5 text-[15px] font-bold leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <BuyBox sku={p.sku} name={p.name} available={p.stock} priceText={formatVnd(p.price)} unit={p.unit} />

          <ul className="mt-5 overflow-hidden rounded-2xl bg-sunk">
            {policyRows.map(({ Icon, text, href }, i) => (
              <li key={text} className={i > 0 ? "border-t border-line" : ""}>
                <Link href={href} aria-label={`${text}, xem chi tiết`} className="flex min-h-12 items-center gap-3 px-4 py-2 text-sm hover:bg-brand-tint">
                  <Icon className="size-5 shrink-0 text-ink" aria-hidden />
                  <span className="min-w-0 flex-1 font-medium">{text}</span>
                  <span className="flex shrink-0 items-center gap-0.5 text-xs text-ink-2">Xem chi tiết<ChevronRight className="size-4" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/bao-gia?sku=${p.sku}`} className="mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:underline">
            <FileText className="size-4" aria-hidden />Mua số lượng lớn? Gửi yêu cầu báo giá
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-2 lg:items-start">
        <details className="group rounded-3xl bg-sunk">
          <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-5 [&::-webkit-details-marker]:hidden">
            <h2 className="text-lg font-bold">Thông số</h2>
            <span className="num text-sm text-ink-2">{specRows.length} mục</span>
            <ChevronDown className="ml-auto size-5 transition-transform duration-200 group-open:rotate-180" aria-hidden />
          </summary>
          <div className="px-5 pb-5">
            <dl className="divide-y divide-brand-line text-sm">
              {specRows.map(([k, v], i) => (
                <div key={`${k}-${i}`} className="flex justify-between gap-4 py-2.5"><dt className="text-ink-2">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
              ))}
            </dl>
            {!!p.specNotes?.length && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{p.specNotes.map((n) => <li key={n}>{n}</li>)}</ul>}
          </div>
        </details>

        <details open className="group rounded-3xl border border-line">
          <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-5 [&::-webkit-details-marker]:hidden">
            <h2 className="text-lg font-bold">Mô tả &amp; bảo hành</h2>
            <ChevronDown className="ml-auto size-5 transition-transform duration-200 group-open:rotate-180" aria-hidden />
          </summary>
          <div className="px-5 pb-5">
            {p.description ? (
              // Đã làm sạch ở server (lib/rich-text): chỉ còn thẻ định dạng cho phép
              <div className="rich-text text-[15px] leading-6 text-ink-2" dangerouslySetInnerHTML={{ __html: p.description }} />
            ) : (
              <p className="text-[15px] leading-6 text-ink-2">{p.name}{p.spec ? ` — ${p.spec.toLowerCase()}` : ""}. Phù hợp dùng trong gia đình, phòng trọ và công trình nhỏ. Cần tư vấn chọn loại, gọi shop {""}
                <a href="tel:0948732064" className="font-semibold text-ink underline underline-offset-[3px]">0948 732 064</a>.
              </p>
            )}
            <p className="mt-3 text-sm"><b>Bảo hành:</b> {p.warranty}</p>
          </div>
        </details>

        {p.usageGuide && p.usageGuide.length > 0 && (
          <details open className="group rounded-3xl border border-line">
            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-5 [&::-webkit-details-marker]:hidden">
              <h2 className="text-lg font-bold">Hướng dẫn sử dụng</h2>
              <ChevronDown className="ml-auto size-5 transition-transform duration-200 group-open:rotate-180" aria-hidden />
            </summary>
            <div className="px-5 pb-5">
              <ol className="space-y-3">
                {p.usageGuide.map((step, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-6">
                    <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white">{i + 1}</span>
                    <span className="min-w-0">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-ink-2">Hướng dẫn chung theo loại sản phẩm. Xem sách hướng dẫn của hãng đi kèm sản phẩm.</p>
            </div>
          </details>
        )}
      </div>

      <section id="cung-danh-muc" className="mt-10 scroll-mt-32" aria-labelledby="h-lien-quan">
        <h2 id="h-lien-quan" className="mb-4 text-[22px] font-extrabold">{related.length ? `Cùng danh mục ${cat.name}` : "Có thể bạn cần"}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {more.map((x) => <ProductCard key={x.sku} p={x} />)}
        </div>
      </section>
    </>
  );
}
