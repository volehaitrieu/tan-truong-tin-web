import type { Metadata } from "next";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";

export const metadata: Metadata = { title: "Đặt hàng" };

export default function CheckoutPage() {
  return (
    <>
      <h1 className="text-[28px] font-extrabold">Thông tin đặt hàng</h1>
      <CheckoutForm />
    </>
  );
}
