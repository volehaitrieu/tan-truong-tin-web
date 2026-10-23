import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nhật ký thao tác" };

// Ai đã làm gì: ghi tự động bằng trigger trong DB (sửa SP, giá nhập, quyền, nhân viên, cài đặt).
const ACTION: Record<string, string> = {
  "insert:products": "Thêm sản phẩm", "update:products": "Sửa sản phẩm",
  "insert:product_costs": "Nhập giá nhập", "update:product_costs": "Sửa giá nhập", "delete:product_costs": "Xóa giá nhập",
  "update:role_permissions": "Đổi quyền", "update:profiles": "Sửa nhân viên", "update:settings": "Sửa cài đặt",
};
const FIELD: Record<string, string> = {
  price: "giá bán", sale_price: "giá KM", sale_from: "KM từ", sale_to: "KM đến", name: "tên", is_visible: "hiển thị",
  cost_price: "giá nhập", allowed: "cho phép", role: "vai trò", is_active: "hoạt động", inner_ship_fee: "phí ship nội thành",
};
const IGNORE = new Set(["updated_at", "search_text", "in_stock"]);

function changes(details: unknown) {
  const d = details as { old?: Record<string, unknown>; new?: Record<string, unknown> } | null;
  if (!d?.old || !d.new) return "";
  return Object.keys(d.new)
    .filter((k) => !IGNORE.has(k) && JSON.stringify(d.old![k]) !== JSON.stringify(d.new![k]))
    .map((k) => `${FIELD[k] ?? k}: ${String(d.old![k] ?? "—")} → ${String(d.new![k] ?? "—")}`)
    .join(" · ")
    .slice(0, 240);
}

export default async function AuditPage() {
  await requireStaff("view_audit");
  const db = await createClient();
  const { data: rows } = await db.from("audit_log").select("id, actor, action, target, details, created_at").order("created_at", { ascending: false }).limit(200);
  const ids = [...new Set((rows ?? []).map((r) => r.actor).filter(Boolean))] as string[];
  const { data: people } = ids.length ? await db.from("profiles").select("id, full_name").in("id", ids) : { data: [] };
  const who = new Map((people ?? []).map((p) => [p.id, p.full_name]));
  const fmt = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <PageHeader title="Nhật ký thao tác" sub="200 thao tác gần nhất · chỉ xem" />
      {!rows?.length ? (
        <p className="rounded-lg border border-line bg-white p-6 text-center text-sm text-ink-2">Chưa có thao tác nào được ghi.</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-white">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap gap-x-4 gap-y-1 p-3 text-sm">
              <span className="num shrink-0 text-ink-2 sm:w-36">{fmt.format(new Date(r.created_at))}</span>
              <span className="shrink-0 font-medium sm:w-32">{(r.actor && who.get(r.actor)) || "Nhân viên"}</span>
              <span className="min-w-0 flex-1 basis-full [overflow-wrap:anywhere] sm:basis-auto">
                {ACTION[r.action] ?? r.action}{r.target ? <span className="num text-ink-2"> · {r.target}</span> : null}
                {changes(r.details) && <small className="block text-ink-2">{changes(r.details)}</small>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
