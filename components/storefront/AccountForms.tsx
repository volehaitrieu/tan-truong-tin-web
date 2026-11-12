"use client";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { PROVINCES } from "@/lib/mock/address";
import { TurnstileWidget, useCaptcha } from "@/components/TurnstileWidget";
import { changeCustomerPassword, saveAddress, saveProfile, type AuthResult, type Field } from "@/app/(store)/tai-khoan/actions";

const input = (bad: boolean) => `mt-1 h-12 w-full rounded-xl border bg-white px-3 text-[15px] ${bad ? "border-danger" : "border-line"}`;

function Row({ label, name, error, children }: { label: string; name: Field; error?: string; children?: ReactNode }) {
  return <label className="block text-sm font-medium" htmlFor={`f-${name}`}>{label}{children}
    {error && <span role="alert" className="mt-1 block text-sm text-danger">{error}</span>}
  </label>;
}

// Sửa họ tên, email; cũng dùng để hoàn tất hồ sơ khi đăng ký bị gián đoạn
export function ProfileForm({ name, email, complete, needPhone }: { name: string; email: string; complete?: boolean; needPhone?: boolean }) {
  const [state, action, pending] = useActionState<AuthResult, FormData>(saveProfile, {});
  const f = state.fields ?? {};
  return <form action={action} noValidate className="space-y-3">
    <Row label="Họ tên" name="name" error={f.name}><input id="f-name" name="name" defaultValue={name} maxLength={80} autoComplete="name" className={input(!!f.name)} /></Row>
    {needPhone && <Row label="Số điện thoại" name="phone" error={f.phone}><input id="f-phone" name="phone" type="tel" inputMode="tel" maxLength={20} autoComplete="tel" className={input(!!f.phone)} /></Row>}
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

// Địa chỉ nhận hàng: cùng danh sách Tỉnh/Phường với trang thanh toán để tự điền khớp
export function AddressForm({ province, ward, street }: { province: string; ward: string; street: string }) {
  const [state, action, pending] = useActionState<AuthResult, FormData>(saveAddress, {});
  const [p, setP] = useState(PROVINCES[province] ? province : "Khánh Hòa");
  const wards = PROVINCES[p] ?? [];
  const sel = "mt-1 h-12 w-full rounded-xl border border-line bg-white px-3 text-[15px]";
  return <form action={action} className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm font-medium">Tỉnh / Thành phố
        <select name="province" value={p} onChange={(e) => setP(e.target.value)} className={sel}>{Object.keys(PROVINCES).map((x) => <option key={x}>{x}</option>)}</select>
      </label>
      <label className="block text-sm font-medium">Phường / Xã
        <select key={p} name="ward" defaultValue={wards.includes(ward) ? ward : ""} className={sel}><option value="">Chọn phường / xã</option>{wards.map((w) => <option key={w}>{w}</option>)}</select>
      </label>
    </div>
    <label className="block text-sm font-medium">Số nhà, tên đường
      <input name="street" defaultValue={street} maxLength={200} autoComplete="street-address" placeholder="Ví dụ: 12 Lê Thánh Tôn" className={sel} />
    </label>
    {state.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
    {state.ok && <p role="status" className="text-sm text-ok">Đã lưu địa chỉ.</p>}
    <button disabled={pending} className="h-11 rounded-xl border border-brand px-5 font-semibold text-brand hover:bg-brand-tint disabled:opacity-60">{pending ? "Đang lưu…" : "Lưu địa chỉ"}</button>
  </form>;
}
