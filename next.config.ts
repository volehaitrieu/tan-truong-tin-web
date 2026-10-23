import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Lớp bảo vệ ở trình duyệt: chống nhúng trang (clickjacking), chống đoán kiểu file, giới hạn nguồn tải mã.
// Next dùng mã inline nên script-src cần 'unsafe-inline'; chỉ cho kết nối tới chính web + Supabase của shop.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  // Cho phép mở bản chạy thử từ điện thoại cùng mạng Wi-Fi
  allowedDevOrigins: ["192.168.5.122"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Trang quản trị chủ yếu là dữ liệu động theo người đăng nhập, nên tắt cacheComponents mặc định của Next 16.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
