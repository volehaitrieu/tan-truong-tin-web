import { after } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { sendTelegram } from "@/lib/notify/telegram";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 16_384) return Response.json({ success: false }, { status: 413 });

  const rawBody = await request.text();
  if (!rawBody || Buffer.byteLength(rawBody, "utf8") > 16_384) return Response.json({ success: false }, { status: 413 });
  const timestamp = request.headers.get("x-sepay-timestamp");
  const signature = request.headers.get("x-sepay-signature");
  if (!timestamp || !signature) return Response.json({ success: false }, { status: 401 });

  const { data, error } = await createPublicClient().rpc("sepay_receive", {
    p_raw_body: rawBody,
    p_timestamp: timestamp,
    p_signature: signature,
  });
  if (error) {
    const status = /signature|timestamp|secret/i.test(error.message) ? 401 : 500;
    return Response.json({ success: false }, { status });
  }
  if (data?.matched === true && typeof data.order_code === "string" && /^TTT\d{6}$/.test(data.order_code)) {
    const code = data.order_code;
    after(async () => { await sendTelegram(`ĐÃ NHẬN CHUYỂN KHOẢN ${code}\nĐơn đã được xác nhận thanh toán. Vào trang quản trị để xử lý.`); });
  } else if (data?.review === true) {
    after(async () => { await sendTelegram("SePay có giao dịch cần kiểm tra. Vào Quản trị → Giao dịch để đối chiếu trước khi xử lý đơn."); });
  }
  // Một số cấu hình webhook SePay cũ chỉ chấp nhận 201.
  return Response.json({ success: true }, { status: 201 });
}
