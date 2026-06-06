"use client";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import { PRODUCT_EMOJI } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function QuickAddButton({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const emoji = PRODUCT_EMOJI[p.category_id] ?? "🍰";
    const first = p.variants[0];

    add({
      product_id: p.id,
      name: p.name_en,
      emoji,
      size: first?.size ?? "Standard",
      flavour: first?.flavour ?? "Classic",
      message: "",
      quantity: 1,
      unit_price: p.base_price + (first?.price_adjustment ?? 0),
      prep: p.prep_time_hours,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      onClick={handleAdd}
      aria-label={`Add ${p.name_en} to cart`}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white shadow-sm transition-all duration-200 ${
        added
          ? "scale-90 bg-sage shadow-sage/20"
          : "bg-berry shadow-berry/25 hover:bg-berryDk active:scale-90"
      }`}
    >
      {added ? <Check size={15} strokeWidth={2.5} /> : <Plus size={16} />}
    </button>
  );
}
