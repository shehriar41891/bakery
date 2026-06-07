import Link from "next/link";
import { ChefHat, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-ink text-white/80">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-berry text-white">
                <ChefHat size={22} />
              </span>
              <div className="leading-none">
                <div className="font-display text-lg font-semibold text-white">Fariba Hazara</div>
                <div className="mt-0.5 text-[10px] font-semibold tracking-[2.5px] text-honey">ARTISAN BAKERY</div>
              </div>
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">
              Boutique home-baked cakes, cupcakes & pastries, delivered fresh across Rawalpindi & Islamabad.
            </p>
            <div className="mt-4 flex gap-2.5">
              <a href="#" aria-label="Instagram" className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 transition-colors hover:bg-white/20">
                <Instagram size={15} />
              </a>
              <a href="#" aria-label="Facebook" className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 transition-colors hover:bg-white/20">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/35">Menu</h3>
            <ul className="space-y-2.5 text-[13.5px]">
              {[
                ["Celebration Cakes", "/menu?category=cakes"],
                ["Cupcakes", "/menu?category=cupcakes"],
                ["Pastries & Desserts", "/menu?category=pastries"],
                ["Brownies & Bars", "/menu?category=brownies"],
                ["Cookies", "/menu?category=cookies"],
                ["Eid Specials", "/menu?category=seasonal"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-honey">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/35">Account</h3>
            <ul className="space-y-2.5 text-[13.5px]">
              {[
                ["Browse Menu", "/menu"],
                ["My Orders", "/account"],
                ["Cart", "/cart"],
                ["Checkout", "/checkout"],
                ["Owner Dashboard", "/admin"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-honey">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/35">Contact</h3>
            <ul className="space-y-3.5 text-[13.5px]">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-honey" />
                <span>Bahria Town, Rawalpindi, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0 text-honey" />
                <span>+92 311 123 4567</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={14} className="mt-0.5 shrink-0 text-honey" />
                <div>
                  Mon – Sat, 10 am – 8 pm
                  <div className="text-white/45">Sundays by pre-order only</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[12px] text-white/35">
          <p>© 2025 Fariba Hazara Bakery. All rights reserved.</p>
          <p>Fresh · Handcrafted · Made with love 🧡</p>
        </div>
      </div>
    </footer>
  );
}
