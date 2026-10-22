import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Đường dẫn" className="mb-3 flex flex-wrap items-center text-[13px] text-ink-2">
      <Link href="/" className="flex min-h-9 items-center hover:text-brand">Trang chủ</Link>
      {items.map((it) => (
        <span key={it.label} className="flex items-center">
          <ChevronRight className="mx-1 size-3.5" aria-hidden />
          {it.href ? (
            <Link href={it.href} className="flex min-h-9 items-center hover:text-brand">{it.label}</Link>
          ) : (
            <span aria-current="page" className="line-clamp-1 text-ink">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
