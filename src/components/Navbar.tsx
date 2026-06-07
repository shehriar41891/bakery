"use client";
import Link from "next/link";
import { ShoppingBag, ChefHat, LayoutDashboard, Gift } from "lucide-react";
import { useCart } from "@/store/cart";

export default function Navbar() {
  const count = useCart((s) => s.count());
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-berry text-white">
            <ChefHat size={20} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold">Fariba Hazara</span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[2.5px] text-honey">
              ARTISAN BAKERY
            </span>
          </span>
        </Link>
        <nav className="ml-4 hidden gap-1 sm:flex">
          <Link href="/" className="rounded-lg px-4 py-2 text-sm font-medium text-inkSoft hover:bg-rose">Home</Link>
          <Link href="/menu" className="rounded-lg px-4 py-2 text-sm font-medium text-inkSoft hover:bg-rose">Menu</Link>
          <Link href="/account" className="rounded-lg px-4 py-2 text-sm font-medium text-inkSoft hover:bg-rose">My Orders</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/admin" className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-inkSoft">
            <LayoutDashboard size={14} /> <span className="hidden sm:inline">Owner</span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-lg bg-honeyLt px-3 py-2 text-xs font-semibold text-berryDk sm:flex">
            <Gift size={14} /> 120 pts
          </span>
          <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full border-2 border-cream bg-berry text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
