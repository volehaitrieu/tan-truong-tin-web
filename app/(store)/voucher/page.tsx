import type { Metadata } from "next";
import Link from "next/link";
import { TicketPercent } from "lucide-react";
import { SHOP } from "@/lib/shop";

export const metadata: Metadata = { title: "Voucher" };

// Shop chưa có chương trình voucher: trang chỉ báo trạng thái trống, không bày mã giảm giá giả.
// Khi có voucher thật, thay phần trống bằng danh sách lấy từ dữ liệu.
export default function VoucherPage() {
  return (
    <>
      <div hidden data-theme-v2 />
      <h1 className="text-[26px] font-extrabold sm:text-[32px]">Voucher</h1>
      <div role="status" className="mt-5 rounded-2xl bg-surface px-5 py-12 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-tint text-brand"><TicketPercent className="size-8" aria-hidden /></span>
        <h2 className="mt-4 text-lg font-bold">Hiện chưa có voucher</h2>
        <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-2">Shop sẽ đăng mã giảm giá tại đây khi có chương trình. Cần giá tốt cho đơn số lượng lớn, gọi {SHOP.phone} hoặc nhắn Zalo.</p>
        <Link href="/danh-muc" className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-deep">Xem sản phẩm</Link>
      </div>
    </>
  );
}
