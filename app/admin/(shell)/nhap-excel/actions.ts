"use server";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { finish, markDuplicates, type ImportRow } from "@/lib/excel/parse-products";
import { htmlToText, sanitizeHtml, textToHtml } from "@/lib/rich-text";
import { costFromImport } from "@/lib/admin/products";

export type ImportResult =
  | { ok: true; added: number; pending: number; unchanged: number; skipped: number }
  | { ok: false; error: string };
const slugify = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const str = (v: unknown, max: number) => (v == null ? null : String(v).replace(/\r/g, "").trim().slice(0, max) || null);

// Các trường được so sánh khi SP đã có. Khóa = cột field trong bảng import_changes.
type Field = "name" | "unit" | "price" | "import_price" | "category" | "brand" | "location" | "min_qty" | "spec" | "description" | "warranty" | "origin" | "made_in";

// Ghi SP từ Excel. Kiểm lại toàn bộ ở server (không tin dữ liệu xem trước), bỏ qua dòng lỗi.
// SP mới → thêm thẳng. SP đã có → thay đổi đưa vào bảng chờ duyệt (import_changes), chưa ghi đè.
// Quyền: import_excel + edit_price (vì có giá bán/giá nhập). RLS + trigger trong DB kiểm thêm lần nữa.
export async function importProducts(input: ImportRow[], defaultSub: string | null): Promise<ImportResult> {
  const staff = await requireStaff("import_excel");
  await requireStaff("edit_price");
  const canCost = staff.perms.has("view_cost");
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: "Không có dòng nào để nhập." };
  if (input.length > 5000) return { ok: false, error: "Tối đa 5.000 dòng mỗi lần." };

  const db = await createClient();
  const { data: cats } = await db.from("categories").select("id, slug, name");
  const catId = new Map((cats ?? []).map((c) => [c.slug, c.id]));
  const catName = new Map((cats ?? []).map((c) => [c.id, c.name]));
  const rows = markDuplicates(input.map((r) => finish({
    line: Number(r.line) || 0, sku: String(r.sku ?? "").toUpperCase().slice(0, 40), name: String(r.name ?? "").trim(),
    unit: String(r.unit ?? "").trim(), price: Number(r.price), cost: r.cost == null ? null : Number(r.cost),
    minQty: r.minQty == null ? null : Math.max(0, Math.min(100000, Number(r.minQty) || 0)),
    sub: r.sub && catId.has(r.sub) ? r.sub : defaultSub && catId.has(defaultSub) ? defaultSub : null,
    brand: str(r.brand, 60), spec: str(r.spec, 3000),
    attributes: Object.fromEntries(Object.entries(r.attributes ?? {}).slice(0, 20).map(([k, v]) => [k.slice(0, 30), String(v).slice(0, 120)])),
    warranty: str(r.warranty, 100), origin: str(r.origin, 100), location: str(r.location, 40), madeIn: str(r.madeIn, 100),
    description: str(r.description, 10000), errors: [],
  })));
  const good = rows.filter((r) => r.errors.length === 0 && /^[A-Z0-9][A-Z0-9-]{1,40}$/.test(r.sku));
  if (!good.length) return { ok: false, error: "Không có dòng hợp lệ (kiểm tra mã, giá, danh mục)." };

  // Thương hiệu mới
  const brandNames = [...new Set(good.map((r) => r.brand).filter(Boolean))] as string[];
  if (brandNames.length) await db.from("brands").upsert(brandNames.map((name) => ({ name, slug: slugify(name) })), { onConflict: "name", ignoreDuplicates: true });
  const { data: brands } = await db.from("brands").select("id, name");
  const brandId = new Map((brands ?? []).map((b) => [b.name, b.id]));
  const brandName = new Map((brands ?? []).map((b) => [b.id, b.name]));

  // SP đã có
  type Old = {
    id: number; sku: string; name: string; unit: string; price: number; category_id: number | null; brand_id: number | null;
    spec_line: string | null; description: string | null; warranty: string | null; origin: string | null; made_in: string | null;
    inventory: { min_qty: number; location: string } | null;
  };
  const old = new Map<string, Old>();
  for (let i = 0; i < good.length; i += 500) {
    const { data } = await db.from("products")
      .select("id, sku, name, unit, price, category_id, brand_id, spec_line, description, warranty, origin, made_in, inventory(min_qty, location)")
      .in("sku", good.slice(i, i + 500).map((r) => r.sku));
    for (const p of (data ?? []) as unknown as Old[]) old.set(p.sku, p);
  }
  const costs = new Map<number, number | null>();
  if (canCost && old.size) {
    const { data } = await db.from("product_costs").select("product_id, import_price, cost_price").in("product_id", [...old.values()].map((p) => p.id));
    for (const c of data ?? []) costs.set(c.product_id, c.import_price ?? c.cost_price);
  }

  // 1) SP mới → thêm thẳng
  const fresh = good.filter((r) => !old.has(r.sku));
  for (const r of fresh.filter((x) => !x.sub)) r.errors.push("Chưa có danh mục");
  const toAdd = fresh.filter((r) => r.sub);
  for (let i = 0; i < toAdd.length; i += 500) {
    const batch = toAdd.slice(i, i + 500);
    const { data: saved, error } = await db.from("products").insert(batch.map((r) => ({
      sku: r.sku, name: r.name, slug: r.sku.toLowerCase(), unit: r.unit, price: r.price, category_id: catId.get(r.sub!),
      brand_id: r.brand ? brandId.get(r.brand) ?? null : null, spec_line: r.spec, attributes: r.attributes,
      warranty: r.warranty, origin: r.origin, made_in: r.madeIn ?? null,
      description: r.description ? sanitizeHtml(textToHtml(r.description)) : null,
    }))).select("id, sku");
    if (error) return { ok: false, error: `Lỗi khi ghi lô ${i / 500 + 1}: ${/[À-ỹ]/.test(error.message) ? error.message : "vui lòng thử lại"}` };
    const id = new Map((saved ?? []).map((p) => [p.sku, p.id]));
    const c = batch.filter((r) => r.cost !== null).map((r) => ({ product_id: id.get(r.sku), import_price: r.cost, cost_price: costFromImport(r.cost!) }));
    if (c.length && canCost) await db.from("product_costs").upsert(c, { onConflict: "product_id" });
    for (const r of batch.filter((x) => x.minQty !== null || x.location))
      await db.from("inventory").update({ ...(r.minQty !== null ? { min_qty: r.minQty } : {}), ...(r.location ? { location: r.location } : {}) }).eq("product_id", id.get(r.sku));
    await db.from("product_images").insert([...id.values()].map((pid) => ({ product_id: pid, url: "/ai/hardware-hero.jpg", is_illustration: true })));
  }

  // 2) SP đã có → so sánh từng trường có giá trị trong file (ô trống = giữ nguyên)
  const changes: { product_id: number; field: Field; old_value: string | null; new_value: string }[] = [];
  let unchanged = 0;
  for (const r of good.filter((x) => old.has(x.sku))) {
    const p = old.get(r.sku)!;
    const before = changes.length;
    const cmp = (field: Field, oldV: string | null | undefined, newV: string | null | undefined) => {
      if (newV == null || newV === "") return;
      if ((oldV ?? "").trim() !== newV.trim()) changes.push({ product_id: p.id, field, old_value: oldV ?? null, new_value: newV });
    };
    cmp("name", p.name, r.name);
    cmp("unit", p.unit, r.unit);
    cmp("price", String(p.price), String(r.price));
    if (canCost && r.cost !== null) cmp("import_price", costs.has(p.id) && costs.get(p.id) != null ? String(costs.get(p.id)) : null, String(r.cost));
    if (r.sub) cmp("category", p.category_id ? catName.get(p.category_id) ?? null : null, catName.get(catId.get(r.sub)!) ?? null);
    cmp("brand", p.brand_id ? brandName.get(p.brand_id) ?? null : null, r.brand);
    cmp("location", p.inventory?.location ?? null, r.location);
    if (r.minQty !== null) cmp("min_qty", String(p.inventory?.min_qty ?? 0), String(r.minQty));
    cmp("spec", p.spec_line, r.spec);
    cmp("description", p.description ? htmlToText(p.description) : null, r.description);
    cmp("warranty", p.warranty, r.warranty);
    cmp("origin", p.origin, r.origin);
    cmp("made_in", p.made_in, r.madeIn);
    if (changes.length === before) unchanged++;
  }
  for (let i = 0; i < changes.length; i += 500) {
    const { error } = await db.from("import_changes").upsert(changes.slice(i, i + 500), { onConflict: "product_id,field" });
    if (error) return { ok: false, error: "Không lưu được bảng đối chiếu, vui lòng thử lại." };
  }
  revalidatePath("/", "layout");
  return { ok: true, added: toAdd.length, pending: changes.length, unchanged, skipped: rows.length - good.length + (fresh.length - toAdd.length) };
}

// Xác nhận các thay đổi đã tick → ghi vào SP, xóa khỏi bảng chờ. Thay đổi chưa tick giữ nguyên.
export async function applyChanges(ids: number[]): Promise<{ ok: boolean; applied: number; error?: string }> {
  const staff = await requireStaff("import_excel");
  await requireStaff("edit_price");
  if (!Array.isArray(ids) || !ids.length || ids.length > 5000 || !ids.every(Number.isSafeInteger)) return { ok: false, applied: 0, error: "Chưa chọn thay đổi nào." };
  const db = await createClient();
  const { data, error } = await db.from("import_changes").select("id, product_id, field, new_value").in("id", ids);
  if (error || !data) return { ok: false, applied: 0, error: "Không đọc được bảng đối chiếu." };
  const { data: cats } = await db.from("categories").select("id, name, parent_id");
  const subByName = new Map((cats ?? []).filter((c) => c.parent_id !== null).map((c) => [c.name, c.id]));

  // Gom theo SP để mỗi SP chỉ ghi 1 lần mỗi bảng
  const byProduct = new Map<number, { id: number; field: Field; v: string }[]>();
  for (const c of data) byProduct.set(c.product_id, [...(byProduct.get(c.product_id) ?? []), { id: c.id, field: c.field as Field, v: c.new_value ?? "" }]);
  const done: number[] = [];
  const failed: string[] = [];
  for (const [pid, list] of byProduct) {
    const prod: Record<string, unknown> = {};
    const inv: Record<string, unknown> = {};
    let importPrice: number | null = null;
    for (const { field, v } of list) {
      if (field === "name") prod.name = v.slice(0, 200);
      else if (field === "unit") prod.unit = v.slice(0, 30);
      else if (field === "price") prod.price = Number(v);
      else if (field === "spec") prod.spec_line = v.slice(0, 3000);
      else if (field === "description") prod.description = sanitizeHtml(textToHtml(v));
      else if (field === "warranty") prod.warranty = v.slice(0, 100);
      else if (field === "origin") prod.origin = v.slice(0, 100);
      else if (field === "made_in") prod.made_in = v.slice(0, 100);
      else if (field === "category") prod.category_id = subByName.get(v) ?? null;
      else if (field === "brand") {
        await db.from("brands").upsert({ name: v, slug: slugify(v) }, { onConflict: "name", ignoreDuplicates: true });
        const { data: b } = await db.from("brands").select("id").eq("name", v).maybeSingle();
        prod.brand_id = b?.id ?? null;
      } else if (field === "location") inv.location = v.slice(0, 40) || "Kho 1";
      else if (field === "min_qty") inv.min_qty = Math.max(0, Math.min(100000, Number(v) || 0));
      else if (field === "import_price") importPrice = Number(v);
    }
    if (prod.category_id === null) delete prod.category_id;
    const errs = [
      Object.keys(prod).length ? (await db.from("products").update(prod).eq("id", pid)).error : null,
      Object.keys(inv).length ? (await db.from("inventory").update(inv).eq("product_id", pid)).error : null,
      importPrice !== null && staff.perms.has("view_cost") && Number.isSafeInteger(importPrice)
        ? (await db.from("product_costs").upsert({ product_id: pid, import_price: importPrice, cost_price: costFromImport(importPrice) })).error : null,
    ].filter(Boolean);
    if (errs.length) failed.push(String(pid));
    else done.push(...list.map((x) => x.id));
  }
  if (done.length) await db.from("import_changes").delete().in("id", done);
  revalidatePath("/admin/nhap-excel");
  revalidatePath("/", "layout");
  return failed.length
    ? { ok: false, applied: done.length, error: `Đã ghi ${done.length} thay đổi; ${failed.length} sản phẩm không ghi được (giá khuyến mãi có thể đang cao hơn giá bán mới).` }
    : { ok: true, applied: done.length };
}
