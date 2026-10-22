// Kiểm thử phân quyền + RLS trực tiếp vào API Supabase (như kẻ tấn công dùng khóa công khai).
// Chạy: node --env-file=.env.local scripts/kiem-thu-bao-mat.mjs
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUB = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(URL, process.env.SUPABASE_SECRET_KEY, opts);

let pass = 0, fail = 0;
const check = (name, ok, extra = "") => {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "✓" : "✗ LỖI"} ${name}${extra ? " — " + extra : ""}`);
};
async function signIn(key) {
  const c = createClient(URL, PUB, opts);
  const { error } = await c.auth.signInWithPassword({
    email: `${process.env[`TEST_${key}_PHONE`]}@nhanvien.tantruongtin.vn`,
    password: process.env[`TEST_${key}_PASSWORD`],
  });
  if (error) throw new Error(`Đăng nhập ${key} thất bại: ${error.message}`);
  return c;
}
const stockOf = async (sku) => {
  const { data } = await admin.from("products").select("id, inventory(qty)").eq("sku", sku).single();
  return { id: data.id, qty: data.inventory.qty };
};

const anon = createClient(URL, PUB, opts);
const owner = await signIn("OWNER");
const orderStaff = await signIn("ORDER");
const stockStaff = await signIn("STOCK");

// ---- Khách (chưa đăng nhập) ----
{
  const { data } = await anon.from("products").select("sku, price");
  check("Khách xem được danh sách SP", (data ?? []).length > 0);
  const { data: c } = await anon.from("product_costs").select("*");
  check("Khách KHÔNG đọc được giá nhập", (c ?? []).length === 0);
  const { data: o } = await anon.from("orders").select("*");
  check("Khách KHÔNG đọc được đơn hàng", (o ?? []).length === 0);
  const { data: inv } = await anon.from("inventory").select("*");
  check("Khách KHÔNG đọc được số tồn kho", (inv ?? []).length === 0);
  const { error: u } = await anon.from("products").update({ price: 1 }).eq("sku", "QUA-HALI-TR2").select();
  const { data: p } = await admin.from("products").select("price").eq("sku", "QUA-HALI-TR2").single();
  check("Khách KHÔNG sửa được giá", p.price === 480000, u?.message);
  const { error: rpc } = await anon.rpc("order_set_status", { p_order_id: 1, p_status: "confirmed" });
  check("Khách KHÔNG gọi được hàm nhân viên", !!rpc);
  const { error: perms } = await anon.rpc("my_permissions");
  check("Khách KHÔNG gọi được my_permissions", !!perms);
}

// ---- Đặt hàng: server tự tính tiền, chặn số lượng sai ----
let orderId;
{
  const base = { name: "Khách Thử", phone: "+84 977 000 111", delivery: "pickup" };
  const bad = [
    [{ sku: "QUA-HALI-TR2", qty: -1 }], [{ sku: "QUA-HALI-TR2", qty: 0 }], [{ sku: "QUA-HALI-TR2", qty: 1.5 }],
    [{ sku: "QUA-HALI-TR2", qty: 1000 }], [{ sku: "QUA-HALI-TR2", qty: "1; drop table orders" }], [{ sku: "KHONG-CO", qty: 1 }], [],
  ];
  for (const items of bad) {
    const { error } = await anon.rpc("place_order", { payload: { ...base, items } });
    check(`Chặn giỏ hàng xấu ${JSON.stringify(items)}`, !!error, error?.message);
  }
  const { error: badPhone } = await anon.rpc("place_order", { payload: { ...base, phone: "12345", items: [{ sku: "QUA-HALI-TR2", qty: 1 }] } });
  check("Chặn SĐT sai", !!badPhone, badPhone?.message);
  const { error: noAddr } = await anon.rpc("place_order", { payload: { ...base, delivery: "inner", items: [{ sku: "QUA-HALI-TR2", qty: 1 }] } });
  check("Giao nội thành bắt buộc địa chỉ", !!noAddr, noAddr?.message);

  // Gửi kèm giá giả 1đ → server bỏ qua, tính theo giá KM thật 430.000đ
  const { data, error } = await anon.rpc("place_order", {
    payload: { ...base, items: [{ sku: "qua-hali-tr2", qty: 2, price: 1 }, { sku: "QUA-HALI-TR2", qty: 1 }], subtotal: 1 },
  });
  check("Đặt hàng hợp lệ thành công", !error && data?.code?.startsWith("TTT"), error?.message);
  check("Server tự tính tiền (3 × 430.000đ), bỏ qua giá gửi lên", data?.subtotal === 1290000, String(data?.subtotal));
  const { data: o } = await admin.from("orders").select("id, phone").eq("code", data.code).single();
  orderId = o.id;
  check("SĐT +84 được chuẩn hóa về 0…", o.phone === "0977000111");

  const { data: found } = await anon.rpc("lookup_order", { p_code: data.code, p_phone: "0977 000 111" });
  check("Tra cứu đúng mã + SĐT ra đơn", found?.code === data.code);
  const { data: wrong } = await anon.rpc("lookup_order", { p_code: data.code, p_phone: "0977000112" });
  check("Tra cứu sai SĐT KHÔNG lộ đơn", wrong === null);
  const { data: inj } = await anon.rpc("lookup_order", { p_code: "' or 1=1 --", p_phone: "0977000111" });
  check("Tra cứu chèn SQL không lộ dữ liệu", inj === null);
}

// ---- NV đơn ----
{
  const { data: c } = await orderStaff.from("product_costs").select("*");
  check("NV đơn KHÔNG đọc được giá nhập", (c ?? []).length === 0);
  const { error } = await orderStaff.from("products").update({ price: 1 }).eq("sku", "DEN-RD-LED-9W").select();
  const { data: p } = await admin.from("products").select("price").eq("sku", "DEN-RD-LED-9W").single();
  check("NV đơn KHÔNG sửa được giá", p.price === 35000, error?.message);
  const { error: adj } = await orderStaff.rpc("adjust_stock", { p_product_id: 1, p_delta: 100, p_reason: "Nhập hàng" });
  check("NV đơn KHÔNG điều chỉnh được tồn", !!adj, adj?.message);
  const { error: cancel } = await orderStaff.rpc("order_set_status", { p_order_id: orderId, p_status: "cancelled" });
  check("NV đơn KHÔNG hủy được đơn", !!cancel, cancel?.message);
  const { data: staffList } = await orderStaff.from("profiles").select("id");
  check("NV đơn chỉ thấy hồ sơ của mình", (staffList ?? []).length === 1);
  const { data: me } = await orderStaff.from("profiles").select("id").single();
  const { error: esc } = await orderStaff.from("profiles").update({ role: "owner" }).eq("id", me.id).select();
  const { data: still } = await admin.from("profiles").select("role").eq("id", me.id).single();
  check("NV đơn KHÔNG tự nâng mình thành chủ shop", still.role === "order_staff", esc?.message);
  const { error: rp } = await orderStaff.from("role_permissions").update({ allowed: true }).eq("role", "order_staff").select();
  const { data: rpCheck } = await admin.from("role_permissions").select("allowed").eq("role", "order_staff").eq("permission", "cancel_orders").single();
  check("NV đơn KHÔNG tự cấp thêm quyền", rpCheck.allowed === false, rp?.message);

  // Xác nhận đơn → trừ tồn đúng 1 lần dù bấm 2 lần cùng lúc
  const before = await stockOf("QUA-HALI-TR2");
  const [r1, r2] = await Promise.all([
    orderStaff.rpc("order_set_status", { p_order_id: orderId, p_status: "confirmed" }),
    orderStaff.rpc("order_set_status", { p_order_id: orderId, p_status: "confirmed" }),
  ]);
  const after = await stockOf("QUA-HALI-TR2");
  check("Bấm xác nhận 2 lần cùng lúc: chỉ 1 lần thành công", [r1, r2].filter((r) => !r.error).length === 1);
  check("Tồn kho trừ đúng 3 cái một lần", before.qty - after.qty === 3, `${before.qty} → ${after.qty}`);
}

// ---- NV kho ----
{
  const { data: c } = await stockStaff.from("product_costs").select("*");
  check("NV kho đọc được giá nhập (theo PRD)", (c ?? []).length > 0);
  const { error } = await stockStaff.from("products").update({ name: "Hack" }).eq("sku", "VAN-MIHA-21").select();
  const { data: p } = await admin.from("products").select("name").eq("sku", "VAN-MIHA-21").single();
  check("NV kho KHÔNG sửa được sản phẩm", p.name !== "Hack", error?.message);
  const { error: st } = await stockStaff.rpc("order_set_status", { p_order_id: orderId, p_status: "shipping" });
  check("NV kho KHÔNG xử lý được đơn", !!st, st?.message);
  const { data: o } = await stockStaff.from("orders").select("*");
  check("NV kho KHÔNG đọc được đơn (SĐT khách)", (o ?? []).length === 0);
}

// ---- Chủ shop ----
{
  const { error: cancel } = await owner.rpc("order_set_status", { p_order_id: orderId, p_status: "cancelled", p_note: "kiểm thử" });
  const after = await stockOf("QUA-HALI-TR2");
  check("Chủ shop hủy đơn được", !cancel, cancel?.message);
  const { data: mv } = await admin.from("inventory_movements").select("delta").eq("order_id", orderId);
  check("Hủy đơn hoàn lại đúng số đã trừ", mv.reduce((s, m) => s + m.delta, 0) === 0, `tồn hiện ${after.qty}`);
  const { error: neg } = await owner.rpc("adjust_stock", { p_product_id: after.id, p_delta: -100000, p_reason: "Khác" });
  check("Không thể điều chỉnh tồn xuống âm", !!neg, neg?.message);
  const { error: upd } = await owner.from("products").update({ sale_price: 425000 }).eq("sku", "QUA-HALI-TR2").select();
  check("Chủ shop sửa được giá KM", !upd, upd?.message);
  await owner.from("products").update({ sale_price: 430000 }).eq("sku", "QUA-HALI-TR2");
  const { data: pr } = await owner.from("products").select("id").eq("sku", "QUA-HALI-TR2").single();
  const { error: minE } = await owner.from("inventory").update({ min_qty: 4 }).eq("product_id", pr.id);
  check("Chủ shop sửa được tồn tối thiểu", !minE, minE?.message);
  const { error: costE } = await owner.from("product_costs").upsert({ product_id: pr.id, cost_price: 300000 });
  check("Chủ shop ghi được giá nhập", !costE, costE?.message);
  const { error: costO } = await orderStaff.from("product_costs").upsert({ product_id: pr.id, cost_price: 1 });
  check("NV đơn KHÔNG ghi được giá nhập", !!costO);
  const { data: audit } = await owner.from("audit_log").select("action, target").eq("action", "update:products").order("created_at", { ascending: false }).limit(1);
  check("Sửa giá được ghi vào nhật ký thao tác", audit?.[0]?.action === "update:products" && audit[0].target === "QUA-HALI-TR2");
}

// Dọn đơn kiểm thử
await admin.from("inventory_movements").delete().eq("order_id", orderId);
await admin.from("orders").delete().eq("phone", "0977000111");

console.log(`\nKết quả: ${pass} đạt, ${fail} lỗi`);
process.exit(fail ? 1 : 0);
