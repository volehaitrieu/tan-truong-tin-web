"use server";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SaveInput = {
  id: number; name: string; unit: string; categoryId: number | null; brandId: number | null; spec: string; warranty: string; origin: string;
  description: string; needTags: string; visible: boolean; min: number;
  // Chỉ gửi khi người dùng có quyền sửa giá (máy chủ kiểm lại, trigger trong DB chặn thêm lần nữa)
  price?: number; salePrice?: number | null; saleFrom?: string; saleTo?: string; cost?: number | null;
};

const isDate = (s?: string) => !s || /^\d{4}-\d{2}-\d{2}$/.test(s);
const isMoney = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 2_000_000_000;
const friendly = (m: string) => (/[À-ỹ]/.test(m) ? m : "Không lưu được. Vui lòng kiểm tra lại và thử lại.");

export async function saveProduct(input: SaveInput): Promise<{ ok: boolean; error?: string }> {
  const staff = await requireStaff("edit_products");
  const name = String(input.name ?? "").trim();
  if (!Number.isInteger(input.id) || name.length < 2 || name.length > 200) return { ok: false, error: "Tên sản phẩm cần từ 2 đến 200 ký tự." };
  if (!Number.isInteger(input.min) || input.min < 0 || input.min > 100000) return { ok: false, error: "Tồn tối thiểu không hợp lệ." };

  const patch: Record<string, unknown> = {
    name, unit: String(input.unit ?? "").trim().slice(0, 30) || "Cái", category_id: input.categoryId, brand_id: input.brandId,
    spec_line: String(input.spec ?? "").trim().slice(0, 300) || null, warranty: String(input.warranty ?? "").trim().slice(0, 100) || null,
    origin: String(input.origin ?? "").trim().slice(0, 100) || null, description: String(input.description ?? "").trim().slice(0, 5000) || null,
    need_tags: String(input.needTags ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10), is_visible: !!input.visible,
  };
  const wantsPrice = input.price !== undefined;
  if (wantsPrice) {
    if (!staff.perms.has("edit_price")) return { ok: false, error: "Bạn không có quyền sửa giá bán." };
    if (!isMoney(input.price) || (input.salePrice != null && !isMoney(input.salePrice)) || !isDate(input.saleFrom) || !isDate(input.saleTo))
      return { ok: false, error: "Giá hoặc ngày khuyến mãi không hợp lệ." };
    if (input.salePrice != null && input.salePrice >= (input.price as number)) return { ok: false, error: "Giá khuyến mãi phải thấp hơn giá bán." };
    if (input.cost != null && !isMoney(input.cost)) return { ok: false, error: "Giá nhập không hợp lệ." };
    Object.assign(patch, { price: input.price, sale_price: input.salePrice ?? null, sale_from: input.saleFrom || null, sale_to: input.saleTo || null });
  }
  const db = await createClient();
  const { error } = await db.from("products").update(patch).eq("id", input.id);
  if (error) return { ok: false, error: friendly(error.message) };
  const inv = await db.from("inventory").update({ min_qty: input.min }).eq("product_id", input.id);
  if (inv.error) return { ok: false, error: friendly(inv.error.message) };
  if (wantsPrice && input.cost != null) {
    const c = await db.from("product_costs").upsert({ product_id: input.id, cost_price: input.cost });
    if (c.error) return { ok: false, error: friendly(c.error.message) };
  }
  revalidatePath("/admin/san-pham");
  revalidatePath("/", "layout");
  return { ok: true };
}
