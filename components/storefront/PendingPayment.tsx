"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState, useSyncExternalStore } from "react";
import { lookupOrder, type LookupResult } from "@/app/(store)/actions";
import { clearCart } from "@/components/storefront/CartControls";
import { ORDER_KEY, type PlacedOrder } from "@/components/storefront/CheckoutForm";
import { BankQr } from "@/components/storefront/BankQr";
import { formatVnd } from "@/lib/shop";
import type { ShopBank } from "@/lib/vietqr";

const noop = () => () => {};
function readOrder(): PlacedOrder | null {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) as PlacedOrder : null;
  } catch { return null; }
}
const getSnapshot = () => { try { return sessionStorage.getItem(ORDER_KEY); } catch { return null; } };

export function PendingPayment({ bank }: { bank: ShopBank | null }) {
  const raw = useSyncExternalStore(noop, getSnapshot, () => undefined);
  const order = raw === undefined ? undefined : readOrder();
  const orderCode = order?.code;
  const orderPhone = order?.phone;
  const orderPay = order?.pay;
  const router = useRouter();
  const [found, setFound] = useState<LookupResult>(null);
  const [checked, setChecked] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!orderCode || orderPay !== "bank" || !orderPhone) return;
    let active = true;
    let running = false;
    const poll = () => {
      if (running) return;
      running = true;
      startTransition(async () => {
        try {
          const result = await lookupOrder(orderCode, orderPhone);
          if (!active) return;
          setFound(result);
          setChecked(true);
          if (result?.payment_status === "paid" && result.payment_acceptance !== "review") {
            clearCart();
            router.replace("/cam-on");
          }
        } catch { if (active) setChecked(true); }
        finally { running = false; }
      });
    };
    poll();
    const pollId = window.setInterval(poll, 5000);
    const clockId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { active = false; window.clearInterval(pollId); window.clearInterval(clockId); };
  }, [orderCode, orderPhone, orderPay, router]);

  if (raw === undefined) return <p className="p-6">Đang mở thông tin thanh toán…</p>;
  if (!order || order.pay !== "bank" || !order.phone) return <div className="rounded-xl bg-white p-6"><h1 className="text-2xl font-bold">Không tìm thấy mã thanh toán</h1><p className="mt-2 text-sm text-ink-2">Nếu đã tạo đơn, hãy dùng mã đơn và số điện thoại để tra cứu.</p><Link href="/tra-cuu" className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand">Tra cứu đơn</Link></div>;

  const until = found?.payment_hold_until ? Date.parse(found.payment_hold_until) : 0;
  const autoUntil = found?.payment_auto_until ? Date.parse(found.payment_auto_until) : 0;
  const holding = until > now;
  const minutes = Math.max(0, Math.ceil((until - now) / 60_000));
  const amount = found && found.shipping_fee !== null ? found.subtotal + found.shipping_fee : null;

  return <>
    <div className="rounded-xl bg-white p-5 sm:p-7" aria-live="polite">
      <h1 className="text-2xl font-extrabold">{found?.payment_status === "paid" && found.payment_acceptance === "review" ? "Đã nhận tiền · shop đang xử lý" : "Chờ thanh toán chuyển khoản"}</h1>
      <p className="mt-2 text-sm text-ink-2">Mã đơn <b className="num text-ink">{order.code}</b> đã được tạo để nhận tiền. Đơn chỉ thành công khi hệ thống hoặc shop xác nhận đúng khoản chuyển.</p>
      {!checked && <p className="mt-4 text-sm text-ink-2">Đang kiểm tra trạng thái và số tiền từ hệ thống…</p>}
      {checked && !found && <p role="alert" className="mt-4 rounded-lg bg-brand-tint p-3 text-sm">Chưa đọc được đơn. Vui lòng giữ mã đơn và thử lại sau ít phút, hoặc liên hệ shop.</p>}
      {found?.status === "cancelled" && <p role="alert" className="mt-4 rounded-lg bg-[#fef2f2] p-3 text-sm text-danger">Đơn này đã hủy. Vui lòng không chuyển khoản theo mã QR cũ.</p>}
      {found?.payment_status === "paid" && found.payment_acceptance === "review" && <p role="status" className="mt-4 rounded-lg bg-[#fff7e6] p-3 text-sm">Hệ thống đã ghi nhận tiền, nhưng chưa thể xác nhận đơn vì cần shop kiểm tra hàng hoặc giao dịch đến sau thời hạn tự nhận. Shop sẽ xử lý; vui lòng không chuyển thêm tiền.</p>}
      {found && found.status !== "cancelled" && found.payment_status !== "paid" && holding && <p className="mt-4 rounded-lg bg-brand-tint p-3 text-sm">Hàng được giữ thêm khoảng <b className="num">{minutes} phút</b>. Số tiền và nội dung chuyển khoản đã điền sẵn; vui lòng không sửa.</p>}
      {found && found.status !== "cancelled" && found.payment_status !== "paid" && !holding && <p role="status" className="mt-4 rounded-lg bg-[#fff7e6] p-3 text-sm">Đã hết 30 phút giữ hàng. Vui lòng không tạo khoản chuyển mới. Nếu đã chuyển tiền, hệ thống vẫn có thể nhận trong 24 giờ từ lúc tạo mã khi còn hàng; sau đó shop sẽ kiểm tra thủ công.</p>}
      {amount !== null && <p className="num mt-4 text-lg font-bold">Tổng cần thanh toán: {formatVnd(amount)}</p>}
      {autoUntil > 0 && now > autoUntil && found?.payment_status !== "paid" && <p className="mt-2 text-sm text-ink-2">Đã quá thời hạn tự đối soát. Nếu đã chuyển tiền, vui lòng liên hệ shop kèm mã đơn để được kiểm tra.</p>}
      <p className="mt-3 text-xs text-ink-2">Trang tự kiểm tra trạng thái mỗi 5 giây. Bạn có thể giữ trang này mở trong lúc thanh toán.</p>
    </div>
    {found && found.status !== "cancelled" && found.payment_status !== "paid" && holding && amount !== null && bank && <BankQr bank={bank} amount={amount} code={found.code} />}
    {found && found.status !== "cancelled" && found.payment_status !== "paid" && holding && !bank && <p role="alert" className="mt-4 rounded-xl bg-white p-4 text-sm">Shop đang cập nhật tài khoản nhận tiền. Vui lòng không chuyển khoản theo thông tin cũ và liên hệ shop.</p>}
    <div className="mt-5 flex gap-4"><Link href={`/tra-cuu?ma=${order.code}`} className="inline-flex min-h-11 items-center font-semibold text-brand">Tra cứu đơn</Link><Link href="/" className="inline-flex min-h-11 items-center font-semibold text-brand">Về trang chủ</Link></div>
  </>;
}
