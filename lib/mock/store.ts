// Dữ liệu mẫu cho web bán hàng — chỉ để dựng giao diện, sẽ thay bằng Supabase.

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
  warranty: string;
};

export const CATEGORIES: Category[] = [
  { slug: "ong-nuoc", name: "Ống nước & phụ kiện", icon: "wrench", subs: ["Ống PVC", "Van & co nối", "Băng tan & keo"], count: 628 },
  { slug: "thiet-bi-dien", name: "Thiết bị điện", icon: "plug", subs: ["Công tắc", "Ổ cắm", "CB & aptomat"], count: 412 },
  { slug: "day-cap-dien", name: "Dây & cáp điện", icon: "cable", subs: ["Dây đơn", "Dây đôi", "Cáp điện"], count: 284 },
  { slug: "den", name: "Đèn chiếu sáng", icon: "bulb", subs: ["Bóng LED", "Đèn tuýp", "Đèn ốp trần"], count: 376 },
  { slug: "quat", name: "Quạt", icon: "fan", subs: ["Quạt treo tường", "Quạt đứng", "Quạt trần"], count: 186 },
  { slug: "dung-cu", name: "Dụng cụ cầm tay", icon: "drill", subs: ["Máy khoan", "Kìm & cờ lê", "Tua vít"], count: 298 },
  { slug: "kim-khi", name: "Kim khí & keo", icon: "bolt", subs: ["Vít & bulông", "Keo dán", "Băng keo"], count: 745 },
  { slug: "gia-dung", name: "Gia dụng", icon: "home", subs: ["Ấm & bình đun", "Đồ bếp", "Dụng cụ vệ sinh"], count: 646 },
];

export const PRODUCTS: Product[] = [
  {
    sku: "QUA-HALI-TR2", name: "Quạt treo tường Hali TR2 (Ghi xám)", brand: "Hali", cat: "quat", sub: "Quạt treo tường",
    price: 430000, old: 480000, unit: "Cái", stock: true, image: "/ai/fan.jpg", spec: "Sải cánh 40cm · 3 tốc độ",
    specs: [["Loại quạt", "Treo tường"], ["Sải cánh", "40 cm"], ["Công suất", "55 W"], ["Điều khiển", "Dây kéo"]], warranty: "12 tháng theo hãng",
  },
  {
    sku: "ONG-BM-21-4M", name: "Ống nhựa PVC Bình Minh Φ21 (cây 4m)", brand: "Bình Minh", cat: "ong-nuoc", sub: "Ống PVC",
    price: 32000, unit: "Cây", stock: true, image: "/ai/pvc-pipe.jpg", spec: "Φ21 · dài 4m",
    specs: [["Đường kính", "21 mm"], ["Chiều dài", "4 m"], ["Chất liệu", "uPVC"]], warranty: "Đổi nếu lỗi nhà sản xuất",
  },
  {
    sku: "DAY-CAD-225-100", name: "Dây điện Cadivi 2x2.5 (cuộn 100m)", brand: "Cadivi", cat: "day-cap-dien", sub: "Dây đôi",
    price: 1450000, unit: "Cuộn", stock: true, image: "/ai/electrical-cable.jpg", spec: "2 lõi 2.5mm² · 100m",
    specs: [["Tiết diện", "2 × 2.5 mm²"], ["Chiều dài", "100 m"], ["Ruột dẫn", "Đồng"]], warranty: "Theo hãng",
  },
  {
    sku: "DEN-RD-LED-9W", name: "Bóng LED Rạng Đông 9W", brand: "Rạng Đông", cat: "den", sub: "Bóng LED",
    price: 35000, unit: "Bóng", stock: true, image: "/ai/led-bulb.jpg", spec: "9W · ánh sáng trắng · E27",
    specs: [["Công suất", "9 W"], ["Đui", "E27"], ["Ánh sáng", "Trắng 6500K"]], warranty: "12 tháng theo hãng",
  },
  {
    sku: "MAY-BOS-GSB550", name: "Máy khoan Bosch GSB 550", brand: "Bosch", cat: "dung-cu", sub: "Máy khoan",
    price: 1150000, unit: "Cái", stock: true, image: "/ai/cordless-drill.jpg", spec: "550W · khoan tường, gỗ, sắt",
    specs: [["Công suất", "550 W"], ["Đầu kẹp", "13 mm"], ["Chức năng", "Khoan, khoan búa"]], warranty: "6 tháng theo hãng",
  },
  {
    sku: "BANG-TOMBO-10", name: "Băng tan Tombo 10m", brand: "Tombo", cat: "ong-nuoc", sub: "Băng tan & keo",
    price: 8000, unit: "Cuộn", stock: false, image: "/ai/thread-seal-tape.jpg", spec: "Dài 10m · quấn ren ống nước",
    specs: [["Chiều dài", "10 m"], ["Bản rộng", "12 mm"]], warranty: "Không áp dụng",
  },
  {
    sku: "VAN-MIHA-21", name: "Van bi đồng Miha Φ21", brand: "Miha", cat: "ong-nuoc", sub: "Van & co nối",
    price: 95000, unit: "Cái", stock: true, image: "/ai/brass-valve.jpg", spec: "Đồng thau · ren Φ21",
    specs: [["Kích thước", "Φ21"], ["Chất liệu", "Đồng thau"], ["Kiểu", "Tay gạt"]], warranty: "6 tháng",
  },
  {
    sku: "BINH-MIDEA-18", name: "Bình đun siêu tốc Midea 1.8L", brand: "Midea", cat: "gia-dung", sub: "Ấm & bình đun",
    price: 390000, old: 420000, unit: "Cái", stock: true, image: "/ai/electric-kettle.jpg", spec: "1.8 lít · 1500W",
    specs: [["Dung tích", "1.8 L"], ["Công suất", "1500 W"], ["Chất liệu", "Inox 304"]], warranty: "12 tháng theo hãng",
  },
];

export const BRANDS = ["Bình Minh", "Tiền Phong", "Cadivi", "Panasonic", "Rạng Đông", "Hali", "Senko", "Asia", "Makita", "Bosch", "Tombo", "Miha", "Midea"];

// Đơn mẫu cho trang Tra cứu đơn
export const SAMPLE_ORDER = {
  code: "TTT000123",
  phone: "0908123456",
  step: 1, // 0 Chờ xác nhận · 1 Đã xác nhận · 2 Đang giao · 3 Hoàn thành
  delivery: "Giao nội thành",
  items: [["QUA-HALI-TR2", 1], ["DEN-RD-LED-9W", 2]] as [string, number][],
  shipFee: 20000,
  tracking: "",
};
export const ORDER_STEPS = ["Chờ xác nhận", "Đã xác nhận", "Đang giao / Sẵn sàng lấy", "Hoàn thành"];

// Tìm không dấu: "quat treo" khớp "Quạt treo"
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

export const findProduct = (sku: string) => PRODUCTS.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
export const findCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const searchProducts = (q: string) => {
  const words = normalize(q).split(/\s+/).filter(Boolean);
  return PRODUCTS.filter((p) => {
    const hay = normalize(`${p.name} ${p.brand} ${p.sku} ${p.sub}`);
    return words.every((w) => hay.includes(w));
  });
};
export const discountPct = (p: Product) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);
