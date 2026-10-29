"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileDown } from "lucide-react";
import { exportProducts } from "@/app/admin/(shell)/san-pham/actions";
import { buildXlsx, downloadBlob } from "@/lib/excel/write-xlsx";
import { TEMPLATE_SHEET } from "@/lib/excel/parse-products";
import { FILTER_KEYS, type ProductSearchParams } from "@/lib/admin/products-params";

// Xuất Excel đúng những SP đang tìm/lọc (bỏ qua trang và số dòng mỗi trang); không lọc = tất cả SP.
// Tên sheet giống mẫu Nhập Excel để sửa xong nhập lại được.
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }); // YYYY-MM-DD

export function ProductExportButton({ total }: { total: number }) {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const sp: ProductSearchParams = {};
      for (const k of FILTER_KEYS) { const v = params.get(k); if (v) sp[k] = v; }
      const result = await exportProducts(sp);
      if (!result.ok) { window.alert(result.error); return; }
      const widths = result.rows[0].map((h) => (h === "Tên sản phẩm" || h === "Mô tả" || h === "Link ảnh" ? 45 : 16));
      downloadBlob(buildXlsx([{ name: TEMPLATE_SHEET, rows: result.rows, widths }]), `San_pham_${today()}.xlsx`);
    } catch {
      window.alert("Không xuất được file. Vui lòng kiểm tra mạng rồi thử lại.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <button type="button" onClick={() => void run()} disabled={busy || total === 0}
      className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-ctl)] border border-line bg-surface px-3.5 text-sm font-medium text-ink hover:border-brand hover:text-brand disabled:opacity-50">
      <FileDown className="size-4" aria-hidden />{busy ? "Đang xuất…" : `Xuất Excel (${total})`}
    </button>
  );
}
