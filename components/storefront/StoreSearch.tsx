"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchProducts } from "@/lib/mock/store";

// Ô tìm kiếm có gợi ý thả xuống; gõ không dấu vẫn ra.
export function StoreSearch({ mobile = false, initial = "" }: { mobile?: boolean; initial?: string }) {
  const [query, setQuery] = useState(initial);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const matches = query.trim() ? searchProducts(query).slice(0, 5) : [];
  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) go(`/tim-kiem?query=${encodeURIComponent(query.trim())}`);
      }}
      className="relative flex h-11 min-w-0 items-center rounded-md border border-brand bg-white pl-3"
    >
      <Search className="size-5 shrink-0 text-brand" aria-hidden />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-label="Tìm sản phẩm"
        enterKeyHint="search"
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-[15px] outline-none"
        placeholder={mobile ? "Tìm ống nước, quạt…" : "Tìm ống nước, quạt, công tắc…"}
      />
      <button type="submit" className={`h-full rounded-r-[5px] bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-deep ${mobile ? "sr-only" : ""}`}>
        Tìm
      </button>
      {open && matches.length > 0 && (
        <ul className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border border-line bg-white shadow-lg">
          {matches.map((p) => (
            <li key={p.sku}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(`/san-pham/${p.sku}`)}
                className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-line px-3 py-2 text-left text-sm last:border-0 hover:bg-brand-tint"
              >
                <span className="line-clamp-1">{p.name}</span>
                <span className="shrink-0 text-xs text-ink-2">{p.brand}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
