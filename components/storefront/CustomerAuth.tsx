"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState, useTransition, type ReactNode } from "react";
import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Phone, UserRound } from "lucide-react";
import { TurnstileWidget, useCaptcha } from "@/components/TurnstileWidget";
import { bounceField, rippleAt, shakeField } from "@/lib/ui-effects";
import { SHOP } from "@/lib/shop";
import { passwordProblem } from "@/lib/password-rule";
import { loginCustomer, oauthLogin, registerCustomer, type AuthResult } from "@/app/(store)/tai-khoan/actions";

// Đăng nhập / Đăng ký khách hàng (giao diện v2, trang đứng riêng). Kiểm ô ở trình duyệt, rồi gửi máy chủ (app/(store)/tai-khoan/actions.ts);
// lỗi trùng SĐT/email từ máy chủ hiện đỏ dưới đúng ô. Email không xác minh (chủ shop chốt 12/11).
// Khách vẫn đặt hàng và tra cứu đơn không cần tài khoản. Không nhắc điểm, mã giảm giá, ưu đãi, thông báo (chủ shop chưa chốt).
// Kiểu theo bản mẫu chủ shop gửi 3/11/2026: ảnh mặt tiền phía trên mép dưới rõ nét, tấm nền kem bo góc lớn trượt lên đè ảnh, tiêu đề căn trái,
// tiến trình ngang, ô nhập xám đặc có viền mảnh (viền để ô đủ rõ so với nền), nút đen mực, "Tôi đã có tài khoản" là chữ gạch chân.
// Nút Google chỉ hiện khi đặt NEXT_PUBLIC_GOOGLE_LOGIN=1 (xem thử nội bộ); trên web thật phải ẩn cho tới khi nối xong.
const GOOGLE_READY = process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "1";
// Nút Facebook chỉ hiện khi đã bật ứng dụng Facebook trong Supabase và đặt NEXT_PUBLIC_FACEBOOK_LOGIN=1
const FACEBOOK_READY = process.env.NEXT_PUBLIC_FACEBOOK_LOGIN === "1";
const OAUTH_ERROR: Record<string, string> = {
  "dang-nhap": "Chưa đăng nhập được bằng Google/Facebook. Vui lòng thử lại hoặc dùng số điện thoại.",
  "nhan-vien": "Tài khoản nhân viên đăng nhập ở trang quản trị, không dùng khu vực khách hàng.",
};
const GREEN = "#3E9B6A";

type Key = "name" | "phone" | "email" | "password" | "password2";
type Vals = Partial<Record<Key, string>>;
const STEPS: { key: Key; optional?: boolean }[] = [
  { key: "name" }, { key: "phone" }, { key: "email", optional: true }, { key: "password" }, { key: "password2" },
];

// Trả về lời báo lỗi tiếng Việt, hoặc "" nếu ô hợp lệ (ô tùy chọn để trống là hợp lệ)
function check(key: Key, vals: Vals, login = false): string {
  const v = (vals[key] ?? "").trim();
  switch (key) {
    case "name": return v.length >= 2 ? "" : "Bạn nhập họ tên giúp shop nhé.";
    case "phone": return /^0\d{9}$/.test(v.replace(/\D/g, "")) ? "" : "Số điện thoại cần 10 số, bắt đầu bằng 0.";
    case "email": return v === "" || /^\S+@\S+\.\S+$/.test(v) ? "" : "Email chưa đúng dạng, ví dụ ten@gmail.com.";
    case "password":
      // Đăng nhập chỉ cần có nhập; luật mới (từ 8 ký tự, có cả chữ và số, không bắt buộc ký tự đặc biệt) áp khi tạo mật khẩu
      if (login) return v === "" ? "Bạn nhập mật khẩu giúp shop nhé." : "";
      return passwordProblem(v);
    case "password2": return v !== "" && v === (vals.password ?? "").trim() ? "" : "Hai mật khẩu chưa giống nhau.";
    default: return "";
  }
}

// Ô nhập sáng, viền rõ và trạng thái focus theo bảng màu trang khách.
const boxCls = (invalid: boolean) =>
  `relative flex h-[52px] items-center rounded-[20px] border bg-[#E8F0F1] transition-[border-color,box-shadow] duration-150 focus-within:shadow-[0_0_0_3px_rgba(24,24,24,0.14)] ${invalid ? "border-danger" : "border-[#6F8992] focus-within:border-[#17324D]"}`;
const inputCls = "h-full w-full min-w-0 bg-transparent pl-12 pr-4 text-[15px] text-[#17324D] outline-none shadow-none focus-visible:!rounded-none focus-visible:!shadow-none placeholder:text-[#60717B]";

// Một bước trong form. `data-step-box` để hiệu ứng rung tìm đúng ô.
// Ô tùy chọn ghi "(không bắt buộc)" bằng chữ mờ nhỏ (không bẻ giữa chừng: nhãn dài thì cả khối xuống dòng dưới); ô bắt buộc không ghi gì,
// chỉ có chữ ẩn "(bắt buộc)" cho máy đọc màn hình.
function Step({ no, label, required, optional, icon, error, children, tall }: { no?: number; label: ReactNode; required?: boolean; optional?: boolean; icon: ReactNode; error?: string; children: ReactNode; tall?: boolean }) {
  return (
    <label className="group block">
      <span className="mb-1.5 block text-sm font-semibold leading-snug text-[#17324D] transition duration-150 group-focus-within:-translate-y-0.5">
        {no && <>{no}. </>}{label}
        {required && <span className="sr-only"> (bắt buộc)</span>}
        {optional && <> <span className="inline-block whitespace-nowrap text-xs font-normal text-[#60717B]">(không bắt buộc)</span></>}
      </span>
      <span data-step-box className={`${boxCls(!!error)} ${tall ? "!h-auto min-h-[52px] items-start" : ""}`}>
        <span className={`pointer-events-none absolute left-4 grid size-5 place-items-center text-[#60717B] ${tall ? "top-[15px]" : ""}`} aria-hidden>{icon}</span>
        {children}
      </span>
      {error && <span role="alert" className="mt-1.5 block text-sm text-danger">{error}</span>}
    </label>
  );
}

function PasswordInput({ name, label, autoComplete, invalid }: { name: string; label: string; autoComplete: string; invalid: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <input name={name} type={show ? "text" : "password"} autoComplete={autoComplete} placeholder={label} aria-invalid={invalid} className={`${inputCls} pr-14`} />
      <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-1 top-1 grid size-11 place-items-center rounded-2xl text-[#60717B] hover:bg-black/5">
        {show ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
      </button>
    </>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

// oauthError: mã lỗi khi quay về từ Google/Facebook (?loi=…)
export function CustomerAuth({ mode, oauthError }: { mode: "login" | "register"; oauthError?: string }) {
  const isLogin = mode === "login";
  const steps = isLogin ? STEPS.filter((s) => s.key === "phone").concat({ key: "password" }) : STEPS;
  const [vals, setVals] = useState<Vals>({});
  const [submitted, setSubmitted] = useState(false);
  const [server, setServer] = useState<AuthResult>(() => (oauthError && OAUTH_ERROR[oauthError] ? { error: OAUTH_ERROR[oauthError] } : {}));
  const [pending, start] = useTransition();
  const captcha = useCaptcha();
  const social = (provider: "google" | "facebook") => start(async () => { setSubmitted(false); setServer((await oauthLogin(provider)) ?? {}); });

  // Điền từ trên xuống: một bước tính là xong khi mọi bước phía trên đã xong và ô hợp lệ (ô tùy chọn để trống thì bỏ qua)
  const done: boolean[] = [];
  steps.forEach((s, i) => {
    const empty = (vals[s.key] ?? "").trim() === "";
    const pass = s.optional && empty ? true : check(s.key, vals, isLogin) === "";
    done.push((i === 0 || done[i - 1]) && pass);
  });
  const firstOpen = done.indexOf(false);
  const doneCount = done.filter(Boolean).length;
  const err = (key: Key) => (submitted ? check(key, vals, isLogin) : "") || server.fields?.[key] || "";

  const onInput = (e: React.FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (!t.name) return;
    setVals((v) => ({ ...v, [t.name]: t.value }));
    setServer((r) => (r.fields?.[t.name as Key] || r.error ? { ...r, error: undefined, fields: { ...r.fields, [t.name]: undefined } } : r));
    bounceField(t.closest("label")?.querySelector<HTMLElement>("span:last-of-type") ?? t.parentElement);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    // Chỉ rung khi bấm gửi mà ô bắt buộc còn TRỐNG (ô sai định dạng chỉ báo lỗi)
    steps.filter((s) => !s.optional && (vals[s.key] ?? "").trim() === "").forEach((s) => shakeField(e.currentTarget.querySelector(`[name=${s.key}]`)?.closest("[data-step-box]")));
    const bad = steps.find((s) => check(s.key, vals, isLogin) !== "");
    if (bad) {
      e.currentTarget.querySelector<HTMLElement>(`[name=${bad.key}]`)?.focus();
      return;
    }
    const data = new FormData(e.currentTarget);
    start(async () => {
      const r = await (isLogin ? loginCustomer(data) : registerCustomer(data));
      setServer(r ?? {});
      captcha.renew();
    });
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[460px] flex-col overflow-hidden bg-white md:min-h-0 md:rounded-3xl md:border md:border-white/70 md:shadow-[0_24px_60px_-24px_rgba(24,24,24,0.35)]">
      <div className="relative h-[270px] shrink-0">
        <Image src="/shop/mat-tien.webp" alt="Mặt tiền cửa hàng Tân Trường Tín trên đường 2/4, Nha Trang" fill priority sizes="(min-width: 640px) 460px, 100vw" className="object-cover object-[50%_59%]" />
        <Link href="/" aria-label="Quay lại trang bán hàng" className="absolute left-3 top-3 z-10 inline-flex h-11 items-center gap-1.5 rounded-full bg-white pl-3 pr-4 text-sm font-semibold text-[#17324D] shadow-[0_4px_14px_-6px_rgba(24,24,24,0.4)] transition duration-150 hover:bg-[#E8F0F1] active:scale-95">
          <ArrowLeft className="size-5" aria-hidden />Quay lại
        </Link>
      </div>
      <div className="relative -mt-7 flex flex-1 flex-col rounded-t-[28px] bg-white px-[22px] pb-8 pt-6">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#17324D]">{isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}</h1>
        {!isLogin && (
          <div className="mt-3">
            <p role="status" aria-live="polite" className="text-[13px] text-[#60717B]">Đã xong {doneCount} trên {steps.length} bước</p>
            <div aria-hidden className="mt-2.5 flex items-center">
              {steps.map((s, i) => (
                <Fragment key={s.key}>
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold transition-colors duration-300 ${i === firstOpen ? "text-[#17324D]" : "text-[#60717B]"}`} style={{ borderColor: done[i] ? GREEN : i === firstOpen ? "#17324D" : "#B6D4D7", background: done[i] ? GREEN : "#FFFFFF" }}>
                    {done[i] ? <Check className="size-4 text-white" strokeWidth={3} /> : i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#DCE5E9]">
                      <span className="block h-full w-full origin-left transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ background: GREEN, transform: `scaleX(${done[i] ? 1 : 0})` }} />
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={submit} onInput={onInput} noValidate className="mt-5 flex flex-col gap-4">
          {!isLogin && (
            <Step no={isLogin ? undefined : 1} label="Họ tên" required icon={<UserRound className="size-5" />} error={err("name")}>
              <input name="name" autoComplete="name" maxLength={80} placeholder="Họ tên của bạn" aria-invalid={!!err("name")} className={inputCls} />
            </Step>
          )}
          <Step no={isLogin ? undefined : 2} label="Số điện thoại" required={!isLogin} icon={<Phone className="size-5" />} error={err("phone")}>
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="Số điện thoại của bạn" aria-invalid={!!err("phone")} className={inputCls} />
          </Step>
          {!isLogin && (
            <Step no={3} label="Email" optional icon={<Mail className="size-5" />} error={err("email")}>
              <input name="email" type="email" autoComplete="email" maxLength={120} placeholder="ten@gmail.com" aria-invalid={!!err("email")} className={inputCls} />
            </Step>
          )}
          <Step no={isLogin ? undefined : 4} label="Mật khẩu" required={!isLogin} icon={<Lock className="size-5" />} error={err("password")}>
            <PasswordInput name="password" label="Mật khẩu" autoComplete={isLogin ? "current-password" : "new-password"} invalid={!!err("password")} />
          </Step>
          {!isLogin && (
            <>
              <Step no={5} label="Nhập lại mật khẩu" required icon={<Lock className="size-5" />} error={err("password2")}>
                <PasswordInput name="password2" label="Nhập lại mật khẩu" autoComplete="new-password" invalid={!!err("password2")} />
              </Step>
            </>
          )}

          {captcha.enabled && <TurnstileWidget key={captcha.round} onStatus={captcha.setStatus} />}

          {server.error && <p role="alert" className="rounded-2xl border border-danger/40 bg-[#fef2f2] px-3.5 py-3 text-sm leading-6 text-danger">{server.error}</p>}

          <button type="submit" disabled={captcha.blocked || pending} onPointerDown={(e) => rippleAt(e, "rgba(255,255,255,0.35)")} className={`relative mt-1 flex h-[52px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#0B6972] text-[15px] font-semibold text-white transition duration-150 hover:bg-[#07545C] active:scale-[0.98] disabled:opacity-60 ${done.every(Boolean) ? "" : "opacity-70"}`}>
            {captcha.waiting ? "Đang xác minh…" : pending ? "Đang xử lý…" : isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
          {GOOGLE_READY && (
            <button type="button" disabled={pending} onClick={() => social("google")} onPointerDown={(e) => rippleAt(e, "rgba(24,24,24,0.12)")} className="relative flex h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#DCE5E9] bg-white text-[15px] font-semibold text-[#17324D] transition duration-150 hover:bg-[#E8F0F1] active:scale-[0.98]">
              <GoogleG />Tiếp tục với Google
            </button>
          )}
          {FACEBOOK_READY && (
            <button type="button" disabled={pending} onClick={() => social("facebook")} className="relative flex h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#1877F2] text-[15px] font-semibold text-white transition duration-150 hover:bg-[#166FE5] active:scale-[0.98] disabled:opacity-60">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden><path fill="currentColor" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.69 4.54-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.6 23.1 24 18.1 24 12.07z" /></svg>Tiếp tục với Facebook
            </button>
          )}
          <Link href={isLogin ? "/tai-khoan/dang-ky" : "/tai-khoan/dang-nhap"} className="mx-auto inline-flex h-11 items-center px-2 text-[15px] font-semibold text-[#17324D] underline underline-offset-4">
            {isLogin ? "Tạo tài khoản mới" : "Tôi đã có tài khoản"}
          </Link>
          {isLogin && (
            <p className="-mt-2 text-center text-[13px] text-[#60717B]">
              Quên mật khẩu? <a href="tel:0948732064" className="font-semibold text-[#17324D] underline underline-offset-2">Gọi shop {SHOP.phone}</a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
