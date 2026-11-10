"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { markPaid, setShipping, setStatus, type ActionResult } from "@/app/admin/(shell)/don-hang/actions";
import type { OrderStatus } from "@/lib/admin/orders";

const LABEL: Partial<Record<OrderStatus, string>> = {
  confirmed: "Xác nhận đơn", shipping: "Bắt đầu giao", ready: "Sẵn sàng lấy", completed: "Hoàn thành",
};
const btn = "inline-flex h-11 items-center justify-center rounded px-4 text-sm font-semibold disabled:opacity-50";

function useAction() {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      const r = await fn();
      setError(r.ok ? "" : r.error ?? "Không thực hiện được.");
    });
  return { pending, error, run };
}

export function OrderActions({ orderId, code, next, canCancel }: { orderId: number; code: string; next: OrderStatus[]; canCancel: boolean }) {
  const { pending, error, run } = useAction();
  const [confirmCancel, setConfirmCancel] = useState(false);
  if (!next.length && !canCancel) return null;
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {next.map((s, i) => (
          <button key={s} disabled={pending} onClick={() => run(() => setStatus(orderId, code, s))}
            className={`${btn} ${i === 0 ? "bg-brand text-white hover:bg-brand-deep" : "border border-brand bg-white text-brand"}`}>
            {LABEL[s]}
          </button>
        ))}
        {canCancel && !confirmCancel && (
          <button disabled={pending} onClick={() => setConfirmCancel(true)} className={`${btn} border border-line bg-white text-danger`}>Hủy đơn</button>
        )}
        {confirmCancel && (
          <span className="flex flex-wrap items-center gap-2 rounded bg-[#fef2f2] p-2 text-sm text-danger">
            Hủy đơn này? Tồn kho đã trừ sẽ được hoàn lại.
            <button disabled={pending} onClick={() => run(() => setStatus(orderId, code, "cancelled", "Hủy từ trang quản trị"))} className={`${btn} bg-danger text-white`}>Hủy đơn</button>
            <button onClick={() => setConfirmCancel(false)} className={`${btn} bg-white text-ink`}>Không</button>
          </span>
        )}
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function ShippingForm({ orderId, code, fee, tracking, feeLocked = false }: { orderId: number; code: string; fee: number | null; tracking: string; feeLocked?: boolean }) {
  const { pending, error, run } = useAction();
  const [f, setF] = useState(fee === null ? "" : String(fee));
  const [t, setT] = useState(tracking);
  return (
    <form className="mt-3 space-y-2" onSubmit={(e) => { e.preventDefault(); run(() => setShipping(orderId, code, f, t)); }}>
      <label className="block text-sm">Phí ship (đồng)
        <input value={f} onChange={(e) => setF(e.target.value)} disabled={feeLocked} inputMode="numeric" maxLength={10} placeholder="Để trống = báo sau" className="num mt-1 h-11 w-full rounded border border-line px-3 disabled:bg-ground" />
      </label>
      {feeLocked && <p className="text-xs text-ink-2">Phí giao hàng đã chốt trong mã QR; vẫn có thể cập nhật mã vận đơn.</p>}
      <label className="block text-sm">Mã vận đơn
        <input value={t} onChange={(e) => setT(e.target.value)} maxLength={60} className="mt-1 h-11 w-full rounded border border-line px-3" />
      </label>
      <button disabled={pending} className={`${btn} border border-brand text-brand`}>{pending ? "Đang lưu…" : "Lưu giao hàng"}</button>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    </form>
  );
}

export function PaidButton({ orderId, code, bank = false, reviewPaid = false }: { orderId: number; code: string; bank?: boolean; reviewPaid?: boolean }) {
  const { pending, error, run } = useAction();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      {bank && <p className="mt-2 text-xs text-ink-2">Nếu SePay đã ghi giao dịch, hãy <Link href="/admin/giao-dich" className="font-semibold text-brand underline">đối chiếu trong Giao dịch</Link> để liên kết đúng mã giao dịch.</p>}
      {bank && !confirm ? <button type="button" onClick={() => setConfirm(true)} className={`${btn} mt-3 border border-brand text-brand`}>{reviewPaid ? "Kiểm tra đủ hàng để chấp nhận" : "Không thấy giao dịch? Xác minh sao kê"}</button> : <div className="mt-3"><p className="mb-2 text-xs text-ink-2">{reviewPaid ? "Hệ thống đã ghi nhận tiền. Chỉ chấp nhận đơn khi đã kiểm tra đủ hàng." : bank ? "Chỉ bấm sau khi đã đối chiếu sao kê ngân hàng: đúng đơn và đủ toàn bộ số tiền." : "Xác nhận đã thu tiền đơn này."}</p><button type="button" disabled={pending} onClick={() => run(() => markPaid(orderId, code))} className={`${btn} border border-brand text-brand`}>{reviewPaid ? "Chấp nhận khi đủ hàng" : "Xác nhận đã nhận tiền"}</button>{bank && <button type="button" disabled={pending} onClick={() => setConfirm(false)} className={`${btn} ml-2 border border-line`}>Hủy</button>}</div>}
      {error && <p role="alert" className="mt-1 text-sm text-danger">{error}</p>}
    </>
  );
}
