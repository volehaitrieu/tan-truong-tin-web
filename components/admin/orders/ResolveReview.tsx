"use client";
import { useState, useTransition } from "react";
import { resolveReview } from "@/app/admin/(shell)/giao-dich/actions";

export function ResolveReview({ transactionId }: { transactionId: number }) {
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return <div className="mt-3 rounded-lg border border-line bg-ground p-3">
    <label className="block text-sm font-medium">Gắn giao dịch vào mã đơn đã đối chiếu
      <input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setConfirm(false); setError(""); }} maxLength={9} placeholder="TTT001234" className="num mt-1 h-11 w-full rounded border border-line bg-white px-3 text-base uppercase" />
    </label>
    {!confirm ? <button type="button" disabled={!/^TTT\d{6}$/.test(code)} onClick={() => setConfirm(true)} className="mt-2 min-h-11 rounded border border-brand px-4 font-semibold text-brand disabled:opacity-50">Tiếp tục đối chiếu</button>
      : <div className="mt-2 space-y-2"><p className="text-sm">Chỉ xác nhận khi đã đối chiếu tài khoản nhận, số tiền và chứng từ với đơn <b className="num">{code}</b>. Hệ thống sẽ kiểm tra lại trước khi ghi nhận.</p><div className="flex gap-2"><button type="button" disabled={pending} onClick={() => start(async () => { const result = await resolveReview(transactionId, code); setError(result.ok ? "" : result.error ?? "Không thực hiện được."); if (result.ok) setConfirm(false); })} className="min-h-11 rounded bg-brand px-4 font-semibold text-white disabled:opacity-50">{pending ? "Đang đối chiếu…" : "Xác nhận đã đối chiếu"}</button><button type="button" disabled={pending} onClick={() => setConfirm(false)} className="min-h-11 rounded border border-line px-4">Hủy</button></div></div>}
    {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
  </div>;
}
