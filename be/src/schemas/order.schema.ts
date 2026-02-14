import { z } from "zod";
import { OrderStatus } from "../types/order.types";

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        menuItemId: z.string().min(1, "Menu Item ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    ).nonempty("Order must contain at least one item"),
    deliveryDetails: z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      address: z.string().min(5, "Address must be at least 5 characters"),
      phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    }),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Order ID is required"),
  }),
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
});
