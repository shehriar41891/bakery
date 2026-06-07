"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Gift, Check, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { PKR, STATUS_META, STATUS_FLOW } from "@/lib/format";
import type { Order } from "@/lib/types";

function Tracker({ order }: { order: Order }) {
  const idx = STATUS_FLOW.indexOf(order.status);
  return (
    <div className="mb-8 rounded-2xl border border-sage bg-paper p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-sage text-white"><Check size={26} /></span>
        <div>
          <div className="font-display text-xl font-semibold">Order {order.reference} confirmed!</div>
          <div className="text-sm text-inkSoft">Confirmation sent via WhatsApp & email · {order.delivery_date} {order.delivery_slot}</div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FLOW.map((s, i) => {
          const m = STATUS_META[s];
          const done = i <= idx;
          return (
            <div key={s} className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-white"
                style={{ background: done ? m.color : "#E7D8C3" }}>{i + 1}</span>
              <span className={`text-[13px] ${done ? "font-semibold" : "text-inkSoft"}`}>{m.label}</span>
              {i < STATUS_FLOW.length - 1 && <span className="mx-1 h-px w-5" style={{ background: "#E7D8C3" }} />}
            </div>
          );
        })}
      </div>
      <a href="https://wa.me/" target="_blank" rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-[13.5px] font-semibold text-white">
        <Phone size={15} /> WhatsApp the bakery
      </a>
    </div>
  );
}

function AccountInner() {
  const ref = useSearchParams().get("ref");
  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: () => api.orders() });
  const justPlaced = ref ? orders.find((o) => o.reference === ref) : undefined;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-8">
      <div className="mb-6 flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-honey font-display text-2xl font-bold text-white">A</span>
        <div>
          <h1 className="font-display text-3xl font-semibold">My Orders</h1>
          <div className="mt-1 flex items-center gap-2 text-[13.5px] text-inkSoft">
            <Gift size={15} className="text-honey" /> <b className="text-berryDk">120</b> loyalty points
          </div>
        </div>
      </div>

      {justPlaced && <Tracker order={justPlaced} />}

      <h2 className="font-display text-xl font-semibold">Order history</h2>
      <div className="mt-3 flex flex-col gap-3">
        {orders.map((o) => {
          const m = STATUS_META[o.status];
          return (
            <div key={o.id} className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-line bg-paper p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-rose text-2xl">{o.items[0]?.emoji || "🍰"}</div>
              <div className="min-w-[140px] flex-1">
                <div className="text-[14.5px] font-semibold">{o.items.map((i) => i.name).join(", ")}</div>
                <div className="text-[12.5px] text-inkSoft">{o.reference} · {o.delivery_date} · {PKR(o.total)}</div>
              </div>
              <span className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: m.color + "1A", color: m.color }}>{m.label}</span>
            </div>
          );
        })}
        {orders.length === 0 && (
          <p className="rounded-2xl border border-line bg-paper p-6 text-center text-sm text-inkSoft">
            No orders yet. <Link href="/menu" className="font-semibold text-berry">Start an order →</Link>
          </p>
        )}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className="p-16 text-center">Loading…</p>}>
        <AccountInner />
      </Suspense>
    </>
  );
}
