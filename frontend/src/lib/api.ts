import type {
  Product, Category, Order, OrderStatus, AnalyticsSummary,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  categories: () => req<Category[]>("/products/categories"),
  products: (category?: string, search?: string) => {
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (search) q.set("search", search);
    return req<Product[]>(`/products?${q.toString()}`);
  },
  product: (slug: string) => req<Product>(`/products/${slug}`),
  orders: (status?: OrderStatus) =>
    req<Order[]>(`/orders${status ? `?status=${status}` : ""}`),
  order: (reference: string) => req<Order>(`/orders/${reference}`),
  createOrder: (body: unknown) =>
    req<Order>("/orders", { method: "POST", body: JSON.stringify(body) }),
  updateStatus: (reference: string, status: OrderStatus) =>
    req<Order>(`/orders/${reference}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  validatePromo: (code: string, subtotal: number) =>
    req<{ valid: boolean; discount: number; message: string }>(
      "/promotions/validate",
      { method: "POST", body: JSON.stringify({ code, subtotal }) }
    ),
  analytics: () => req<AnalyticsSummary>("/analytics/summary"),
};
