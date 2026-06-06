"use client";
import Link from "next/link";
import { Minus, Plus, X, ArrowRight, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/store/cart";
import { PKR } from "@/lib/format";

export default function CartPage() {
  const { lines, setQty, subtotal } = useCart();
  const total = subtotal();

  if (lines.length === 0)
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-5 py-24 text-center">
          <div className="text-6xl">🛒</div>
          <h2 className="mt-3 font-display text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-inkSoft">Let&apos;s fix that — the oven&apos;s warm.</p>
          <Link href="/menu" className="mt-5 inline-block rounded-xl bg-ink px-6 py-3 font-semibold text-white">Browse menu</Link>
        </main>
      </>
    );

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-8">
        <h1 className="mb-6 font-display text-3xl font-semibold">Your Cart</h1>
        <div className="grid gap-6 md:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-3.5">
            {lines.map((it) => (
              <div key={it.key} className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
                <div className="grid h-[72px] w-[72px] flex-none place-items-center rounded-2xl bg-rose text-4xl">{it.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold">{it.name}</div>
                  <div className="mt-0.5 text-xs text-inkSoft">{it.size} · {it.flavour}{it.message ? ` · “${it.message}”` : ""}</div>
                  <div className="mt-1.5 font-display font-semibold text-berryDk">{PKR(it.unit_price)}</div>
                </div>
                <div className="flex items-center gap-0.5 rounded-xl border border-line p-1">
                  <button onClick={() => setQty(it.key, it.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-lg bg-cream"><Minus size={15} /></button>
                  <span className="w-7 text-center font-bold">{it.quantity}</span>
                  <button onClick={() => setQty(it.key, it.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-lg bg-cream"><Plus size={15} /></button>
                </div>
                <button onClick={() => setQty(it.key, 0)} className="p-1.5 text-inkSoft"><X size={18} /></button>
              </div>
            ))}
          </div>
          <div>
            <div className="sticky top-24 rounded-2xl border border-line bg-paper p-5">
              <h3 className="font-display text-xl font-semibold">Summary</h3>
              <div className="mt-2 flex justify-between py-1.5 text-sm"><span>Subtotal</span><span>{PKR(total)}</span></div>
              <div className="flex justify-between py-1.5 text-sm text-inkSoft"><span>Delivery</span><span>Calculated at checkout</span></div>
              <div className="my-3 flex items-center gap-2 rounded-xl bg-honeyLt px-3 py-2.5 text-[12.5px] font-semibold text-berryDk">
                <Gift size={15} /> You&apos;ll earn ~{Math.round(total / 100)} loyalty points
              </div>
              <Link href="/checkout" className="flex w-full items-center justify-center gap-2 rounded-xl bg-berry py-3.5 font-semibold text-white">
                Checkout <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
