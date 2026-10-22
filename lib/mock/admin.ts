// Dữ liệu MẪU chỉ để dựng giao diện Admin — chưa nối database.

export type OrderStatus = "cho-xac-nhan" | "da-xac-nhan" | "dang-giao" | "san-sang-lay" | "hoan-thanh" | "da-huy";
export type Delivery = "tai-cua-hang" | "noi-thanh" | "di-tinh";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  "cho-xac-nhan": "Chờ xác nhận",
  "da-xac-nhan": "Đã xác nhận",
  "dang-giao": "Đang giao",
  "san-sang-lay": "Sẵn sàng lấy",
  "hoan-thanh": "Hoàn thành",
  "da-huy": "Đã hủy",
};

export const DELIVERY_LABEL: Record<Delivery, string> = {
  "tai-cua-hang": "Nhận tại cửa hàng",
  "noi-thanh": "Giao nội thành",
  "di-tinh": "Gửi đi tỉnh",
};

export type Order = {
  code: string;
  time: string;
  customer: string;
  phone: string;
  delivery: Delivery;
  total: number;
  payment: "COD" | "VietQR";
  paid: boolean;
  status: OrderStatus;
  shipFeeMissing?: boolean;
};

export const ORDERS: Order[] = [
  { code: "TTT000128", time: "07:45 · 22/10", customer: "Lê Hoàng Yến", phone: "0982 990 112", delivery: "tai-cua-hang", total: 760_000, payment: "COD", paid: false, status: "cho-xac-nhan" },
  { code: "TTT000127", time: "07:12 · 22/10", customer: "Phạm Minh Tuấn", phone: "0905 214 778", delivery: "di-tinh", total: 2_840_000, payment: "COD", paid: false, status: "cho-xac-nhan", shipFeeMissing: true },
  { code: "TTT000126", time: "20:05 · 21/10", customer: "Nguyễn Thị Thu", phone: "0935 661 090", delivery: "noi-thanh", total: 435_000, payment: "COD", paid: false, status: "da-xac-nhan" },
  { code: "TTT000125", time: "17:40 · 21/10", customer: "Trần Văn Khoa", phone: "0914 337 208", delivery: "noi-thanh", total: 1_290_000, payment: "COD", paid: false, status: "dang-giao" },
  { code: "TTT000124", time: "15:22 · 21/10", customer: "Võ Thanh Long", phone: "0978 455 610", delivery: "tai-cua-hang", total: 186_000, payment: "COD", paid: true, status: "hoan-thanh" },
];

export type LowStock = { name: string; sku: string; stock: number; min: number; unit: string };

export const LOW_STOCK: LowStock[] = [
  { name: "Băng tan Tombo 10m", sku: "TTT-BT-0010", stock: 1, min: 10, unit: "cuộn" },
  { name: "Keo dán ống Bình Minh 50g", sku: "TTT-KEO-0050", stock: 4, min: 12, unit: "tuýp" },
  { name: "Van bi đồng Miha Φ21", sku: "TTT-VAN-0021", stock: 0, min: 5, unit: "cái" },
  { name: "Bóng LED Rạng Đông 9W", sku: "TTT-LED-0009", stock: 6, min: 20, unit: "bóng" },
];

// Doanh thu 7 ngày gần nhất (đồng).
export const REVENUE_7D = [
  { day: "16/10", value: 6_420_000 },
  { day: "17/10", value: 8_130_000 },
  { day: "18/10", value: 5_970_000 },
  { day: "19/10", value: 9_860_000 },
  { day: "20/10", value: 7_240_000 },
  { day: "21/10", value: 10_350_000 },
  { day: "22/10", value: 3_180_000 },
];

export const CURRENT_USER = { name: "Chủ cửa hàng", role: "Chủ shop" as const };
