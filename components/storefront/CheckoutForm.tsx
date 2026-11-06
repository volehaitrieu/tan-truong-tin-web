"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Banknote, MapPin, QrCode, Store, Truck } from "lucide-react";
import { clearCart, useCartLines } from "@/components/storefront/CartControls";
import { placeOrder } from "@/app/(store)/actions";
import { PROVINCES, isInner } from "@/lib/mock/address";
import { formatVnd } from "@/lib/shop";

export type PlacedOrder = { code: string; total: number; method: Method; lines: { name: string; quantity: number; price: number }[] };
export const ORDER_KEY = "ttt-last-order";
type Method = "pickup" | "inner" | "province";
const METHODS: { id: Method; icon: typeof Store; title: string; note: string }[] = [
  { id: "pickup", icon: Store, title: "Đến cửa hàng lấy", note: "0₫ · 379 đường 2/4" },
  { id: "inner", icon: Truck, title: "Giao nội thành", note: "Trong Nha Trang · phí báo khi xác nhận" },
  { id: "province", icon: MapPin, title: "Gửi đi tỉnh", note: "SPX, GHTK · phí báo sau" },
];
const input = "mt-1 h-12 w-full rounded-md border bg-white px-3 text-[15px] outline-none focus:border-brand";

function Field({ label, error, children }: { label: ReactNode; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {error && <span role="alert" className="mt-1 block text-[13px] font-normal text-danger">{error}</span>}
    </label>
  );
}

export function CheckoutForm({ innerFee, freeFrom }: { innerFee: number | null; freeFrom: number | null }) {
  const cart = useCartLines();
  const router = useRouter();
  const [method, setMethod] = useState<Method>("pickup");
  const [f, setF] = useState({ name: "", phone: "", email: "", province: "Khánh Hòa", ward: "", street: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    setF((s) => ({ ...s, [k]: e.target.value, ...(k === "province" ? { ward: "" } : {}) }));
    setErrors((s) => ({ ...s, [k]: "" }));
  };

  if (cart === null || placed) return <p className="mt-5 text-sm text-ink-2">{placed ? "Đang gửi đơn…" : "Đang tải giỏ hàng…"}</p>;
  const { lines } = cart;
  if (lines.length === 0)
    return (
      <div className="mt-5 rounded-md bg-white p-6 text-center">
        <p>Giỏ hàng đang trống nên chưa đặt hàng được.</p>
        <Link href="/danh-muc" className="mt-4 inline-flex h-11 items-center rounded-md bg-brand px-5 font-semibold text-white">Xem sản phẩm</Link>
      </div>
    );
  const total = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  // Chỉ để hiển thị — server tự tính lại phí ship khi đặt hàng
  const fee = method === "pickup" ? 0 : method === "inner" && innerFee !== null ? (freeFrom !== null && total >= freeFrom ? 0 : innerFee) : null;

  function validate() {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Vui lòng nhập họ tên người nhận.";
    const digits = f.phone.replace(/\D/g, "");
    if (!/^0\d{9}$/.test(digits)) e.phone = "Số điện thoại cần 10 số, bắt đầu bằng 0.";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email chưa đúng dạng, ví dụ ten@gmail.com.";
    if (method !== "pickup") {
      if (!f.ward) e.ward = "Chọn phường/xã nhận hàng.";
      if (!f.street.trim()) e.street = "Nhập số nhà, tên đường.";
      if (method === "inner" && f.ward && !isInner(f.province, f.ward)) e.ward = "Địa chỉ này ngoài Nha Trang — chọn “Gửi đi tỉnh”.";
    }
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (sending) return;
    const e = validate();
    setErrors(e);
    setServerError("");
    if (Object.values(e).some(Boolean)) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setSending(true);
    // Chỉ gửi mã hàng + số lượng; server tự tính tiền và phí ship
    const res = await placeOrder({
      name: f.name, phone: f.phone, email: f.email || undefined, delivery: method,
      province: method === "pickup" ? undefined : f.province, ward: method === "pickup" ? undefined : f.ward,
      street: method === "pickup" ? undefined : f.street, note: f.note || undefined,
      items: lines.map((l) => ({ sku: l.sku, qty: l.quantity })),
    });
    setSending(false);
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    const order: PlacedOrder = {
      code: res.code,
      total: res.subtotal,
      method,
      lines: lines.map((l) => ({ name: l.product.name, quantity: l.quantity, price: l.product.price })),
    };
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {}
    setPlaced(true);
    clearCart();
    router.push("/cam-on");
  }

  const border = (k: string) => (errors[k] ? "border-danger" : "border-line");
  const wards = PROVINCES[f.province] ?? [];

  return (
    <form noValidate onSubmit={submit} className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6 rounded-md bg-white p-4 sm:p-6">
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Người nhận</h2>
          <Field label="Họ tên *" error={errors.name}>
            <input value={f.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} className={`${input} ${border("name")}`} placeholder="Nguyễn Văn A" />
          </Field>
          <Field label="Số điện thoại *" error={errors.phone}>
            <input value={f.phone} onChange={set("phone")} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} className={`${input} ${border("phone")} num`} placeholder="Số điện thoại của bạn" />
          </Field>
          <Field label={<>Email <span className="font-normal text-ink-2">(không bắt buộc)</span></>} error={errors.email}>
            <input value={f.email} onChange={set("email")} type="email" autoComplete="email" aria-invalid={!!errors.email} className={`${input} ${border("email")}`} />
          </Field>
        </section>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-lg font-bold">Cách nhận hàng</legend>
          {METHODS.map(({ id, icon: Icon, title, note }) => (
            <label key={id} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border p-3 ${method === id ? "border-brand bg-brand-tint" : "border-line"}`}>
              <input type="radio" name="method" checked={method === id} onChange={() => setMethod(id)} className="size-5 accent-brand" />
              <Icon className="size-5 text-brand" aria-hidden />
              <span><b className="block text-[15px]">{title}</b><span className="text-[13px] text-ink-2">{note}</span></span>
            </label>
          ))}
        </fieldset>

        {method !== "pickup" && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold">Địa chỉ nhận hàng</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tỉnh / Thành phố *">
                <select value={f.province} onChange={set("province")} className={`${input} border-line`}>
                  {Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Phường / Xã *" error={errors.ward}>
                <select value={f.ward} onChange={set("ward")} aria-invalid={!!errors.ward} className={`${input} ${border("ward")}`}>
                  <option value="">Chọn phường / xã</option>
                  {wards.map((w) => <option key={w}>{w}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Số nhà, tên đường *" error={errors.street}>
              <input value={f.street} onChange={set("street")} autoComplete="street-address" aria-invalid={!!errors.street} className={`${input} ${border("street")}`} placeholder="Ví dụ: 12 Lê Thánh Tôn" />
            </Field>
          </section>
        )}

        <Field label={<>Ghi chú <span className="font-normal text-ink-2">(không bắt buộc)</span></>}>
          <textarea value={f.note} onChange={set("note")} rows={2} className="mt-1 w-full rounded-md border border-line p-3 text-[15px] outline-none focus:border-brand" placeholder="Giờ nhận hàng, chỉ đường…" />
        </Field>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-lg font-bold">Thanh toán</legend>
          <label className="flex min-h-14 items-center gap-3 rounded-md border border-brand bg-brand-tint p-3">
            <input type="radio" name="pay" defaultChecked className="size-5 accent-brand" />
            <Banknote className="size-5 text-brand" aria-hidden />
            <b className="text-[15px]">Trả tiền mặt khi nhận hàng (COD)</b>
          </label>
          <label className="flex min-h-14 items-center gap-3 rounded-md border border-line p-3 opacity-60">
            <input type="radio" name="pay" disabled className="size-5" />
            <QrCode className="size-5 text-brand" aria-hidden />
            <b className="flex-1 text-[15px]">Chuyển khoản VietQR</b>
            <span className="rounded-full border border-line bg-sunk px-2 py-0.5 text-xs font-medium text-ink-2">Sắp có</span>
          </label>
        </fieldset>
      </div>

      <aside className="h-fit rounded-md bg-white p-4 sm:p-5 lg:sticky lg:top-28">
        <h2 className="font-bold">Đơn hàng ({lines.length} món)</h2>
        <ul className="mt-2 divide-y divide-line">
          {lines.map((l) => (
            <li key={l.sku} className="flex justify-between gap-3 py-2.5 text-sm">
              <span>{l.product.name} <span className="num text-ink-2">× {l.quantity}</span></span>
              <b className="num whitespace-nowrap">{formatVnd(l.product.price * l.quantity)}</b>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t border-line pt-3 text-sm">Tiền hàng <b className="num">{formatVnd(total)}</b></p>
        <p className="mt-1.5 flex justify-between text-sm">Phí ship <span className="num text-ink-2">{fee === null ? "Báo khi xác nhận đơn" : formatVnd(fee)}</span></p>
        {method === "inner" && fee !== 0 && freeFrom !== null && <p className="mt-1 text-xs text-ok">Miễn phí ship nội thành cho đơn từ {formatVnd(freeFrom)}</p>}
        <p className="mt-3 flex items-baseline justify-between text-base font-bold">Tạm tính <span className="num text-xl text-ink">{formatVnd(total + (fee ?? 0))}</span></p>
        {serverError && <p role="alert" className="mt-3 rounded-md bg-[#fef2f2] p-3 text-sm text-danger">{serverError}</p>}
        <button type="submit" disabled={sending} className="mt-4 h-12 w-full rounded-md bg-brand font-bold text-white hover:bg-brand-deep disabled:opacity-60">{sending ? "Đang gửi đơn…" : "Đặt hàng"}</button>
        <p className="mt-2 text-center text-xs text-ink-2">Shop sẽ gọi xác nhận đơn trước khi giao.</p>
      </aside>
    </form>
  );
}
