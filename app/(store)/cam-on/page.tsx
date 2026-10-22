import type { Metadata } from "next";
import { ThankYou } from "@/components/storefront/ThankYou";

export const metadata: Metadata = { title: "Đặt hàng thành công" };

export default function ThankYouPage() {
  return <ThankYou />;
}
