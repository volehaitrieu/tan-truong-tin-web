import Image from "next/image";
import Link from "next/link";

const LOGOS: Record<string, string> = {
  ChingHai: "/brand-logos/chinghai.png",
  Lifan: "/brand-logos/lifan.webp",
  Senko: "/brand-logos/senko.png",
  Sunhouse: "https://app-upload-assets.cdn.botstar.com/6f860630-8ce3-11e9-a12c-db236403da6d/image/1687323386197/LOGO%20Hinh.png",
  Hinoki: "https://thietbidienhinoki.com/wp-content/uploads/2024/10/logo.webp",
  Midea: "https://img1.pnghut.com/23/22/0/LuPZf42Dwa/text-air-conditioning-midea-group-dehumidifier-area.jpg",
  "Rạng Đông": "https://cdn.haitrieu.com/wp-content/uploads/2022/08/logo-rang-dong-icon.png",
  Cadivi: "https://cadivi.vn/vnt_upload/news/09_2020/2015_Logo_CADIVI_new.jpg",
  "Điện Quang": "https://images.seeklogo.com/logo-png/33/1/dien-quang-logo-png_seeklogo-335452.png",
  Tolsen: "https://tolsentools.vn/image/cache/catalog/logo-tolsen-600x600.png",
  TOLSEN: "https://tolsentools.vn/image/cache/catalog/logo-tolsen-600x600.png",
};

export function BrandCarousel({ brands }: { brands: string[] }) {
  const available = brands.filter((brand) => LOGOS[brand]);
  const repeated = [...available, ...available, ...available];
  if (!available.length) return null;

  return (
    <div className="brand-marquee overflow-hidden rounded-md" aria-label="Thương hiệu">
      <div className="brand-marquee-track flex w-max gap-3 py-2">
        {repeated.map((brand, index) => (
          <Link
            key={`${brand}-${index}`}
            href={`/danh-muc?brand=${encodeURIComponent(brand)}`}
            className={`grid h-20 w-40 shrink-0 place-items-center rounded-md border border-line bg-white p-4 transition-colors hover:border-brand-line hover:bg-brand-tint ${index >= available.length ? "brand-marquee-copy" : ""}`}
            aria-label={`Xem sản phẩm thương hiệu ${brand}`}
            aria-hidden={index >= available.length}
            tabIndex={index >= available.length ? -1 : undefined}
          >
            <Image src={LOGOS[brand]} alt={brand} width={128} height={48} unoptimized className="max-h-12 w-full object-contain" />
          </Link>
        ))}
      </div>
    </div>
  );
}
