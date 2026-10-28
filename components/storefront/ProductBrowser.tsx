"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Phone, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { discountPct, HOME_PAGE_SIZE, PAGE_SIZE, type Category, type Product } from "@/lib/mock/store";

const SPEC_PRIORITY = ["Loại quạt", "Sải cánh", "Công suất", "Điều khiển"];
const PRICES = [
  { id: "duoi-100", label: "Dưới 100.000₫", test: (n: number) => n < 100000 },
  { id: "100-500", label: "100.000₫ – 500.000₫", test: (n: number) => n >= 100000 && n <= 500000 },
  { id: "500-1tr", label: "500.000₫ – 1.000.000₫", test: (n: number) => n > 500000 && n <= 1000000 },
  { id: "tren-1tr", label: "Trên 1.000.000₫", test: (n: number) => n > 1000000 },
];
const STATES = [
  { id: "con-hang", label: "Còn hàng", test: (p: Product) => p.stock },
  { id: "lien-he", label: "Liên hệ", test: (p: Product) => !p.stock },
  { id: "giam-gia", label: "Đang giảm giá", test: (p: Product) => !!p.old },
];
const SORTS = [
  ["pho-bien", "Phổ biến"],
  ["gia-tang", "Giá thấp → cao"],
  ["gia-giam", "Giá cao → thấp"],
  ["giam-nhieu", "Giảm nhiều nhất"],
  ["ten", "Tên A–Z"],
] as const;
const URL_FILTERS = ["cat", "sub", "industry", "brand", "price", "state"];

type Group = { key: string; title: string; options: { id: string; label: string }[]; test: (p: Product, id: string) => boolean };
type Picked = Record<string, string[]>;
type Sort = (typeof SORTS)[number][0];

function paramKey(key: string) {
  return key.startsWith("spec:") ? `spec.${key.slice(5)}` : key;
}

export function ProductBrowser({ products, categories, fixedCat, showSort = true, showSale = false }: { products: Product[]; categories: Category[]; fixedCat?: string; showSort?: boolean; showSale?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const serializedParams = searchParams.toString();
  const navigationKey = `${pathname}?${serializedParams}`;
  const pageSize = showSale ? HOME_PAGE_SIZE : PAGE_SIZE;
  const [pagination, setPagination] = useState({ key: navigationKey, count: pageSize });
  const [sheet, setSheet] = useState(false);
  const [brandExpansion, setBrandExpansion] = useState<{ key: string; expanded: boolean } | null>(null);
  const shown = pagination.key === navigationKey ? pagination.count : pageSize;

  const groups = useMemo<Group[]>(() => {
    const uniq = (xs: string[]) => [...new Set(xs)].map((x) => ({ id: x, label: x }));
    const g: Group[] = [];
    if (!fixedCat)
      g.push({ key: "cat", title: "Danh mục", options: categories.map((c) => ({ id: c.slug, label: c.name })), test: (p, id) => p.cat === id });
    const industries = uniq(products.map((p) => p.industry.trim()).filter(Boolean));
    if (industries.length) g.push({ key: "industry", title: "Ngành hàng", options: industries, test: (p, id) => p.industry.trim() === id });
    const subs = fixedCat ? (categories.find((c) => c.slug === fixedCat)?.subs ?? []).filter((sub) => products.some((p) => p.sub === sub)) : [...new Set(products.map((p) => p.sub))];
    g.push({ key: "sub", title: "Danh mục con", options: subs.map((s) => ({ id: s, label: s })), test: (p, id) => p.sub === id });
    g.push({ key: "brand", title: "Thương hiệu", options: uniq(products.map((p) => p.brand).filter(Boolean)), test: (p, id) => p.brand === id });
    g.push({ key: "price", title: "Khoảng giá", options: PRICES, test: (p, id) => PRICES.find((x) => x.id === id)!.test(p.price) });
    if (fixedCat) {
      const all = [...new Set(products.flatMap((p) => p.specs.map(([k]) => k)))];
      const keys = [...SPEC_PRIORITY.filter((k) => all.includes(k)), ...all.filter((k) => !SPEC_PRIORITY.includes(k))].slice(0, 4);
      for (const k of keys)
        g.push({
          key: `spec:${k}`,
          title: k,
          options: uniq(products.flatMap((p) => p.specs.filter(([kk]) => kk === k).map(([, v]) => v))),
          test: (p, id) => p.specs.some(([kk, v]) => kk === k && v === id),
        });
    }
    g.push({ key: "state", title: "Tình trạng", options: STATES, test: (p, id) => STATES.find((x) => x.id === id)!.test(p) });
    return g;
  }, [products, categories, fixedCat]);

  const picked = useMemo<Picked>(() => {
    const next: Picked = {};
    for (const group of groups) {
      const allowed = new Set(group.options.map((option) => option.id));
      const values = [...new Set(new URLSearchParams(serializedParams).getAll(paramKey(group.key)))].filter((value) => allowed.has(value));
      if (values.length) next[group.key] = values;
    }
    return next;
  }, [groups, serializedParams]);

  const sort = useMemo<Sort>(() => {
    const allowed = new Set<string>(SORTS.map(([id]) => id));
    return new URLSearchParams(serializedParams).getAll("sort").find((value): value is Sort => allowed.has(value)) ?? "pho-bien";
  }, [serializedParams]);

  const updateUrl = (key: string, values: string[], history: "push" | "replace" = "push") => {
    const params = new URLSearchParams(serializedParams);
    params.delete(key);
    [...new Set(values)].forEach((value) => params.append(key, value));
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router[history](url, { scroll: false });
  };

  // Back/Forward are external navigation events; reset ephemeral UI from the subscription.
  useEffect(() => {
    const resetEphemeralState = () => {
      setPagination({ key: "", count: PAGE_SIZE });
      setBrandExpansion(null);
    };
    window.addEventListener("popstate", resetEphemeralState);
    return () => window.removeEventListener("popstate", resetEphemeralState);
  }, []);

  const filter = (skip?: string) =>
    products.filter((p) => groups.every((g) => g.key === skip || !picked[g.key]?.length || picked[g.key].some((id) => g.test(p, id))));

  const results = useMemo(() => {
    const list = filter();
    const by: Partial<Record<Sort, (a: Product, b: Product) => number>> = {
      "gia-tang": (a, b) => a.price - b.price,
      "gia-giam": (a, b) => b.price - a.price,
      "giam-nhieu": (a, b) => discountPct(b) - discountPct(a),
      ten: (a, b) => a.name.localeCompare(b.name, "vi"),
    };
    return by[sort] ? [...list].sort(by[sort]) : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, picked, sort, groups]);
  const [salePrice, setSalePrice] = useState<string | null>(null);
  const [allPrice, setAllPrice] = useState<string | null>(null);
  const saleHomeProducts = products.filter((product) => product.old && (!salePrice || PRICES.find((range) => range.id === salePrice)?.test(product.price)));
  const allHomeProducts = products.filter((product) => !allPrice || PRICES.find((range) => range.id === allPrice)?.test(product.price));

  const toggle = (key: string, id: string) => {
    const group = groups.find((item) => item.key === key);
    if (!group?.options.some((option) => option.id === id)) return;
    const current = picked[key] ?? [];
    const values = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    updateUrl(paramKey(key), values);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(serializedParams);
    for (const key of URL_FILTERS) params.delete(key);
    for (const key of [...params.keys()]) if (key.startsWith("spec.")) params.delete(key);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const active = groups.flatMap((g) => (picked[g.key] ?? []).map((id) => ({ g, id, label: g.options.find((o) => o.id === id)?.label ?? id })));
  const hiddenBrandSelected = (picked.brand ?? []).some((id) => {
    const options = groups.find((group) => group.key === "brand")?.options ?? [];
    return options.slice(6).some((option) => option.id === id);
  });
  const moreBrands = (brandExpansion?.key === navigationKey && brandExpansion.expanded) || hiddenBrandSelected;

  useEffect(() => {
    if (!sheet) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const homePriceFilter = (value: string | null, setValue: (value: string | null) => void, section: string) => (
    <fieldset className="mb-3">
      <legend className="mb-2 text-sm font-semibold">Khoảng giá · {section}</legend>
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={`Lọc khoảng giá ${section}`}>
        {[{ id: "all", label: "Tất cả" }, ...PRICES].map((range) => {
          const selected = range.id === "all" ? value === null : value === range.id;
          return <button key={range.id} type="button" aria-pressed={selected} onClick={() => { setValue(range.id === "all" || selected ? null : range.id); setPagination({ key: navigationKey, count: pageSize }); }} className={`min-h-10 shrink-0 rounded-full border px-4 text-[13px] font-medium transition-colors ${selected ? "border-brand bg-brand text-white" : "border-line bg-surface hover:border-brand hover:bg-brand-tint"}`}>{range.label}</button>;
        })}
      </div>
    </fieldset>
  );

  if (showSale) {
    return (
      <div className="min-w-0">
        <section className="mb-8" aria-labelledby="h-giam-gia">
          {homePriceFilter(salePrice, setSalePrice, "sản phẩm giảm giá")}
          <h2 id="h-giam-gia" className="mb-4 text-[22px] font-extrabold sm:text-[26px]">Sản phẩm đang giảm giá ({saleHomeProducts.length})</h2>
          {saleHomeProducts.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{saleHomeProducts.map((p) => <ProductCard key={p.sku} p={p} />)}</div> : <p className="rounded-md bg-surface p-5 text-sm text-ink-2">Không có sản phẩm giảm giá trong khoảng này.</p>}
        </section>
        <section aria-labelledby="h-tat-ca">
          {homePriceFilter(allPrice, setAllPrice, "tất cả sản phẩm")}
          <h2 id="h-tat-ca" className="mb-4 text-[22px] font-extrabold sm:text-[26px]">Tất cả sản phẩm ({allHomeProducts.length})</h2>
          {allHomeProducts.length ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {allHomeProducts.slice(0, shown).map((p) => <ProductCard key={p.sku} p={p} />)}
              </div>
              {allHomeProducts.length > shown && <button type="button" onClick={() => setPagination({ key: navigationKey, count: shown + pageSize })} className="mx-auto mt-6 flex h-11 items-center rounded-md border border-brand bg-surface px-6 font-semibold text-brand hover:bg-brand-tint">Xem thêm {Math.min(pageSize, allHomeProducts.length - shown)} / {allHomeProducts.length} sản phẩm</button>}
            </>
          ) : <p className="rounded-md bg-surface p-5 text-sm text-ink-2">Không có sản phẩm trong khoảng giá này.</p>}
        </section>
      </div>
    );
  }

  const panel = (
    <div className="space-y-1">
      {groups.map((g) => {
        const base = filter(g.key);
        const opts = g.key === "brand" && !moreBrands ? g.options.slice(0, 6) : g.options;
        if (g.options.length === 0) return null;
        return (
          <fieldset key={g.key} className="border-t border-line py-3 first:border-0 first:pt-0">
            <legend className="mb-1 text-sm font-semibold">{g.title}</legend>
            {opts.map((o) => {
              const n = base.filter((p) => g.test(p, o.id)).length;
              const on = picked[g.key]?.includes(o.id) ?? false;
              return (
                <label key={o.id} className={`flex min-h-10 cursor-pointer items-center gap-2.5 text-sm ${n === 0 && !on ? "opacity-40" : ""}`}>
                  <input type="checkbox" checked={on} disabled={n === 0 && !on} onChange={() => toggle(g.key, o.id)} className="size-[18px] accent-brand disabled:cursor-not-allowed disabled:opacity-50" />
                  <span className="flex-1">{o.label}</span>
                  <span className="num text-xs text-ink-2">{n}</span>
                </label>
              );
            })}
            {g.key === "brand" && g.options.length > 6 && !hiddenBrandSelected && (
              <button type="button" onClick={() => setBrandExpansion({ key: navigationKey, expanded: !moreBrands })} className="min-h-10 text-sm font-medium text-brand">
                {moreBrands ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </fieldset>
        );
      })}
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="hidden h-fit rounded-md bg-surface p-4 md:sticky md:top-24 md:block" aria-label="Bộ lọc">
        <h2 className="mb-3 font-bold">Bộ lọc</h2>
        {panel}
      </aside>

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-2">Tìm thấy <b className="num text-ink">{results.length}</b> sản phẩm</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSheet(true)} className="flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium md:hidden">
              <SlidersHorizontal className="size-4" aria-hidden />Bộ lọc{active.length > 0 && <span className="num">({active.length})</span>}
            </button>
            {showSort && (
              <>
                <label className="sr-only" htmlFor="sort">Sắp xếp</label>
                <select id="sort" value={sort} onChange={(event) => updateUrl("sort", event.target.value === "pho-bien" ? [] : [event.target.value], "replace")} className="h-11 rounded-md border border-brand bg-surface px-3 text-sm">
                  {SORTS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </>
            )}
          </div>
        </div>

        {active.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {active.map(({ g, id, label }) => (
              <button key={g.key + id} type="button" onClick={() => toggle(g.key, id)} className="flex min-h-9 items-center gap-1 rounded-full bg-brand-tint px-3 text-[13px] font-medium text-brand">
                {label}<X className="size-3.5" aria-label="Bỏ lọc" />
              </button>
            ))}
            <button type="button" onClick={clearFilters} className="min-h-9 px-2 text-[13px] text-ink-2 underline">Xóa tất cả</button>
          </div>
        )}

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {results.slice(0, shown).map((p) => <ProductCard key={p.sku} p={p} />)}
            </div>
            {results.length > shown && (
              <button type="button" onClick={() => setPagination({ key: navigationKey, count: shown + pageSize })} className="mx-auto mt-6 flex h-11 items-center rounded-md border border-brand bg-surface px-6 font-semibold text-brand hover:bg-brand-tint">
                Xem thêm {Math.min(pageSize, results.length - shown)} / {results.length} sản phẩm
              </button>
            )}
          </>
        ) : (
          <div className="rounded-md bg-surface px-5 py-10 text-center">
            <h2 className="text-lg font-bold">Chưa có sản phẩm phù hợp</h2>
            <p className="mt-2 text-sm text-ink-2">Thử bỏ bớt bộ lọc, chọn danh mục khác hoặc gọi shop để hỏi hàng.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map((c) => <Link key={c.slug} href={`/danh-muc/${c.slug}`} className="flex min-h-10 items-center rounded-full bg-sunk px-3 text-[13px] font-medium hover:bg-brand-tint hover:text-brand">{c.name}</Link>)}
            </div>
            <a href="tel:0948732064" className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-deep">
              <Phone className="size-4" aria-hidden />Gọi shop · 0948 732 064
            </a>
          </div>
        )}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Bộ lọc">
          <button type="button" aria-label="Đóng" onClick={() => setSheet(false)} className="absolute inset-0 bg-ink/40" />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-xl bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <b>Bộ lọc</b>
              <button type="button" onClick={() => setSheet(false)} aria-label="Đóng bộ lọc" className="grid size-11 place-items-center"><X className="size-5" /></button>
            </div>
            <div className="overflow-y-auto px-4 py-3">{panel}</div>
            <div className="flex gap-2 border-t border-line p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
              <button type="button" onClick={clearFilters} className="h-12 rounded-md border border-line px-4 font-medium">Xóa lọc</button>
              <button type="button" onClick={() => setSheet(false)} className="h-12 flex-1 rounded-md bg-brand font-bold text-white">Xem {results.length} sản phẩm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
