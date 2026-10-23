import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { normalize, type Category, type Product } from "@/lib/mock/store";

// Đọc danh mục / sản phẩm cho trang bán hàng từ Supabase (vai trò khách → RLS chỉ cho SP đang hiển thị).
// Trả về đúng kiểu Category / Product mà giao diện đang dùng.

type Row = {
  sku: string; name: string; unit: string; price: number; sale_price: number | null; sale_from: string | null; sale_to: string | null;
  spec_line: string | null; attributes: Record<string, string | number>; warranty: string | null; in_stock: boolean;
  category_id: number | null;
  brand: { name: string } | null;
  images: { url: string; sort: number }[];
};
const SELECT =
  "sku, name, unit, price, sale_price, sale_from, sale_to, spec_line, attributes, warranty, in_stock, " +
  "category_id, brand:brands(name), images:product_images(url, sort)";

// Bảng danh mục (id → tên, slug, danh mục cha) — tra trong bộ nhớ thay vì nhúng bảng tự tham chiếu
type CatRow = { id: number; parent_id: number | null; name: string; slug: string; icon: string | null; sort: number };
const getCategoryRows = cache(async (): Promise<CatRow[]> => {
  const { data, error } = await createPublicClient().from("categories").select("id, parent_id, name, slug, icon, sort").order("sort");
  if (error) throw error;
  return data;
});

const today = () => new Date().toISOString().slice(0, 10);
function saleActive(r: Row) {
  return r.sale_price != null && (!r.sale_from || r.sale_from <= today()) && (!r.sale_to || r.sale_to >= today());
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const [rows, products] = await Promise.all([getCategoryRows(), getProducts()]);
  return rows
    .filter((c) => c.parent_id === null)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      icon: (c.icon ?? "home") as Category["icon"],
      subs: rows.filter((s) => s.parent_id === c.id).map((s) => s.name),
      count: products.filter((p) => p.cat === c.slug).length,
    }));
});

async function attributeLabels() {
  const { data } = await createPublicClient().from("categories").select("attribute_schema").neq("attribute_schema", "[]");
  const map = new Map<string, { label: string; unit?: string }>();
  for (const c of data ?? []) for (const a of c.attribute_schema as { key: string; label: string; unit?: string }[]) map.set(a.key, a);
  return map;
}

function toProduct(r: Row, labels: Map<string, { label: string; unit?: string }>, cats: CatRow[]): Product {
  const sale = saleActive(r);
  const sub = cats.find((c) => c.id === r.category_id);
  const top = sub?.parent_id ? cats.find((c) => c.id === sub.parent_id) : sub;
  return {
    sku: r.sku,
    name: r.name,
    brand: r.brand?.name ?? "",
    cat: top?.slug ?? "",
    sub: sub?.name ?? "",
    price: sale ? r.sale_price! : r.price,
    old: sale ? r.price : undefined,
    unit: r.unit,
    stock: r.in_stock,
    image: [...r.images].sort((a, b) => a.sort - b.sort)[0]?.url ?? "/ai/hardware-hero.jpg",
    spec: r.spec_line ?? "",
    specs: Object.entries(r.attributes ?? {}).map(([k, v]) => {
      const l = labels.get(k);
      return [l?.label ?? k, `${v}${l?.unit ? " " + l.unit : ""}`] as [string, string];
    }),
    warranty: r.warranty ?? "Theo chính sách của hãng",
  };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const [{ data, error }, labels, cats] = await Promise.all([
    createPublicClient().from("products").select(SELECT).order("name").limit(5000),
    attributeLabels(),
    getCategoryRows(),
  ]);
  if (error) throw error;
  return (data as unknown as Row[]).map((r) => toProduct(r, labels, cats));
});

export async function getProduct(sku: string) {
  if (!/^[A-Za-z0-9-]{2,42}$/.test(sku)) return undefined;
  return (await getProducts()).find((p) => p.sku.toLowerCase() === sku.toLowerCase());
}

export async function searchCatalog(q: string) {
  const words = normalize(q).split(/\s+/).filter(Boolean).slice(0, 8);
  return (await getProducts()).filter((p) => {
    const hay = normalize(`${p.name} ${p.brand} ${p.sku} ${p.sub}`);
    return words.every((w) => hay.includes(w));
  });
}
