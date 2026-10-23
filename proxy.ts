import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Làm mới phiên đăng nhập Supabase và chặn khách chưa đăng nhập vào /admin.
// Kiểm quyền chi tiết nằm ở server (lib/auth.ts) và RLS — đây chỉ là lớp chặn đầu.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  // getClaims: kiểm chữ ký JWT ngay tại máy chủ web (khóa ES256), làm mới phiên khi hết hạn — không cần hỏi Supabase mỗi lần
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims?.sub ? { id: data.claims.sub } : null;

  const isLogin = request.nextUrl.pathname.startsWith("/admin/dang-nhap");
  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dang-nhap";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
