"use server";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function resolveReview(transactionId: number, code: string): Promise<{ ok: boolean; error?: string }> {
  const staff = await requireStaff("process_orders");
  if (staff.role !== "owner") return { ok: false, error: "Chỉ chủ shop được đối chiếu giao dịch thủ công." };
  const normalized = code.trim().toUpperCase();
  if (!Number.isSafeInteger(transactionId) || transactionId <= 0 || !/^TTT\d{6}$/.test(normalized))
    return { ok: false, error: "Nhập mã đơn TTT và 6 chữ số." };
  const db = await createClient();
  const { error } = await db.rpc("sepay_resolve_review", { p_transaction_id: transactionId, p_order_code: normalized });
  if (error) return { ok: false, error: /[À-ỹ]/.test(error.message) ? error.message : "Chưa đối chiếu được. Vui lòng kiểm tra giao dịch và thử lại." };
  revalidatePath("/admin/giao-dich");
  revalidatePath(`/admin/don-hang/${normalized}`);
  revalidatePath("/admin/don-hang");
  return { ok: true };
}

export async function ignoreReview(transactionId: number): Promise<{ ok: boolean; error?: string }> {
  const staff = await requireStaff("process_orders");
  if (staff.role !== "owner") return { ok: false, error: "Chỉ chủ shop được bỏ qua giao dịch." };
  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) return { ok: false, error: "Giao dịch không hợp lệ." };
  const db = await createClient();
  const { error } = await db.rpc("sepay_ignore_review", { p_transaction_id: transactionId });
  if (error) return { ok: false, error: /[À-ỹ]/.test(error.message) ? error.message : "Chưa bỏ qua được. Vui lòng thử lại." };
  revalidatePath("/admin/giao-dich");
  return { ok: true };
}
