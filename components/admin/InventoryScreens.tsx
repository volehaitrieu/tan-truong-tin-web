"use client";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Badge } from "@/components/admin/ui";
import { formatVnd } from "@/lib/shop";
import { adjustStock } from "@/app/admin/(shell)/ton-kho/actions";
import type { MovementRow, StockRow } from "@/lib/admin/inventory";

// Tồn kho: dữ liệu thật truyền từ trang (server). Khuyến mãi: còn dữ liệu mẫu.
const REASONS = ["Nhập hàng", "Hư hỏng", "Thất lạc", "Trả hàng", "Kiểm kho", "Khác"];

const btn = "inline-flex h-10 items-center justify-center gap-2 rounded px-4 text-sm font-semibold";
const level = (s: number, m: number) =>
  s === 0 ? <Badge tone="danger">Hết hàng</Badge> : s <= m ? <Badge tone="warn">Sắp hết</Badge> : <Badge tone="ok">Đủ hàng</Badge>;

export function StockScreen({ rows, history, canAdjust }: { rows: StockRow[]; history: MovementRow[]; canAdjust: boolean }) {
  const [tab, setTab] = useState<"ton" | "lich-su">("ton");
  const [editing, setEditing] = useState<StockRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState(REASONS[0]);
  const open = (row: StockRow) => {
    setEditing(row);
    setDelta(0);
    setError("");
    setNote("");
    setReason(REASONS[0]);
  };

  return (
    <>
      <div className="mb-3 flex gap-2" role="tablist">
        {([["ton", "Tồn kho"], ["lich-su", "Lịch sử thay đổi"]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`${btn} min-h-11 border ${tab === id ? "border-brand bg-brand-tint text-brand" : "border-line bg-white text-ink"}`}>
            {label}
          </button>
        ))}
      </div>
      {!canAdjust && <p className="mb-3 text-sm text-ink-2">Bạn chỉ có quyền xem.</p>}

      {tab === "ton" ? (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <table className="hidden w-full text-sm md:table">
            <thead className="bg-ground text-left text-xs text-ink-2">
              <tr>{["Sản phẩm", "Danh mục", "Tồn hiện có", "Tồn tối thiểu", "Trạng thái", ""].map((x) => <th key={x} className="px-3 py-3 font-semibold">{x}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.sku} className="h-14 border-t border-line">
                  <td className="px-3"><b>{p.name}</b><small className="block text-ink-2">{p.sku}</small></td>
                  <td className="px-3">{p.cat}</td>
                  <td className="num px-3 font-semibold">{p.stock} {p.unit}</td>
                  <td className="num px-3">{p.min}</td>
                  <td className="px-3">{level(p.stock, p.min)}</td>
                  <td className="px-3 text-right">
                    <button disabled={!canAdjust} onClick={() => open(p)} className={`${btn} border border-brand text-brand hover:bg-brand-tint disabled:opacity-40`}>Điều chỉnh</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="divide-y divide-line md:hidden">
            {rows.map((p) => (
              <li key={p.sku} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <b className="block text-sm">{p.name}</b>
                  <span className="text-xs text-ink-2">{p.sku}</span>
                  <p className="mt-1 flex items-center gap-2 text-sm"><span className="num font-semibold">{p.stock} {p.unit}</span><span className="text-xs text-ink-2">/ tối thiểu {p.min}</span>{level(p.stock, p.min)}</p>
                </div>
                <button disabled={!canAdjust} onClick={() => open(p)} className={`${btn} min-h-11 border border-brand px-3 text-brand disabled:opacity-40`}>Điều chỉnh</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-white">
          {history.map(({ id, when, who, what, delta: d, why }) => (
            <li key={id} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-3 text-sm">
              <span className="num w-24 text-ink-2">{when}</span>
              <span className="min-w-0 flex-1 font-medium">{what}</span>
              <b className={`num ${d > 0 ? "text-ok" : "text-danger"}`}>{d > 0 ? `+${d}` : d}</b>
              <span className="text-ink-2">{why} · {who}</span>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Điều chỉnh tồn kho">
          <button aria-label="Đóng" onClick={() => setEditing(null)} className="absolute inset-0 bg-ink/40" />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-xl md:inset-y-0 md:left-auto md:right-0 md:w-[400px] md:rounded-none">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-lg font-semibold">Điều chỉnh tồn kho</h2><p className="text-sm text-ink-2">{editing.name}</p></div>
              <button onClick={() => setEditing(null)} aria-label="Đóng" className="grid size-11 place-items-center"><X className="size-5" /></button>
            </div>
            <p className="mt-4 text-sm">Hiện có: <b className="num">{editing.stock} {editing.unit}</b></p>
            <div className="mt-3 flex items-center gap-3">
              <button aria-label="Giảm" onClick={() => setDelta((d) => Math.max(-editing.stock, d - 1))} className="grid size-11 place-items-center rounded border border-line"><Minus className="size-4" /></button>
              <input aria-label="Số lượng điều chỉnh" inputMode="numeric" value={delta} onChange={(e) => { const n = parseInt(e.target.value.replace(/[^0-9-]/g, "")) || 0; setDelta(Math.max(-editing.stock, Math.min(100000, n))); }} className={`num h-11 w-20 rounded border border-line text-center text-xl font-bold ${delta < 0 ? "text-danger" : delta > 0 ? "text-ok" : ""}`} />
              <button aria-label="Tăng" onClick={() => setDelta((d) => d + 1)} className="grid size-11 place-items-center rounded border border-line"><Plus className="size-4" /></button>
            </div>
            <p className="mt-2 text-sm">Sau điều chỉnh: <b className="num">{editing.stock + delta} {editing.unit}</b></p>
            <label className="mt-4 block text-sm font-medium">Lý do
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-white px-3">
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <label className="mt-3 block text-sm font-medium">Ghi chú
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} className="mt-1 w-full rounded border border-line p-3" placeholder="Ví dụ: nhập lô mới từ nhà phân phối" />
            </label>
            {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
            <button
              disabled={delta === 0 || saving}
              onClick={async () => {
                setSaving(true);
                const r = await adjustStock(editing.id, delta, reason, note);
                setSaving(false);
                if (r.ok) setEditing(null);
                else setError(r.error ?? "Không lưu được.");
              }}
              className={`${btn} mt-5 h-12 w-full bg-brand text-white hover:bg-brand-deep disabled:opacity-40`}
            >
              {saving ? "Đang lưu…" : "Lưu điều chỉnh"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Khuyến mãi: giá KM theo sản phẩm + mã giảm giá
const PROMOS = [
  { name: "Quạt treo tường Hali TR2 (Ghi xám)", old: 480000, price: 430000, from: "22/10", to: "31/10", state: "Đang chạy", on: true },
  { name: "Bình đun siêu tốc Midea 1.8L", old: 420000, price: 390000, from: "20/10", to: "05/11", state: "Đang chạy", on: true },
  { name: "Bóng LED Rạng Đông 9W", old: 35000, price: 30000, from: "01/11", to: "15/11", state: "Sắp tới", on: true },
  { name: "Máy khoan Bosch GSB 550", old: 1250000, price: 1150000, from: "01/10", to: "15/10", state: "Đã hết", on: false },
];
const CODES = [
  { code: "KHAITRUONG", kind: "10%", min: 500000, used: "12 / 100", until: "30/11", state: "Đang chạy" },
  { code: "GIAM50K", kind: "50.000₫", min: 1000000, used: "3 / 50", until: "31/10", state: "Đang chạy" },
];
const stateTone = (s: string) => (s === "Đang chạy" ? "ok" : s === "Sắp tới" ? "info" : "neutral");

export function PromoScreen() {
  const [tab, setTab] = useState<"gia" | "ma">("gia");
  return (
    <>
      <div className="mb-4 flex gap-2" role="tablist">
        {([["gia", "Giá KM theo sản phẩm"], ["ma", "Mã giảm giá"]] as const).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`${btn} min-h-11 border ${tab === id ? "border-brand bg-brand-tint text-brand" : "border-line bg-white"}`}>{label}</button>
        ))}
      </div>
      {tab === "gia" ? (
        <ul className="divide-y divide-line rounded-lg border border-line bg-white">
          {PROMOS.map((p) => (
            <li key={p.name} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 md:flex-nowrap">
              <div className="min-w-0 flex-1 basis-full md:basis-auto">
                <b className="text-sm">{p.name}</b>
                <p className="mt-0.5 text-xs text-ink-2">{p.from} – {p.to}/2026</p>
              </div>
              <span className="text-sm"><del className="num text-ink-2">{formatVnd(p.old)}</del> <b className="num text-danger">{formatVnd(p.price)}</b></span>
              <Badge tone="danger">-{Math.round((1 - p.price / p.old) * 100)}%</Badge>
              <Badge tone={stateTone(p.state)}>{p.state}</Badge>
              <label className="ml-auto flex min-h-11 items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked={p.on} className="size-5" aria-label={`Bật khuyến mãi ${p.name}`} />Bật
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-white">
          {CODES.map((c) => (
            <li key={c.code} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-3 text-sm">
              <b className="num rounded bg-gold-tint px-2 py-1 text-gold-ink">{c.code}</b>
              <span>Giảm {c.kind}</span>
              <span className="text-ink-2">Đơn từ {formatVnd(c.min)}</span>
              <span className="text-ink-2">Đã dùng {c.used}</span>
              <span className="text-ink-2">Hạn {c.until}</span>
              <span className="ml-auto"><Badge tone={stateTone(c.state)}>{c.state}</Badge></span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
