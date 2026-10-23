// Nạp scripts/du-lieu-thu.json (từ trich-du-lieu-thu.py) vào Supabase. Chạy lại được (upsert theo SKU).
// Chạy: node --env-file=.env.local scripts/nap-du-lieu-thu.mjs
// Không có số tồn thật (không đọc sheet TON KHO) → tồn = 0, web hiện "Liên hệ" cho tới khi nhập tồn.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const must = ({ data, error }, what) => {
  if (error) throw new Error(`${what}: ${error.message}`);
  return data;
};
const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const items = JSON.parse(readFileSync("scripts/du-lieu-thu.json", "utf8"));

// 1. Danh mục con quạt còn thiếu + bộ thông số quạt (giữ nguyên văn từ file → kiểu text)
const quat = must(await db.from("categories").select("id").eq("slug", "quat").single(), "danh mục quạt");
const fanSubs = [["Quạt lửng", "quat-lung", 4], ["Quạt sàn", "quat-san", 5], ["Quạt bàn", "quat-ban", 6], ["Quạt hộp", "quat-hop", 7], ["Quạt hút / thông gió", "quat-hut", 8]];
must(await db.from("categories").upsert(fanSubs.map(([name, slug, sort]) => ({ parent_id: quat.id, name, slug, sort })), { onConflict: "slug", ignoreDuplicates: true }), "thêm danh mục quạt");
must(await db.from("categories").update({
  attribute_schema: [
    { key: "loai", label: "Loại quạt", type: "text", filter: true },
    { key: "sai_canh", label: "Sải cánh", type: "text", filter: true },
    { key: "so_canh", label: "Số cánh", type: "text" },
    { key: "cong_suat", label: "Công suất", type: "text", filter: true },
    { key: "luu_luong", label: "Lưu lượng gió", type: "text" },
    { key: "toc_do", label: "Tốc độ gió", type: "text" },
    { key: "dieu_khien", label: "Điều khiển", type: "text", filter: true },
    { key: "dien_ap", label: "Điện áp", type: "text" },
  ],
}).eq("slug", "quat"), "bộ thông số quạt");

const cats = must(await db.from("categories").select("id, slug, parent_id"), "đọc danh mục");
const catBySlug = new Map(cats.map((c) => [c.slug, c]));
const topSlug = (c) => (c.parent_id ? cats.find((x) => x.id === c.parent_id)?.slug : c.slug);

// 2. Thương hiệu
const brandNames = [...new Set(items.map((i) => i.brand).filter(Boolean))];
must(await db.from("brands").upsert(brandNames.map((name) => ({ name, slug: slugify(name) })), { onConflict: "name", ignoreDuplicates: true }), "thương hiệu");
const brands = new Map(must(await db.from("brands").select("id, name"), "đọc thương hiệu").map((b) => [b.name, b.id]));

// 3. Sản phẩm
const ILLUS = { "ong-nuoc": "/ai/pvc-pipe.jpg", "thiet-bi-dien": "/ai/hardware-hero.jpg", "day-cap-dien": "/ai/electrical-cable.jpg", den: "/ai/led-bulb.jpg",
  quat: "/ai/fan.jpg", "dung-cu": "/ai/cordless-drill.jpg", "kim-khi": "/ai/thread-seal-tape.jpg", "gia-dung": "/ai/electric-kettle.jpg" };
const rows = items.map((i) => {
  const cat = catBySlug.get(i.sub);
  if (!cat) throw new Error(`Thiếu danh mục ${i.sub}`);
  return {
    sku: i.sku, name: i.name.slice(0, 200), slug: i.sku.toLowerCase(), unit: i.unit.slice(0, 20), price: i.price,
    category_id: cat.id, brand_id: i.brand ? brands.get(i.brand) : null, spec_line: i.spec || null,
    attributes: i.attributes ?? {}, warranty: i.warranty ?? null, origin: i.origin ?? null, is_visible: true,
  };
});
must(await db.from("products").upsert(rows, { onConflict: "sku" }), "sản phẩm");
const saved = new Map(must(await db.from("products").select("id, sku").in("sku", rows.map((r) => r.sku)), "đọc SP").map((p) => [p.sku, p.id]));

// 4. Giá nhập, tồn tối thiểu, ảnh minh họa
const costs = items.filter((i) => i.cost).map((i) => ({ product_id: saved.get(i.sku), cost_price: i.cost }));
if (costs.length) must(await db.from("product_costs").upsert(costs, { onConflict: "product_id" }), "giá nhập");
for (const i of items.filter((x) => x.min_qty)) {
  must(await db.from("inventory").update({ min_qty: i.min_qty }).eq("product_id", saved.get(i.sku)), "tồn tối thiểu");
}
// Ảnh minh họa theo danh mục cha (ghi đè ảnh minh họa cũ, không đụng ảnh thật)
const illusOf = (i) => ILLUS[topSlug(catBySlug.get(i.sub))] ?? "/ai/hardware-hero.jpg";
const existing = must(await db.from("product_images").select("id, product_id, is_illustration").in("product_id", [...saved.values()]), "đọc ảnh");
let imgCount = 0;
for (const i of items) {
  const pid = saved.get(i.sku);
  const mine = existing.filter((e) => e.product_id === pid);
  if (!mine.length) {
    must(await db.from("product_images").insert({ product_id: pid, url: illusOf(i), is_illustration: true }), "ảnh minh họa");
    imgCount++;
  } else {
    for (const e of mine.filter((e) => e.is_illustration)) must(await db.from("product_images").update({ url: illusOf(i) }).eq("id", e.id), "sửa ảnh minh họa");
  }
}

console.log(`✓ Đã nạp ${rows.length} SP (${costs.length} có giá nhập, ${brandNames.length} thương hiệu, ${imgCount} ảnh minh họa mới)`);
