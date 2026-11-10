import type { Metadata } from "next";
import { PendingPayment } from "@/components/storefront/PendingPayment";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Chờ thanh toán" };

export default async function PendingPaymentPage() {
  const settings = await getSettings();
  return <div className="mx-auto max-w-2xl"><div hidden data-theme-v2 /><PendingPayment bank={settings.bank} /></div>;
}
