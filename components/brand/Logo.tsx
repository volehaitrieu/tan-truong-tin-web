import Image from "next/image";

type Props = { size?: number; subtitle?: string; subtitleClassName?: string; tone?: "brand" | "light" };

export function Logo({ size = 36, subtitle, subtitleClassName = "", tone = "brand" }: Props) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/brand/logo-trong-suot.png" alt="" width={size} height={size} priority className="shrink-0" />
      <span className="flex flex-col leading-tight">
        <span className={`text-[15px] font-extrabold tracking-wide ${tone === "light" ? "text-white" : "text-brand"}`}>
          TÂN TRƯỜNG TÍN
        </span>
        {subtitle && (
          <span className={`text-xs ${tone === "light" ? "text-white/70" : "text-ink-2"} ${subtitleClassName}`}>{subtitle}</span>
        )}
      </span>
    </span>
  );
}

