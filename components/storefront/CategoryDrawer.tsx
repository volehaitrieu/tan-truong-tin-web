"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutGrid, X } from "lucide-react";
import type { Category } from "@/lib/mock/store";
import { CategoryIcon } from "@/components/storefront/CategoryIcon";

// Tab "Danh mục" trên thanh đáy điện thoại: mở ngăn kéo từ bên trái.
export function CategoryDrawer({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className="flex h-16 flex-col items-center justify-center gap-1 hover:text-brand">
        <LayoutGrid className="size-5" aria-hidden />Danh mục
      </button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Danh mục hàng hóa">
          <button type="button" aria-label="Đóng" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/40" />
          <div className="absolute inset-y-0 left-0 flex w-[min(86vw,340px)] flex-col bg-white pt-[env(safe-area-inset-top)] shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <b className="text-base">Danh mục hàng hóa</b>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng danh mục" className="grid size-11 place-items-center text-ink-2"><X className="size-5" /></button>
            </div>
            <ul className="flex-1 overflow-y-auto py-1 text-left text-[15px] text-ink">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/danh-muc/${c.slug}`} className="flex min-h-12 items-center gap-3 px-4 hover:bg-brand-tint">
                    <span className="grid size-9 place-items-center rounded-full bg-brand-tint text-brand"><CategoryIcon icon={c.icon} className="size-[18px]" /></span>
                    <span className="flex-1">{c.name}</span>
                    <ChevronRight className="size-4 text-ink-2" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/danh-muc" className="m-4 flex h-11 items-center justify-center rounded-md border border-brand font-semibold text-brand">Xem tất cả sản phẩm</Link>
          </div>
        </div>
      )}
    </>
  );
}
