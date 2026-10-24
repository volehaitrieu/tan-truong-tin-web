"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Check, Download, FolderDown, Pencil, X } from "lucide-react";
import { Badge, OwnerOnly } from "@/components/admin/ui";
import { ProductCell, ProductThumb, stockClass } from "@/components/admin/ProductCell";
import { ProductDescription, ProductFacts, ProductPrice, ProductSpecs } from "@/components/admin/ProductInfo";
import { getProductPreview, getProductPreviews } from "@/app/admin/(shell)/san-pham/actions";
import { canPickFolder, downloadQuoteImages, pickFolder, quoteFolderName, saveQuotesToFolder } from "@/lib/quote-image";
import type { ProductRow } from "@/lib/admin/products";
import type { ProductPreview } from "@/lib/admin/preview";
import { formatVnd } from "@/lib/shop";

// Danh sách SP: bấm dòng → khung chi tiết; tick nhiều SP → tải ảnh báo giá PNG.
const box = "size-5 shrink-0 cursor-pointer accent-[var(--color-brand)]";
// Tải ảnh báo giá PNG: mỗi SP một ảnh vào thư mục Tải xuống (kéo thẳng vào Zalo)
let busy = false;
async function openQuote(ids: number[]) {
  if (busy || !ids.length) return;
  busy = true;
  try {
    const msg = await downloadQuoteImages(async () => {
      document.body.style.cursor = "progress";
      return getProductPreviews(ids);
    });
    if (msg) alert(msg);
  } catch { alert("Không tạo được ảnh, vui lòng thử lại."); }
  finally { busy = false; document.body.style.cursor = ""; }
}

export function ProductTable({ items, canEdit, canCost }: { items: ProductRow[]; canEdit: boolean; canCost: boolean }) {
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [openId, setOpenId] = useState<number | null>(null);
  const close = useCallback(() => setOpenId(null), []);
  const all = items.length > 0 && items.every((p) => picked.has(p.id));
  const toggle = (id: number) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () => setPicked((s) => { const n = new Set(s); for (const p of items) if (all) n.delete(p.id); else n.add(p.id); return n; });
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  // Nhiều SP: hiện bảng của web trước rồi mới chọn chỗ lưu thư mục; 1 SP hoặc trình duyệt không hỗ trợ → tải thẳng
  const [saveIds, setSaveIds] = useState<number[] | null>(null);
  const requestDownload = (ids: number[]) => (ids.length > 1 && canPickFolder() ? setSaveIds(ids) : openQuote(ids));

  return (
    <>
      {saveIds && <SaveFolderDialog ids={saveIds} onClose={() => setSaveIds(null)} />}
      {/* Thanh chọn: luôn gọn một hàng; nút tải chỉ hiện khi đã chọn */}
      <div className="flex min-h-12 items-center gap-3 border-b border-line bg-ground px-3 py-1.5">
        <label className="flex min-h-11 items-center gap-2 text-sm font-medium">
          <input type="checkbox" className={box} checked={all} onChange={toggleAll} aria-label="Chọn tất cả sản phẩm trên trang này" />
          <span>Chọn tất cả <span className="text-ink-2">({items.length})</span></span>
        </label>
        {picked.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm text-ink-2 sm:inline">Đã chọn <b className="text-ink">{picked.size}</b></span>
            <button onClick={() => setPicked(new Set())} className="h-9 rounded px-3 text-sm text-ink-2 hover:bg-white">Bỏ chọn</button>
            <button onClick={() => requestDownload([...picked])} className="inline-flex h-9 items-center gap-1.5 rounded bg-brand px-3 text-sm font-semibold text-white hover:bg-brand-deep">
              <Download className="size-4" aria-hidden />Tải {picked.size} SP
            </button>
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-ink-2">
            <tr className="border-b border-line">
              <th className="w-12 px-3 py-3" />
              {["Sản phẩm", "Danh mục", "Thương hiệu", "Giá bán", "Giá nhập", "Tồn", "Vị trí", "Trạng thái", ""].map((h) => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} onClick={() => setOpenId(p.id)} className={`h-14 cursor-pointer border-t border-line hover:bg-ground ${picked.has(p.id) ? "bg-brand-tint/40" : ""}`}>
                <td className="px-3" onClick={stop}><input type="checkbox" className={box} checked={picked.has(p.id)} onChange={() => toggle(p.id)} aria-label={`Chọn ${p.name}`} /></td>
                <td className="px-3 py-2"><ProductCell name={p.name} sku={p.sku} image={p.image} /></td>
                <td className="px-3">{p.cat}</td>
                <td className="px-3">{p.brand}</td>
                <td className="num px-3">{formatVnd(p.salePrice ?? p.price)}{p.salePrice != null && <small className="block text-ink-2 line-through">{formatVnd(p.price)}</small>}</td>
                <td className="num px-3">{canCost ? (p.cost != null ? formatVnd(p.cost) : "—") : <OwnerOnly label="Ẩn" />}</td>
                <td className={`num px-3 ${stockClass(p.stock, p.min)}`}>{p.stock}</td>
                <td className="whitespace-nowrap px-3">{p.location}</td>
                <td className="px-3"><Badge tone={p.visible ? "ok" : "neutral"}>{p.visible ? "Hiển thị" : "Ẩn"}</Badge></td>
                <td className="px-3" onClick={stop}>{canEdit && <Link href={`/admin/san-pham/${p.id}`} aria-label={`Sửa ${p.name}`} className="grid size-11 -my-2 place-items-center rounded text-brand hover:bg-brand-tint"><Pencil className="size-4" /></Link>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line md:hidden">
        {items.map((p) => (
          <li key={p.id} onClick={() => setOpenId(p.id)} className={`flex cursor-pointer gap-3 p-3 ${picked.has(p.id) ? "bg-brand-tint/40" : ""}`}>
            <span onClick={stop} className="grid place-items-center"><input type="checkbox" className={box} checked={picked.has(p.id)} onChange={() => toggle(p.id)} aria-label={`Chọn ${p.name}`} /></span>
            <ProductThumb src={p.image} size={60} />
            <div className="min-w-0 flex-1">
              <b className="block text-sm leading-snug">{p.name}</b>
              <small className="num block break-all text-xs text-ink-2">Mã: {p.sku}</small>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <b className="num text-sm text-danger">{formatVnd(p.salePrice ?? p.price)}</b>
                <span className="text-xs text-ink-2">Tồn <span className={`num ${stockClass(p.stock, p.min) || "text-ink"}`}>{p.stock}</span> · {p.location}</span>
                {!p.visible && <Badge>Ẩn</Badge>}
              </div>
            </div>
            {canEdit && <Link onClick={stop} href={`/admin/san-pham/${p.id}`} aria-label={`Sửa ${p.name}`} className="grid size-11 shrink-0 place-items-center rounded text-brand hover:bg-brand-tint"><Pencil className="size-4" /></Link>}
          </li>
        ))}
      </ul>

      {openId !== null && (
        <ProductDialog
          id={openId}
          picked={picked.has(openId)}
          pickedCount={picked.size}
          onToggle={() => toggle(openId)}
          onDownloadPicked={() => requestDownload([...picked])}
          canEdit={canEdit}
          onClose={close}
        />
      )}
    </>
  );
}

function ProductDialog({ id, picked, pickedCount, onToggle, onDownloadPicked, canEdit, onClose }: {
  id: number; picked: boolean; pickedCount: number; onToggle: () => void; onDownloadPicked: () => void; canEdit: boolean; onClose: () => void;
}) {
  const [p, setP] = useState<ProductPreview | null>(null);
  const [img, setImg] = useState(0);
  const [loading, start] = useTransition();

  useEffect(() => {
    start(async () => { setP(await getProductPreview(id)); setImg(0); });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [id, onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-4" role="dialog" aria-modal="true" aria-label={p?.name ?? "Chi tiết sản phẩm"}>
      <button aria-label="Đóng" onClick={onClose} className="absolute inset-0 bg-ink/50" />
      <div className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl lg:max-h-[96dvh] lg:w-[min(1320px,96vw)] bg-white shadow-2xl md:rounded-xl">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <span className="text-sm font-semibold text-ink-2">Chi tiết sản phẩm</span>
          <button onClick={onClose} aria-label="Đóng" className="grid size-10 place-items-center rounded hover:bg-ground"><X className="size-5" /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
          {!p ? (
            <p className="py-16 text-center text-sm text-ink-2">{loading ? "Đang tải…" : "Không tìm thấy sản phẩm."}</p>
          ) : (
            // Máy tính: 3 cột (ảnh + giá | thông tin + thông số | mô tả) để thấy hết, không phải kéo
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="space-y-3">
                <div className="relative mx-auto aspect-square max-w-60 overflow-hidden rounded-lg border border-line bg-sunk md:max-w-none">
                  {p.images[img] && <Image src={p.images[img]} alt={p.name} fill sizes="(max-width: 768px) 100vw, 260px" className="object-cover" />}
                </div>
                {p.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {p.images.map((src, i) => (
                      <button key={src} onClick={() => setImg(i)} aria-label={`Xem ảnh ${i + 1}`} aria-current={i === img}
                        className={`relative aspect-square overflow-hidden rounded border-2 ${i === img ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}>
                        <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-extrabold leading-snug">{p.name}</h2>
                  <p className="num mt-1 text-xs text-ink-2">Mã: {p.sku}</p>
                </div>
                <ProductPrice p={p} />
              </div>
              <div className="min-w-0 space-y-4">
                <ProductFacts p={p} />
                <ProductSpecs p={p} />
              </div>
              <div className="min-w-0 md:col-span-2 lg:col-span-1">
                <ProductDescription p={p} />
              </div>
            </div>
          )}
        </div>

        {/* Chân khung: tải 1 SP, hoặc thêm vào danh sách để tải nhiều SP cùng lúc */}
        <div className="flex items-center gap-2 border-t border-line bg-ground px-3 py-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] md:px-4 md:py-3">
          <button onClick={onToggle} className={`inline-flex h-10 items-center gap-1.5 rounded border px-3 text-sm font-medium ${picked ? "border-brand bg-brand-tint text-brand" : "border-line bg-white"}`}>
            {picked && <Check className="size-4" aria-hidden />}<span className="md:hidden">{picked ? "Đã chọn" : "Chọn"}</span><span className="hidden md:inline">{picked ? "Đã thêm vào danh sách tải" : "Thêm vào danh sách tải"}</span>
          </button>
          {canEdit && <Link href={`/admin/san-pham/${id}`} className="inline-flex h-10 items-center gap-1.5 rounded px-3 text-sm text-brand hover:bg-white"><Pencil className="size-4" aria-hidden />Sửa</Link>}
          <div className="ml-auto flex gap-2">
            {pickedCount > 0 && (
              <button onClick={onDownloadPicked} className="h-10 rounded border border-brand bg-white px-3 text-sm font-semibold text-brand">Tải {pickedCount}<span className="hidden md:inline"> SP đã chọn</span></button>
            )}
            <button onClick={() => openQuote([id])} className="inline-flex h-10 items-center gap-1.5 rounded bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-deep">
              <Download className="size-4" aria-hidden />Tải<span className="hidden sm:inline"> SP này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bảng của web trước khi mở hộp chọn thư mục của Windows: giải thích rõ sẽ lưu gì, ở đâu.
function SaveFolderDialog({ ids, onClose }: { ids: number[]; onClose: () => void }) {
  const [state, setState] = useState<{ busy: boolean; msg: string; ok: boolean }>({ busy: false, msg: "", ok: false });
  const folder = quoteFolderName();
  const fail = "Không lưu được vào thư mục này. Hãy tạo thư mục “Báo giá” bên trong Tải xuống rồi chọn thư mục đó (dùng Chrome hoặc Edge).";
  const choose = async () => {
    let dir;
    setState({ busy: true, msg: "", ok: false }); // khóa nút trong lúc hộp Windows đang mở
    try { dir = await pickFolder(); } // gọi ngay trong lần bấm (trình duyệt yêu cầu)
    catch (e) {
      // Bấm Hủy → giữ nguyên bảng, bấm lại được; lỗi khác (hộp đang mở, bị chặn…) → báo rõ
      setState({ busy: false, msg: e instanceof DOMException && e.name === "AbortError" ? "" : fail, ok: false });
      return;
    }
    try {
      // Chờ tối đa 30 giây (trình duyệt có thể treo khi không hiện được câu hỏi cấp quyền)
      const msg = await Promise.race([
        saveQuotesToFolder(dir, await getProductPreviews(ids)),
        new Promise<never>((_, no) => setTimeout(() => no(new Error("timeout")), 30_000)),
      ]);
      setState({ busy: false, msg, ok: true });
    } catch {
      setState({ busy: false, msg: fail, ok: false });
    }
  };
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Lưu ảnh báo giá">
      <button aria-label="Đóng" onClick={state.busy ? undefined : onClose} className="absolute inset-0 bg-ink/50" />
      <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-tint text-brand"><FolderDown className="size-5" aria-hidden /></span>
          <div>
            <h2 className="text-lg font-bold">Lưu {ids.length} ảnh báo giá</h2>
            <p className="mt-1 text-sm text-ink-2">Web sẽ tạo thư mục <b className="text-ink">{folder}</b> chứa {ids.length} ảnh PNG, mỗi ảnh mang tên sản phẩm.</p>
          </div>
        </div>
        {!state.ok && (
          <ol className="mt-4 list-decimal space-y-1 rounded-md bg-ground p-3 pl-8 text-sm">
            <li>Bấm <b>Chọn chỗ lưu</b>.</li>
            <li>Trong hộp của Windows, mở <b>Tải xuống</b>, bấm <b>Thư mục mới</b>, đặt tên <b>Báo giá</b> rồi bấm đúp để vào thư mục đó. <span className="text-ink-2">(Chrome không cho lưu thẳng vào Tải xuống/Màn hình; chỉ cần tạo 1 lần, lần sau hộp tự mở đúng chỗ.)</span></li>
            <li>Bấm nút <b>Chọn cặp</b> (không cần gõ gì), rồi bấm <b>Lưu thay đổi / Cho phép</b> nếu được hỏi.</li>
          </ol>
        )}
        {state.msg && <p role="status" className={`mt-4 rounded-md p-3 text-sm ${state.ok ? "bg-brand-tint text-brand" : "bg-[#fef2f2] text-danger"}`}>{state.msg}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} disabled={state.busy} className="h-10 rounded border border-line px-4 text-sm font-medium disabled:opacity-50">{state.ok ? "Đóng" : "Hủy"}</button>
          {!state.ok && (
            <button onClick={choose} disabled={state.busy} className="inline-flex h-10 items-center gap-1.5 rounded bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60">
              <FolderDown className="size-4" aria-hidden />{state.busy ? "Đang chờ chọn chỗ lưu…" : "Chọn chỗ lưu"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
