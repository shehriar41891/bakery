"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Printer } from "lucide-react";
import { api } from "@/lib/api";
import { PKR, STATUS_META, STATUS_FLOW } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const FILTERS = ["all", ...STATUS_FLOW, "CANCELLED"];

export default function AdminOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState<string | null>(null);

  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: () => api.orders() });

  const mutate = useMutation({
    mutationFn: ({ ref, status }: { ref: string; status: OrderStatus }) => api.updateStatus(ref, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  const list = orders
    .filter((o) => filter === "all" || o.status === filter)
    .sort((a, b) => a.delivery_date.localeCompare(b.delivery_date));
  const selected = orders.find((o) => o.reference === sel);

  const advance = (o: Order) => {
    const i = STATUS_FLOW.indexOf(o.status);
    if (i >= 0 && i < STATUS_FLOW.length - 1) {
      mutate.mutate({ ref: o.reference, status: STATUS_FLOW[i + 1] as OrderStatus });
    }
  };

  return (
    <div className="fadeup">
      <h1 className="font-display text-3xl font-semibold">Orders</h1>
      <p className="mt-1.5 text-[14.5px] text-inkSoft">Update status — customers are auto-notified via WhatsApp.</p>

      <div className="my-5 flex gap-2 overflow-x-auto pb-2">
        {FILTERS.map((f) => {
          const label = f === "all" ? "All" : STATUS_META[f].label;
          const n = f === "all" ? orders.length : orders.filter((o) => o.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-none rounded-full border px-4 py-2 text-[13px] font-semibold ${filter === f ? "border-ink bg-ink text-white" : "border-line bg-paper"}`}>
              {label} <span className="opacity-60">({n})</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        {list.map((o, idx) => {
          const m = STATUS_META[o.status];
          return (
            <button key={o.id} onClick={() => setSel(o.reference)}
              className={`grid w-full grid-cols-[1.4fr_1fr_1fr_0.9fr_1.1fr] items-center gap-3 px-4 py-3.5 text-left text-[13.5px] hover:bg-cream ${idx ? "border-t border-line" : ""}`}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{o.items[0]?.emoji || "🍰"}</span>
                <div><div className="font-bold">{o.reference}</div><div className="text-[11.5px] text-inkSoft">{o.items.length} item(s)</div></div>
              </div>
              <div><div className="font-medium">{o.customer_name}</div><div className="text-[11.5px] text-inkSoft">{o.payment_method}</div></div>
              <div className="text-[12.5px]"><div>{o.delivery_type === "delivery" ? o.delivery_zone : "Pickup"}</div><div className="text-inkSoft">{o.delivery_date}</div></div>
              <div className="font-bold text-berryDk">{PKR(o.total)}</div>
              <div><span className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: m.color + "1A", color: m.color }}>{m.label}</span></div>
            </button>
          );
        })}
        {list.length === 0 && <p className="p-8 text-center text-sm text-inkSoft">No orders in this filter.</p>}
      </div>

      {selected && (
        <div onClick={() => setSel(null)} className="fixed inset-0 z-50 flex justify-end bg-ink/40">
          <div onClick={(e) => e.stopPropagation()} className="h-full w-[440px] max-w-[92vw] overflow-y-auto bg-paper p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-2xl font-semibold">{selected.reference}</div>
                <span className="mt-1.5 inline-block rounded-full px-3 py-1.5 text-[12.5px] font-bold"
                  style={{ background: STATUS_META[selected.status].color + "1A", color: STATUS_META[selected.status].color }}>
                  {STATUS_META[selected.status].label}
                </span>
              </div>
              <button onClick={() => setSel(null)} className="grid h-9 w-9 place-items-center rounded-lg bg-cream">✕</button>
            </div>

            <Block label="Customer">
              <div className="font-semibold">{selected.customer_name}</div>
              <div className="text-[13.5px] text-inkSoft">{selected.customer_phone}</div>
            </Block>

            <Block label="Items">
              {selected.items.map((it, k) => (
                <div key={k} className="flex items-center gap-3 border-b border-line py-2 last:border-0">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-rose text-xl">{it.emoji}</span>
                  <div className="flex-1"><div className="text-sm font-semibold">{it.quantity}× {it.name}</div>
                    <div className="text-xs text-inkSoft">{it.size} · {it.flavour}{it.message ? ` · “${it.message}”` : ""}</div></div>
                  <div className="font-semibold">{PKR(it.unit_price * it.quantity)}</div>
                </div>
              ))}
            </Block>

            {selected.special_notes && (
              <Block label="Special notes">
                <div className="rounded-lg bg-honeyLt px-3 py-2.5 text-[13.5px] italic">“{selected.special_notes}”</div>
              </Block>
            )}

            <Block label="Delivery">
              <Row l={selected.delivery_type === "delivery" ? "Home delivery" : "Self pickup"} r={selected.delivery_zone || "—"} />
              <Row l="Date & slot" r={`${selected.delivery_date} · ${selected.delivery_slot}`} />
              {selected.delivery_address && <div className="mt-1 text-[13px] text-inkSoft">{selected.delivery_address}</div>}
            </Block>

            <Block label="Payment">
              <Row l={selected.payment_method} r={selected.payment_status} />
              <Row l="Subtotal" r={PKR(selected.subtotal)} />
              {selected.delivery_fee > 0 && <Row l="Delivery" r={PKR(selected.delivery_fee)} />}
              {selected.discount_amount > 0 && <Row l="Discount" r={`– ${PKR(selected.discount_amount)}`} />}
              <div className="mt-1 flex justify-between border-t border-dashed border-line pt-1.5 font-bold"><span>Total</span><span className="text-berryDk">{PKR(selected.total)}</span></div>
            </Block>

            <div className="mt-5 flex gap-2.5">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cream py-3 text-[13.5px] font-semibold"><Printer size={16} /> Print ticket</button>
              {!["DELIVERED", "CANCELLED"].includes(selected.status) && (
                <button onClick={() => advance(selected)} className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-berry py-3 text-[13.5px] font-bold text-white">
                  Mark “{STATUS_META[STATUS_FLOW[STATUS_FLOW.indexOf(selected.status) + 1]].label}” <ArrowRight size={16} />
                </button>
              )}
            </div>
            {!["DELIVERED", "CANCELLED"].includes(selected.status) && (
              <button onClick={() => mutate.mutate({ ref: selected.reference, status: "CANCELLED" })}
                className="mt-2.5 w-full py-2 text-[13px] font-semibold text-berry">Cancel order</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-inkSoft">{label}</div>
      {children}
    </div>
  );
}
function Row({ l, r }: { l: string; r: string }) {
  return <div className="flex justify-between py-1.5 text-sm text-inkSoft"><span>{l}</span><span>{r}</span></div>;
}
