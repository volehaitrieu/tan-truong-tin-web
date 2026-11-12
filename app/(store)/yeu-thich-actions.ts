"use server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/customer";

// Yêu thích theo tài khoản khách. Khách vãng lai/nhân viên → null (trình duyệt tự lưu trên máy như cũ).
// Mã sản phẩm nhận từ trình duyệt chỉ dùng để tra id sản phẩm; quyền ghi do RLS (customer_id = auth.uid()).

const clean = (skus: unknown) =>
  Array.isArray(skus) ? [...new Set(skus.filter((s): s is string => typeof s === "string" && s.length <= 80).map((s) => s.toUpperCase()))].slice(0, 200) : [];

async function customerDb() {
  const db = await createClient();
  const user = await getCustomerUser(db);
  return user ? { db, uid: user.id } : null;
}

// Gộp danh sách trên máy vào tài khoản rồi trả về danh sách đầy đủ của tài khoản
export async function syncFavorites(localSkus: string[]): Promise<string[] | null> {
  const c = await customerDb();
  if (!c) return null;
  const want = clean(localSkus);
  if (want.length) {
    const { data: prods } = await c.db.from("products").select("id").in("sku", want);
    const rows = (prods ?? []).map((p) => ({ customer_id: c.uid, product_id: p.id }));
    if (rows.length) await c.db.from("customer_favorites").upsert(rows, { onConflict: "customer_id,product_id", ignoreDuplicates: true });
  }
  const { data } = await c.db.from("customer_favorites").select("products(sku)").eq("customer_id", c.uid);
  return (data ?? []).flatMap((r) => { const p = r.products as unknown as { sku: string } | null; return p ? [p.sku] : []; });
}

export async function setFavorite(sku: string, on: boolean): Promise<boolean> {
  const c = await customerDb();
  if (!c) return false;
  const [s] = clean([sku]);
  if (!s) return false;
  const { data: p } = await c.db.from("products").select("id").eq("sku", s).maybeSingle();
  if (!p) return false;
  const { error } = on
    ? await c.db.from("customer_favorites").upsert({ customer_id: c.uid, product_id: p.id }, { onConflict: "customer_id,product_id", ignoreDuplicates: true })
    : await c.db.from("customer_favorites").delete().eq("customer_id", c.uid).eq("product_id", p.id);
  return !error;
}
