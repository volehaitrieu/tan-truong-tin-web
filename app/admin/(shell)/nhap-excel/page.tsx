import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ImportClient } from "./ImportClient";

export const metadata: Metadata = { title: "Nhập Excel" };

export default async function ImportPage() {
  await requireStaff("import_excel");
  const db = await createClient();
  const [{ data: cats }, { data: brands }] = await Promise.all([
    db.from("categories").select("id, parent_id, name, slug, sort").order("sort"),
    db.from("brands").select("name").order("name"),
  ]);
  const all = cats ?? [];
  const subs = all.filter((c) => c.parent_id !== null).map((c) => ({ slug: c.slug, name: c.name, parent: all.find((p) => p.id === c.parent_id)?.name ?? "" }));
  return (
    <>
      <PageHeader title="Nhập Excel" sub="Xem trước, báo lỗi từng dòng; chỉ ghi khi bạn xác nhận." />
      <ImportClient subs={subs} brands={(brands ?? []).map((b) => b.name)} />
    </>
  );
}
