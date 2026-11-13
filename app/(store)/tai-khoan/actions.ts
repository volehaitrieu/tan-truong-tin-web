"use server";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { customerLoginEmail, getCustomerUser, isCustomerLogin, normalizePhone } from "@/lib/customer";
import { passwordProblem } from "@/lib/password-rule";
import { CAPTCHA_FAILED, captchaOption, isCaptchaError } from "@/lib/turnstile";

export type Field = "name" | "phone" | "email" | "password" | "password2" | "current";
export type AuthResult = { error?: string; fields?: Partial<Record<Field, string>>; ok?: boolean };

const TAKEN = "Thông tin này đã được sử dụng.";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (form: FormData, k: string) => String(form.get(k) ?? "");

function cleanEmail(raw: string): string | null | false {
  const e = raw.trim().toLowerCase();
  if (!e) return null;
  return e.length <= 120 && EMAIL_RE.test(e) ? e : false;
}

const isUnique = (e: { code?: string } | null) => e?.code === "23505";
// Trùng SĐT hay trùng email (dựa trên tên ràng buộc / lời báo của DB)
const dupField = (e: { message?: string; details?: string } | null): Field => /phone/.test(`${e?.message} ${e?.details}`) ? "phone" : "email";

export async function registerCustomer(form: FormData): Promise<AuthResult> {
  const name = str(form, "name").trim();
  const phone = normalizePhone(str(form, "phone"));
  const email = cleanEmail(str(form, "email"));
  const password = str(form, "password");
  const fields: AuthResult["fields"] = {};
  if (name.length < 2 || name.length > 80) fields.name = "Bạn nhập họ tên giúp shop nhé.";
  if (!phone) fields.phone = "Số điện thoại cần 10 số, bắt đầu bằng 0.";
  if (email === false) fields.email = "Email chưa đúng dạng, ví dụ ten@gmail.com.";
  const weak = password.length > 72 ? "Mật khẩu tối đa 72 ký tự." : passwordProblem(password);
  if (weak) fields.password = weak;
  if (password !== str(form, "password2")) fields.password2 = "Hai mật khẩu chưa giống nhau.";
  if (Object.keys(fields).length) return { fields };

  const db = await createClient();
  // Auth kiểm captcha trước; không cho khách chưa xác minh dò SĐT/email bằng RPC.
  // Ràng buộc unique trong Auth/customers vẫn xử lý trùng sau khi xác minh.
  const { data, error } = await db.auth.signUp({ email: customerLoginEmail(phone!), password, options: captchaOption(form) });
  if (isCaptchaError(error)) return { error: CAPTCHA_FAILED };
  if (error?.code === "user_already_exists") return { fields: { phone: TAKEN } };
  if (error?.code === "signup_disabled") return { error: "Shop chưa mở đăng ký tài khoản. Bạn vẫn đặt hàng được không cần tài khoản." };
  if (error || !data.session) return { error: "Chưa tạo được tài khoản. Vui lòng thử lại sau." };

  const { error: profileError } = await db.rpc("customer_register", { p_full_name: name, p_email: email || null });
  if (profileError) {
    // Tài khoản đăng nhập đã có; hồ sơ sẽ được hoàn tất ở trang Tài khoản
    if (isUnique(profileError)) redirect("/tai-khoan?email-trung=1");
    redirect("/tai-khoan");
  }
  redirect("/tai-khoan");
}

export async function loginCustomer(form: FormData): Promise<AuthResult> {
  const phone = normalizePhone(str(form, "phone"));
  const password = str(form, "password");
  if (!phone) return { fields: { phone: "Số điện thoại cần 10 số, bắt đầu bằng 0." } };
  if (!password || password.length > 200) return { fields: { password: "Bạn nhập mật khẩu giúp shop nhé." } };
  const db = await createClient();
  const { error } = await db.auth.signInWithPassword({ email: customerLoginEmail(phone), password, options: captchaOption(form) });
  if (isCaptchaError(error)) return { error: CAPTCHA_FAILED };
  if (error) return { error: "Số điện thoại hoặc mật khẩu chưa đúng." };
  redirect("/tai-khoan");
}

export async function logoutCustomer() {
  const db = await createClient();
  await db.auth.signOut();
  redirect("/tai-khoan");
}

// Hoàn tất hồ sơ (đăng ký bị gián đoạn, hoặc lần đầu vào bằng Google/Facebook — cần nhập SĐT) hoặc sửa họ tên/email
export async function saveProfile(_: AuthResult, form: FormData): Promise<AuthResult> {
  const name = str(form, "name").trim();
  const email = cleanEmail(str(form, "email"));
  const fields: AuthResult["fields"] = {};
  if (name.length < 2 || name.length > 80) fields.name = "Bạn nhập họ tên giúp shop nhé.";
  if (email === false) fields.email = "Email chưa đúng dạng, ví dụ ten@gmail.com.";
  const db = await createClient();
  const user = await getCustomerUser(db);
  if (!user) return { error: "Phiên đăng nhập đã hết, vui lòng đăng nhập lại." };
  const { data: existing } = await db.from("customers").select("id").eq("id", user.id).maybeSingle();
  // Tài khoản Google/Facebook chưa có hồ sơ: SĐT bắt buộc (tài khoản SĐT thì DB tự lấy từ tên đăng nhập)
  const phone = !existing && !isCustomerLogin(user.email) ? normalizePhone(str(form, "phone")) : null;
  if (!existing && !isCustomerLogin(user.email) && !phone) fields.phone = "Số điện thoại cần 10 số, bắt đầu bằng 0.";
  if (Object.keys(fields).length) return { fields };
  const { error } = existing
    ? await db.from("customers").update({ full_name: name, email: email || null }).eq("id", user.id)
    : await db.rpc("customer_register", { p_full_name: name, p_email: email || null, p_phone: phone });
  if (isUnique(error)) return { fields: { [dupField(error)]: TAKEN } };
  if (error) return { error: "Chưa lưu được. Vui lòng thử lại." };
  revalidatePath("/tai-khoan");
  return { ok: true };
}

export async function changeCustomerPassword(_: AuthResult, form: FormData): Promise<AuthResult> {
  const current = str(form, "current");
  const next = str(form, "password");
  const fields: AuthResult["fields"] = {};
  const weak = next.length > 72 ? "Mật khẩu tối đa 72 ký tự." : passwordProblem(next);
  if (!current) fields.current = "Bạn nhập mật khẩu hiện tại.";
  if (weak) fields.password = weak.replace("Mật khẩu", "Mật khẩu mới");
  else if (next === current) fields.password = "Mật khẩu mới phải khác mật khẩu cũ.";
  if (next !== str(form, "password2")) fields.password2 = "Hai mật khẩu chưa giống nhau.";
  if (Object.keys(fields).length) return { fields };
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  // Chỉ tài khoản SĐT có mật khẩu; tài khoản Google/Facebook đổi mật khẩu ở nhà cung cấp
  if (!user?.email || !isCustomerLogin(user.email)) return { error: "Phiên đăng nhập đã hết, vui lòng đăng nhập lại." };
  // Kiểm mật khẩu cũ bằng phiên tạm riêng, không đụng phiên đang dùng (giống trang quản trị)
  const probe = createSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: wrong } = await probe.auth.signInWithPassword({ email: user.email, password: current, options: captchaOption(form) });
  if (isCaptchaError(wrong)) return { error: CAPTCHA_FAILED };
  if (wrong) return { fields: { current: "Mật khẩu hiện tại chưa đúng." } };
  await probe.auth.signOut({ scope: "local" });
  const { error } = await db.auth.updateUser({ password: next });
  return error ? { error: "Không đổi được mật khẩu. Vui lòng thử lại." } : { ok: true };
}

// Địa chỉ nhận hàng thường dùng (tự điền ở trang thanh toán). Để trống cả 3 ô = xóa địa chỉ.
export async function saveAddress(_: AuthResult, form: FormData): Promise<AuthResult> {
  const province = str(form, "province").trim();
  const ward = str(form, "ward").trim();
  const street = str(form, "street").trim();
  if (province.length > 80 || ward.length > 80 || street.length > 200) return { error: "Địa chỉ quá dài." };
  if ((ward || street) && (!province || !ward || !street)) return { error: "Nhập đủ Tỉnh/Thành, Phường/Xã và số nhà, tên đường." };
  const db = await createClient();
  const user = await getCustomerUser(db);
  if (!user) return { error: "Phiên đăng nhập đã hết, vui lòng đăng nhập lại." };
  const empty = !ward && !street;
  const { error } = await db.from("customers")
    .update({ province: empty ? null : province, ward: empty ? null : ward, street: empty ? null : street }).eq("id", user.id);
  if (error) return { error: "Chưa lưu được địa chỉ. Vui lòng thử lại." };
  revalidatePath("/tai-khoan");
  return { ok: true };
}

// Đăng nhập bằng Google/Facebook: Supabase chuyển khách sang trang nhà cung cấp rồi về /auth/callback
export async function oauthLogin(provider: "google" | "facebook"): Promise<AuthResult> {
  if (provider !== "google" && provider !== "facebook") return { error: "Cách đăng nhập không hợp lệ." };
  const enabled = provider === "google" ? process.env.NEXT_PUBLIC_GOOGLE_LOGIN : process.env.NEXT_PUBLIC_FACEBOOK_LOGIN;
  if (enabled !== "1") return { error: "Shop chưa bật cách đăng nhập này. Vui lòng dùng số điện thoại." };
  const h = await headers();
  const origin = h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const db = await createClient();
  const { data, error } = await db.auth.signInWithOAuth({ provider, options: { redirectTo: `${origin}/auth/callback` } });
  if (error || !data.url) return { error: "Chưa mở được trang đăng nhập. Vui lòng thử lại hoặc dùng số điện thoại." };
  redirect(data.url);
}
