import Link from "next/link";
import { formatVnd } from "@/lib/shop";
import { ReviewActions } from "@/components/admin/orders/ReviewActions";

export type Payment = {
  id: number; transaction_id: string; account_number: string; transfer_amount: number;
  transfer_type: string; payment_code: string | null; content: string | null; order_id: number | null;
  status: "matched" | "review" | "ignored"; review_reason: string | null; created_at: string;
};

const STATUS = {
  review: { label: "Cần kiểm tra", cls: "bg-[#fff4d6] text-gold-ink" },
  matched: { label: "Đã khớp đơn", cls: "bg-brand-tint text-ok" },
  ignored: { label: "Đã bỏ qua", cls: "bg-sunk text-ink-2" },
} as const;

const time = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short" });

// Khoản cần kiểm tra lên đầu, còn lại giữ thứ tự mới nhất trước.
export function sortForReview(rows: Payment[]) {
  return [...rows].sort((a, b) => Number(b.status === "review") - Number(a.status === "review"));
}

export function PaymentList({ rows, codes, shopAccount, isOwner }: { rows: Payment[]; codes: Map<number, string>; shopAccount: string | null; isOwner: boolean }) {
  return <ul className="space-y-3">
    {rows.map((row) => {
      const s = STATUS[row.status];
      const code = row.order_id === null ? undefined : codes.get(row.order_id);
      const otherAccount = shopAccount !== null && row.account_number !== shopAccount;
      return <li key={row.id} className="rounded-lg border border-line bg-white p-4 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="num text-lg font-bold">{row.transfer_type === "in" ? "+" : "−"}{formatVnd(row.transfer_amount)}</p>
            <time className="text-xs text-ink-2" dateTime={row.created_at}>{time.format(new Date(row.created_at))}</time>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>
        </div>
        <p className="mt-2 break-words text-ink">{row.content || "(Không có nội dung)"}</p>
        {row.status === "matched" && code && <p className="mt-1">Đơn: <Link className="num font-semibold text-brand underline" href={`/admin/don-hang/${code}`}>{code}</Link></p>}
        {otherAccount && <p role="alert" className="mt-2 text-sm font-semibold text-danger">Tiền vào tài khoản khác tài khoản nhận của shop.</p>}
        {row.status === "review" && row.review_reason && <p className="mt-2 text-gold-ink">{row.review_reason}</p>}
        {isOwner && row.status === "review" && row.transfer_type === "in" && <div className="mt-3"><ReviewActions transactionId={row.id} canIgnore={row.order_id === null} /></div>}
        <details className="mt-2 text-xs text-ink-2">
          <summary className="inline-flex min-h-11 cursor-pointer items-center">Chi tiết</summary>
          <p className="break-all">Mã giao dịch SePay: {row.transaction_id}</p>
          <p className="break-all">Tài khoản nhận: {row.account_number}</p>
        </details>
      </li>;
    })}
  </ul>;
}
