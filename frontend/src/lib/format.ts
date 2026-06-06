export const PKR = (n: number) =>
  "Rs " + Math.round(n).toLocaleString("en-PK");

export const PRODUCT_EMOJI: Record<string, string> = {
  cakes: "🎂", cupcakes: "🧁", pastries: "🥐",
  brownies: "🍫", cookies: "🍪", seasonal: "🌙",
};

export const STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#9A8472" },
  CONFIRMED: { label: "Confirmed", color: "#3E7CB1" },
  PREPARING: { label: "Being Prepared", color: "#D98E3A" },
  READY: { label: "Ready", color: "#7C8A6B" },
  DISPATCHED: { label: "Out for Delivery", color: "#B07A2E" },
  DELIVERED: { label: "Delivered", color: "#4B7A4B" },
  CANCELLED: { label: "Cancelled", color: "#B23A48" },
};

export const STATUS_FLOW = ["CONFIRMED", "PREPARING", "READY", "DISPATCHED", "DELIVERED"];
