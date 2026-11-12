"use client";
import { useState, useTransition } from "react";
import { ignoreReview } from "@/app/admin/(shell)/giao-dich/actions";

// Bỏ qua tiền vào không phải của đơn hàng (ví dụ chuyển khoản cá nhân). Không đổi đơn, tiền hay tồn kho.
export function IgnoreReview({ transactionId }: { transactionId: number }) {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  if (!confirm) return <div className="mt-2">
    <button type="button" onClick={() => { setConfirm(true); setError(""); }} className="min-h-11 rounded border border-line px-4 text-sm font-semibold text-ink-2 hover:border-brand hover:text-brand">Bỏ qua — không phải tiền đơn hàng</button>
  </div>;
  return <div className="mt-2 space-y-2 rounded-lg border border-line bg-ground p-3">
    <p className="text-sm">Chỉ bỏ qua khi chắc khoản này không thuộc đơn nào. Giao dịch sẽ chuyển sang “Đã bỏ qua” và không gắn được vào đơn nữa.</p>
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={pending} onClick={() => start(async () => { const r = await ignoreReview(transactionId); if (r.ok) setConfirm(false); else setError(r.error ?? "Không thực hiện được."); })} className="min-h-11 rounded bg-brand px-4 font-semibold text-white disabled:opacity-50">{pending ? "Đang lưu…" : "Xác nhận bỏ qua"}</button>
      <button type="button" disabled={pending} onClick={() => setConfirm(false)} className="min-h-11 rounded border border-line px-4">Hủy</button>
    </div>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
  </div>;
}
