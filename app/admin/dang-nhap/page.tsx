import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/brand/Logo";
import { SHOP } from "@/lib/shop";

export const metadata: Metadata = { title: "Đăng nhập quản trị" };

// ?het-phien=1: proxy.ts vừa tự đăng xuất vì bỏ không dùng quá 7 ngày
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ "het-phien"?: string }> }) {
  const expired = (await searchParams)["het-phien"] === "1";
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ground px-4 py-10">
      <div className="w-full max-w-[420px] md:rounded-[var(--radius-card)] md:border md:border-line md:bg-surface md:p-8">
        <div className="mb-6 flex justify-center">
          <Logo size={48} subtitle="Điện nước • Kim khí • Gia dụng" />
        </div>
        <h1 className="mb-1 text-center text-xl font-bold">Đăng nhập quản trị</h1>
        <p className="mb-6 text-center text-sm text-ink-2">Dành cho chủ shop và nhân viên</p>
        {expired && (
          <p role="status" className="mb-4 rounded-[var(--radius-ctl)] border border-line bg-sunk px-3 py-2.5 text-sm">
            Phiên đăng nhập đã hết hạn vì lâu không dùng. Vui lòng đăng nhập lại.
          </p>
        )}
        <LoginForm />
        <p className="mt-6 text-center text-xs text-ink-2">
          {SHOP.addressShort} • {SHOP.phone}
        </p>
      </div>
    </main>
  );
}
