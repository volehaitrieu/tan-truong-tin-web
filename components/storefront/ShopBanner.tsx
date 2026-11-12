import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SHOP } from "@/lib/shop";

export function ShopBanner() {
  return (
    <section aria-label="Cửa hàng Tân Trường Tín" className="shop-banner mb-6">
      <div className="shop-banner-body">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-white/75">Tân Trường Tín · Nha Trang</p>
        <h2 className="mt-3 max-w-xl text-[24px] font-extrabold leading-[1.16] tracking-tight text-white sm:text-[36px]">Chọn đúng món, mua thật dễ</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/85">Xem hàng theo ngành, so sánh sản phẩm và đặt hàng dễ dàng.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href="/danh-muc" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#17324d] transition-colors hover:bg-[#e8f0f1]">Xem sản phẩm <ArrowRight className="size-4" aria-hidden /></Link>
          <span className="text-xs text-white/75">Mở {SHOP.hours} hằng ngày</span>
        </div>
      </div>
      <div className="shop-banner-photo">
        <Image src="/shop/mat-tien.webp" alt="Mặt tiền cửa hàng Tân Trường Tín trên đường 2/4, Nha Trang" fill sizes="(min-width: 768px) 45vw, 100vw" priority className="object-cover object-center" />
      </div>
    </section>
  );
}
