"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { DUMMY_CATEGORIES, DUMMY_PRODUCTS } from "@/lib/dummy";

function MenuInner() {
  const params = useSearchParams();
  const initial = params.get("category") ?? "all";
  const [active, setActive] = useState(initial);
  const [search, setSearch] = useState("");

  const { data: rawCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories,
    retry: 1,
  });
  const categories = rawCategories?.length ? rawCategories : DUMMY_CATEGORIES;

  const fallbackProducts = DUMMY_PRODUCTS.filter((p) => {
    const catMatch = active === "all" || p.category_id === active;
    const searchMatch = !search || p.name_en.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const { data: rawProducts, isLoading } = useQuery({
    queryKey: ["products", active, search],
    queryFn: () => api.products(active === "all" ? undefined : active, search || undefined),
    retry: 1,
  });
  const products = rawProducts?.length ? rawProducts : fallbackProducts;

  const tabs = [{ id: "all", name: "All", emoji: "🍴" }, ...categories];

  return (
    <main className="mx-auto max-w-6xl px-5 pb-16">
      <div className="py-10">
        <h1 className="font-display text-4xl font-semibold">Our Menu</h1>
        <p className="mt-2 max-w-lg text-[15px] text-inkSoft">
          Every order is baked fresh to your taste. Browse by category, search for something specific, or just explore.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-5 flex max-w-sm items-center gap-2.5 rounded-2xl border border-line bg-paper px-4 py-3 shadow-sm">
        <Search size={16} className="shrink-0 text-inkSoft" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cakes, cookies, brownies…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Category tabs */}
      <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`flex flex-none items-center gap-1.5 rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition ${
              active === c.id
                ? "border-berry bg-berry text-white shadow-sm shadow-berry/20"
                : "border-line bg-paper hover:bg-rose"
            }`}
          >
            <span>{c.emoji}</span> {c.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {isLoading && products.length === 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shimmer h-64 rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-5xl">🔍</div>
          <p className="mt-3 font-display text-xl font-semibold">No results found</p>
          <p className="mt-1 text-sm text-inkSoft">Try a different search or browse another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<p className="p-16 text-center text-inkSoft">Loading…</p>}>
        <MenuInner />
      </Suspense>
      <Footer />
    </>
  );
}
