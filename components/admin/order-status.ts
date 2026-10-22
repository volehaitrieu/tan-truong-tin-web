import type { Tone } from "@/components/admin/ui";
import type { OrderStatus } from "@/lib/mock/admin";

export const STATUS_TONE: Record<OrderStatus, Tone> = {
  "cho-xac-nhan": "warn",
  "da-xac-nhan": "info",
  "dang-giao": "info",
  "san-sang-lay": "info",
  "hoan-thanh": "ok",
  "da-huy": "danger",
};
