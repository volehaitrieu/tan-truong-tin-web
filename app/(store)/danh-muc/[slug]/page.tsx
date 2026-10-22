import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductBrowser } from "@/components/storefront/ProductBrowser";
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
      <Breadcrumb items={[{ label: "Sản phẩm", href: "/danh-muc" }, { label: cat.name }]} />
      <h1 className="mb-4 text-[28px] font-extrabold sm:text-[34px]">{cat.name}</h1>
      <ProductBrowser key={cat.slug} products={products} categories={categories} fixedCat={cat.slug} />
    </>
  );
}
