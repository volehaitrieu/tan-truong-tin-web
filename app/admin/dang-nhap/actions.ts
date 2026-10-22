"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginEmail } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const id = String(form.get("id") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!id || !password) return { error: "Nhập số điện thoại/email và mật khẩu." };
  if (id.length > 200 || password.length > 200) return { error: "Số điện thoại/email hoặc mật khẩu chưa đúng." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail(id), password });
  // Không nói rõ sai SĐT hay sai mật khẩu để tránh dò tài khoản
  if (error || !data.user) return { error: "Số điện thoại/email hoặc mật khẩu chưa đúng." };

  const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", data.user.id).maybeSingle();
  if (!profile?.is_active) {
    await supabase.auth.signOut();
    return { error: "Tài khoản chưa được cấp quyền hoặc đã bị khóa. Liên hệ chủ shop." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/dang-nhap");
}
