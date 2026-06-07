"use client";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { Calendar, TrendingUp, Wallet, ChefHat } from "lucide-react";
import { api } from "@/lib/api";
import { PKR } from "@/lib/format";

const COLORS = ["#A8324A", "#D98E3A", "#7C8A6B", "#3E7CB1", "#B07A2E"];

export default function AdminOverview() {
  const { data } = useQuery({ queryKey: ["analytics"], queryFn: api.analytics });

  const stats = [
    ["Total orders", data ? String(data.total_orders) : "—", Calendar, "#A8324A"],
    ["Total revenue", data ? PKR(data.total_revenue) : "—", TrendingUp, "#7C8A6B"],
    ["Avg order value", data ? PKR(data.average_order_value) : "—", Wallet, "#D98E3A"],
    ["In the queue", data ? String(data.pending_orders) : "—", ChefHat, "#3E7CB1"],
  ] as const;

  return (
    <div className="fadeup">
      <h1 className="font-display text-3xl font-semibold">Good morning, Fariba 👋</h1>
      <p className="mt-1.5 text-[14.5px] text-inkSoft">Here&apos;s how the bakery is doing today.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([l, v, I, col]) => (
          <div key={l} className="rounded-2xl border border-line bg-paper p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: col + "1A", color: col }}><I size={20} /></span>
            <div className="mt-3.5 font-display text-2xl font-semibold">{v}</div>
            <div className="mt-0.5 text-[13px] text-inkSoft">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Revenue by delivery date">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data?.revenue_by_day ?? []} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
              <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A8324A" stopOpacity={0.5} /><stop offset="100%" stopColor="#A8324A" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7D8C3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B5648" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B5648" }} axisLine={false} tickLine={false} tickFormatter={(v) => v / 1000 + "k"} />
              <Tooltip formatter={(v: number) => PKR(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#A8324A" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Payment mix">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data?.payment_mix ?? []} dataKey="value" innerRadius={55} outerRadius={88} paddingAngle={3}>
                {(data?.payment_mix ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Top-selling products" wide>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.top_products ?? []} layout="vertical" margin={{ left: 30, right: 20, top: 6, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7D8C3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#6B5648" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#33231B" }} axisLine={false} tickLine={false} width={130} />
              <Tooltip />
              <Bar dataKey="value" fill="#D98E3A" radius={[0, 8, 8, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-line bg-paper p-5 ${wide ? "lg:col-span-2" : ""}`}>
      <h3 className="mb-3.5 font-display text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
