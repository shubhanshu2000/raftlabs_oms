import { Request, Response } from "express";
import * as orderService from "../service/order.service";
import { orderEvents } from "../service/order.events";
import { Order } from "../types/order.types";

// SSE endpoint for order status updates
export const streamOrderStatus = async (req: Request, res: Response) => {
  const orderId = (req as any).params.id as string;

  // Verify order exists
  const order = orderService.getOrderById(orderId);

  if (!order) {
    (res as any).status(404).json({
      success: false,
      error: "Order not found",
    });
    return;
  }

  // Set SSE headers
  (res as any).setHeader("Content-Type", "text/event-stream");
  (res as any).setHeader("Cache-Control", "no-cache");
  (res as any).setHeader("Connection", "keep-alive");
  (res as any).setHeader("X-Accel-Buffering", "no"); // Disable buffering for Vercel

  // Send initial order state
  (res as any).write(`data: ${JSON.stringify(order)}\n\n`);

  // Listen for order updates
  const onOrderUpdate = (updatedOrder: Order) => {
    (res as any).write(`data: ${JSON.stringify(updatedOrder)}\n\n`);
  };

  orderEvents.on(`order:${orderId}`, onOrderUpdate);

  // Handle client disconnect
  (req as any).on("close", () => {
    orderEvents.off(`order:${orderId}`, onOrderUpdate);
    (res as any).end();
  });
};
