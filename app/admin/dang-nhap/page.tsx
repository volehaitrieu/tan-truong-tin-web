import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/brand/Logo";
import { SHOP } from "@/lib/shop";

export const metadata: Metadata = { title: "Đăng nhập quản trị" };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ground px-4 py-10">
      <div className="w-full max-w-[420px] md:rounded-[var(--radius-card)] md:border md:border-line md:bg-surface md:p-8">
        <div className="mb-6 flex justify-center">
          <Logo size={48} subtitle="Điện nước • Kim khí • Gia dụng" />
        </div>
        <h1 className="mb-1 text-center text-xl font-bold">Đăng nhập quản trị</h1>
        <p className="mb-6 text-center text-sm text-ink-2">Dành cho chủ shop và nhân viên</p>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-ink-2">
          {SHOP.addressShort} • {SHOP.phone}
        </p>
      </div>
    </main>
  );
}
