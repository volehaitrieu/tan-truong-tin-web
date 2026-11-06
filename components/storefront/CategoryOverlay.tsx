"use client";

import { useEffect, useState, type KeyboardEvent, type RefObject } from "react";
import { X } from "lucide-react";
import { CategoryIndexClient } from "@/components/storefront/CategoryIndexClient";
import type { CategoryMenuTab } from "@/lib/catalog";

type Props = {
  menu: CategoryMenuTab[];
  closing: boolean;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onNavigate: (href: string) => void;
};

export function CategoryOverlay({ menu, closing, closeButtonRef, onClose, onNavigate }: Props) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeButtonRef]);

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Danh mục sản phẩm"
      onKeyDown={onDialogKeyDown}
      style={{ transitionDuration: closing ? "160ms" : "220ms" }}
      className={`fixed inset-0 z-[60] flex flex-col bg-[#F2F4F7] transition-[opacity,transform] ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${closing ? "translate-y-4 opacity-0" : entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <header className="flex h-12 shrink-0 items-center justify-between bg-white px-3">
        <h2 className="text-[14px] font-medium text-[#252A31]">Danh mục sản phẩm</h2>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Đóng danh mục"
          onClick={onClose}
          className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2A83E9]"
        >
          <span className="grid size-6 place-items-center rounded-full bg-[#98A2B3] text-white"><X className="size-4" aria-hidden="true" /></span>
        </button>
      </header>
      <div className="flex min-h-0 flex-1 px-0 pt-2">
        <CategoryIndexClient menu={menu} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
