import type { Metadata } from "next";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { CartPanel } from "@/components/storefront/CartControls";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
      <h1 className="text-[28px] font-extrabold">Giỏ hàng</h1>
      <CartPanel />
    </>
  );
}
