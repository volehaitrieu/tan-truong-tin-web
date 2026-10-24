// Kiểu dữ liệu + hàm tiện ích dùng chung cho web bán hàng.
// Dữ liệu thật lấy từ Supabase qua lib/catalog.ts (file này không còn dữ liệu mẫu).

export type Category = {
  slug: string;
  name: string;
  icon: "wrench" | "plug" | "cable" | "bulb" | "fan" | "drill" | "bolt" | "home";
  subs: string[];
  count: number; // số mặt hàng hiển thị trên ô danh mục (mẫu)
};

export type Product = {
  sku: string;
  name: string;
  brand: string;
  cat: string; // slug danh mục
  sub: string;
  price: number;
  old?: number; // giá gốc khi đang khuyến mãi
  unit: string;
  stock: boolean; // false → "Liên hệ" (vẫn đặt trước được)
  image: string;
  spec: string; // 1 dòng thông số chính trên thẻ
  specs: [string, string][];
  specNotes?: string[]; // dòng thông số không có dấu ":"
  description?: string; // HTML đã làm sạch
  warranty: string;
};

export const ORDER_STEPS = ["Chờ xác nhận", "Đã xác nhận", "Đang giao / Sẵn sàng lấy", "Hoàn thành"];

// Tìm không dấu: "quat treo" khớp "Quạt treo"
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

export const discountPct = (p: Product) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
