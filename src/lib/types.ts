export interface Variant {
  id: number;
  size: string;
  flavour: string;
  frosting: string;
  price_adjustment: number;
  stock_status: string;
}

export interface Product {
  id: number;
  slug: string;
  name_en: string;
  name_ur: string;
  description: string;
  category_id: string;
  base_price: number;
  image_url: string;
  prep_time_hours: number;
  allow_custom_message: boolean;
  is_eggless_available: boolean;
  is_active: boolean;
  badge: string;
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export type OrderStatus =
  | "PENDING" | "CONFIRMED" | "PREPARING" | "READY"
  | "DISPATCHED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id?: number;
  product_id?: number | null;
  name: string;
  emoji: string;
  size: string;
  flavour: string;
  message?: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  reference: string;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  delivery_type: string;
  delivery_zone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_slot: string;
  special_notes: string;
  created_at: string;
  items: OrderItem[];
}

export interface AnalyticsSummary {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  pending_orders: number;
  revenue_by_day: { day: string; revenue: number }[];
  top_products: { name: string; value: number }[];
  payment_mix: { name: string; value: number }[];
}
