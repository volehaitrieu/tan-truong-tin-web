import type { Metadata } from "next";
import { CustomerAuth } from "@/components/storefront/CustomerAuth";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function CustomerLoginPage({ searchParams }: { searchParams: Promise<{ loi?: string }> }) {
  return <CustomerAuth mode="login" oauthError={(await searchParams).loi} />;
}
