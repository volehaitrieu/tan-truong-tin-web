"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { setFavorite as saveFavorite, syncFavorites } from "@/app/(store)/yeu-thich-actions";

const KEY = "ttt-favorite-products";
const EVENT = "ttt-favorites-change";

function readFavorites() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(list: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* bộ nhớ trình duyệt bị chặn */ }
  window.dispatchEvent(new Event(EVENT));
}

// Đồng bộ một lần mỗi lần tải trang: khách đăng nhập → gộp danh sách trên máy vào tài khoản và dùng danh sách tài khoản.
let synced: Promise<boolean> | null = null;
let generation = 0;
export function clearFavorites() {
  generation++;
  synced = null;
  try { localStorage.removeItem(KEY); } catch { /* bộ nhớ bị chặn */ }
  window.dispatchEvent(new Event(EVENT));
}
function syncOnce(): Promise<boolean> {
  // Chưa có cookie đăng nhập Supabase → chắc chắn là khách vãng lai, khỏi gọi máy chủ
  if (!document.cookie.includes("-auth-token")) return Promise.resolve(false);
  const started = generation;
  synced ??= syncFavorites(readFavorites()).then((list) => {
    if (started !== generation) return false;
    if (list) writeFavorites(list);
    return list !== null;
  }).catch(() => false);
  return synced;
}

export function FavoriteButton({ sku, name }: { sku: string; name: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const sync = () => setFavorite(readFavorites().includes(sku));
    sync();
    void syncOnce();
    window.addEventListener(EVENT, sync);
    const storageChanged = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue === null) { generation++; synced = null; }
      sync();
    };
    window.addEventListener("storage", storageChanged);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", storageChanged);
    };
  }, [sku]);

  const toggle = () => {
    const current = readFavorites();
    const next = current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku];
    const on = next.includes(sku);
    setFavorite(on);
    writeFavorites(next);
    // Đã đăng nhập thì lưu lên tài khoản; lỗi mạng không làm mất trạng thái trên máy
    void syncOnce().then((loggedIn) => { if (loggedIn) void saveFavorite(sku, on); });
  };

  return (
    <button type="button" onClick={toggle} aria-label={favorite ? `Bỏ ${name} khỏi yêu thích` : `Thêm ${name} vào yêu thích`} aria-pressed={favorite} className="group absolute right-0.5 top-0.5 z-10 grid size-10 place-items-center rounded-full text-ink transition-colors hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand">
      {/* Vòng trắng nhỏ 32px; vùng bấm vẫn 40px */}
      <span className="grid size-8 place-items-center rounded-full bg-white/95 shadow-sm"><Heart className={`size-4 ${favorite ? "fill-danger text-danger" : ""}`} aria-hidden /></span>
    </button>
  );
}
