import Link from "next/link";
import { Clock } from "lucide-react";
import type { Product } from "@/lib/types";
import { PKR, PRODUCT_EMOJI } from "@/lib/format";
import QuickAddButton from "@/components/QuickAddButton";

const CAT_BG: Record<string, string> = {
  cakes:    "#FEE2E6",
  cupcakes: "#FCE7F3",
  pastries: "#FEFCE8",
  brownies: "#F5EEE6",
  cookies:  "#FFF7ED",
  seasonal: "#ECFDF5",
};

const BADGE_STYLE: Record<string, { background: string; color: string }> = {
  "Bestseller":  { background: "#A8324A", color: "#fff" },
  "New":         { background: "#7C8A6B", color: "#fff" },
  "Pre-order":   { background: "#D98E3A", color: "#fff" },
  "Eid Special": { background: "#1E3A2F", color: "#fff" },
  "Custom":      { background: "#5B3A8A", color: "#fff" },
};

export default function ProductCard({ p }: { p: Product }) {
  const emoji = PRODUCT_EMOJI[p.category_id] ?? "🍰";
  const bg = CAT_BG[p.category_id] ?? "#F6E3DF";
  const badgeStyle = p.badge ? (BADGE_STYLE[p.badge] ?? { background: "#33231B", color: "#fff" }) : null;

  return (
    <Link
      href={`/product/${p.slug}`}
      className="card-hover fadeup flex flex-col overflow-hidden rounded-2xl border border-line bg-paper"
    >
      <div className="relative grid h-40 place-items-center" style={{ background: bg }}>
        <span className="text-6xl drop-shadow">{emoji}</span>
        {p.badge && badgeStyle && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={badgeStyle}
          >
            {p.badge}
          </span>
        )}
        {p.is_eggless_available && (
          <span className="absolute right-3 top-3 rounded-full bg-sage px-2 py-1 text-[10px] font-bold text-white">
            Eggless ✓
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[15px] font-semibold leading-snug">{p.name_en}</div>
        {p.description && (
          <div className="mt-1 line-clamp-1 text-[12px] text-inkSoft">{p.description}</div>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-inkSoft">
          <Clock size={12} /> Ready in {p.prep_time_hours} hrs
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-berryDk">{PKR(p.base_price)}</span>
          <QuickAddButton p={p} />
        </div>
      </div>
    </Link>
  );
}
