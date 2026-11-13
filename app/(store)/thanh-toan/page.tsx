import type { Metadata } from "next";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { getSettings } from "@/lib/settings";
import { getCustomerSession } from "@/lib/customer";
import { ORDERING_PAUSED, ORDERING_PAUSED_MESSAGE } from "@/lib/shop";

export const metadata: Metadata = { title: "Đặt hàng" };

export default async function CheckoutPage() {
  if (ORDERING_PAUSED) {
    return (
      <>
        <div hidden data-theme-v2 />
        <h1 className="text-[28px] font-extrabold">Thông tin đặt hàng</h1>
        <section role="status" className="mt-5 max-w-xl rounded-xl bg-white p-5">
          <p className="text-[15px] leading-6">{ORDERING_PAUSED_MESSAGE}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="tel:0948732064" className="inline-flex h-12 items-center rounded-xl bg-brand px-5 font-semibold text-white hover:bg-brand-deep">Gọi 0948 732 064</a>
            <a href="https://zalo.me/0948732064" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-xl border border-brand px-5 font-semibold text-brand hover:bg-brand-tint">Nhắn Zalo</a>
          </div>
        </section>
      </>
    );
  }
  const [st, session] = await Promise.all([getSettings(), getCustomerSession()]);
  const c = session.kind === "customer" ? session.customer : null;
  const prefill = c ? { name: c.full_name, phone: c.phone, province: c.province, ward: c.ward, street: c.street } : undefined;
  return (
    <>
      {/* Đã áp bảng màu mới (cờ data-theme-v2, xem globals.css) */}
      <div hidden data-theme-v2 />
      <h1 className="text-[28px] font-extrabold">Thông tin đặt hàng</h1>
      <CheckoutForm innerFee={st.inner_ship_fee} freeFrom={st.free_ship_threshold} bankReady={!!st.bank} shippingPolicy={st.shop.shipping_policy} prefill={prefill} />
    </>
  );
}
