import { Order } from "../types/order.types";

// In-memory storage for orders
export const orders: Map<string, Order> = new Map();

// Counter for generating order IDs
let orderIdCounter = 1;

export const generateOrderId = (): string => {
  return `ORD-${String(orderIdCounter++).padStart(6, "0")}`;
};
