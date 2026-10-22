import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { normalize, type Category, type Product } from "@/lib/mock/store";

// Đọc danh mục / sản phẩm cho trang bán hàng từ Supabase (vai trò khách → RLS chỉ cho SP đang hiển thị).
// Trả về đúng kiểu Category / Product mà giao diện đang dùng.

type Row = {
  sku: string; name: string; unit: string; price: number; sale_price: number | null; sale_from: string | null; sale_to: string | null;
  spec_line: string | null; attributes: Record<string, string | number>; warranty: string | null; in_stock: boolean;
  brand: { name: string } | null;
  category: { name: string; slug: string; parent: { slug: string } | null } | null;
  images: { url: string; sort: number }[];
};
const SELECT =
  "sku, name, unit, price, sale_price, sale_from, sale_to, spec_line, attributes, warranty, in_stock, " +
  "brand:brands(name), category:categories(name, slug, parent:categories(slug)), images:product_images(url, sort)";

const today = () => new Date().toISOString().slice(0, 10);
function saleActive(r: Row) {
  return r.sale_price != null && (!r.sale_from || r.sale_from <= today()) && (!r.sale_to || r.sale_to >= today());
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = createPublicClient();
  const { data, error } = await db.from("categories").select("id, parent_id, name, slug, icon, sort").order("sort");
  if (error) throw error;
  const { data: counts } = await db.from("products").select("category:categories(parent_id, slug)");
  return data
    .filter((c) => c.parent_id === null)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      icon: (c.icon ?? "home") as Category["icon"],
      subs: data.filter((s) => s.parent_id === c.id).map((s) => s.name),
      count: (counts ?? []).filter((p) => {
        const cat = p.category as unknown as { parent_id: number | null; slug: string } | null;
        return cat?.parent_id === c.id || cat?.slug === c.slug;
      }).length,
    }));
});

async function attributeLabels() {
  const { data } = await createPublicClient().from("categories").select("attribute_schema").neq("attribute_schema", "[]");
  const map = new Map<string, { label: string; unit?: string }>();
  for (const c of data ?? []) for (const a of c.attribute_schema as { key: string; label: string; unit?: string }[]) map.set(a.key, a);
  return map;
}

function toProduct(r: Row, labels: Map<string, { label: string; unit?: string }>): Product {
  const sale = saleActive(r);
  return {
    sku: r.sku,
    name: r.name,
    brand: r.brand?.name ?? "",
    cat: r.category?.parent?.slug ?? r.category?.slug ?? "",
    sub: r.category?.name ?? "",
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
  const [{ data, error }, labels] = await Promise.all([
    createPublicClient().from("products").select(SELECT).order("name").limit(5000),
    attributeLabels(),
  ]);
  if (error) throw error;
  return (data as unknown as Row[]).map((r) => toProduct(r, labels));
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
