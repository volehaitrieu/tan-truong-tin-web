import "server-only";
import { cache } from "react";

// Ảnh cho ô Danh mục con trong tấm Danh mục: đặt file vào public/shop/danh-muc/<slug>.png
const SUBCATEGORY_TILE_IMAGES: Record<string, string> = {
  quat: "/shop/danh-muc/quat.png",
};
import { createPublicClient } from "@/lib/supabase/public";
import { normalize, type Category, type Product } from "@/lib/mock/store";
import { parseSpecs, sanitizeHtml } from "@/lib/rich-text";

// Đọc danh mục / sản phẩm cho trang bán hàng từ Supabase (vai trò khách → RLS chỉ cho SP đang hiển thị).
// Trả về đúng kiểu Category / Product mà giao diện đang dùng.

type Row = {
  sku: string; name: string; unit: string; price: number; sale_price: number | null; sale_from: string | null; sale_to: string | null;
  spec_line: string | null; attributes: Record<string, string | number>; warranty: string | null; in_stock: boolean;
  origin: string | null; made_in: string | null; description: string | null;
  category_id: number | null; industry: string | null;
  brand: { name: string } | null;
  images: { url: string; sort: number }[];
};
const SELECT =
  "sku, name, unit, price, sale_price, sale_from, sale_to, spec_line, attributes, warranty, origin, made_in, description, in_stock, " +
  "category_id, industry, brand:brands(name), images:product_images(url, sort)";
const SELECT_BEFORE_INDUSTRY = SELECT.replace("category_id, industry,", "category_id,");

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
    .map((c) => {
      const inCategory = products.filter((p) => p.cat === c.slug);
      const subcategories = rows
        .filter((s) => s.parent_id === c.id)
        .map((s) => ({
          slug: s.slug,
          name: s.name,
          count: inCategory.filter((p) => p.sub === s.name).length,
        }))
        .filter((s) => s.count > 0);
      return {
        slug: c.slug,
        name: c.slug === "gia-dung" ? "Đồ gia dụng" : c.name,
        icon: (c.icon ?? "home") as Category["icon"],
        subs: subcategories.map((s) => s.name),
        subcategories,
        count: inCategory.length,
      };
    })
    .filter((c) => c.count > 0);
});

export type CategoryMenuChild = { slug: string; name: string; count: number; image?: string };
export type CategoryMenuTab = { slug: string; name: string; icon: Category["icon"]; count: number; children: CategoryMenuChild[] };

// A compact root category → child category list for the mobile menu.
export const getCategoryMenu = cache(async (): Promise<CategoryMenuTab[]> => {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return categories
    .map((category) => {
      const inCategory = products.filter((product) => product.cat === category.slug);
      const children = (category.subcategories ?? []).flatMap((subcategory) => {
        const inSubcategory = inCategory.filter((product) => product.sub === subcategory.name);
        if (!inSubcategory.length) return [];
        // Ảnh ô riêng (PNG nền trong, chủ shop cung cấp) ưu tiên hơn ảnh sản phẩm đầu tiên.
        const image = SUBCATEGORY_TILE_IMAGES[subcategory.slug] ?? inSubcategory.find((product) => product.image !== "/ai/hardware-hero.jpg")?.image;
        return [{ slug: subcategory.slug, name: subcategory.name, count: inSubcategory.length, ...(image ? { image } : {}) }];
      });
      return { slug: category.slug, name: category.name, icon: category.icon, count: category.count, children };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "vi"));
});

async function attributeLabels() {
  const { data } = await createPublicClient().from("categories").select("attribute_schema").neq("attribute_schema", "[]");
  const map = new Map<string, { label: string; unit?: string }>();
  for (const c of data ?? []) for (const a of c.attribute_schema as { key: string; label: string; unit?: string }[]) map.set(a.key, a);
  return map;
}

function toProduct(r: Row, labels: Map<string, { label: string; unit?: string }>, cats: CatRow[]): Product {
  const sale = saleActive(r);
  const specs = parseSpecs(r.spec_line ?? "");
  let sub = cats.find((c) => c.id === r.category_id);
  let top = sub;
  let classification = "";
  // Keep the storefront's category filter at the root + first child level,
  // even when a product is assigned to a deeper leaf such as "Quạt treo tường".
  while (top && top.parent_id) {
    const parentId = top.parent_id;
    const parent = cats.find((c) => c.id === parentId);
    if (!parent) break;
    if (parent.parent_id === null) {
      sub = top;
      top = parent;
      break;
    }
    if (!classification) classification = top.name;
    top = parent;
  }
  return {
    sku: r.sku,
    name: r.name,
    brand: r.brand?.name ?? "",
    industry: r.industry ?? "",
    cat: top?.slug ?? "",
    sub: sub && sub.parent_id === top?.id ? sub.name : "",
    classification,
    price: sale ? r.sale_price! : r.price,
    old: sale ? r.price : undefined,
    unit: r.unit,
    stock: r.in_stock,
    image: [...r.images].sort((a, b) => a.sort - b.sort)[0]?.url ?? "/ai/hardware-hero.jpg",
    // Thẻ SP: 3 giá trị thông số đầu (hoặc dòng đầu)
    spec: specs.rows.length ? specs.rows.slice(0, 3).map(([, v]) => v).join(" · ") : specs.notes[0] ?? "",
    specs: [
      // Thông số nhập tay thắng thông số cũ cùng tên
      ...Object.entries(r.attributes ?? {}).map(([k, v]) => {
        const l = labels.get(k);
        return [l?.label ?? k, `${v}${l?.unit ? " " + l.unit : ""}`] as [string, string];
      }).filter(([label]) => !specs.rows.some(([n]) => n.toLowerCase() === label.toLowerCase())),
      ...specs.rows,
      ...(r.origin ? [["Xuất xứ", r.origin] as [string, string]] : []),
      ...(r.made_in ? [["Sản xuất tại", r.made_in] as [string, string]] : []),
    ],
    specNotes: specs.notes,
    description: r.description ? sanitizeHtml(r.description) : "",
    warranty: r.warranty ?? "Theo chính sách của hãng",
  };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const [initial, labels, cats] = await Promise.all([
    createPublicClient().from("products").select(SELECT).order("name").limit(5000),
    attributeLabels(),
    getCategoryRows(),
  ]);
  let data = initial.data;
  let error = initial.error;
  // Keep the storefront readable while the industry migration is waiting to be applied.
  if (error && /column products\.industry does not exist/i.test(error.message)) {
    const legacy = await createPublicClient().from("products").select(SELECT_BEFORE_INDUSTRY).order("name").limit(5000);
    data = legacy.data;
    error = legacy.error;
  }
  if (error) throw error;
  return (data as unknown as Row[]).map((r) => toProduct(r, labels, cats));
});

export async function getProduct(sku: string) {
  if (!/^[A-Za-z0-9-]{2,42}$/.test(sku)) return undefined;
  return (await getProducts()).find((p) => p.sku.toLowerCase() === sku.toLowerCase());
}

export function matchProducts(products: Product[], q: string) {
  const words = normalize(q).split(/\s+/).filter(Boolean).slice(0, 8);
  return products.filter((p) => {
    const hay = normalize(`${p.name} ${p.brand} ${p.sku} ${p.industry} ${p.sub}`);
    return words.every((w) => hay.includes(w));
  });
}

export async function searchCatalog(q: string) {
  return matchProducts(await getProducts(), q);
}
