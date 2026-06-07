import type { Product, Category, Order, OrderStatus, AnalyticsSummary } from "./types";
import { DUMMY_CATEGORIES, DUMMY_PRODUCTS, DUMMY_ORDERS, DUMMY_ANALYTICS } from "./dummy";

const pause = () => new Promise<void>((r) => setTimeout(r, 250));

export const api = {
  categories: async (): Promise<Category[]> => {
    await pause();
    return DUMMY_CATEGORIES;
  },

  products: async (category?: string, search?: string): Promise<Product[]> => {
    await pause();
    return DUMMY_PRODUCTS.filter((p) => {
      const catMatch = !category || p.category_id === category;
      const searchMatch =
        !search || p.name_en.toLowerCase().includes(search.toLowerCase());
      return catMatch && searchMatch && p.is_active;
    });
  },

  product: async (slug: string): Promise<Product> => {
    await pause();
    const p = DUMMY_PRODUCTS.find((p) => p.slug === slug);
    if (!p) throw new Error("Product not found");
    return p;
  },

  orders: async (status?: OrderStatus): Promise<Order[]> => {
    await pause();
    return status
      ? DUMMY_ORDERS.filter((o) => o.status === status)
      : DUMMY_ORDERS;
  },

  order: async (reference: string): Promise<Order> => {
    await pause();
    return DUMMY_ORDERS.find((o) => o.reference === reference) ?? DUMMY_ORDERS[0];
  },

  createOrder: async (_body: unknown): Promise<Order> => {
    await new Promise<void>((r) => setTimeout(r, 800));
    return { ...DUMMY_ORDERS[0], reference: "FHB-2040" };
  },

  updateStatus: async (reference: string, status: OrderStatus): Promise<Order> => {
    await pause();
    return {
      ...(DUMMY_ORDERS.find((o) => o.reference === reference) ?? DUMMY_ORDERS[0]),
      status,
    };
  },

  validatePromo: async (
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; discount: number; message: string }> => {
    await pause();
    if (code.trim().toUpperCase() === "FIRST10")
      return {
        valid: true,
        discount: Math.round(subtotal * 0.1),
        message: "10% discount applied!",
      };
    return { valid: false, discount: 0, message: "Invalid promo code" };
  },

  analytics: async (): Promise<AnalyticsSummary> => {
    await pause();
    return DUMMY_ANALYTICS;
  },
};
