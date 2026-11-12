"use client";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

// Trang giỏ hàng và thanh toán có thanh dính (tiền + nút Đặt hàng) nằm trên thanh đáy khi màn hình nhỏ hơn lg.
// Chủ shop duyệt 06/11 (phương án B): đẩy 2 nút nổi lên trên thanh dính đó để không che số tiền và nút.
// 12/11: chủ shop yêu cầu nút nhỏ hơn, chỉ còn Messenger + Zalo (bỏ nút gọi).
const RAISED = new Set(["/gio-hang", "/thanh-toan"]);

// Link Facebook chủ shop gửi 12/11 (trang cá nhân, chưa phải Fanpage).
const MESSENGER_URL = "https://www.facebook.com/trieu.vo.697369";
const ZALO_URL = "https://zalo.me/0948732064";

export function FloatActions() {
  const pathname = usePathname();
  const raised = RAISED.has(pathname);
  if (pathname === "/so-sanh") return null;
  const bottom = raised
    ? "bottom-[calc(216px+env(safe-area-inset-bottom))] lg:bottom-6"
    : "bottom-[calc(76px+env(safe-area-inset-bottom))] md:bottom-6";
  return (
    <div className={`float-actions fixed right-3 z-40 flex flex-col gap-2 md:right-6 ${bottom}`}>
      <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" aria-label="Nhắn Messenger cho shop" className="grid size-10 place-items-center rounded-full border border-line bg-white text-brand shadow-[var(--shadow-soft)] hover:bg-brand-tint">
        <MessageCircle className="size-5" aria-hidden />
      </a>
      <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho shop" className="grid size-10 place-items-center rounded-full bg-brand text-[11px] font-bold text-white shadow-[var(--shadow-float)] hover:bg-brand-deep">
        Zalo
      </a>
    </div>
  );
}
