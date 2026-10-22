import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  FileSpreadsheet,
  FolderTree,
  LayoutDashboard,
  Package,
  ReceiptText,
  ScrollText,
  Settings,
  ShoppingCart,
  TicketPercent,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// 13 mục menu Admin — thứ tự theo docs/GIAO_DIEN_BAN_GIAO.md (A0).
export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: ReceiptText },
  { href: "/admin/ban-tai-quay", label: "Bán tại quầy", icon: ShoppingCart },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: Package },
  { href: "/admin/nhap-excel", label: "Nhập Excel", icon: FileSpreadsheet },
  { href: "/admin/ton-kho", label: "Tồn kho", icon: Boxes },
  { href: "/admin/kiem-kho", label: "Kiểm kho", icon: ClipboardCheck },
  { href: "/admin/danh-muc", label: "Danh mục & thương hiệu", icon: FolderTree },
  { href: "/admin/khuyen-mai", label: "Khuyến mãi", icon: TicketPercent },
  { href: "/admin/bao-cao", label: "Báo cáo", icon: BarChart3 },
  { href: "/admin/nhan-vien", label: "Nhân viên & quyền", icon: UserCog },
  { href: "/admin/nhat-ky", label: "Nhật ký thao tác", icon: ScrollText },
  { href: "/admin/cai-dat", label: "Cài đặt", icon: Settings },
];

// 4 tab đầu trên thanh đáy điện thoại; còn lại nằm trong "Thêm".
export const MOBILE_TABS = ["/admin", "/admin/don-hang", "/admin/ban-tai-quay", "/admin/san-pham"];

export function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");
}
