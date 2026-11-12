"use client";
import { useState } from "react";
import { ResolveReview } from "@/components/admin/orders/ResolveReview";
import { IgnoreReview } from "@/components/admin/orders/IgnoreReview";

// Hai thao tác cho khoản "Cần kiểm tra": gắn vào đơn (gõ mã) hoặc bỏ qua (chỉ khi chưa gắn đơn).
export function ReviewActions({ transactionId, canIgnore }: { transactionId: number; canIgnore: boolean }) {
  const [mode, setMode] = useState<"link" | "ignore" | null>(null);
  if (mode === "link") return <div><ResolveReview transactionId={transactionId} /><button type="button" onClick={() => setMode(null)} className="mt-1 min-h-11 text-sm font-semibold text-ink-2 hover:text-brand">Đóng</button></div>;
  if (mode === "ignore") return <IgnoreReview transactionId={transactionId} onCancel={() => setMode(null)} />;
  return <div className="flex flex-wrap gap-2">
    <button type="button" onClick={() => setMode("link")} className="min-h-11 rounded bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-deep">Gắn vào đơn</button>
    {canIgnore && <button type="button" onClick={() => setMode("ignore")} className="min-h-11 rounded border border-line px-4 text-sm font-semibold text-ink-2 hover:border-brand hover:text-brand">Bỏ qua</button>}
  </div>;
}
