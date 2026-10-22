"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Phone, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { discountPct, type Category, type Product } from "@/lib/mock/store";

const PAGE = 12;
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

type Group = { key: string; title: string; options: { id: string; label: string }[]; test: (p: Product, id: string) => boolean };
type Picked = Record<string, string[]>;

export function ProductBrowser({ products, categories, fixedCat }: { products: Product[]; categories: Category[]; fixedCat?: string }) {
  const [picked, setPicked] = useState<Picked>({});
  const [sort, setSort] = useState<(typeof SORTS)[number][0]>("pho-bien");
  const [shown, setShown] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const [moreBrands, setMoreBrands] = useState(false);

  const groups = useMemo<Group[]>(() => {
    const uniq = (xs: string[]) => [...new Set(xs)].map((x) => ({ id: x, label: x }));
    const g: Group[] = [];
    if (!fixedCat)
      g.push({ key: "cat", title: "Danh mục", options: categories.map((c) => ({ id: c.slug, label: c.name })), test: (p, id) => p.cat === id });
    const subs = fixedCat ? categories.find((c) => c.slug === fixedCat)?.subs ?? [] : [...new Set(products.map((p) => p.sub))];
    g.push({ key: "sub", title: "Danh mục con", options: subs.map((s) => ({ id: s, label: s })), test: (p, id) => p.sub === id });
    g.push({ key: "brand", title: "Thương hiệu", options: uniq(products.map((p) => p.brand)), test: (p, id) => p.brand === id });
    g.push({ key: "price", title: "Khoảng giá", options: PRICES, test: (p, id) => PRICES.find((x) => x.id === id)!.test(p.price) });
    // Thông số riêng của danh mục (vd. quạt: loại, sải cánh, điều khiển)
    if (fixedCat) {
      const keys = [...new Set(products.flatMap((p) => p.specs.map(([k]) => k)))].slice(0, 3);
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

  // Lọc theo mọi nhóm, trừ nhóm `skip` (để đếm số lượng cho từng lựa chọn)
  const filter = (skip?: string) =>
    products.filter((p) => groups.every((g) => g.key === skip || !picked[g.key]?.length || picked[g.key].some((id) => g.test(p, id))));

  const results = useMemo(() => {
    const list = filter();
    const by: Record<string, (a: Product, b: Product) => number> = {
      "gia-tang": (a, b) => a.price - b.price,
      "gia-giam": (a, b) => b.price - a.price,
      "giam-nhieu": (a, b) => discountPct(b) - discountPct(a),
      ten: (a, b) => a.name.localeCompare(b.name, "vi"),
    };
    return by[sort] ? [...list].sort(by[sort]) : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, picked, sort, groups]);

  const toggle = (key: string, id: string) => {
    setShown(PAGE);
    setPicked((s) => {
      const cur = s[key] ?? [];
      return { ...s, [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };
  const active = groups.flatMap((g) => (picked[g.key] ?? []).map((id) => ({ g, id, label: g.options.find((o) => o.id === id)?.label ?? id })));

  useEffect(() => {
    if (!sheet) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

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
                  <input type="checkbox" checked={on} disabled={n === 0 && !on} onChange={() => toggle(g.key, o.id)} className="size-[18px] accent-brand" />
                  <span className="flex-1">{o.label}</span>
                  <span className="num text-xs text-ink-2">{n}</span>
                </label>
              );
            })}
            {g.key === "brand" && g.options.length > 6 && (
              <button type="button" onClick={() => setMoreBrands((v) => !v)} className="min-h-10 text-sm font-medium text-brand">
                {moreBrands ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </fieldset>
        );
      })}
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-[250px_1fr]">
      <aside className="hidden h-fit rounded-md bg-white p-4 md:block" aria-label="Bộ lọc">
        <h2 className="mb-3 font-bold">Bộ lọc</h2>
        {panel}
      </aside>

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-2">Tìm thấy <b className="num text-ink">{results.length}</b> sản phẩm</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSheet(true)} className="flex h-11 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium md:hidden">
              <SlidersHorizontal className="size-4" aria-hidden />Bộ lọc{active.length > 0 && <span className="num">({active.length})</span>}
            </button>
            <label className="sr-only" htmlFor="sort">Sắp xếp</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-11 rounded-md border border-line bg-white px-3 text-sm">
              {SORTS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </div>
        </div>

        {active.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {active.map(({ g, id, label }) => (
              <button key={g.key + id} type="button" onClick={() => toggle(g.key, id)} className="flex min-h-9 items-center gap-1 rounded-full bg-brand-tint px-3 text-[13px] font-medium text-brand">
                {label}<X className="size-3.5" aria-label="Bỏ lọc" />
              </button>
            ))}
            <button type="button" onClick={() => setPicked({})} className="min-h-9 px-2 text-[13px] text-ink-2 underline">Xóa tất cả</button>
          </div>
        )}

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {results.slice(0, shown).map((p) => <ProductCard key={p.sku} p={p} />)}
            </div>
            {results.length > shown && (
              <button type="button" onClick={() => setShown((s) => s + PAGE)} className="mx-auto mt-6 flex h-11 items-center rounded-md border border-brand bg-white px-6 font-semibold text-brand hover:bg-brand-tint">
                Xem thêm {Math.min(PAGE, results.length - shown)} sản phẩm
              </button>
            )}
          </>
        ) : (
          <div className="rounded-md bg-white px-5 py-10 text-center">
            <h2 className="text-lg font-bold">Chưa có sản phẩm phù hợp</h2>
            <p className="mt-2 text-sm text-ink-2">Thử bỏ bớt bộ lọc, chọn danh mục khác hoặc gọi shop để hỏi hàng.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <Link key={c.slug} href={`/danh-muc/${c.slug}`} className="flex min-h-10 items-center rounded-full bg-sunk px-3 text-[13px] font-medium hover:bg-brand-tint hover:text-brand">{c.name}</Link>
              ))}
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
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <b>Bộ lọc</b>
              <button type="button" onClick={() => setSheet(false)} aria-label="Đóng bộ lọc" className="grid size-11 place-items-center"><X className="size-5" /></button>
            </div>
            <div className="overflow-y-auto px-4 py-3">{panel}</div>
            <div className="flex gap-2 border-t border-line p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => setPicked({})} className="h-12 rounded-md border border-line px-4 font-medium">Xóa lọc</button>
              <button type="button" onClick={() => setSheet(false)} className="h-12 flex-1 rounded-md bg-brand font-bold text-white">Xem {results.length} sản phẩm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
