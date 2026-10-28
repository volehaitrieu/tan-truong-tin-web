"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
      className="hidden min-h-9 shrink-0 items-center gap-1 rounded-md px-2 text-[13px] font-medium text-brand hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:inline-flex"
      aria-label="Quay lại trang trước"
    >
      <ChevronLeft className="size-4" aria-hidden />
      Quay lại
    </button>
  );
}
