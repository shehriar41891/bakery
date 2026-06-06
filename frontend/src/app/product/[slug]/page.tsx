"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Clock, Minus, Plus, ShoppingBag, ChevronLeft, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { PKR, PRODUCT_EMOJI } from "@/lib/format";
import { useCart } from "@/store/cart";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const add = useCart((s) => s.add);

  const { data: p, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.product(slug),
  });

  const [sizeIdx, setSizeIdx] = useState(0);
  const [flavour, setFlavour] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [eggless, setEggless] = useState(false);

  if (isLoading) return (<><Navbar /><p className="p-20 text-center">Loading…</p></>);
  if (!p) return (<><Navbar /><p className="p-20 text-center">Product not found.</p></>);

  const sizes = p.variants.length ? p.variants : [{ size: "Standard", price_adjustment: 0, flavour: "" } as any];
  const flavours = Array.from(new Set(p.variants.map((v) => v.flavour).filter(Boolean)));
  const activeFlavour = flavour || flavours[0] || "Classic";
  const emoji = PRODUCT_EMOJI[p.category_id] ?? "🍰";
  const unit = p.base_price + (sizes[sizeIdx]?.price_adjustment ?? 0);

  const addToCart = () => {
    add({
      product_id: p.id, name: p.name_en, emoji, size: sizes[sizeIdx].size,
      flavour: eggless ? `${activeFlavour} (Eggless)` : activeFlavour,
      message, quantity: qty, unit_price: unit, prep: p.prep_time_hours,
    });
    router.push("/cart");
  };

  return (
    <>
      <Navbar />
      <main className="fadeup mx-auto max-w-6xl px-5 pb-16 pt-6">
        <button onClick={() => router.back()} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-inkSoft">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="grid gap-9 md:grid-cols-2">
          <div className="relative grid h-96 place-items-center rounded-3xl bg-rose">
            <span className="text-[150px] drop-shadow-lg">{emoji}</span>
            {p.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3.5 py-1.5 text-[12.5px] font-bold text-berryDk">{p.badge}</span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-honey">{p.category_id}</div>
            <h1 className="mt-1.5 font-display text-4xl font-semibold leading-tight">{p.name_en}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="font-display text-3xl font-semibold text-berryDk">{PKR(unit)}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-xs text-inkSoft">
                <Clock size={13} /> {p.prep_time_hours} hr lead time
              </span>
            </div>
            <p className="mt-5 leading-relaxed text-inkSoft">{p.description}</p>

            <div className="mt-6">
              <div className="mb-2 text-sm font-bold">Size</div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, i) => (
                  <button key={i} onClick={() => setSizeIdx(i)}
                    className={`rounded-xl border px-4 py-2.5 text-[13.5px] font-semibold ${sizeIdx === i ? "border-berry bg-rose" : "border-line bg-paper"}`}>
                    {s.size}{s.price_adjustment ? ` +${PKR(s.price_adjustment)}` : ""}
                  </button>
                ))}
              </div>
            </div>

            {flavours.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-sm font-bold">Flavour</div>
                <div className="flex flex-wrap gap-2">
                  {flavours.map((f) => (
                    <button key={f} onClick={() => setFlavour(f)}
                      className={`rounded-xl border px-4 py-2.5 text-[13.5px] font-semibold ${activeFlavour === f ? "border-berry bg-rose" : "border-line bg-paper"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {p.allow_custom_message && (
              <div className="mt-5">
                <div className="mb-2 text-sm font-bold">Message on cake (optional)</div>
                <input value={message} maxLength={40} onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Ayesha"
                  className="w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-sm outline-none" />
              </div>
            )}

            {p.is_eggless_available && (
              <button onClick={() => setEggless((v) => !v)}
                className="mt-4 flex w-full items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-3 text-left text-sm font-medium">
                <span className={`grid h-5 w-5 place-items-center rounded-md border-2 ${eggless ? "border-sage bg-sage" : "border-line"}`}>
                  {eggless && <Check size={13} className="text-white" />}
                </span>
                Make it eggless
              </button>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-line bg-paper p-1">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center rounded-lg bg-cream"><Minus size={16} /></button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-9 w-9 place-items-center rounded-lg bg-cream"><Plus size={16} /></button>
              </div>
              <button onClick={addToCart} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-berry px-5 py-3.5 text-[15px] font-semibold text-white">
                <ShoppingBag size={18} /> Add to cart · {PKR(unit * qty)}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
