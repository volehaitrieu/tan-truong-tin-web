// Trang đăng nhập / đăng ký khách đứng riêng: không đầu trang, chân trang, thanh dưới, nút Gọi/Zalo của web bán hàng.
// Địa chỉ vẫn là /tai-khoan/dang-nhap và /tai-khoan/dang-ky (nhóm thư mục (auth) không đổi địa chỉ).
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="min-h-dvh bg-[#F5F8F9] md:grid md:place-items-center md:p-8">
      {children}
    </main>
  );
}
