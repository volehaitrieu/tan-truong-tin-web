import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ProductRow = {
  id: number; sku: string; name: string; cat: string; brand: string; price: number; salePrice: number | null;
  stock: number; min: number; visible: boolean; cost: number | null;
};
export type Option = { id: number; name: string };

const PAGE_SIZE = 50;

// Bỏ ký tự đặc biệt của bộ lọc PostgREST khỏi chuỗi tìm kiếm
const cleanQuery = (q: string) => q.replace(/[,()%*\\]/g, " ").trim().slice(0, 80);

export async function listProducts(opts: { q?: string; cat?: number; status?: string; page?: number; withCost: boolean }) {
  const db = await createClient();
  let query = db
    .from("products")
    .select("id, sku, name, price, sale_price, is_visible, category:categories(name), brand:brands(name), inventory(qty, min_qty)", { count: "exact" })
    .order("name");
  const q = cleanQuery(opts.q ?? "");
  if (q) {
    const plain = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
    query = query.ilike("search_text", `%${plain}%`);
  }
  if (opts.cat) query = query.eq("category_id", opts.cat);
  if (opts.status === "show") query = query.eq("is_visible", true);
  if (opts.status === "hide") query = query.eq("is_visible", false);
  const page = Math.max(1, opts.page ?? 1);
  const { data, count, error } = await query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw error;
  type R = { id: number; sku: string; name: string; price: number; sale_price: number | null; is_visible: boolean; category: { name: string } | null; brand: { name: string } | null; inventory: { qty: number; min_qty: number } | null };
  const rows = data as unknown as R[];
  const costs = new Map<number, number>();
  if (opts.withCost && rows.length) {
    const { data: c } = await db.from("product_costs").select("product_id, cost_price").in("product_id", rows.map((r) => r.id));
    for (const x of c ?? []) costs.set(x.product_id, x.cost_price);
  }
  const items: ProductRow[] = rows.map((r) => ({
    id: r.id, sku: r.sku, name: r.name, cat: r.category?.name ?? "", brand: r.brand?.name ?? "", price: r.price, salePrice: r.sale_price,
    stock: r.inventory?.qty ?? 0, min: r.inventory?.min_qty ?? 0, visible: r.is_visible, cost: costs.get(r.id) ?? null,
  }));
  return { items, total: count ?? items.length, page, pages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)) };
}

export async function listOptions() {
  const db = await createClient();
  const [c, b] = await Promise.all([db.from("categories").select("id, name").order("sort").order("name"), db.from("brands").select("id, name").order("name")]);
  return { categories: (c.data ?? []) as Option[], brands: (b.data ?? []) as Option[] };
}

export type ProductDetail = {
  id: number; sku: string; name: string; unit: string; price: number; salePrice: number | null; saleFrom: string; saleTo: string;
  categoryId: number | null; brandId: number | null; spec: string; warranty: string; origin: string; description: string;
  needTags: string; visible: boolean; stock: number; min: number; cost: number | null; updatedAt: string;
};

export async function getProductDetail(id: number, withCost: boolean): Promise<ProductDetail | null> {
  const db = await createClient();
  const { data } = await db
    .from("products")
    .select("id, sku, name, unit, price, sale_price, sale_from, sale_to, category_id, brand_id, spec_line, warranty, origin, description, need_tags, is_visible, updated_at, inventory(qty, min_qty)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const d = data as unknown as {
    id: number; sku: string; name: string; unit: string; price: number; sale_price: number | null; sale_from: string | null; sale_to: string | null;
    category_id: number | null; brand_id: number | null; spec_line: string | null; warranty: string | null; origin: string | null; description: string | null;
    need_tags: string[]; is_visible: boolean; updated_at: string; inventory: { qty: number; min_qty: number } | null;
  };
  let cost: number | null = null;
  if (withCost) {
    const { data: c } = await db.from("product_costs").select("cost_price").eq("product_id", id).maybeSingle();
    cost = c?.cost_price ?? null;
  }
  return {
    id: d.id, sku: d.sku, name: d.name, unit: d.unit, price: d.price, salePrice: d.sale_price, saleFrom: d.sale_from ?? "", saleTo: d.sale_to ?? "",
    categoryId: d.category_id, brandId: d.brand_id, spec: d.spec_line ?? "", warranty: d.warranty ?? "", origin: d.origin ?? "",
    description: d.description ?? "", needTags: d.need_tags.join(", "), visible: d.is_visible, stock: d.inventory?.qty ?? 0, min: d.inventory?.min_qty ?? 0,
    cost, updatedAt: new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short" }).format(new Date(d.updated_at)),
  };
}
