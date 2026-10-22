import { Hammer } from "lucide-react";
import { ButtonLink, PageHeader } from "@/components/admin/ui";

// Màn chưa dựng xong — giữ đường dẫn hoạt động, không để link hỏng.
export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-line bg-surface px-6 py-16 text-center">
        <Hammer className="mb-3 size-8 text-brand" aria-hidden />
        <p className="font-semibold">Màn này đang được dựng</p>
        <p className="mt-1 max-w-sm text-sm text-ink-2">Giao diện theo docs/GIAO_DIEN_BAN_GIAO.md sẽ có ở bản kế tiếp.</p>
        <div className="mt-5">
          <ButtonLink href="/admin" variant="secondary">Về Tổng quan</ButtonLink>
        </div>
      </div>
    </>
  );
}
