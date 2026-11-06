"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Banknote, MapPin, QrCode, Store, Truck } from "lucide-react";
import { clearCart, useCartLines } from "@/components/storefront/CartControls";
import { placeOrder } from "@/app/(store)/actions";
import { PROVINCES, isInner } from "@/lib/mock/address";
import { formatVnd } from "@/lib/shop";

export type PlacedOrder = { code: string; total: number; method: Method; lines: { name: string; quantity: number; price: number }[] };
export const ORDER_KEY = "ttt-last-order";
type Method = "pickup" | "inner" | "province";
const METHODS: { id: Method; icon: typeof Store; title: string }[] = [
  { id: "pickup", icon: Store, title: "Đến cửa hàng lấy" },
  { id: "inner", icon: Truck, title: "Giao nội thành" },
  { id: "province", icon: MapPin, title: "Gửi đi tỉnh" },
];
const input = "mt-1 h-12 w-full rounded-lg border bg-white px-3 text-base outline-none focus:border-brand";

function Field({ label, error, children }: { label: ReactNode; error?: string; children: ReactNode }) {
  return <label className="block text-sm font-medium">{label}{children}{error && <span role="alert" className="mt-1 block text-[13px] font-normal text-danger">{error}</span>}</label>;
}

export function CheckoutForm({ innerFee, freeFrom }: { innerFee: number | null; freeFrom: number | null }) {
  const cart = useCartLines();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [method, setMethod] = useState<Method>("pickup");
  const [f, setF] = useState({ name: "", phone: "", province: "Khánh Hòa", ward: "", street: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    setF((s) => ({ ...s, [k]: e.target.value, ...(k === "province" ? { ward: "" } : {}) }));
    setErrors((s) => ({ ...s, [k]: "" }));
  };
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const focusin = (event: FocusEvent) => { if ((event.target as HTMLElement).matches("input,select,textarea")) setFocused(true); };
    const focusout = () => window.setTimeout(() => setFocused(!!form.querySelector("input:focus,select:focus,textarea:focus")), 0);
    form.addEventListener("focusin", focusin);
    form.addEventListener("focusout", focusout);
    return () => { form.removeEventListener("focusin", focusin); form.removeEventListener("focusout", focusout); };
  }, []);

  if (cart === null || placed) return <div className="mt-5 space-y-4" aria-label={placed ? "Đang gửi đơn" : "Đang tải giỏ hàng"}><div className="h-24 animate-pulse rounded-xl bg-sunk" /><div className="h-64 animate-pulse rounded-xl bg-sunk" /></div>;
  const { lines } = cart;
  if (lines.length === 0) return <div className="mt-5 rounded-xl bg-white p-6 text-center"><p>Giỏ hàng đang trống nên chưa đặt hàng được.</p><Link href="/danh-muc" className="mt-4 inline-flex h-11 items-center rounded-full bg-brand px-5 font-semibold text-white">Xem sản phẩm</Link></div>;
  const total = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const fee = method === "pickup" ? 0 : method === "inner" && innerFee !== null ? (freeFrom !== null && total >= freeFrom ? 0 : innerFee) : null;
  const innerNote = innerFee === null ? "Phí báo khi xác nhận" : `${formatVnd(innerFee)}${freeFrom !== null ? ` · miễn phí từ ${formatVnd(freeFrom)}` : ""}`;
  const invalidCount = Object.values(errors).filter(Boolean).length;

  function validate() {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Vui lòng nhập họ tên người nhận.";
    const digits = f.phone.replace(/\D/g, "");
    if (!/^0\d{9}$/.test(digits)) e.phone = "Số điện thoại cần 10 số, bắt đầu bằng 0.";
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
    const e = validate(); setErrors(e); setServerError("");
    if (Object.values(e).some(Boolean)) { formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(); return; }
    setSending(true);
    try {
      const res = await placeOrder({
        name: f.name, phone: f.phone, delivery: method,
        province: method === "pickup" ? undefined : f.province, ward: method === "pickup" ? undefined : f.ward,
        street: method === "pickup" ? undefined : f.street, note: f.note || undefined,
        items: lines.map((l) => ({ sku: l.sku, qty: l.quantity })),
      });
      if (!res.ok) { setServerError(res.error); setSending(false); return; }
      const order: PlacedOrder = { code: res.code, total: res.subtotal, method, lines: lines.map((l) => ({ name: l.product.name, quantity: l.quantity, price: l.product.price })) };
      try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch {}
      setPlaced(true); clearCart(); router.push("/cam-on");
    } catch {
      setServerError("Chưa gửi được đơn hàng. Vui lòng thử lại hoặc gọi shop."); setSending(false);
    }
  }
  const border = (k: string) => (errors[k] ? "border-danger" : "border-line");
  const wards = PROVINCES[f.province] ?? [];
  const summary = <>
    <ul className="mt-2 divide-y divide-line">{lines.map((l) => <li key={l.sku} className="flex gap-3 py-3">
      <Link href={`/san-pham/${l.sku}`} className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-sunk"><Image src={l.product.image} alt="" fill sizes="56px" className="object-cover" /></Link>
      <div className="min-w-0 flex-1"><Link href={`/san-pham/${l.sku}`} className="line-clamp-2 text-sm font-medium hover:text-brand">{l.product.name}</Link>{[l.product.brand, l.product.classification || l.product.sub].filter(Boolean).length > 0 && <p className="mt-1 text-xs text-ink-2">{[l.product.brand, l.product.classification || l.product.sub].filter(Boolean).join(" · ")}</p>}<p className="num mt-1 text-xs text-ink-2">× {l.quantity} · {formatVnd(l.product.price)}</p>{!l.product.stock && <p className="mt-1 text-xs font-medium text-ask">Đặt trước — shop gọi báo ngày có hàng</p>}</div>
      <b className="num whitespace-nowrap text-sm">{formatVnd(l.product.price * l.quantity)}</b>
    </li>)}</ul>
    <Link href="/gio-hang" className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-brand">Sửa giỏ hàng</Link>
    <div className="border-t border-line pt-3"><p className="flex justify-between text-sm">Tiền hàng <b className="num">{formatVnd(total)}</b></p><p className="mt-2 flex justify-between text-sm">Phí ship <span className="num text-right text-ink-2">{fee === null ? "Báo khi xác nhận đơn" : formatVnd(fee)}</span></p>{method === "inner" && fee !== 0 && freeFrom !== null && <p className="mt-1 text-xs text-ok">Miễn phí ship nội thành cho đơn từ {formatVnd(freeFrom)}</p>}<p className="mt-3 flex items-baseline justify-between text-base font-bold">Tạm tính <span className="num text-xl">{formatVnd(total + (fee ?? 0))}</span></p></div>
  </>;
  const orderButton = <><button type="submit" disabled={sending} className="h-12 w-full rounded-full bg-brand font-bold text-white hover:bg-brand-deep disabled:opacity-60">{sending ? "Đang gửi đơn…" : "Đặt hàng"}</button><p className="mt-2 text-center text-xs text-ink-2">Shop sẽ gọi xác nhận trước khi giao.</p></>;

  return <form ref={formRef} noValidate onSubmit={submit} className="mt-5 grid gap-5 pb-36 lg:grid-cols-[minmax(0,1fr)_360px] lg:pb-0">
    <section className="rounded-xl bg-white p-4 lg:hidden"><div className="flex items-baseline justify-between gap-3"><h2 className="font-bold">Đơn hàng ({lines.reduce((s, l) => s + l.quantity, 0)} món)</h2><b className="num text-sm">{formatVnd(total)}</b></div>{!summaryOpen && <><ul className="mt-2 space-y-1">{lines.slice(0, 2).map((l) => <li key={l.sku} className="text-sm text-ink-2">{l.product.name} × {l.quantity}</li>)}</ul>{lines.length > 2 && <p className="mt-1 text-xs text-ink-2">Còn {lines.length - 2} sản phẩm khác</p>}</>}<button type="button" aria-expanded={summaryOpen} onClick={() => setSummaryOpen((open) => !open)} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-brand">{summaryOpen ? "Thu gọn đơn hàng" : "Xem chi tiết đơn hàng"}</button>{summaryOpen && summary}</section>
    <div className="space-y-6 rounded-xl bg-white p-4 sm:p-6">
      <section className="space-y-4"><h2 className="text-lg font-bold">1. Người nhận</h2><Field label="Họ tên *" error={errors.name}><input value={f.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} className={`${input} ${border("name")}`} placeholder="Nguyễn Văn A" /></Field><Field label="Số điện thoại *" error={errors.phone}><input value={f.phone} onChange={set("phone")} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} className={`${input} ${border("phone")} num`} placeholder="Số điện thoại của bạn" /></Field></section>
      <fieldset className="space-y-2"><legend className="mb-2 text-lg font-bold">2. Cách nhận hàng</legend>{METHODS.map(({ id, icon: Icon, title }) => <label key={id} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-3 ${method === id ? "border-brand bg-brand-tint" : "border-line"}`}><input type="radio" name="method" checked={method === id} onChange={() => setMethod(id)} className="size-5 accent-brand" /><Icon className="size-5 text-brand" aria-hidden /><span><b className="block text-[15px]">{title}</b><span className="text-[13px] text-ink-2">{id === "pickup" ? "0₫ · 379 đường 2/4, Nha Trang" : id === "inner" ? innerNote : "SPX, GHTK · phí báo sau"}</span></span></label>)}</fieldset>
      {method !== "pickup" && <section className="space-y-4"><h2 className="text-lg font-bold">3. Địa chỉ</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="Tỉnh / Thành phố *"><select value={f.province} onChange={set("province")} className={`${input} border-line`}>{Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}</select></Field><Field label="Phường / Xã *" error={errors.ward}><select value={f.ward} onChange={set("ward")} aria-invalid={!!errors.ward} className={`${input} ${border("ward")}`}><option value="">Chọn phường / xã</option>{wards.map((w) => <option key={w}>{w}</option>)}</select></Field></div>{errors.ward?.includes("ngoài Nha Trang") && <button type="button" onClick={() => { setMethod("province"); setErrors((old) => ({ ...old, ward: "" })); }} className="min-h-10 rounded-full border border-line px-3 text-sm font-medium">Chuyển sang Gửi đi tỉnh</button>}<Field label="Số nhà, tên đường *" error={errors.street}><input value={f.street} onChange={set("street")} autoComplete="street-address" aria-invalid={!!errors.street} className={`${input} ${border("street")}`} placeholder="Ví dụ: 12 Lê Thánh Tôn" /></Field></section>}
      <Field label={<>Ghi chú <span className="font-normal text-ink-2">(không bắt buộc)</span></>}><textarea value={f.note} onChange={set("note")} rows={2} className="mt-1 w-full rounded-lg border border-line p-3 text-base outline-none focus:border-brand" placeholder="Giờ nhận hàng, chỉ đường…" /></Field>
      <fieldset className="space-y-2"><legend className="mb-2 text-lg font-bold">4. Thanh toán</legend><label className="flex min-h-14 items-center gap-3 rounded-xl border border-brand bg-brand-tint p-3"><input type="radio" name="pay" defaultChecked className="size-5 accent-brand" /><Banknote className="size-5 text-brand" aria-hidden /><b className="text-[15px]">Trả tiền mặt khi nhận hàng (COD)</b></label><label className="flex min-h-14 items-center gap-3 rounded-xl border border-line p-3 opacity-60"><input type="radio" name="pay" disabled className="size-5" /><QrCode className="size-5 text-brand" aria-hidden /><b className="flex-1 text-[15px]">Chuyển khoản VietQR</b><span className="rounded-full border border-line bg-sunk px-2 py-1 text-xs font-medium text-ink-2">Sắp có</span></label></fieldset>
    </div>
    <aside className="hidden h-fit rounded-xl bg-white p-4 sm:p-5 lg:sticky lg:top-28 lg:block"><h2 className="font-bold">Đơn hàng ({lines.reduce((s, l) => s + l.quantity, 0)} món)</h2>{summary}{serverError && <p role="alert" className="mt-3 rounded-xl bg-[#fef2f2] p-3 text-sm text-danger">{serverError}</p>}{orderButton}</aside>
    <div className={`fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-40 border-t border-line bg-surface px-4 py-3 shadow-[var(--shadow-soft)] lg:hidden ${focused ? "hidden" : ""}`}><p className="flex justify-between text-sm font-semibold">Tạm tính <b className="num text-base">{formatVnd(total + (fee ?? 0))}</b></p>{serverError && <p role="alert" className="my-2 rounded-lg bg-[#fef2f2] p-2 text-sm text-danger">{serverError}</p>}{invalidCount > 0 && <p aria-live="polite" className="mt-1 text-xs text-danger">Còn {invalidCount} ô cần sửa</p>}{orderButton}</div>
  </form>;
}
