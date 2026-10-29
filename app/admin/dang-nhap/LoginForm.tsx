"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TurnstileWidget, useCaptcha } from "@/components/TurnstileWidget";
import { login, type LoginState } from "./actions";

// Đăng nhập thật qua Supabase Auth (server action). Nhân viên gõ SĐT hoặc email.
// Có ô xác minh Cloudflare (khi đã cấu hình): nút Đăng nhập mở khi ô hiện dấu ✓.
export function LoginForm() {
  const [show, setShow] = useState(false);
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const captcha = useCaptcha();
  const error = state.error ?? "";

  const field =
    "h-12 w-full rounded-[var(--radius-ctl)] border bg-surface px-3 text-[15px] placeholder:text-ink-2/60 focus:border-brand";

  return (
    <form action={(fd) => { captcha.renew(); action(fd); }} noValidate className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Số điện thoại hoặc email</span>
        <input name="id" key={state.id} defaultValue={state.id} maxLength={200} autoComplete="username" placeholder="Số điện thoại của bạn" className={`${field} border-line`} />
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
      {captcha.enabled && <TurnstileWidget key={captcha.round} onStatus={captcha.setStatus} />}
      <button type="submit" disabled={pending || captcha.waiting} className="h-12 w-full rounded-[var(--radius-ctl)] bg-brand text-[15px] font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60">
        {pending ? "Đang đăng nhập…" : captcha.waiting ? "Đang xác minh…" : "Đăng nhập"}
      </button>
      <p className="text-center text-sm text-ink-2">Quên mật khẩu? Liên hệ chủ shop</p>
    </form>
  );
}
