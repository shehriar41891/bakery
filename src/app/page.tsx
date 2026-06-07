import Link from "next/link";
import { ArrowRight, Sparkles, Star, Package, Clock3, Leaf, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { DUMMY_PRODUCTS, DUMMY_CATEGORIES } from "@/lib/dummy";
import type { Product, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

const CAT_BG: Record<string, string> = {
  cakes:    "#FEE2E6",
  cupcakes: "#FCE7F3",
  pastries: "#FEFCE8",
  brownies: "#F5EEE6",
  cookies:  "#FFF7ED",
  seasonal: "#ECFDF5",
};

export default async function Home() {
  let products: Product[] = [];
  let categories: Category[] = [];
  try {
    [products, categories] = await Promise.all([api.products(), api.categories()]);
  } catch {
    // API unreachable — fall through to dummy data below
  }

  if (products.length === 0) products = DUMMY_PRODUCTS;
  if (categories.length === 0) categories = DUMMY_CATEGORIES;

  const featured = products
    .filter((p) => p.badge === "Bestseller" || p.badge === "New" || p.badge === "")
    .slice(0, 6);
  const displayFeatured = featured.length >= 4 ? featured : products.slice(0, 6);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink px-4 py-2.5 text-center text-[12.5px] font-medium text-white">
        🎉 Use code{" "}
        <span className="font-bold text-honey">FIRST10</span>{" "}
        for 10% off your first order &nbsp;·&nbsp; Fresh baked in Rawalpindi & Islamabad
      </div>

      <Navbar />

      <main className="mx-auto max-w-6xl px-5 pb-16">

        {/* ── Hero ── */}
        <section className="fadeup hero-pattern grid items-center gap-10 py-14 md:grid-cols-2">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose px-4 py-1.5 text-xs font-semibold text-berryDk">
              <Sparkles size={13} /> Baked fresh to order in Islamabad
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[1.15]">
              Celebrations,
              <br />
              <span className="italic text-berry">handcrafted</span> with love.
            </h1>
            <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-inkSoft">
              Custom cakes, cupcakes & pastries — order in seconds, pick your delivery slot, and skip the endless DMs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="flex items-center gap-2 rounded-2xl bg-berry px-7 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-berry/30 transition hover:bg-berryDk"
              >
                Order Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/menu?category=cakes"
                className="rounded-2xl border border-line bg-paper px-7 py-3.5 text-[15px] font-semibold transition hover:bg-rose"
              >
                Custom Cakes
              </Link>
            </div>
          </div>

          {/* Emoji collage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 grid h-48 place-items-center rounded-3xl border border-berry/10 text-[100px] drop-shadow-md" style={{ background: "#FEE2E6" }}>
              🎂
            </div>
            <div className="grid h-32 place-items-center rounded-2xl border border-honey/25 text-6xl" style={{ background: "#FEFCE8" }}>
              🧁
            </div>
            <div className="grid grid-cols-2 gap-3 h-32">
              <div className="grid place-items-center rounded-2xl border border-sage/25 text-4xl" style={{ background: "#ECFDF5" }}>
                🍫
              </div>
              <div className="grid place-items-center rounded-2xl border border-line bg-honeyLt text-4xl">
                🍪
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-paper p-4 md:grid-cols-4">
          {([
            [Package,  "500+ celebrations", "And counting"],
            [Clock3,   "24–72 hr lead time", "Always baked fresh"],
            [Leaf,     "Eggless options",    "On most items"],
            [MapPin,   "RWP & ISB delivery", "Rs 250 flat fee"],
          ] as const).map(([Icon, title, sub]) => (
            <div key={title} className="flex items-center gap-3 px-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose text-berry">
                <Icon size={18} />
              </span>
              <div>
                <div className="text-[13px] font-bold">{title}</div>
                <div className="text-[11px] text-inkSoft">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Browse categories ── */}
        <section className="mt-12">
          <h2 className="mb-1.5 font-display text-2xl font-semibold">Browse the menu</h2>
          <p className="mb-5 text-sm text-inkSoft">Pick a category — everything is baked to order.</p>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/menu?category=${c.id}`}
                className="card-hover rounded-2xl border border-line p-4 text-center"
                style={{ background: CAT_BG[c.id] ?? "#FBF4EA" }}
              >
                <div className="text-4xl">{c.emoji}</div>
                <div className="mt-2.5 text-[12.5px] font-semibold leading-tight">{c.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Customer favourites ── */}
        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Customer favourites</h2>
              <p className="mt-1 text-sm text-inkSoft">The treats our customers come back for, every time.</p>
            </div>
            <Link href="/menu" className="text-sm font-semibold text-berry transition hover:text-berryDk">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {displayFeatured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="mt-16 rounded-3xl border border-line bg-paper px-8 py-10 md:px-12 md:py-12">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold">How it works</h2>
            <p className="mt-2 text-sm text-inkSoft">From craving to doorstep in four easy steps.</p>
          </div>
          <div className="mt-9 grid gap-8 md:grid-cols-4">
            {[
              ["🛍️", "Browse & pick",       "Choose from cakes, cupcakes, pastries and more."],
              ["✏️", "Customise it",        "Select size, flavour, and add a personal message."],
              ["📅", "Pick a slot",         "Choose a delivery date and time window that suits you."],
              ["🚗", "We bake & deliver",   "We bake fresh and bring it straight to your door."],
            ].map(([em, title, desc]) => (
              <div key={title as string} className="text-center">
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-berry/10 text-2xl">
                  {em}
                </div>
                <div className="mb-1.5 font-display text-[15px] font-semibold">{title}</div>
                <p className="text-[13px] leading-relaxed text-inkSoft">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-2xl bg-berry px-8 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-berry/25 transition hover:bg-berryDk"
            >
              Start ordering <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="mt-14">
          <h2 className="mb-1.5 font-display text-2xl font-semibold">What customers say</h2>
          <p className="mb-6 text-sm text-inkSoft">Real reviews from real celebrations.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Ayesha K.", city: "Islamabad", initials: "AK", color: "#FEE2E6",
                text: "Ordered my daughter's birthday cake — the custom builder made it so easy. The cake was gorgeous and everyone loved it!",
              },
              {
                name: "Usman T.", city: "Rawalpindi", initials: "UT", color: "#FFF7ED",
                text: "I reorder the brownie box every week. The one-click reorder is a total game changer. Fresh every single time!",
              },
              {
                name: "Zainab M.", city: "DHA", initials: "ZM", color: "#ECFDF5",
                text: "The Eid dry-fruit cake was the star of our family gathering. Beautiful presentation and an incredible flavour.",
              },
            ].map(({ name, city, initials, color, text }) => (
              <div key={name} className="card-hover rounded-2xl border border-line bg-paper p-5">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} size={14} fill="#D98E3A" className="text-honey" />
                  ))}
                </div>
                <p className="text-[14px] italic leading-relaxed text-inkSoft">"{text}"</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <div
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold text-berryDk"
                    style={{ background: color }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold">{name}</div>
                    <div className="text-[11.5px] text-inkSoft">{city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="mt-14 overflow-hidden rounded-3xl bg-berry px-8 py-12 text-center text-white">
          <div className="mb-4 text-5xl">🎂</div>
          <h2 className="font-display text-3xl font-semibold">Ready to celebrate?</h2>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/80">
            Order fresh-baked treats for your next occasion. Delivery across Rawalpindi & Islamabad.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-[15px] font-bold text-berry transition hover:bg-rose"
            >
              Browse Menu <ArrowRight size={17} />
            </Link>
            <a
              href="https://wa.me/923111234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              WhatsApp us
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
