// Tạm ngưng đặt hàng trực tuyến (13/11/2026, chủ shop chọn) cho tới khi thông báo website với Bộ Công Thương.
// Mặc định TẠM NGƯNG; chỉ mở lại khi đặt NEXT_PUBLIC_ORDERING_OPEN=1 (Vercel) VÀ cấp lại quyền place_order ở DB.
export const ORDERING_PAUSED = process.env.NEXT_PUBLIC_ORDERING_OPEN !== "1";
export const ORDERING_PAUSED_MESSAGE = "Shop tạm ngưng nhận đặt hàng trên website. Vui lòng gọi 0948 732 064 hoặc nhắn Zalo để đặt hàng.";

// Thông tin thật của cửa hàng — dùng chung cho mọi trang.
export const SHOP = {
  name: "Tân Trường Tín",
  tagline: "Điện nước · Kim khí · Dụng cụ · Quạt · Gia dụng",
  slogan: "Chất lượng tạo niềm tin, dịch vụ tạo khác biệt.",
  address: "379 đường 2/4, phường Bắc Nha Trang, Khánh Hòa",
  addressShort: "379 đường 2/4, Bắc Nha Trang",
  phone: "0948 732 064",
  phone2: "0793 783 379",
  hours: "7:45 – 20:30",
} as const;

const vnd = new Intl.NumberFormat("vi-VN");
export const formatVnd = (n: number) => `${vnd.format(n)}₫`;
export const formatNum = (n: number) => vnd.format(n);
