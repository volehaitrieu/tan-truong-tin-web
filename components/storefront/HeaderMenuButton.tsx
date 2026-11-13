"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { CategoryDrawer } from "@/components/storefront/CategoryDrawer";
import type { CategoryMenuTab } from "@/lib/catalog";

const HINT_KEY = "ttt-menu-hint-seen";

// Nút ☰ đầu trang (chỉ điện thoại): mở bảng danh mục toàn màn hình, cột nhóm gốc bên trái, lưới danh mục con bên phải.
// Khách mới: nút có vòng sáng lan ra 3 lần (lớp .menu-hint trong globals.css), chỉ một lần cho mỗi trình duyệt.
export function HeaderMenuButton({ menu }: { menu: CategoryMenuTab[] }) {
  const [hint, setHint] = useState(false);
  useEffect(() => {
    let seen = true;
    try { seen = localStorage.getItem(HINT_KEY) === "1"; } catch {}
    if (seen) return;
    // Chỉ ghi "đã xem" khi hiệu ứng thật sự bật (effect có thể chạy 2 lần ở chế độ phát triển)
    const t = window.setTimeout(() => {
      setHint(true);
      try { localStorage.setItem(HINT_KEY, "1"); } catch {}
    }, 0);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <CategoryDrawer menu={menu}>
      {({ isOpen, toggle, openerRef }) => (
        <button ref={openerRef} type="button" onClick={() => { setHint(false); toggle(); }} aria-label="Danh mục sản phẩm" aria-expanded={isOpen} aria-haspopup="dialog" className={`relative -ml-2 grid size-11 shrink-0 place-items-center rounded-full text-ink transition-colors duration-150 hover:bg-sunk active:bg-sunk md:hidden ${hint ? "menu-hint" : ""}`}>
          <Menu className="relative size-6" aria-hidden />
        </button>
      )}
    </CategoryDrawer>
  );
}
