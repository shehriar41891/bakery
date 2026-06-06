"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Store, Wallet, CreditCard, Banknote, AlertCircle, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/store/cart";
import { api } from "@/lib/api";
import { PKR } from "@/lib/format";

const ZONES = ["Bahria Town", "DHA Islamabad", "F-Sectors (Islamabad)", "Saddar (Rawalpindi)", "Gulberg Greens"];
const SLOTS = ["10:00 – 12:00", "12:00 – 14:00", "14:00 – 16:00", "16:00 – 18:00", "18:00 – 20:00"];
const DELIVERY_FEE = 250;
const PAY = [["JazzCash", Wallet], ["EasyPaisa", Wallet], ["Card", CreditCard], ["Cash on Delivery", Banknote]] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const sub = subtotal();

  const [dtype, setDtype] = useState("delivery");
  const [zone, setZone] = useState(ZONES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [date, setDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); });
  const [slot, setSlot] = useState(SLOTS[2]);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [pay, setPay] = useState("JazzCash");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const fee = dtype === "delivery" ? DELIVERY_FEE : 0;
  const total = Math.max(0, sub + fee - discount);
  const minLead = Math.max(24, ...lines.map((l) => l.prep || 24));
  const valid = name.trim() && phone.trim() && (dtype === "pickup" || addr.trim());

  const applyPromo = async () => {
    try {
      const r = await api.validatePromo(promo, sub);
      setDiscount(r.valid ? r.discount : 0);
      setPromoMsg(r.message);
    } catch { setPromoMsg("Could not validate code"); }
  };

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      const order = await api.createOrder({
        customer_name: name, customer_phone: phone,
        items: lines.map((l) => ({
          product_id: l.product_id, name: l.name, emoji: l.emoji, size: l.size,
          flavour: l.flavour, message: l.message ?? "", quantity: l.quantity, unit_price: l.unit_price,
        })),
        payment_method: pay, delivery_type: dtype, delivery_zone: dtype === "delivery" ? zone : "",
        delivery_address: addr, delivery_date: date, delivery_slot: slot,
        promo_code: promo || null, special_notes: notes,
      });
      clear();
      router.push(`/account?ref=${order.reference}`);
    } catch (e) {
      alert("Could not place order — is the API running?\n" + (e as Error).message);
      setBusy(false);
    }
  };

  const inp = "w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-sm outline-none";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-8">
        <h1 className="mb-6 font-display text-3xl font-semibold">Checkout</h1>
        <div className="grid gap-6 md:grid-cols-[1fr_360px]">
          <div className="flex flex-col space-y-4">
            <Panel title="Delivery method">
              <div className="flex gap-3">
                {[["delivery", "Home Delivery", Truck], ["pickup", "Self Pickup", Store]].map(([v, l, I]: any) => (
                  <button key={v} onClick={() => setDtype(v)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border p-4 ${dtype === v ? "border-berry bg-rose" : "border-line bg-paper"}`}>
                    <I size={22} className={dtype === v ? "text-berry" : "text-inkSoft"} />
                    <span className="text-sm font-semibold">{l}</span>
                    <span className="text-[11.5px] text-inkSoft">{v === "delivery" ? PKR(DELIVERY_FEE) : "Free"}</span>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Your details">
              <div className="grid grid-cols-2 gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inp} />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (+92 3XX…)" className={inp} />
              </div>
              {dtype === "delivery" && (
                <>
                  <select value={zone} onChange={(e) => setZone(e.target.value)} className={`${inp} mt-3`}>
                    {ZONES.map((z) => <option key={z}>{z}</option>)}
                  </select>
                  <textarea value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="House #, street, area…" rows={2} className={`${inp} mt-3 resize-y`} />
                </>
              )}
            </Panel>

            <Panel title="Delivery slot">
              <div className="mb-3.5 flex items-center gap-2 rounded-lg bg-honeyLt px-3 py-2.5 text-[12.5px] font-semibold text-berryDk">
                <AlertCircle size={15} /> Minimum {minLead} hrs lead time required for your items
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><div className="mb-1.5 text-[12.5px] font-semibold">Date</div><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inp} /></div>
                <div><div className="mb-1.5 text-[12.5px] font-semibold">Time slot</div>
                  <select value={slot} onChange={(e) => setSlot(e.target.value)} className={inp}>{SLOTS.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
              </div>
            </Panel>

            <Panel title="Payment method">
              <div className="grid grid-cols-2 gap-3">
                {PAY.map(([v, I]) => (
                  <button key={v} onClick={() => setPay(v)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3.5 text-[13.5px] font-semibold ${pay === v ? "border-berry bg-rose" : "border-line bg-paper"}`}>
                    <I size={18} className={pay === v ? "text-berry" : "text-inkSoft"} /> {v}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] text-inkSoft">Demo mode — no real payment is processed. In production these redirect to a secure gateway.</p>
            </Panel>

            <Panel title="Order notes (optional)">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions…" rows={2} className={`${inp} resize-y`} />
            </Panel>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-line bg-paper p-5">
              <h3 className="font-display text-xl font-semibold">Order summary</h3>
              <div className="my-2 max-h-36 overflow-y-auto">
                {lines.map((i) => (
                  <div key={i.key} className="flex justify-between py-1 text-[13px] text-inkSoft">
                    <span>{i.quantity}× {i.name}</span><span>{PKR(i.unit_price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="my-3 flex gap-2">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo (try FIRST10)" className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-[13px] outline-none" />
                <button onClick={applyPromo} className="rounded-lg bg-ink px-4 text-[13px] font-semibold text-white">Apply</button>
              </div>
              {promoMsg && <div className={`mb-2 text-[12.5px] font-semibold ${discount ? "text-sage" : "text-berry"}`}>{discount ? "✓ " : ""}{promoMsg}</div>}
              <div className="border-t border-line pt-2">
                <Row l="Subtotal" r={PKR(sub)} />
                {dtype === "delivery" && <Row l="Delivery fee" r={PKR(fee)} />}
                {discount > 0 && <Row l="Discount" r={`– ${PKR(discount)}`} soft />}
                <div className="mt-1.5 border-t border-dashed border-line pt-1.5">
                  <div className="flex justify-between text-base font-bold"><span>Total</span><span className="font-display text-berryDk">{PKR(total)}</span></div>
                </div>
              </div>
              <button onClick={submit} disabled={!valid || busy}
                className={`mt-4 w-full rounded-xl py-3.5 text-[15px] font-bold ${valid && !busy ? "bg-berry text-white" : "cursor-not-allowed bg-line text-inkSoft"}`}>
                {busy ? "Placing…" : pay === "Cash on Delivery" ? "Place order" : `Pay ${PKR(total)}`}
              </button>
              {!valid && <div className="mt-2 text-center text-xs text-inkSoft">Fill in name, phone{dtype === "delivery" ? " & address" : ""} to continue</div>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h3 className="mb-3.5 text-[15px] font-bold">{title}</h3>
      {children}
    </div>
  );
}
function Row({ l, r, soft }: { l: string; r: string; soft?: boolean }) {
  return <div className={`flex justify-between py-1.5 text-sm ${soft ? "text-inkSoft" : ""}`}><span>{l}</span><span>{r}</span></div>;
}
