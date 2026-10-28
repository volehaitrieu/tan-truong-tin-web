import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { CategoryIcon } from "@/components/storefront/CategoryIcon";
import { ProductBrowserShell } from "@/components/storefront/ProductBrowserShell";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tất cả sản phẩm" };
// Dữ liệu từ Supabase, làm mới mỗi 60 giây
export const revalidate = 60;

export default async function AllProducts() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <>
      <Breadcrumb items={[{ label: "Tất cả sản phẩm" }]} />
      <h1 className="text-[28px] font-extrabold sm:text-[34px]">Tất cả sản phẩm</h1>
      <div className="my-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {categories.map((c) => (
          <Link key={c.slug} href={`/danh-muc/${c.slug}`} className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-medium hover:bg-brand-tint hover:text-brand">
            <CategoryIcon icon={c.icon} className="size-4 text-brand" />{c.name}
          </Link>
        ))}
      </div>
      <ProductBrowserShell products={products} categories={categories} />
    </>
  );
}
