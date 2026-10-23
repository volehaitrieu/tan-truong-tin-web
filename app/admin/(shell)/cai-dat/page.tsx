import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Cài đặt" };

export default async function SettingsPage() {
  await requireStaff("settings");
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Cài đặt" sub="Thay đổi được ghi vào Nhật ký thao tác." />
      <SettingsForm s={s} />
    </>
  );
}
