import type { Metadata } from "next";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductBrowserShell } from "@/components/storefront/ProductBrowserShell";
import { getCategories, searchCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tìm kiếm" };

export default async function SearchPage({ searchParams }: PageProps<"/tim-kiem">) {
  const { query } = await searchParams;
  const q = (Array.isArray(query) ? query[0] : query ?? "").trim();
  const [results, categories] = await Promise.all([q ? searchCatalog(q.slice(0, 100)) : [], getCategories()]);
  return (
    <>
      <Breadcrumb items={[{ label: "Tìm kiếm" }]} />
      <h1 className="mb-4 text-[26px] font-extrabold sm:text-[32px]">{q ? <>Kết quả cho “{q}”</> : "Tìm sản phẩm"}</h1>
      {q ? <ProductBrowserShell key={q} products={results} categories={categories} /> : <p className="text-ink-2">Nhập tên món cần tìm vào ô tìm kiếm phía trên, ví dụ “quạt treo”, “ống 21”.</p>}
    </>
  );
}
