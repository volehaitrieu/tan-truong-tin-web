import { requireStaff } from "@/lib/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ClipboardList, PackageX, Wallet } from "lucide-react";
import { Badge, ButtonLink, Card, OwnerOnly, PageHeader } from "@/components/admin/ui";
import { STATUS_TONE } from "@/components/admin/order-status";
import { DELIVERY_LABEL, LOW_STOCK, ORDERS, ORDER_STATUS_LABEL, REVENUE_7D } from "@/lib/mock/admin";
import { formatNum, formatVnd } from "@/lib/shop";

export const metadata: Metadata = { title: "Tổng quan" };

export default async function DashboardPage() { await requireStaff();
  const today = REVENUE_7D[REVENUE_7D.length - 1].value;
  const yesterday = REVENUE_7D[REVENUE_7D.length - 2].value;
  const pending = ORDERS.filter((o) => o.status === "cho-xac-nhan").length;
  const max = Math.max(...REVENUE_7D.map((d) => d.value));

  const stats = [
    { label: "Doanh thu hôm nay", value: formatVnd(today), note: `Hôm qua ${formatVnd(yesterday)}`, icon: Wallet, owner: true },
    { label: "Đơn mới hôm nay", value: "2", note: "Hôm qua 7 đơn", icon: ClipboardList },
    { label: "Chờ xác nhận", value: String(pending), note: "Cần gọi khách xác nhận", icon: AlertTriangle },
    { label: "Sản phẩm sắp hết", value: String(LOW_STOCK.length), note: "Tồn ≤ tồn tối thiểu", icon: PackageX },
  ];

  return (
    <>
      <PageHeader title="Tổng quan" sub="Thứ Năm, 22/10/2026 · dữ liệu mẫu" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, owner }) => (
          <div key={label} className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[13px] text-ink-2">{label}</span>
              <Icon className="size-5 text-brand" aria-hidden />
            </div>
            <p className="num mt-2 text-xl font-bold md:text-2xl">{value}</p>
            <p className="mt-1 text-xs text-ink-2">{note}</p>
            {owner && <div className="mt-2"><OwnerOnly /></div>}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Doanh thu 7 ngày" action={<OwnerOnly />}>
          <div className="flex h-56 items-end gap-2 px-4 pb-3 pt-6 md:gap-4" role="img" aria-label="Biểu đồ doanh thu 7 ngày">
            {REVENUE_7D.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="num text-[11px] text-ink-2">{(d.value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}tr</span>
                <div className="w-full max-w-10 rounded-t bg-brand" style={{ height: `${(d.value / max) * 150}px` }} />
                <span className="text-[11px] text-ink-2">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Đơn cần xử lý" action={<Link href="/admin/don-hang" className="-my-2 inline-flex min-h-11 items-center text-sm font-medium text-brand hover:underline">Xem tất cả</Link>}>
          <ul className="divide-y divide-line">
            {ORDERS.filter((o) => o.status !== "hoan-thanh").map((o) => (
              <li key={o.code}>
                <Link href={`/admin/don-hang/${o.code}`} className="flex items-center gap-3 px-4 py-3 hover:bg-ground">
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="num text-sm font-semibold">{o.code}</span>
                      {o.shipFeeMissing && <Badge tone="gold">Chưa có phí ship</Badge>}
                    </span>
                    <span className="block truncate text-[13px] text-ink-2">
                      {o.customer} · {DELIVERY_LABEL[o.delivery]}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className="num text-sm font-semibold">{formatVnd(o.total)}</span>
                    <Badge tone={STATUS_TONE[o.status]}>{ORDER_STATUS_LABEL[o.status]}</Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Sắp hết hàng" className="mt-4" action={<ButtonLink href="/admin/ton-kho" variant="secondary">Mở Tồn kho</ButtonLink>}>
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-semibold text-ink-2">
                <th className="px-4 py-2.5">Sản phẩm</th>
                <th className="px-4 py-2.5">SKU</th>
                <th className="px-4 py-2.5 text-right">Tồn / tối thiểu</th>
                <th className="px-4 py-2.5">Trạng thái</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {LOW_STOCK.map((p) => (
                <tr key={p.sku} className="h-11 border-b border-line last:border-0">
                  <td className="px-4 font-medium">{p.name}</td>
                  <td className="num px-4 text-ink-2">{p.sku}</td>
                  <td className="num px-4 text-right">
                    {formatNum(p.stock)} / {formatNum(p.min)} {p.unit}
                  </td>
                  <td className="px-4">{p.stock === 0 ? <Badge tone="danger">Hết hàng</Badge> : <Badge tone="warn">Sắp hết</Badge>}</td>
                  <td className="px-4 text-right">
                    <Link href="/admin/ton-kho" className="font-medium text-brand hover:underline">Điều chỉnh</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="divide-y divide-line md:hidden">
          {LOW_STOCK.map((p) => (
            <li key={p.sku} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{p.name}</span>
                <span className="num text-[13px] text-ink-2">
                  {p.sku} · còn {p.stock}/{p.min} {p.unit}
                </span>
              </span>
              {p.stock === 0 ? <Badge tone="danger">Hết hàng</Badge> : <Badge tone="warn">Sắp hết</Badge>}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
