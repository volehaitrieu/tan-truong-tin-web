import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Nhận khách quay về từ Google/Facebook: đổi mã lấy phiên đăng nhập.
// Nhân viên không dùng đường này (tài khoản nhân viên đăng nhập ở /admin/dang-nhap) → đăng xuất ngay.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const to = (path: string) => NextResponse.redirect(new URL(path, url.origin));
  const code = url.searchParams.get("code");
  if (!code) return to("/tai-khoan/dang-nhap?loi=dang-nhap");
  const db = await createClient();
  const { data, error } = await db.auth.exchangeCodeForSession(code);
  if (error || !data.user) return to("/tai-khoan/dang-nhap?loi=dang-nhap");
  const { data: staff } = await db.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
  if (staff) {
    await db.auth.signOut();
    return to("/tai-khoan/dang-nhap?loi=nhan-vien");
  }
  return to("/tai-khoan");
}
