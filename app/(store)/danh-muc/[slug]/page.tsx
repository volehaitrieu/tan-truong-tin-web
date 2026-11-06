import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductBrowserShell } from "@/components/storefront/ProductBrowserShell";
import { getCategories, getProducts } from "@/lib/catalog";

// Dữ liệu từ Supabase, làm mới mỗi 60 giây
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/danh-muc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: (await getCategories()).find((c) => c.slug === slug)?.name ?? "Không tìm thấy" };
}

export default async function CategoryPage({ params }: PageProps<"/danh-muc/[slug]">) {
  const { slug } = await params;
  const [categories, all] = await Promise.all([getCategories(), getProducts()]);
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const products = all.filter((p) => p.cat === cat.slug);
  return (
    <>
      {/* Đã áp bảng màu mới (cờ data-theme-v2, xem globals.css) */}
      <div hidden data-theme-v2 />
      <h1 className="mb-4 text-[28px] font-extrabold sm:text-[34px]">{cat.name}</h1>
      {cat.subs.length > 0 && (
        <nav aria-label={`Danh mục con của ${cat.name}`} className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {cat.subs.filter((sub) => products.some((product) => product.sub === sub)).map((sub) => (
            <Link key={sub} href={`/danh-muc/${cat.slug}?sub=${encodeURIComponent(sub)}`} className="flex min-h-10 shrink-0 items-center rounded-full border border-line bg-surface px-4 text-[13px] font-medium transition-colors duration-150 hover:border-brand-line hover:bg-brand-tint hover:text-brand">{sub}</Link>
          ))}
        </nav>
      )}
      <ProductBrowserShell key={cat.slug} products={products} categories={categories} fixedCat={cat.slug} />
    </>
  );
}
