import "server-only";
import { createClient } from "@/lib/supabase/server";

// Khách đăng nhập bằng SĐT → email ảo riêng (khác miền nhân viên nhanvien.tantruongtin.vn).
// Phải khớp chuỗi trong migration 20261112150000_customer_accounts.
export const CUSTOMER_EMAIL_DOMAIN = "khach.tantruongtin.vn";

// "0901 234 567" / "+84901234567" → "0901234567"; sai dạng → null
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  const p = /^84\d{9}$/.test(d) ? `0${d.slice(2)}` : d;
  return /^0\d{9}$/.test(p) ? p : null;
}

export const customerLoginEmail = (phone: string) => `${phone}@${CUSTOMER_EMAIL_DOMAIN}`;
export const isCustomerLogin = (email: string | undefined) => !!email?.endsWith(`@${CUSTOMER_EMAIL_DOMAIN}`);

export type Customer = { id: string; full_name: string; phone: string; email: string | null; province: string | null; ward: string | null; street: string | null };

// Phiên hiện tại: khách (có/chưa có hồ sơ), nhân viên, hoặc chưa đăng nhập
export type CustomerSession =
  | { kind: "guest" }
  | { kind: "staff" }
  | { kind: "customer"; customer: Customer | null; phone: string };

export async function getCustomerSession(): Promise<CustomerSession> {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { kind: "guest" };
  if (!isCustomerLogin(user.email)) return { kind: "staff" };
  const { data } = await db.from("customers").select("id, full_name, phone, email, province, ward, street").eq("id", user.id).maybeSingle();
  return { kind: "customer", customer: (data as Customer | null) ?? null, phone: user.email!.split("@")[0] };
}
