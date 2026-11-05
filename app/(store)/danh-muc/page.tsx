import type { Metadata } from "next";
import { CatalogBrowserShell } from "@/components/storefront/CatalogBrowserShell";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tất cả sản phẩm" };
// Dữ liệu từ Supabase, làm mới mỗi 60 giây
export const revalidate = 60;

export default async function AllProducts() {
  const products = await getProducts();
  return (
    <>
      {/* Đã áp bảng màu mới (cờ data-theme-v2, xem globals.css) */}
      <div hidden data-theme-v2 />
      <CatalogBrowserShell products={products} />
    </>
  );
}
