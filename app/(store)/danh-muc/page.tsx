import type { Metadata } from "next";
import { CatalogBrowserShell } from "@/components/storefront/CatalogBrowserShell";
import { ProductBrowserShell } from "@/components/storefront/ProductBrowserShell";
import { CategoryIndexClient } from "@/components/storefront/CategoryIndexClient";
import { getCategories, getCategoryMenu, getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Danh mục" };
// Dữ liệu từ Supabase, làm mới mỗi 60 giây
export const revalidate = 60;

export default async function CategoryIndex({ searchParams }: PageProps<"/danh-muc">) {
  const params = await searchParams;
  const filterKeys = new Set(["industry", "brand", "price", "state", "sort", "cat", "sub"]);
  const hasCatalogFilters = Object.keys(params).some((key) => filterKeys.has(key) || key.startsWith("spec."));
  if (hasCatalogFilters) {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    return (
      <>
        <div hidden data-theme-v2 />
        <h1 className="mb-5 text-[26px] font-extrabold sm:text-[32px]">Sản phẩm</h1>
        <ProductBrowserShell products={products} categories={categories} />
      </>
    );
  }
  const [menu, products] = await Promise.all([getCategoryMenu(), getProducts()]);
  return (
    <>
      <div hidden data-theme-v2 />
      <div className="md:hidden -mx-4 -mt-5 flex h-[calc(100dvh-9rem)] min-h-[480px] flex-col">
        <header className="flex h-12 shrink-0 items-center bg-white px-3">
          <h1 className="text-[14px] font-medium text-[#252A31]">Danh mục sản phẩm</h1>
        </header>
        <div className="flex min-h-0 flex-1 px-0 pt-2"><CategoryIndexClient menu={menu} /></div>
      </div>
      <div className="hidden md:block"><CatalogBrowserShell products={products} /></div>
    </>
  );
}
