"use client";
import { useMemo, useState, useTransition } from "react";
import { FileSpreadsheet } from "lucide-react";
import { readXlsx } from "@/lib/excel/read-xlsx";
import { detectAndParse, markDuplicates, type ImportRow } from "@/lib/excel/parse-products";
import { importProducts, type ImportResult } from "./actions";
import { formatVnd } from "@/lib/shop";

type Sub = { slug: string; name: string; parent: string };
const STEPS = ["1 · Chọn file", "2 · Xem trước & kiểm lỗi", "3 · Xác nhận"];

export function ImportClient({ subs, brands }: { subs: Sub[]; brands: string[] }) {
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [format, setFormat] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [defaultSub, setDefaultSub] = useState("");
  const [show, setShow] = useState<"all" | "error" | "nocat">("all");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [pending, start] = useTransition();
  const subName = useMemo(() => new Map(subs.map((s) => [s.slug, `${s.parent} › ${s.name}`])), [subs]);

  async function onFile(f: File | undefined) {
    setError(""); setRows(null); setResult(null);
    if (!f) return;
    if (!/\.xlsx$/i.test(f.name)) return setError("Chỉ nhận file .xlsx (Excel).");
    try {
      // Mẫu KHO XHD: CHỈ đọc sheet DMHH (bỏ qua TON KHO)
      const sheets = await readXlsx(f);
      delete sheets["TON KHO"];
      const parsed = detectAndParse(sheets, brands);
      setRows(markDuplicates(parsed.rows));
      setFormat(parsed.format);
      setFileName(f.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không đọc được file.");
    }
  }

  const bad = rows?.filter((r) => r.errors.length) ?? [];
  const nocat = rows?.filter((r) => !r.errors.length && !r.sub) ?? [];
  const ok = rows ? rows.length - bad.length - (defaultSub ? 0 : nocat.length) : 0;
  const visible = (rows ?? []).filter((r) => (show === "error" ? r.errors.length : show === "nocat" ? !r.sub && !r.errors.length : true)).slice(0, 300);
  const step = result?.ok ? 2 : rows ? 1 : 0;

  return (
    <>
      <ol className="mb-5 grid grid-cols-3 gap-2">
        {STEPS.map((s, i) => <li key={s} className={`rounded-lg p-3 text-center text-xs font-semibold sm:text-sm ${i <= step ? "bg-brand text-white" : "bg-white text-ink-2"}`}>{s}</li>)}
      </ol>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line bg-white p-6 text-center hover:border-brand">
        <FileSpreadsheet className="size-10 text-brand" aria-hidden />
        <b>{fileName || "Chọn file Excel (.xlsx)"}</b>
        <span className="text-sm text-ink-2">Mẫu DMHH (KHO XHD — chỉ đọc sheet DMHH) hoặc file quạt (Import_SanPham)</span>
        <input type="file" accept=".xlsx" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
      {error && <p role="alert" className="mt-3 rounded bg-[#fef2f2] p-3 text-sm text-danger">{error}</p>}

      {rows && !result?.ok && (
        <section className="mt-4 rounded-lg border border-line bg-white p-4">
          <p className="text-sm">Mẫu: <b>{format}</b> · {rows.length} dòng · <span className="text-ok">{ok} dòng sẽ nhập</span> · <span className="text-danger">{bad.length} dòng lỗi (bỏ qua)</span> · <span className="text-ask">{nocat.length} dòng chưa rõ danh mục</span></p>
          {nocat.length > 0 && (
            <label className="mt-3 block text-sm">Danh mục cho {nocat.length} dòng chưa phân loại (để trống = bỏ qua các dòng này)
              <select value={defaultSub} onChange={(e) => setDefaultSub(e.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-white px-3 sm:w-96">
                <option value="">— Bỏ qua —</option>
                {subs.map((s) => <option key={s.slug} value={s.slug}>{s.parent} › {s.name}</option>)}
              </select>
            </label>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {([["all", "Tất cả"], ["error", `Dòng lỗi (${bad.length})`], ["nocat", `Chưa rõ danh mục (${nocat.length})`]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setShow(k)} className={`min-h-11 rounded border px-3 text-sm ${show === k ? "border-brand bg-brand-tint text-brand" : "border-line"}`}>{l}</button>
            ))}
          </div>
          <div className="mt-3 max-h-[60vh] overflow-auto rounded border border-line">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-ground text-left text-xs text-ink-2"><tr>{["Dòng", "SKU", "Tên", "Đơn vị", "Giá bán", "Danh mục", "Tình trạng"].map((h) => <th key={h} className="px-2 py-2 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.line} className={`border-t border-line ${r.errors.length ? "bg-[#fef2f2]" : ""}`}>
                    <td className="num px-2 py-1.5 text-ink-2">{r.line}</td>
                    <td className="num px-2">{r.sku}</td>
                    <td className="px-2">{r.name}</td>
                    <td className="px-2">{r.unit}</td>
                    <td className="num px-2">{Number.isFinite(r.price) ? formatVnd(r.price) : "—"}</td>
                    <td className="px-2 text-ink-2">{r.sub ? subName.get(r.sub) : defaultSub ? subName.get(defaultSub) : "—"}</td>
                    <td className="px-2">{r.errors.length ? <span className="text-danger">{r.errors.join(", ")}</span> : <span className="text-ok">OK</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 300 && <p className="p-2 text-xs text-ink-2">Chỉ hiện 300 dòng đầu.</p>}
          </div>
          <p className="mt-3 text-[13px] text-ink-2">SKU đã có sẽ được cập nhật (tên, giá, danh mục…). Tồn kho không thay đổi. Chưa ghi gì cho tới khi bấm xác nhận.</p>
          <button disabled={pending || ok <= 0} onClick={() => start(async () => setResult(await importProducts(rows.filter((r) => !r.errors.length && (r.sub || defaultSub)), defaultSub || null)))}
            className="mt-3 h-12 rounded bg-brand px-5 font-semibold text-white disabled:opacity-50">{pending ? "Đang nhập…" : `Xác nhận nhập ${ok} sản phẩm`}</button>
          {result && !result.ok && <p role="alert" className="mt-2 text-sm text-danger">{result.error}</p>}
        </section>
      )}
      {result?.ok && (
        <p role="status" className="mt-4 rounded-lg bg-brand-tint p-4 text-sm">
          Đã nhập xong: <b>{result.added}</b> sản phẩm mới, <b>{result.updated}</b> cập nhật, {result.skipped} dòng bỏ qua.
        </p>
      )}
    </>
  );
}
