"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Chỉ giao diện: chưa nối đăng nhập thật (Task 1.4). Mật khẩu "sai" để xem trạng thái lỗi.
export function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const id = String(data.get("id") ?? "").trim();
    const pw = String(data.get("password") ?? "");
    if (!id || !pw) return setError("Nhập số điện thoại/email và mật khẩu.");
    if (pw === "sai") return setError("Sai số điện thoại/email hoặc mật khẩu.");
    router.push("/admin");
  }

  const field =
    "h-12 w-full rounded-[var(--radius-ctl)] border bg-surface px-3 text-[15px] placeholder:text-ink-2/60 focus:border-brand";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Số điện thoại hoặc email</span>
        <input name="id" autoComplete="username" placeholder="0948 732 064" className={`${field} border-line`} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Mật khẩu</span>
        <span className="relative block">
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
            className={`${field} pr-12 ${error ? "border-danger" : "border-line"}`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-1 top-1 grid size-10 place-items-center rounded-[var(--radius-ctl)] text-ink-2 hover:bg-sunk"
          >
            {show ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
          </button>
        </span>
        {error && (
          <span id="login-error" role="alert" className="mt-1.5 block text-sm text-danger">
            {error}
          </span>
        )}
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" name="remember" className="size-4 accent-brand" defaultChecked /> Ghi nhớ đăng nhập
      </label>
      <button type="submit" className="h-12 w-full rounded-[var(--radius-ctl)] bg-brand text-[15px] font-semibold text-white transition-colors hover:bg-brand-deep">
        Đăng nhập
      </button>
      <p className="text-center text-sm text-ink-2">Quên mật khẩu? Liên hệ chủ shop</p>
    </form>
  );
}
