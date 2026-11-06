"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { CategoryOverlay } from "@/components/storefront/CategoryOverlay";
import type { CategoryMenuTab } from "@/lib/catalog";

export function CategoryDrawer({ menu }: { menu: CategoryMenuTab[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname === "/danh-muc" || pathname.startsWith("/danh-muc/");
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const historyEntryRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const openRef = useRef(false);
  const closingRef = useRef(false);

  const finishClose = useCallback((href?: string) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 160;
    timerRef.current = window.setTimeout(() => {
      openRef.current = false;
      closingRef.current = false;
      setIsOpen(false);
      setClosing(false);
      if (href) {
        const state = { ...window.history.state };
        delete state.__tttCategoryOverlay;
        window.history.replaceState(state, "", window.location.href);
        router.push(href);
      } else {
        openerRef.current?.focus();
      }
      timerRef.current = null;
    }, delay);
  }, [router]);

  useEffect(() => {
    function onPopState() {
      if (!historyEntryRef.current || !openRef.current) return;
      historyEntryRef.current = false;
      finishClose();
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [finishClose]);

  useEffect(() => () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); }, []);

  function openMenu() {
    if (openRef.current) return;
    openRef.current = true;
    closingRef.current = false;
    setClosing(false);
    setIsOpen(true);
    window.history.pushState({ ...window.history.state, __tttCategoryOverlay: true }, "", window.location.href);
    historyEntryRef.current = true;
  }

  function closeMenu() {
    if (historyEntryRef.current) window.history.back();
    else finishClose();
  }

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        aria-current={active ? "page" : undefined}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={openMenu}
        className={`flex h-16 flex-col items-center justify-center gap-1 ${active ? "font-semibold text-ink" : "hover:text-brand"}`}
      >
        <LayoutGrid className="size-5" aria-hidden="true" />Danh mục
      </button>
      {isOpen && typeof document !== "undefined" ? createPortal(<CategoryOverlay
        menu={menu}
        closing={closing}
        closeButtonRef={closeButtonRef}
        onClose={closeMenu}
        onNavigate={(href) => finishClose(href)}
      />, document.body) : null}
    </>
  );
}
