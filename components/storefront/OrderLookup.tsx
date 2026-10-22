"use client";
import { useState } from "react";
import { OrderSteps } from "@/components/storefront/OrderSteps";
import { SAMPLE_ORDER, findProduct } from "@/lib/mock/store";
import { formatVnd } from "@/lib/shop";

const input = "mt-1 h-12 w-full rounded-md border bg-white px-3 text-[15px] outline-none focus:border-brand";

// Chưa có backend: chỉ tra được đơn mẫu TTT000123 / 0908 123 456
export function OrderLookup({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [found, setFound] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFound(false);
    const c = code.trim().toUpperCase();
    const p = phone.replace(/\D/g, "");
    if (!/^TTT\d{6}$/.test(c)) return setError("Mã đơn gồm “TTT” và 6 số, ví dụ TTT000123.");
    if (!/^0\d{9}$/.test(p)) return setError("Số điện thoại cần 10 số, bắt đầu bằng 0.");
    if (c !== SAMPLE_ORDER.code || p !== SAMPLE_ORDER.phone)
      return setError("Không tìm thấy đơn khớp mã và số điện thoại. Kiểm tra lại, hoặc gọi shop 0948 732 064.");
    setError("");
    setFound(true);
  }

  const lines = SAMPLE_ORDER.items.flatMap(([sku, q]) => {
    const p = findProduct(sku);
    return p ? [{ p, q }] : [];
  });
  const goods = lines.reduce((s, l) => s + l.p.price * l.q, 0);

  return (
    <>
      <form noValidate onSubmit={submit} className="mt-5 grid gap-4 rounded-md bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5">
        <label className="block text-sm font-medium">
          Mã đơn
          <input value={code} onChange={(e) => setCode(e.target.value)} className={`${input} num border-line uppercase`} placeholder="TTT000123" autoCapitalize="characters" />
        </label>
        <label className="block text-sm font-medium">
          Số điện thoại
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" className={`${input} num border-line`} placeholder="0908 123 456" />
        </label>
        <button type="submit" className="h-12 rounded-md bg-brand px-6 font-semibold text-white hover:bg-brand-deep">Tra cứu</button>
        {error && <p role="alert" className="text-[13px] text-danger sm:col-span-3">{error}</p>}
      </form>

      {found && (
        <section className="mt-4 rounded-md bg-white p-5 sm:p-6" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="num text-xl font-extrabold text-brand">{SAMPLE_ORDER.code}</h2>
            <span className="text-sm text-ink-2">{SAMPLE_ORDER.delivery}</span>
          </div>
          <div className="mt-5"><OrderSteps current={SAMPLE_ORDER.step} /></div>
          <ul className="mt-5 divide-y divide-line border-t border-line text-sm">
            {lines.map(({ p, q }) => (
              <li key={p.sku} className="flex justify-between gap-3 py-2.5">
                <span>{p.name} <span className="num text-ink-2">× {q}</span></span>
                <b className="num">{formatVnd(p.price * q)}</b>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-1.5 border-t border-line pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-2">Tiền hàng</dt><dd className="num">{formatVnd(goods)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-2">Phí ship</dt><dd className="num">{formatVnd(SAMPLE_ORDER.shipFee)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-2">Mã vận đơn</dt><dd>{SAMPLE_ORDER.tracking || "Chưa có"}</dd></div>
            <div className="flex justify-between pt-1 text-base font-bold"><dt>Tổng cộng</dt><dd className="num text-danger">{formatVnd(goods + SAMPLE_ORDER.shipFee)}</dd></div>
          </dl>
        </section>
      )}
    </>
  );
}
