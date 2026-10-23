"use server";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { finish, markDuplicates, type ImportRow } from "@/lib/excel/parse-products";

export type ImportResult = { ok: true; added: number; updated: number; skipped: number } | { ok: false; error: string };
const slugify = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Ghi SP từ Excel. Kiểm lại toàn bộ ở server (không tin dữ liệu xem trước), bỏ qua dòng lỗi.
// Quyền: import_excel + edit_price (vì có giá bán/giá nhập). RLS + trigger trong DB kiểm thêm lần nữa.
export async function importProducts(input: ImportRow[], defaultSub: string | null): Promise<ImportResult> {
  await requireStaff("import_excel");
  await requireStaff("edit_price");
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: "Không có dòng nào để nhập." };
  if (input.length > 5000) return { ok: false, error: "Tối đa 5.000 dòng mỗi lần." };

  const db = await createClient();
  const { data: cats } = await db.from("categories").select("id, slug");
  const catId = new Map((cats ?? []).map((c) => [c.slug, c.id]));
  const rows = markDuplicates(input.map((r) => finish({
    line: Number(r.line) || 0, sku: String(r.sku ?? "").toUpperCase().slice(0, 40), name: String(r.name ?? "").trim(),
    unit: String(r.unit ?? "").trim(), price: Number(r.price), cost: r.cost == null ? null : Number(r.cost),
    minQty: r.minQty == null ? null : Math.max(0, Math.min(100000, Number(r.minQty) || 0)),
    sub: r.sub && catId.has(r.sub) ? r.sub : defaultSub && catId.has(defaultSub) ? defaultSub : null,
    brand: r.brand ? String(r.brand).trim().slice(0, 60) : null, spec: r.spec ? String(r.spec).slice(0, 120) : null,
    attributes: Object.fromEntries(Object.entries(r.attributes ?? {}).slice(0, 20).map(([k, v]) => [k.slice(0, 30), String(v).slice(0, 120)])),
    warranty: r.warranty ? String(r.warranty).slice(0, 120) : null, origin: r.origin ? String(r.origin).slice(0, 60) : null, errors: [],
  })));
  const good = rows.filter((r) => r.errors.length === 0 && r.sub && /^[A-Z0-9][A-Z0-9-]{1,40}$/.test(r.sku));
  if (!good.length) return { ok: false, error: "Không có dòng hợp lệ (kiểm tra SKU, giá, danh mục)." };

  // Thương hiệu mới
  const brandNames = [...new Set(good.map((r) => r.brand).filter(Boolean))] as string[];
  if (brandNames.length) await db.from("brands").upsert(brandNames.map((name) => ({ name, slug: slugify(name) })), { onConflict: "name", ignoreDuplicates: true });
  const { data: brands } = await db.from("brands").select("id, name");
  const brandId = new Map((brands ?? []).map((b) => [b.name, b.id]));

  const { data: existing } = await db.from("products").select("sku").in("sku", good.map((r) => r.sku));
  const had = new Set((existing ?? []).map((p) => p.sku));

  for (let i = 0; i < good.length; i += 500) {
    const batch = good.slice(i, i + 500);
    const { data: saved, error } = await db.from("products").upsert(batch.map((r) => ({
      sku: r.sku, name: r.name, slug: r.sku.toLowerCase(), unit: r.unit, price: r.price, category_id: catId.get(r.sub!),
      brand_id: r.brand ? brandId.get(r.brand) ?? null : null, spec_line: r.spec, attributes: r.attributes,
      warranty: r.warranty, origin: r.origin,
    })), { onConflict: "sku" }).select("id, sku");
    if (error) return { ok: false, error: `Lỗi khi ghi lô ${i / 500 + 1}: ${/[À-ỹ]/.test(error.message) ? error.message : "vui lòng thử lại"}` };
    const id = new Map((saved ?? []).map((p) => [p.sku, p.id]));
    const costs = batch.filter((r) => r.cost !== null).map((r) => ({ product_id: id.get(r.sku), cost_price: r.cost }));
    if (costs.length) await db.from("product_costs").upsert(costs, { onConflict: "product_id" });
    for (const r of batch.filter((x) => x.minQty !== null)) await db.from("inventory").update({ min_qty: r.minQty }).eq("product_id", id.get(r.sku));
    const { data: imgs } = await db.from("product_images").select("product_id").in("product_id", [...id.values()]);
    const hasImg = new Set((imgs ?? []).map((x) => x.product_id));
    const missing = [...id.values()].filter((pid) => !hasImg.has(pid));
    if (missing.length) await db.from("product_images").insert(missing.map((pid) => ({ product_id: pid, url: "/ai/hardware-hero.jpg", is_illustration: true })));
  }
  revalidatePath("/", "layout");
  return { ok: true, added: good.filter((r) => !had.has(r.sku)).length, updated: good.filter((r) => had.has(r.sku)).length, skipped: rows.length - good.length };
}
