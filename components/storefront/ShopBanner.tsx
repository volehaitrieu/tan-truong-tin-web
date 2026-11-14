import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ORDERING_PAUSED, SHOP } from "@/lib/shop";

// Màn đầu trang chủ: nói rõ shop bán gì, ở đâu, mua thế nào (bài học video YC: H1 = là gì, cho ai, hành động).
// Khi đang tạm ngưng đặt hàng trên web, nút chính là gọi shop; khi mở lại, nút chính là xem sản phẩm.
export function ShopBanner() {
  return (
    <section aria-labelledby="h-trang-chu" className="shop-banner mb-6">
      <div className="shop-banner-body">
        <h1 id="h-trang-chu" className="max-w-xl text-[24px] font-extrabold leading-[1.16] tracking-tight text-white sm:text-[36px]">Điện nước, quạt, gia dụng tại Nha Trang</h1>
        <p className="mt-3 max-w-md text-[15px] leading-6 text-white/90">
          Cửa hàng Tân Trường Tín, 379 đường 2/4. Xem giá ngay trên web, {ORDERING_PAUSED ? "gọi hoặc nhắn Zalo để đặt hàng." : "đặt hàng hoặc gọi shop để được tư vấn."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
          {ORDERING_PAUSED ? (
            <>
              <a href="tel:0948732064" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#17324d] transition-colors hover:bg-[#e8f0f1]"><Phone className="size-4" aria-hidden />Gọi {SHOP.phone}</a>
              <Link href="/danh-muc" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline">Xem sản phẩm <ArrowRight className="size-4" aria-hidden /></Link>
            </>
          ) : (
            <Link href="/danh-muc" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#17324d] transition-colors hover:bg-[#e8f0f1]">Xem sản phẩm <ArrowRight className="size-4" aria-hidden /></Link>
          )}
        </div>
        <p className="mt-3 text-xs text-white/80">Mở cửa {SHOP.hours} hằng ngày</p>
      </div>
      <div className="shop-banner-photo">
        <Image src="/shop/mat-tien.webp" alt="Mặt tiền cửa hàng Tân Trường Tín trên đường 2/4, Nha Trang" fill sizes="(min-width: 768px) 45vw, 100vw" priority className="object-cover object-center" />
      </div>
    </section>
  );
}
