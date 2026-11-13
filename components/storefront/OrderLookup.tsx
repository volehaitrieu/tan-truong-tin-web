"use client";
import { useEffect, useState } from "react";
import { OrderSteps } from "@/components/storefront/OrderSteps";
import { BankQr } from "@/components/storefront/BankQr";
import { lookupOrder, type LookupResult } from "@/app/(store)/actions";
import { formatVnd } from "@/lib/shop";
import type { ShopBank } from "@/lib/vietqr";

const input = "mt-1 h-12 w-full rounded-md border bg-white px-3 text-[15px] outline-none focus:border-brand";
const STEP: Record<string, number> = { pending: 0, confirmed: 1, shipping: 2, ready: 2, completed: 3 };
const DELIVERY: Record<string, string> = { pickup: "Nhận tại cửa hàng", inner: "Giao nội thành", province: "Gửi đi tỉnh", counter: "Mua tại quầy" };

export function OrderLookup({ initialCode = "", bank = null }: { initialCode?: string; bank?: ShopBank | null }) {
  const [code, setCode] = useState(initialCode);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<LookupResult>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setOrder(null);
    const c = code.trim().toUpperCase();
    const p = phone.replace(/\D/g, "");
    if (!/^TTT\d{6}$/.test(c)) return setError("Mã đơn gồm “TTT” và 6 số, ví dụ TTT001024.");
    if (!/^0\d{9}$/.test(p)) return setError("Số điện thoại cần 10 số, bắt đầu bằng 0.");
    setBusy(true);
    try {
      const found = await lookupOrder(c, p);
      if (!found) return setError("Không tìm thấy đơn khớp mã và số điện thoại. Kiểm tra lại, hoặc gọi shop 0948 732 064.");
      setError("");
      setOrder(found);
    } catch {
      setError("Không kết nối được. Kiểm tra mạng rồi thử lại, hoặc gọi shop 0948 732 064.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form noValidate onSubmit={submit} className="mt-5 grid gap-4 rounded-md bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5">
        <label className="block text-sm font-medium">
          Mã đơn
          <input value={code} onChange={(e) => setCode(e.target.value)} maxLength={20} className={`${input} num border-line uppercase`} placeholder="TTT001024" autoCapitalize="characters" />
        </label>
        <label className="block text-sm font-medium">
          Số điện thoại
          <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} type="tel" inputMode="tel" className={`${input} num border-line`} placeholder="Số đã dùng khi đặt" />
        </label>
        <button type="submit" disabled={busy} className="h-12 rounded-md bg-brand px-6 font-semibold text-white hover:bg-brand-deep disabled:opacity-60">{busy ? "Đang tìm…" : "Tra cứu"}</button>
        {error && <p role="alert" className="text-[13px] text-danger sm:col-span-3">{error}</p>}
      </form>

      {order && (
        <section className="mt-4 rounded-md bg-white p-5 sm:p-6" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="num text-xl font-extrabold text-brand">{order.code}</h2>
            <span className="text-sm text-ink-2">{DELIVERY[order.delivery] ?? order.delivery}</span>
          </div>
          <div className="mt-5">
            {order.status === "cancelled" ? <p className="rounded-md bg-[#fef2f2] p-3 text-sm font-semibold text-danger">Đơn đã hủy</p> : order.payment_acceptance === "review" ? <p className="rounded-md bg-[#fff7e6] p-3 text-sm font-semibold">Đã nhận tiền · shop đang xử lý</p> : order.payment_method === "bank" && order.payment_status !== "paid" ? <p className="rounded-md bg-brand-tint p-3 text-sm font-semibold">Chờ xác nhận thanh toán chuyển khoản</p> : <OrderSteps current={STEP[order.status] ?? 0} />}
          </div>
          <ul className="mt-5 divide-y divide-line border-t border-line text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-3 py-2.5">
                <span>{it.name} <span className="num text-ink-2">× {it.qty}</span></span>
                <b className="num">{formatVnd(it.unit_price * it.qty)}</b>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-1.5 border-t border-line pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-2">Tiền hàng</dt><dd className="num">{formatVnd(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-2">Phí ship</dt><dd className="num">{order.shipping_fee == null ? "Báo khi xác nhận" : formatVnd(order.shipping_fee)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-2">Mã vận đơn</dt><dd>{order.tracking_code || "Chưa có"}</dd></div>
            <div className="flex justify-between pt-1 text-base font-bold"><dt>Tổng cộng</dt><dd className="num text-ink">{formatVnd(order.subtotal + (order.shipping_fee ?? 0))}{order.shipping_fee == null && " + ship"}</dd></div>
            {order.payment_method === "bank" && <div className="flex justify-between pt-2"><dt>Thanh toán</dt><dd className={order.payment_status === "paid" ? "font-semibold text-ok" : "text-gold-ink"}>{order.payment_status === "paid" ? order.payment_acceptance === "review" ? "Đã nhận tiền · cần xử lý" : "Đã nhận tiền" : "Đang kiểm tra"}</dd></div>}
          </dl>
        </section>
      )}
      {order?.payment_method === "bank" && order.payment_status !== "paid" && order.status !== "cancelled" && (
        order.payment_hold_until && Date.parse(order.payment_hold_until) > now && order.shipping_fee !== null && bank
          ? <BankQr bank={bank} amount={order.subtotal + order.shipping_fee} code={order.code} />
          : <p role="status" className="mt-4 rounded-md bg-white p-4 text-sm">Thời gian giữ hàng hoặc tài khoản nhận tiền không còn hiệu lực. Vui lòng không tạo khoản chuyển mới; nếu đã chuyển, liên hệ shop kèm mã đơn để kiểm tra.</p>
      )}
    </>
  );
}
