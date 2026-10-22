import type { Metadata } from "next";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductBrowser } from "@/components/storefront/ProductBrowser";
import { searchProducts } from "@/lib/mock/store";

export const metadata: Metadata = { title: "Tìm kiếm" };

export default async function SearchPage({ searchParams }: PageProps<"/tim-kiem">) {
  const { query } = await searchParams;
  const q = (Array.isArray(query) ? query[0] : query ?? "").trim();
  const results = q ? searchProducts(q) : [];
  return (
    <>
      <Breadcrumb items={[{ label: "Tìm kiếm" }]} />
      <h1 className="mb-4 text-[26px] font-extrabold sm:text-[32px]">{q ? <>Kết quả cho “{q}”</> : "Tìm sản phẩm"}</h1>
      {q ? <ProductBrowser key={q} products={results} /> : <p className="text-ink-2">Nhập tên món cần tìm vào ô tìm kiếm phía trên, ví dụ “quạt treo”, “ống 21”.</p>}
    </>
  );
}
