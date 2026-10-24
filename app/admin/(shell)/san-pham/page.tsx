import Link from "next/link";
import type { Metadata } from "next";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { ProductTable } from "@/components/admin/ProductTable";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { listOptions, listProducts, type PriceMode } from "@/lib/admin/products";
import { formatNum } from "@/lib/shop";

export const metadata: Metadata = { title: "Sản phẩm" };

type Params = { q?: string; cat?: string; brand?: string; pmin?: string; pmax?: string; pmode?: string; status?: string; page?: string };
const num = (s?: string) => (s && Number.isSafeInteger(Number(s)) && Number(s) >= 0 ? Number(s) : undefined);

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const staff = await requireStaff();
  const sp = await searchParams;
  const canEdit = staff.perms.has("edit_products");
  const canCost = staff.perms.has("view_cost");
  const [list, { categories, brands }] = await Promise.all([
    listProducts({ q: sp.q, cat: Number(sp.cat) || undefined, brand: Number(sp.brand) || undefined,
      pmin: num(sp.pmin), pmax: num(sp.pmax), pmode: (["goc", "km", "ca2"] as const).find((m) => m === sp.pmode) as PriceMode | undefined, status: sp.status, page: Number(sp.page) || 1, withCost: canCost }),
    listOptions(),
  ]);
  const href = (page: number) => {
    const p = new URLSearchParams();
    for (const k of ["q", "cat", "brand", "pmin", "pmax", "pmode", "status"] as const) if (sp[k]) p.set(k, sp[k]!);
    p.set("page", String(page));
    return `/admin/san-pham?${p}`;
  };
  return (
    <>
      <PageHeader title="Sản phẩm" sub={`${formatNum(list.total)} sản phẩm`} actions={staff.perms.has("import_excel") ? <ButtonLink href="/admin/nhap-excel" variant="secondary">Nhập Excel</ButtonLink> : undefined} />
      <ProductFilters categories={categories} brands={brands} init={sp} />

      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <ProductTable key={JSON.stringify(sp)} items={list.items} canEdit={canEdit} canCost={canCost} />
        {list.items.length === 0 && <p className="p-6 text-center text-sm text-ink-2">Không có sản phẩm nào khớp.</p>}
      </div>

      {list.pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Phân trang">
          {list.page > 1 ? <Link className="rounded border border-line bg-white px-3 py-2" href={href(list.page - 1)}>‹ Trước</Link> : <span />}
          <span className="text-ink-2">Trang {list.page}/{list.pages}</span>
          {list.page < list.pages ? <Link className="rounded border border-line bg-white px-3 py-2" href={href(list.page + 1)}>Sau ›</Link> : <span />}
        </nav>
      )}
    </>
  );
}
