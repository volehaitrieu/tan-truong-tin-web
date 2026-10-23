// Đóng vai kẻ tấn công: chỉ có khóa công khai (lấy được từ mã trang web) + trang web localhost.
// Chạy: node --env-file=.env.local scripts/tan-cong-thu.mjs   (cần dev server ở localhost:3000)
// Mỗi dòng "✗ LỖ HỔNG" là việc cần vá.
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUB = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SITE = "http://localhost:3000";
const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(URL, process.env.SUPABASE_SECRET_KEY, opts);
let holes = 0, ok = 0;
const result = (name, safe, info = "") => {
  if (safe) ok++;
  else holes++;
  console.log(`${safe ? "✓ an toàn" : "✗ LỖ HỔNG"} · ${name}${info ? " — " + info : ""}`);
};
const anon = createClient(URL, PUB, opts);

// 1. Đọc trộm bảng nhạy cảm bằng REST
for (const t of ["profiles", "product_costs", "orders", "order_items", "order_events", "quote_requests", "audit_log", "inventory", "inventory_movements", "role_permissions", "stock_counts"]) {
  const { data, error } = await anon.from(t).select("*").limit(5);
  result(`Khách đọc bảng ${t}`, !data?.length, error?.message ?? `${data?.length ?? 0} dòng`);
}

// 2. Ghi thẳng vào bảng (bỏ qua hàm kiểm tra)
const writes = [
  ["orders", () => anon.from("orders").insert({ code: "HACK000001", customer_name: "x", phone: "0900000000", delivery: "pickup", subtotal: 0 })],
  ["order_items", () => anon.from("order_items").insert({ order_id: 1, sku: "X", name: "x", unit: "x", unit_price: 0, qty: 1 })],
  ["products (giá 1đ)", () => anon.from("products").update({ price: 1 }).neq("id", 0)],
  ["inventory (tồn 9999)", () => anon.from("inventory").update({ qty: 9999 }).neq("product_id", 0)],
  ["settings (phí ship 0)", () => anon.from("settings").update({ inner_ship_fee: 0 }).eq("id", 1)],
  ["profiles (tự tạo chủ shop)", () => anon.from("profiles").insert({ id: "00000000-0000-0000-0000-000000000000", role: "owner" })],
  ["role_permissions", () => anon.from("role_permissions").update({ allowed: true }).neq("role", "owner")],
];
for (const [name, fn] of writes) {
  const { data, error } = await fn().select?.() ?? (await fn());
  result(`Khách ghi thẳng ${name}`, !!error || !data?.length, error?.message?.slice(0, 80));
}
const { data: price } = await admin.from("products").select("price").eq("sku", "QUA-HALI-TR2").single();
result("Giá SP không bị đổi", price.price === 480000);

// 3. Tự đăng ký tài khoản rồi dùng quyền "đã đăng nhập"
const email = `hacker${Date.now()}@example.com`;
const { data: su, error: suErr } = await anon.auth.signUp({ email, password: "Hacker!12345" });
if (suErr || !su.session) {
  result("Tự đăng ký tài khoản", true, suErr?.message ?? "không có phiên đăng nhập (cần xác nhận email)");
} else {
  const h = createClient(URL, PUB, opts);
  await h.auth.setSession(su.session);
  const leaks = [];
  for (const t of ["profiles", "product_costs", "orders", "inventory", "audit_log", "role_permissions"]) {
    const { data } = await h.from(t).select("*").limit(3);
    if (data?.length) leaks.push(t);
  }
  const { error: e2 } = await h.rpc("order_set_status", { p_order_id: 1, p_status: "cancelled" });
  const { data: perms } = await h.rpc("my_permissions");
  result("Tài khoản tự đăng ký KHÔNG đọc được dữ liệu nội bộ", leaks.length === 0, leaks.join(", ") || "không đọc được gì");
  result("Tài khoản tự đăng ký KHÔNG gọi được hàm nhân viên", !!e2 && !(perms ?? []).length);
  result("Đăng ký tự do đang BẬT (nên tắt)", false, "ai cũng tạo được tài khoản đăng nhập — không có quyền gì nhưng nên tắt");
  await admin.auth.admin.deleteUser(su.user.id);
}

// 4. XSS: chèn mã vào tên/ghi chú đơn → xem ở trang tra cứu (render React phải tự thoát ký tự)
const xss = `<img src=x onerror="alert(1)">`;
const { data: o, error: oe } = await anon.rpc("place_order", { payload: { name: xss, phone: "0977000555", delivery: "pickup", note: `<script>alert(2)</script>`, items: [{ sku: "DEN-RD-LED-9W", qty: 1 }] } });
result("Đơn có mã độc vẫn được lưu dạng chữ thường", !oe, oe?.message);
if (o?.code) {
  const { data: found } = await anon.rpc("lookup_order", { p_code: o.code, p_phone: "0977000555" });
  result("Tra cứu không trả về ghi chú/tên (ít lộ dữ liệu)", found && !("note" in found) && !("customer_name" in found));
}

// 5. Spam đặt hàng
let blocked = false;
for (let i = 0; i < 5; i++) {
  const { error } = await anon.rpc("place_order", { payload: { name: "Spam", phone: "0977000666", delivery: "pickup", items: [{ sku: "DEN-RD-LED-9W", qty: 1 }] } });
  if (error) { blocked = true; break; }
}
result("Spam đặt hàng cùng SĐT bị chặn", blocked);
let qBlocked = false;
for (let i = 0; i < 25; i++) {
  const { error } = await anon.rpc("submit_quote", { p_items: "spam spam", p_phone: `09770${String(10000 + i)}` });
  if (error) { qBlocked = true; break; }
}
result("Spam báo giá bằng nhiều SĐT khác nhau bị chặn", qBlocked, qBlocked ? "" : "25 yêu cầu đều lọt");

// 6. Trang quản trị không đăng nhập
for (const p of ["/admin", "/admin/don-hang", "/admin/bao-cao/xuat?ngay=7", "/admin/in-phieu/TTT001000", "/admin/nhan-vien"]) {
  const r = await fetch(SITE + p, { redirect: "manual" });
  result(`Mở ${p} khi chưa đăng nhập`, r.status === 307 || r.status === 302 || r.status === 403, String(r.status));
}

// 7. Header bảo mật của trang
const h = await fetch(SITE + "/");
for (const k of ["x-frame-options", "x-content-type-options", "referrer-policy", "content-security-policy"]) {
  result(`Header ${k}`, !!h.headers.get(k), h.headers.get(k) ?? "thiếu");
}
result("Không lộ 'X-Powered-By: Next.js'", !h.headers.get("x-powered-by"), h.headers.get("x-powered-by") ?? "");

// 8. Lộ khóa bí mật trong mã gửi về trình duyệt
const html = await (await fetch(SITE + "/")).text();
const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]).slice(0, 40);
let leaked = false;
for (const s of scripts) {
  const js = await (await fetch(SITE + s)).text();
  if (js.includes(process.env.SUPABASE_SECRET_KEY.slice(0, 40)) || js.includes("service_role")) leaked = true;
}
result("Khóa bí mật Supabase KHÔNG có trong mã trình duyệt", !leaked, `${scripts.length} file JS đã quét`);

// Dọn
await admin.from("orders").delete().in("phone", ["0977000555", "0977000666"]);
await admin.from("quote_requests").delete().like("phone", "09770%");
console.log(`\nTổng: ${ok} an toàn, ${holes} lỗ hổng/cần cải thiện`);
