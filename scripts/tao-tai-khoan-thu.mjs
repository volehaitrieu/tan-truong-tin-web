// Tạo (hoặc đặt lại mật khẩu) 3 tài khoản thử: chủ shop, NV đơn, NV kho.
// Chạy: node --env-file=.env.local scripts/tao-tai-khoan-thu.mjs
// Mật khẩu ngẫu nhiên được ghi vào .env.local (TEST_*), không in ra màn hình.
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const DOMAIN = "nhanvien.tantruongtin.vn";
const ACCOUNTS = [
  { key: "OWNER", phone: "0948732064", role: "owner", name: "Chủ shop" },
  { key: "ORDER", phone: "0908123456", role: "order_staff", name: "Nguyễn Văn An" },
  { key: "STOCK", phone: "0912345678", role: "stock_staff", name: "Trần Thị Bình" },
];

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let env = readFileSync(".env.local", "utf8");
const setEnv = (k, v) => {
  const line = `${k}=${v}`;
  env = new RegExp(`^${k}=.*$`, "m").test(env) ? env.replace(new RegExp(`^${k}=.*$`, "m"), line) : env.trimEnd() + "\n" + line + "\n";
};

const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
if (listErr) throw listErr;

for (const a of ACCOUNTS) {
  const email = `${a.phone}@${DOMAIN}`;
  const password = randomBytes(12).toString("base64url");
  let user = list.users.find((u) => u.email === email);
  if (user) {
    const { error } = await admin.auth.admin.updateUserById(user.id, { password });
    if (error) throw error;
  } else {
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    user = data.user;
  }
  const { error: pErr } = await admin.from("profiles").upsert({ id: user.id, full_name: a.name, phone: a.phone, role: a.role, is_active: true });
  if (pErr) throw pErr;
  setEnv(`TEST_${a.key}_PHONE`, a.phone);
  setEnv(`TEST_${a.key}_PASSWORD`, password);
  console.log(`✓ ${a.name} (${a.role})`);
}
if (!env.includes("# Tài khoản thử")) env = env.replace("TEST_OWNER_PHONE", "# Tài khoản thử (chỉ để kiểm thử, đổi mật khẩu trước khi dùng thật)\nTEST_OWNER_PHONE");
writeFileSync(".env.local", env);
console.log("Đã ghi mật khẩu vào .env.local");
