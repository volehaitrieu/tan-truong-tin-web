import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { PaymentList, sortForReview, type Payment } from "@/components/admin/orders/PaymentList";

export const metadata: Metadata = { title: "Giao dịch chuyển khoản" };

export default async function PaymentsPage() {
  const staff = await requireStaff("process_orders");
  const db = await createClient();
  const [{ data, error }, settings] = await Promise.all([
    db.from("sepay_transactions")
      .select("id, transaction_id, account_number, transfer_amount, transfer_type, payment_code, content, order_id, status, review_reason, created_at")
      .order("created_at", { ascending: false }).limit(100),
    getSettings(),
  ]);
  if (error) throw error;
  const rows = sortForReview((data ?? []) as Payment[]);
  const orderIds = [...new Set(rows.flatMap((r) => r.order_id === null ? [] : [r.order_id]))];
  const { data: orders } = orderIds.length ? await db.from("orders").select("id, code").in("id", orderIds) : { data: [] };
  const codes = new Map((orders ?? []).map((o) => [o.id, o.code]));
  const reviewCount = rows.filter((r) => r.status === "review").length;

  return <>
    <PageHeader title="Giao dịch chuyển khoản" sub={reviewCount ? `${reviewCount} khoản cần kiểm tra` : "Không có khoản nào cần kiểm tra"} />
    {rows.length === 0
      ? <p className="rounded-lg border border-line bg-white p-6 text-center text-sm text-ink-2">Chưa nhận được giao dịch nào.</p>
      : <PaymentList rows={rows} codes={codes} shopAccount={settings.bank?.account_no ?? null} isOwner={staff.role === "owner"} />}
  </>;
}
