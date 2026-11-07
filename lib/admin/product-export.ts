import "server-only";
import { costFromImport, filteredProducts, importPrices } from "@/lib/admin/products";
import type { ProductFilter } from "@/lib/admin/products-params";
import { TEMPLATE_COLUMNS } from "@/lib/excel/parse-products";
import { htmlToText } from "@/lib/rich-text";
import type { Cell } from "@/lib/excel/write-xlsx";

// Xuất Excel danh sách SP theo đúng bộ lọc đang xem (không lọc = tất cả SP).
// Cột đầu giữ đúng mẫu Nhập Excel để sửa xong nhập lại được; cột thêm ở cuối (Nhập Excel bỏ qua).
// Cột giá nhập chỉ có khi withCost (nơi gọi quyết định: chỉ chủ shop); RLS product_costs vẫn chặn người thiếu quyền view_cost.
const EXTRA_COLUMNS = ["Giá khuyến mãi", "Trạng thái", "Link ảnh"] as const;
const COST_COLUMNS = new Set<string>(["Giá nhập", "Giá nhập + 10%"]);
const BATCH = 1000; // Supabase trả tối đa 1000 dòng mỗi lần

type Row = {
  id: number; sku: string; name: string; unit: string; price: number; sale_price: number | null; is_visible: boolean;
  industry: string | null; spec_line: string | null; description: string | null; warranty: string | null; origin: string | null; made_in: string | null;
  category_id: number | null; brand: { name: string } | null;
  inventory: { qty: number; min_qty: number; location: string } | null;
  images: { url: string; sort: number; is_illustration: boolean }[];
};
const COLUMNS = "id, sku, name, unit, price, sale_price, is_visible, industry, spec_line, description, warranty, origin, made_in, category_id, "
  + "brand:brands(name), inventory(qty, min_qty, location), images:product_images(url, sort, is_illustration)";

async function fetchAll(f: ProductFilter) {
  const rows: Row[] = [];
  const { db, query } = await filteredProducts(f, COLUMNS);
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await query.range(from, from + BATCH - 1);
    if (error) throw error;
    rows.push(...(data as unknown as Row[]));
    if (!data || data.length < BATCH) return { db, rows };
  }
}

export async function productExportSheet(f: ProductFilter, withCost: boolean): Promise<Cell[][]> {
  const { db, rows } = await fetchAll(f);
  const costs = withCost && rows.length ? await importPrices(db, rows.map((r) => r.id)) : new Map<number, number>();
  const { data: cats, error } = await db.from("categories").select("id, parent_id, name");
  if (error) throw error;
  const catById = new Map((cats ?? []).map((c) => [c.id, c]));
  const columns = [...TEMPLATE_COLUMNS.filter((c) => withCost || !COST_COLUMNS.has(c)), ...EXTRA_COLUMNS];

  const cells = (r: Row): Record<(typeof columns)[number], Cell> => {
    const cost = costs.get(r.id) ?? null;
    // SP gắn vào danh mục con → "Danh mục" là danh mục cha; SP gắn thẳng danh mục cha → để trống "Danh mục con"
    const cat = r.category_id ? catById.get(r.category_id) : undefined;
    const parent = cat?.parent_id ? catById.get(cat.parent_id) : undefined;
    return {
      "Mã hàng hóa": r.sku, "Tên sản phẩm": r.name, "Đơn vị tính": r.unit, "Giá bán": r.price,
      "Giá nhập": cost, "Giá nhập + 10%": cost === null ? null : costFromImport(cost),
      "Ngành hàng": r.industry, "Danh mục": parent?.name ?? cat?.name ?? null, "Danh mục con": parent && cat ? cat.name : null,
      "Thương hiệu": r.brand?.name ?? null, "Vị trí": r.inventory?.location ?? null, "Tồn tối thiểu": r.inventory?.min_qty ?? null,
      "Thông số": r.spec_line, "Mô tả": r.description ? htmlToText(r.description) : null,
      "Bảo hành": r.warranty, "Xuất xứ": r.origin, "Sản xuất tại": r.made_in,
      "Giá khuyến mãi": r.sale_price, "Tồn": r.inventory?.qty ?? 0, "Trạng thái": r.is_visible ? "Hiện" : "Ẩn",
      // Chỉ ảnh thật đã tải lên (bỏ ảnh minh họa), mỗi link một dòng trong ô
      "Link ảnh": r.images.filter((i) => !i.is_illustration).sort((a, b) => a.sort - b.sort).map((i) => i.url).join("\n") || null,
    };
  };
  return [[...columns], ...rows.map((r) => { const c = cells(r); return columns.map((k) => c[k]); })];
}
