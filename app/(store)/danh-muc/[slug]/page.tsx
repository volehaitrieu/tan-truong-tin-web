import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductBrowser } from "@/components/storefront/ProductBrowser";
import { CATEGORIES, PRODUCTS, findCategory } from "@/lib/mock/store";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/danh-muc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findCategory(slug)?.name ?? "Không tìm thấy" };
}

export default async function CategoryPage({ params }: PageProps<"/danh-muc/[slug]">) {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) notFound();
  const products = PRODUCTS.filter((p) => p.cat === cat.slug);
  return (
    <>
      <Breadcrumb items={[{ label: "Sản phẩm", href: "/danh-muc" }, { label: cat.name }]} />
      <h1 className="mb-4 text-[28px] font-extrabold sm:text-[34px]">{cat.name}</h1>
      <ProductBrowser key={cat.slug} products={products} fixedCat={cat.slug} />
    </>
  );
}
