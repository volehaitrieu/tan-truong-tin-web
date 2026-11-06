"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Minus, Package, Plus, Trash2 } from "lucide-react";
import { cartProducts } from "@/app/(store)/actions";
import type { Product } from "@/lib/mock/store";
import { formatVnd } from "@/lib/shop";

// Giỏ hàng lưu trong trình duyệt (chưa có backend): [{ sku, quantity }]
const KEY = "ttt-cart-v2";
const EVENT = "ttt-cart-updated";
export type CartRow = { sku: string; quantity: number };

function read(): CartRow[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartRow[];
  } catch {
    return [];
  }
}
function write(rows: CartRow[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
export function addToCart(sku: string, quantity = 1) {
  const rows = read();
  const found = rows.find((r) => r.sku === sku);
  if (found) found.quantity += quantity;
  else rows.push({ sku, quantity });
  write(rows);
}
export function clearCart() {
  write([]);
}

// Đọc giỏ, cập nhật khi trang khác thêm hàng. Trả null khi chưa đọc xong (lúc render trên máy chủ).
let cache: { raw: string | null; rows: CartRow[] } = { raw: null, rows: [] };
function snapshot() {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cache.raw) cache = { raw, rows: read() };
  return cache.rows;
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
export function useCart() {
  return useSyncExternalStore<CartRow[] | null>(subscribe, snapshot, () => null);
}
export type CartLine = CartRow & { product: Product };

// Giỏ + thông tin SP lấy từ server (giá thật trong DB). null = đang tải.
export function useCartLines(): { rows: CartRow[]; lines: CartLine[] } | null {
  const rows = useCart();
  const [products, setProducts] = useState<{ key: string; list: Product[] } | null>(null);
  const key = rows ? [...new Set(rows.map((r) => r.sku))].sort().join(",") : "";
  useEffect(() => {
    if (!key) return;
    let alive = true;
    cartProducts(key.split(",")).then((list) => alive && setProducts({ key, list }));
    return () => {
      alive = false;
    };
  }, [key]);
  if (rows === null) return null;
  if (rows.length === 0) return { rows, lines: [] };
  if (products?.key !== key) return null;
  return {
    rows,
    lines: rows.flatMap((r) => {
      const product = products.list.find((p) => p.sku === r.sku);
      return product ? [{ ...r, product }] : [];
    }),
  };
}

function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div role="status" aria-live="polite" className="buy-toast fixed bottom-[calc(env(safe-area-inset-bottom)+84px)] left-1/2 z-[70] w-[min(92vw,420px)] -translate-x-1/2 rounded-md bg-brand-deep px-4 py-3 text-sm font-medium text-white shadow-lg md:bottom-8">
      Đã thêm vào giỏ: {text}
    </div>
  );
}
function useToast() {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    if (!text) return;
    const t = window.setTimeout(() => setText(null), 2200);
    return () => window.clearTimeout(t);
  }, [text]);
  return [text, setText] as const;
}

export function AddToCartButton({ sku, name, available = true }: { sku: string; name: string; available?: boolean }) {
  const [toast, setToast] = useToast();
  return (
    <>
      <button
        type="button"
        onClick={() => {
          addToCart(sku);
          setToast(name);
        }}
        className={`mt-3 flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition duration-150 active:scale-[0.98] ${available ? "bg-brand text-white hover:bg-brand-deep" : "border border-brand bg-white text-brand hover:bg-brand-tint"}`}
      >
        {available ? "Thêm vào giỏ" : "Đặt trước"}
      </button>
      <Toast text={toast} />
    </>
  );
}

// Trang chi tiết: chọn số lượng + thêm vào giỏ. Có priceText thì thêm thanh mua dính ở đáy,
// chỉ hiện khi hàng nút gốc đã cuộn khuất phía trên (cùng số lượng với ô chọn bên trên).
export function BuyBox({ sku, name, available, priceText, unit }: { sku: string; name: string; available: boolean; priceText?: string; unit?: string }) {
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useToast();
  const actionsRef = useRef<HTMLDivElement>(null);
  const [barOn, setBarOn] = useState(false);
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || !priceText) return;
    // Hiện thanh khi hàng nút gốc đã cuộn khuất hẳn phía trên màn hình (đọc vị trí mỗi lần cuộn; nhẹ, không gây vẽ lại nếu giá trị không đổi)
    const update = () => setBarOn(el.getBoundingClientRect().bottom < 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [priceText]);
  useEffect(() => {
    if (!barOn) return;
    document.body.dataset.buybar = "1";
    return () => {
      delete document.body.dataset.buybar;
    };
  }, [barOn]);
  const add = () => {
    addToCart(sku, qty);
    setToast(`${name} × ${qty}`);
  };
  return (
    <>
      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm text-ink-2">Số lượng</span>
        <div className="flex items-center rounded-md border border-line bg-white">
          <button type="button" aria-label="Giảm số lượng" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-11 place-items-center text-ink-2 hover:text-brand">
            <Minus className="size-4" />
          </button>
          <input
            aria-label="Số lượng"
            inputMode="numeric"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(999, parseInt(e.target.value.replace(/\D/g, "")) || 1)))}
            className="num h-11 w-12 border-x border-line text-center outline-none"
          />
          <button type="button" aria-label="Tăng số lượng" onClick={() => setQty((q) => Math.min(999, q + 1))} className="grid size-11 place-items-center text-ink-2 hover:text-brand">
            <Plus className="size-4" />
          </button>
        </div>
      </div>
      <div ref={actionsRef} className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={add}
          className={`flex h-12 flex-1 items-center justify-center rounded-full px-5 font-bold transition duration-150 active:scale-[0.98] sm:flex-none ${available ? "bg-brand text-white hover:bg-brand-deep" : "border border-brand bg-white text-brand"}`}
        >
          {available ? "Thêm vào giỏ" : "Đặt trước"}
        </button>
        <a href="https://zalo.me/0948732064" className="flex h-12 items-center rounded-full border border-brand bg-white px-5 font-semibold text-brand hover:bg-brand-tint">
          Chat Zalo
        </a>
      </div>
      {priceText && (
        <div inert={!barOn} aria-hidden={!barOn} className={`fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[45] flex items-center gap-3 border-t border-line bg-surface px-5 py-2.5 transition-[transform,visibility] duration-200 md:bottom-0 ${barOn ? "visible translate-y-0" : "invisible translate-y-full"}`}>
          <div className="min-w-0 flex-1">
            <b className="num block truncate text-xl font-extrabold leading-tight">{priceText}</b>
            <span className="block text-xs text-ink-2">{available ? "Còn hàng" : "Liên hệ"}{unit ? ` · / ${unit.toLowerCase()}` : ""}</span>
          </div>
          <button type="button" onClick={add} className={`flex h-12 shrink-0 items-center justify-center rounded-full px-7 font-bold transition duration-150 active:scale-[0.98] ${available ? "bg-brand text-white hover:bg-brand-deep" : "border-2 border-brand bg-surface text-brand hover:bg-brand-tint"}`}>
            {available ? "Thêm vào giỏ" : "Đặt trước"}{qty > 1 && <span className="num ml-1.5 font-semibold">× {qty}</span>}
          </button>
        </div>
      )}
      <Toast text={toast} />
    </>
  );
}

export function CartCount() {
  const rows = useCart();
  const count = rows?.reduce((sum, r) => sum + r.quantity, 0) ?? 0;
  return count > 0 ? (
    <span className="num absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-bold text-white">{count}</span>
  ) : null;
}

export function CartPanel() {
  const cart = useCartLines();
  if (cart === null) return <p className="mt-5 rounded-md bg-white p-5 text-sm text-ink-2">Đang tải giỏ hàng…</p>;
  const { rows, lines } = cart;
  const total = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
  const setQty = (sku: string, q: number) => write(q <= 0 ? rows.filter((r) => r.sku !== sku) : rows.map((r) => (r.sku === sku ? { ...r, quantity: q } : r)));

  if (lines.length === 0)
    return (
      <div className="mt-5 rounded-md bg-white px-5 py-12 text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand-tint text-brand">
          <Package className="size-10" />
        </span>
        <h2 className="mt-4 text-xl font-bold">Giỏ hàng của bạn đang trống</h2>
        <p className="mt-2 text-sm text-ink-2">Chọn vài món cần mua rồi quay lại đây để đặt hàng.</p>
        <Link href="/danh-muc" className="mt-5 inline-flex h-11 items-center rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-deep">
          Xem sản phẩm
        </Link>
      </div>
    );

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-line rounded-md bg-white">
        {lines.map(({ sku, quantity, product: p }) => (
          <li key={sku} className="flex gap-3 p-4">
            <Link href={`/san-pham/${sku}`} className="relative size-20 shrink-0 overflow-hidden rounded bg-sunk">
              <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/san-pham/${sku}`} className="line-clamp-2 text-sm font-semibold hover:text-brand">{p.name}</Link>
              <p className="num mt-1 font-bold text-ink">{formatVnd(p.price)} <span className="text-xs font-normal text-ink-2">/ {p.unit.toLowerCase()}</span></p>
              {!p.stock && <p className="mt-1 text-xs text-ask">Liên hệ · shop sẽ gọi báo thời gian có hàng</p>}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center rounded-md border border-line">
                  <button onClick={() => setQty(sku, quantity - 1)} className="grid size-11 place-items-center" aria-label="Giảm số lượng"><Minus className="size-4" /></button>
                  <span className="num w-8 text-center">{quantity}</span>
                  <button onClick={() => setQty(sku, quantity + 1)} className="grid size-11 place-items-center" aria-label="Tăng số lượng"><Plus className="size-4" /></button>
                </div>
                <button onClick={() => setQty(sku, 0)} className="ml-auto inline-flex min-h-11 items-center gap-1 px-2 text-sm text-ink-2 hover:text-danger">
                  <Trash2 className="size-4" />Xóa
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-md bg-white p-4 lg:sticky lg:top-28">
        <h2 className="font-bold">Tóm tắt đơn hàng</h2>
        <p className="mt-4 flex justify-between text-sm">Tiền hàng <b className="num">{formatVnd(total)}</b></p>
        <p className="mt-2 text-xs text-ink-2">Phí ship tính ở bước sau</p>
        <Link href="/thanh-toan" className="mt-5 flex h-12 items-center justify-center rounded-md bg-brand font-bold text-white hover:bg-brand-deep">Đặt hàng</Link>
        <Link href="/danh-muc" className="mt-2 flex h-11 items-center justify-center text-sm font-semibold text-brand">Mua thêm</Link>
      </aside>
    </div>
  );
}
