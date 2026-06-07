"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, BarChart3, Home, ChefHat } from "lucide-react";

const NAV = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/orders", "Orders", ClipboardList],
  ["/admin", "Analytics", BarChart3], // analytics rendered inside overview tab in this scaffold
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex min-h-screen bg-[#F4EEE4]">
      <aside className="sticky top-0 flex h-screen w-60 flex-col bg-ink p-4 text-white">
        <div className="flex items-center gap-3 px-2 pb-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-honey"><ChefHat size={20} /></span>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-semibold">Fariba Hazara</div>
            <div className="text-[10px] tracking-wider text-honey">OWNER PANEL</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <Link href="/admin" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${path === "/admin" ? "bg-honey/20 text-honey" : "text-white/70"}`}>
            <LayoutDashboard size={18} /> Overview
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${path?.startsWith("/admin/orders") ? "bg-honey/20 text-honey" : "text-white/70"}`}>
            <ClipboardList size={18} /> Orders
          </Link>
        </nav>
        <Link href="/" className="mt-auto flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 text-[13.5px] font-semibold">
          <Home size={17} /> View storefront
        </Link>
      </aside>
      <div className="flex-1 overflow-x-hidden p-7">{children}</div>
    </div>
  );
}
