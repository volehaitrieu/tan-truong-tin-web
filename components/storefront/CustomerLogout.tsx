"use client";

import { LogOut } from "lucide-react";
import { logoutCustomer } from "@/app/(store)/tai-khoan/actions";
import { clearFavorites } from "@/components/storefront/FavoriteButton";

export function CustomerLogout() {
  return (
    <form action={logoutCustomer} onSubmit={clearFavorites}>
      <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 font-semibold text-ink hover:bg-sunk"><LogOut className="size-4" aria-hidden />Đăng xuất</button>
    </form>
  );
}
