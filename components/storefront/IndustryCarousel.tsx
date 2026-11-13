"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { CategoryIcon } from "@/components/storefront/CategoryIcon";

export type IndustryTile = { name: string; image?: string; icon: "fan" | "home" };

// Băng ô ngành hàng ở trang chủ: điện thoại 4 ô/trang, máy tính 10 ô/trang. Vuốt bằng tay (cuộn ngang có snap),
// tự sang trang kế sau 4 giây; dừng khi khách đang chạm/rê chuột, và không tự chạy nếu máy bật giảm chuyển động.
const DELAY = 4000;

export function IndustryCarousel({ tiles }: { tiles: IndustryTile[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      // Trang cuối có thể thiếu ô (10 ô / 4 = 3 trang), lúc đó cuộn chỉ tới được mép phải
      const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.01));
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      setPages(total);
      setPage(atEnd && total > 1 ? total - 1 : Math.round(el.scrollLeft / el.clientWidth));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [tiles.length]);

  useEffect(() => {
    const el = track.current;
    if (!el || hold || pages < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => el.scrollTo({ left: ((page + 1) % pages) * el.clientWidth, behavior: "smooth" }), DELAY);
    return () => window.clearTimeout(t);
  }, [page, pages, hold]);

  // Kéo bằng chuột (máy tính / khung xem thử): cảm ứng đã tự vuốt được nhờ cuộn ngang, chuột thì phải tự xử lý.
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current, el = track.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current, el = track.current;
    if (!d || !el) return;
    el.style.scrollSnapType = "";
    if (d.moved) {
      const dir = Math.sign(d.left - el.scrollLeft);
      const from = Math.round(d.left / el.clientWidth);
      go(Math.min(pages - 1, Math.max(0, Math.abs(el.scrollLeft - d.left) > 40 ? from - dir : from)));
      // Chặn cú bấm ngay sau khi kéo để không mở nhầm ngành hàng
      el.addEventListener("click", (ev) => ev.preventDefault(), { capture: true, once: true });
    }
    drag.current = null;
  };

  const go = (i: number) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" });

  return (
    <div className="rounded-2xl bg-white px-1.5 pb-1 pt-3" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onTouchStart={() => setHold(true)} onTouchEnd={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div ref={track} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag} onDragStart={(e) => e.preventDefault()} className="grid cursor-grab select-none active:cursor-grabbing snap-x snap-mandatory auto-cols-[25%] grid-flow-col overflow-x-auto [scrollbar-width:none] lg:auto-cols-[10%] [&::-webkit-scrollbar]:hidden">
        {tiles.map((t) => (
          <Link key={t.name} href={`/danh-muc?industry=${encodeURIComponent(t.name)}`} className="group flex snap-start flex-col items-center gap-2 rounded-xl px-1 pb-1 pt-0.5 text-center outline-offset-2 active:scale-[0.97] motion-safe:transition-transform">
            {/* Ảnh sản phẩm nền trắng đặt thẳng trên khung trắng: không viền, không nền riêng (kiểu Nguyễn Kim / Điện Máy Xanh) */}
            <span className="relative grid size-14 place-items-center text-brand transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none lg:size-[72px]">
              {t.image
                ? <Image src={t.image} alt="" fill sizes="80px" className="object-contain" />
                : <CategoryIcon icon={t.icon} className="size-8" />}
            </span>
            <span className="line-clamp-2 min-h-8 text-[12.5px] font-semibold leading-4 text-ink lg:text-[13px]">{t.name}</span>
          </Link>
        ))}
      </div>
      {pages > 1 && (
        <div className="flex justify-center" role="tablist" aria-label="Trang ngành hàng">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === page} aria-label={`Trang ${i + 1}`} onClick={() => go(i)} className="grid h-6 place-items-center px-[3px]">
              <span className={`block h-1 rounded-full transition-[width,background-color] duration-300 ${i === page ? "w-4 bg-brand" : "w-1 bg-line"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
