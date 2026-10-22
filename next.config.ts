import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
