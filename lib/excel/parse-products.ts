// Chuyển dòng Excel → sản phẩm cần nhập. Dùng chung trình duyệt (xem trước) và server (kiểm lại).
// Hỗ trợ 2 mẫu: DMHH (KHO XHD, giá đồng) và file quạt Import_SanPham (giá nghìn đồng).

export type ImportRow = {
  line: number; sku: string; name: string; unit: string; price: number; cost: number | null; minQty: number | null;
  sub: string | null; brand: string | null; spec: string | null; attributes: Record<string, string>;
  warranty: string | null; origin: string | null; errors: string[];
  // Chỉ mẫu chuẩn TTT: vị trí, sản xuất tại, mô tả (chữ thường, mỗi dòng một đoạn), ô gốc để xuất lại file lỗi
  location?: string | null; madeIn?: string | null; description?: string | null; raw?: Record<string, string>;
};

// Cột của file Excel mẫu (mẫu chuẩn TTT). Giá tính bằng đồng.
export const TEMPLATE_COLUMNS = [
  "Mã hàng hóa", "Tên sản phẩm", "Đơn vị tính", "Giá bán", "Giá nhập", "Giá nhập + 10%", "Danh mục", "Thương hiệu",
  "Vị trí", "Tồn tối thiểu", "Thông số", "Mô tả", "Bảo hành", "Xuất xứ", "Sản xuất tại",
] as const;
export const TEMPLATE_SHEET = "SanPham";

export const plain = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/\s+/g, " ").trim();

export const toSku = (raw: string) =>
  plain(raw).toUpperCase().replace(/\s/g, "-").replace(/[^A-Z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

const num = (v: string) => {
  const n = Number(String(v ?? "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : NaN;
};

// Xếp danh mục con theo từ khóa trong tên (không dấu). Luật cụ thể đứng trước.
const RULES: [RegExp, string][] = [
  [/^(ong nhua|ong pvc|ong ppr|ong hdpe)/, "ong-pvc"],
  [/^(van |co (pvc|ren|nhua)|te (pvc|nhua)|noi (ren|pvc)|ba chac|kep ong)/, "van-co-noi"],
  [/^(bang tan|keo dan ong|keo pvc)/, "bang-tan-keo"],
  [/^cong tac/, "cong-tac"],
  [/^(o cam|o day)/, "o-cam"],
  [/^(cb |aptomat|cau dao|bo ngat mach)/, "cb-aptomat"],
  [/^(day dien|day don).*(2x|2 x| doi)/, "day-doi"],
  [/^(day dien|day don)/, "day-don"],
  [/^cap (dien|dong)/, "cap-dien"],
  [/^(bong den|bong led)/, "bong-led"],
  [/^(den tuyp|bo den tuyp|tuyp led)/, "den-tuyp"],
  [/^(den op|den tran|den ban)/, "den-op-tran"],
  [/^quat (treo|dao treo)/, "quat-treo-tuong"],
  [/^quat dung/, "quat-dung"],
  [/^quat lung/, "quat-lung"],
  [/^quat san/, "quat-san"],
  [/^quat ban/, "quat-ban"],
  [/^quat tran/, "quat-tran"],
  [/^quat hop/, "quat-hop"],
  [/^quat (hut|thong gio)/, "quat-hut"],
  [/^(may khoan|pin may khoan|mui khoan)/, "may-khoan"],
  [/^(kem |kim |co le|mo let)/, "kim-co-le"],
  [/^(tua vit|tuoc no vit)/, "tua-vit"],
  [/^(bu ?long|oc vit|dinh |vit |tac ke)/, "vit-bulong"],
  [/^keo /, "keo-dan"],
  [/^bang keo/, "bang-keo"],
  [/^(binh dun|am dun|am sieu toc)/, "am-binh-dun"],
  [/^(noi |chao |bep )/, "do-bep"],
  [/^(choi (?!than)|ban chai|cay lau|xo )/, "ve-sinh"],
];
export const guessSub = (name: string) => RULES.find(([rx]) => rx.test(plain(name)))?.[1] ?? null;

const FAN_SUB: Record<string, string> = {
  "quạt treo tường": "quat-treo-tuong", "quạt đứng": "quat-dung", "quạt lửng": "quat-lung", "quạt sàn": "quat-san",
  "quạt bàn": "quat-ban", "quạt trần": "quat-tran", "quạt hộp": "quat-hop", "quạt hút / thông gió": "quat-hut",
};

export function detectAndParse(
  sheets: Record<string, string[][]>, brands: string[], subs: { slug: string; name: string }[] = [],
): { format: string; rows: ImportRow[] } {
  // Mẫu chuẩn TTT (file mẫu tải từ web): có cột "Mã hàng hóa" + "Tên sản phẩm" + "Giá bán"
  const tplName = Object.keys(sheets).find((n) => {
    const h = (sheets[n][0] ?? []).map(plain);
    return h.includes("ma hang hoa") && h.includes("ten san pham") && h.includes("gia ban");
  });
  if (tplName) {
    const rows = sheets[tplName];
    const h = rows[0].map(plain);
    const subByName = new Map(subs.flatMap((s) => [[plain(s.name), s.slug], [s.slug, s.slug]]));
    return {
      format: "Mẫu chuẩn Tân Trường Tín (giá tính bằng đồng)",
      rows: rows.slice(1).map((r, i) => ({ r, line: i + 2 })).filter(({ r }) => r.some((c) => c)).map(({ r, line }) => {
        const raw = Object.fromEntries(TEMPLATE_COLUMNS.map((c) => [c, h.indexOf(plain(c)) >= 0 ? r[h.indexOf(plain(c))] ?? "" : ""]));
        const g = (c: (typeof TEMPLATE_COLUMNS)[number]) => raw[c].trim();
        const opt = (c: (typeof TEMPLATE_COLUMNS)[number]) => g(c) || null;
        const cat = g("Danh mục");
        const sub = cat ? subByName.get(plain(cat)) ?? null : null;
        const row = finish({
          line, sku: toSku(g("Mã hàng hóa")), name: g("Tên sản phẩm"), unit: g("Đơn vị tính") || "Cái", price: num(g("Giá bán")),
          cost: g("Giá nhập") ? num(g("Giá nhập")) : null, minQty: g("Tồn tối thiểu") ? num(g("Tồn tối thiểu")) : null,
          sub, brand: opt("Thương hiệu"), spec: opt("Thông số"), attributes: {}, warranty: opt("Bảo hành"), origin: opt("Xuất xứ"),
          location: opt("Vị trí"), madeIn: opt("Sản xuất tại"), description: opt("Mô tả"), raw, errors: [],
        });
        if (cat && !sub) row.errors.push(`Không tìm thấy danh mục “${cat}”`);
        if (row.minQty !== null && (!Number.isSafeInteger(row.minQty) || row.minQty < 0)) row.errors.push("Tồn tối thiểu không phải số");
        return row;
      }),
    };
  }

  const brandOf = (name: string) => brands.find((b) => new RegExp(`(^|\\s)${plain(b).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(plain(name))) ?? null;

  // Mẫu DMHH (chỉ đọc sheet DMHH)
  const dmhh = sheets["DMHH"];
  if (dmhh) {
    const head = dmhh.findIndex((r) => r.some((c) => plain(c) === "ma hang hoa"));
    if (head < 0) throw new Error("Sheet DMHH thiếu cột “Mã hàng hóa”.");
    const h = dmhh[head].map(plain);
    const at = (k: string) => h.indexOf(k);
    const iCode = at("ma hang hoa"), iName = at("ten hang hoa"), iUnit = at("don vi tinh"), iPrice = at("don gia");
    return {
      format: "DMHH (giá tính bằng đồng)",
      rows: dmhh.slice(head + 1).filter((r) => r[iName] || r[iCode]).map((r, i) => {
        const name = r[iName] ?? "";
        return finish({
          line: head + i + 2, sku: toSku(r[iCode] || name), name, unit: r[iUnit] || "Cái", price: num(r[iPrice]), cost: null, minQty: null,
          sub: guessSub(name), brand: brandOf(name), spec: null, attributes: {}, warranty: null, origin: null, errors: [],
        });
      }),
    };
  }

  // Mẫu quạt (sheet có cột SKU + Giá bán, giá nghìn đồng)
  const fanName = Object.keys(sheets).find((n) => sheets[n][0]?.some((c) => c === "SKU") && sheets[n][0]?.some((c) => c === "Giá bán"));
  if (fanName) {
    const rows = sheets[fanName];
    const h = rows[0];
    const g = (r: string[], k: string) => (h.indexOf(k) >= 0 ? r[h.indexOf(k)] ?? "" : "");
    return {
      format: "File quạt (giá tính bằng nghìn đồng)",
      rows: rows.slice(1).filter((r) => g(r, "Tên sản phẩm")).map((r, i) => {
        const cat = g(r, "Danh mục").split(">").pop()?.trim().toLowerCase() ?? "";
        const name = g(r, "Tên sản phẩm");
        const attributes = Object.fromEntries(Object.entries({
          loai: g(r, "Loại / kiểu"), sai_canh: g(r, "Sải cánh"), so_canh: g(r, "Số cánh"), cong_suat: g(r, "Công suất"),
          luu_luong: g(r, "Lưu lượng gió"), toc_do: g(r, "Tốc độ gió"), dieu_khien: g(r, "Điều khiển"), dien_ap: g(r, "Điện áp"),
        }).filter(([, v]) => v));
        return finish({
          line: i + 2, sku: toSku(g(r, "SKU")), name, unit: g(r, "Đơn vị") || "cái",
          price: num(g(r, "Giá bán")) * 1000, cost: g(r, "Giá nhập") ? num(g(r, "Giá nhập")) * 1000 : null,
          minQty: g(r, "Ngưỡng tối thiểu") ? num(g(r, "Ngưỡng tối thiểu")) : null,
          sub: FAN_SUB[cat] ?? guessSub(name), brand: g(r, "Thương hiệu") || brandOf(name),
          spec: [g(r, "Sải cánh"), g(r, "Công suất"), g(r, "Điều khiển")].filter(Boolean).join(" · ").slice(0, 120) || null,
          attributes, warranty: g(r, "Bảo hành") || null, origin: g(r, "Xuất xứ") || null, errors: [],
        });
      }),
    };
  }
  throw new Error("Không nhận ra mẫu file. Cần sheet “DMHH” hoặc sheet có cột “SKU” và “Giá bán”.");
}

// Kiểm lỗi 1 dòng (dùng cả ở server)
export function finish(r: ImportRow): ImportRow {
  const e: string[] = [];
  if (!r.sku || r.sku.length < 2) e.push("Thiếu mã hàng hóa");
  if (!r.name || r.name.length < 2) e.push("Thiếu tên");
  if (r.name.length > 200) e.push("Tên quá dài");
  if (!Number.isSafeInteger(r.price) || r.price <= 0) e.push(Number.isNaN(r.price) ? "Giá bán không phải số" : "Giá bán bằng 0");
  else if (r.price > 500_000_000) e.push("Giá quá lớn");
  if (r.cost !== null && (!Number.isSafeInteger(r.cost) || r.cost < 0)) e.push("Giá nhập không phải số");
  if (!r.unit || r.unit.length > 20) e.push("Đơn vị lạ");
  r.unit = r.unit ? r.unit.charAt(0).toUpperCase() + r.unit.slice(1).toLowerCase() : r.unit;
  return { ...r, errors: e };
}

export function markDuplicates(rows: ImportRow[]) {
  const seen = new Map<string, number>();
  for (const r of rows) {
    if (!r.sku) continue;
    if (seen.has(r.sku)) r.errors.push(`SKU trùng dòng ${seen.get(r.sku)}`);
    else seen.set(r.sku, r.line);
  }
  return rows;
}
