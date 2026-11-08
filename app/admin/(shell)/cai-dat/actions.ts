"use server";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SettingsState = { ok?: boolean; error?: string };

const money = (v: FormDataEntryValue | null) => {
  const d = String(v ?? "").replace(/\D/g, "");
  return d === "" ? null : Number(d);
};
const text = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function saveSettings(_: SettingsState, form: FormData): Promise<SettingsState> {
  await requireStaff("settings");
  const fee = money(form.get("inner_ship_fee"));
  const free = money(form.get("free_ship_threshold"));
  if ((fee !== null && fee > 1_000_000) || (free !== null && free > 100_000_000)) return { error: "Số tiền quá lớn, vui lòng kiểm tra lại." };
  const phone = text(form.get("phone"), 20);
  if (phone && !/^0\d{9}$/.test(phone.replace(/\D/g, ""))) return { error: "Số điện thoại cần 10 số, bắt đầu bằng 0." };

  const db = await createClient();
  const { error } = await db.from("settings").update({
    shop: {
      name: text(form.get("name"), 80) || "TÂN TRƯỜNG TÍN",
      tagline: text(form.get("tagline"), 120),
      address: text(form.get("address"), 200),
      phone,
      phone2: text(form.get("phone2"), 20),
      hours: text(form.get("hours"), 40),
    },
    inner_ship_fee: fee,
    free_ship_threshold: free,
    return_policy: text(form.get("return_policy"), 5000) || null,
    updated_at: new Date().toISOString(),
  }).eq("id", 1).select("id");
  if (error) return { error: "Không lưu được. Vui lòng thử lại." };
  revalidatePath("/", "layout");
  return { ok: true };
}

// Nút "Gửi tin thử" trong Cài đặt: chỉ người có quyền settings; không nhận dữ liệu từ trình duyệt (nội dung cố định).
export async function sendTestTelegram(): Promise<{ ok: boolean; error?: string }> {
  await requireStaff("settings");
  const { sendTelegram, telegramConfigured } = await import("@/lib/notify/telegram");
  if (!telegramConfigured()) return { ok: false, error: "Chưa cài mã bot trên máy chủ. Xem hướng dẫn tạo bot." };
  return sendTelegram("Tin thử từ trang quản trị Tân Trường Tín: bot báo đơn hoạt động.");
}
