import { formatVnd } from "@/lib/shop";

export type HistoryOrder = {
  code: string; status: string; delivery: string; subtotal: number; shipping_fee: number | null; created_at: string;
  payment_method: string; payment_status: string; payment_acceptance: string | null;
  items: { name: string; qty: number; unit_price: number }[] | null;
};

const STATUS: Record<string, string> = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", shipping: "Đang giao", ready: "Chờ lấy hàng", completed: "Hoàn tất", cancelled: "Đã hủy" };
const time = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short" });

function label(o: HistoryOrder) {
  if (o.status === "cancelled") return { text: "Đã hủy", cls: "bg-sunk text-ink-2" };
  if (o.payment_method === "bank" && o.payment_status !== "paid") return { text: "Chờ thanh toán", cls: "bg-[#fff4d6] text-gold-ink" };
  return { text: STATUS[o.status] ?? o.status, cls: o.status === "completed" ? "bg-brand-tint text-ok" : "bg-brand-tint text-brand" };
}

// Lịch sử đơn đặt khi đã đăng nhập (dữ liệu từ hàm DB customer_orders, chỉ đơn của chính khách)
export function OrderHistory({ orders }: { orders: HistoryOrder[] }) {
  if (orders.length === 0) return <p className="text-sm text-ink-2">Chưa có đơn nào. Đơn bạn đặt khi đã đăng nhập sẽ hiện ở đây.</p>;
  return <ul className="divide-y divide-line">
    {orders.map((o) => {
      const l = label(o);
      const items = o.items ?? [];
      return <li key={o.code} className="py-3 first:pt-0 last:pb-0">
        <details>
          <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3">
            <span>
              <b className="num block">{o.code}</b>
              <time className="text-xs text-ink-2" dateTime={o.created_at}>{time.format(new Date(o.created_at))}</time>
            </span>
            <span className="text-right">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${l.cls}`}>{l.text}</span>
              <b className="num mt-1 block">{formatVnd(o.subtotal + (o.shipping_fee ?? 0))}</b>
            </span>
          </summary>
          <ul className="mt-2 space-y-1 text-sm text-ink-2">
            {items.map((it, i) => <li key={i} className="flex justify-between gap-3"><span className="min-w-0">{it.name} × {it.qty}</span><span className="num shrink-0">{formatVnd(it.unit_price * it.qty)}</span></li>)}
            <li className="flex justify-between gap-3"><span>Phí giao</span><span className="num">{o.shipping_fee === null ? "Báo sau" : formatVnd(o.shipping_fee)}</span></li>
          </ul>
        </details>
      </li>;
    })}
  </ul>;
}
