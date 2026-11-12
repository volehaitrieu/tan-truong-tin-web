"use client";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { TurnstileWidget, useCaptcha } from "@/components/TurnstileWidget";
import { changeCustomerPassword, saveProfile, type AuthResult, type Field } from "@/app/(store)/tai-khoan/actions";

const input = (bad: boolean) => `mt-1 h-12 w-full rounded-xl border bg-white px-3 text-[15px] ${bad ? "border-danger" : "border-line"}`;

function Row({ label, name, error, children }: { label: string; name: Field; error?: string; children?: ReactNode }) {
  return <label className="block text-sm font-medium" htmlFor={`f-${name}`}>{label}{children}
    {error && <span role="alert" className="mt-1 block text-sm text-danger">{error}</span>}
  </label>;
}

// Sửa họ tên, email; cũng dùng để hoàn tất hồ sơ khi đăng ký bị gián đoạn
export function ProfileForm({ name, email, complete }: { name: string; email: string; complete?: boolean }) {
  const [state, action, pending] = useActionState<AuthResult, FormData>(saveProfile, {});
  const f = state.fields ?? {};
  return <form action={action} noValidate className="space-y-3">
    <Row label="Họ tên" name="name" error={f.name}><input id="f-name" name="name" defaultValue={name} maxLength={80} autoComplete="name" className={input(!!f.name)} /></Row>
    <Row label="Email (không bắt buộc)" name="email" error={f.email}><input id="f-email" name="email" type="email" defaultValue={email} maxLength={120} autoComplete="email" className={input(!!f.email)} /></Row>
    {state.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
    {state.ok && <p role="status" className="text-sm text-ok">Đã lưu thông tin.</p>}
    <button disabled={pending} className="h-11 rounded-xl bg-brand px-5 font-semibold text-white hover:bg-brand-deep disabled:opacity-60">{pending ? "Đang lưu…" : complete ? "Hoàn tất hồ sơ" : "Lưu thông tin"}</button>
  </form>;
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(changeCustomerPassword, {});
  const captcha = useCaptcha();
  const { renew } = captcha;
  // Mỗi mã xác minh chỉ dùng 1 lần → lấy mã mới sau mỗi lần gửi (bỏ qua lần đầu hiển thị)
  const initial = useRef(state);
  useEffect(() => { if (state !== initial.current) renew(); }, [state, renew]);
  const f = state.fields ?? {};
  return <form action={action} noValidate className="space-y-3">
    <Row label="Mật khẩu hiện tại" name="current" error={f.current}><input id="f-current" name="current" type="password" autoComplete="current-password" className={input(!!f.current)} /></Row>
    <Row label="Mật khẩu mới" name="password" error={f.password}><input id="f-password" name="password" type="password" autoComplete="new-password" className={input(!!f.password)} /></Row>
    <Row label="Nhập lại mật khẩu mới" name="password2" error={f.password2}><input id="f-password2" name="password2" type="password" autoComplete="new-password" className={input(!!f.password2)} /></Row>
    {captcha.enabled && <TurnstileWidget key={captcha.round} onStatus={captcha.setStatus} />}
    {state.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
    {state.ok && <p role="status" className="text-sm text-ok">Đã đổi mật khẩu.</p>}
    <button disabled={pending || captcha.waiting} className="h-11 rounded-xl border border-brand px-5 font-semibold text-brand hover:bg-brand-tint disabled:opacity-60">{captcha.waiting ? "Đang xác minh…" : pending ? "Đang đổi…" : "Đổi mật khẩu"}</button>
  </form>;
}
