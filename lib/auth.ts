import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Permission } from "@/lib/permissions";

export type { Permission };

export type Staff = {
  id: string;
  fullName: string;
  role: "owner" | "order_staff" | "stock_staff";
  perms: Set<Permission>;
};

export const ROLE_LABEL: Record<Staff["role"], string> = { owner: "Chủ shop", order_staff: "NV đơn", stock_staff: "NV kho" };

// Số điện thoại → email nội bộ để đăng nhập bằng SĐT
export const STAFF_EMAIL_DOMAIN = "nhanvien.tantruongtin.vn";
export function loginEmail(id: string) {
  const s = id.trim().toLowerCase();
  const digits = s.replace(/[^0-9]/g, "");
  if (!s.includes("@") && /^0\d{9}$/.test(digits)) return `${digits}@${STAFF_EMAIL_DOMAIN}`;
  if (!s.includes("@") && /^84\d{9}$/.test(digits)) return `0${digits.slice(2)}@${STAFF_EMAIL_DOMAIN}`;
  return s;
}

// Nhân viên đang đăng nhập (null nếu chưa đăng nhập / bị khóa). Gọi nhiều lần trong 1 request chỉ tốn 1 lần.
export const getStaff = cache(async (): Promise<Staff | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: perms }] = await Promise.all([
    supabase.from("profiles").select("full_name, role, is_active").eq("id", user.id).maybeSingle(),
    supabase.rpc("my_permissions"),
  ]);
  if (!profile || !profile.is_active) return null;
  return {
    id: user.id,
    fullName: profile.full_name,
    role: profile.role,
    perms: new Set(((perms ?? []) as { permission: Permission }[]).map((p) => p.permission)),
  };
});

// Dùng đầu mỗi trang/hành động admin. Thiếu quyền → về trang Tổng quan; chưa đăng nhập → trang đăng nhập.
export async function requireStaff(perm?: Permission): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect("/admin/dang-nhap");
  if (perm && !staff.perms.has(perm)) redirect("/admin?khong-du-quyen=1");
  return staff;
}
