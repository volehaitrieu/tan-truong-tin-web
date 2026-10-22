import Link from "next/link";
import type { Metadata } from "next";
import { Package, Pencil, Search } from "lucide-react";
import { Badge, ButtonLink, OwnerOnly, PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { listOptions, listProducts } from "@/lib/admin/products";
import { formatNum, formatVnd } from "@/lib/shop";

export const metadata: Metadata = { title: "Sản phẩm" };

const field = "h-10 rounded border border-line bg-white px-3 text-sm outline-none";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string; status?: string; page?: string }> }) {
  const staff = await requireStaff();
  const sp = await searchParams;
  const canEdit = staff.perms.has("edit_products");
  const canCost = staff.perms.has("view_cost");
  const [list, { categories }] = await Promise.all([
    listProducts({ q: sp.q, cat: Number(sp.cat) || undefined, status: sp.status, page: Number(sp.page) || 1, withCost: canCost }),
    listOptions(),
  ]);
  const href = (page: number) => {
    const p = new URLSearchParams();
    if (sp.q) p.set("q", sp.q);
    if (sp.cat) p.set("cat", sp.cat);
    if (sp.status) p.set("status", sp.status);
    p.set("page", String(page));
    return `/admin/san-pham?${p}`;
  };
  return (
    <>
      <PageHeader title="Sản phẩm" sub={`${formatNum(list.total)} sản phẩm`} actions={staff.perms.has("import_excel") ? <ButtonLink href="/admin/nhap-excel" variant="secondary">Nhập Excel</ButtonLink> : undefined} />
      <form className="mb-4 flex flex-wrap gap-2" role="search">
        <label className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-3 size-4 text-ink-2" aria-hidden />
          <input name="q" defaultValue={sp.q} maxLength={80} className={`${field} w-full pl-9`} placeholder="Tìm tên, SKU, thương hiệu…" aria-label="Tìm sản phẩm" />
        </label>
        <select name="cat" defaultValue={sp.cat ?? ""} className={`${field} min-w-36`} aria-label="Danh mục">
          <option value="">Mọi danh mục</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="status" defaultValue={sp.status ?? ""} className={`${field} min-w-32`} aria-label="Trạng thái">
          <option value="">Mọi trạng thái</option>
          <option value="show">Hiển thị</option>
          <option value="hide">Ẩn</option>
        </select>
        <button className="h-10 rounded bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-deep">Lọc</button>
      </form>

      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-ground text-left text-xs text-ink-2">
              <tr>
                {["Sản phẩm", "Danh mục", "Thương hiệu", "Giá bán", "Giá nhập", "Tồn", "Trạng thái", ""].map((h) => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.items.map((p) => (
                <tr key={p.id} className="h-14 border-t border-line">
                  <td className="px-3"><b>{p.name}</b><small className="mt-1 block text-ink-2">{p.sku}</small></td>
                  <td className="px-3">{p.cat}</td>
                  <td className="px-3">{p.brand}</td>
                  <td className="num px-3">{formatVnd(p.salePrice ?? p.price)}{p.salePrice != null && <small className="block text-ink-2 line-through">{formatVnd(p.price)}</small>}</td>
                  <td className="num px-3">{canCost ? (p.cost != null ? formatVnd(p.cost) : "—") : <OwnerOnly label="Ẩn" />}</td>
                  <td className="num px-3">{p.stock}</td>
                  <td className="px-3"><Badge tone={p.visible ? "ok" : "neutral"}>{p.visible ? "Hiển thị" : "Ẩn"}</Badge></td>
                  <td className="px-3">{canEdit && <Link href={`/admin/san-pham/${p.id}`} aria-label={`Sửa ${p.name}`} className="grid size-11 -my-2 place-items-center rounded text-brand hover:bg-brand-tint"><Pencil className="size-4" /></Link>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-line md:hidden">
          {list.items.map((p) => (
            <div key={p.id} className="flex gap-3 p-3">
              <div className="grid size-16 shrink-0 place-items-center rounded bg-sunk"><Package className="size-7 text-brand" aria-hidden /></div>
              <div className="min-w-0 flex-1">
                <b className="block text-sm">{p.name}</b>
                <small className="text-ink-2">{p.sku} · {p.cat}</small>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <b className="num text-sm text-danger">{formatVnd(p.salePrice ?? p.price)}</b>
                  <span className="text-xs text-ink-2">Tồn {p.stock}</span>
                  {!p.visible && <Badge>Ẩn</Badge>}
                </div>
              </div>
              {canEdit && <Link href={`/admin/san-pham/${p.id}`} aria-label={`Sửa ${p.name}`} className="grid size-11 shrink-0 place-items-center rounded text-brand hover:bg-brand-tint"><Pencil className="size-4" /></Link>}
            </div>
          ))}
        </div>
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
