import { Request, Response } from "express";
import * as orderService from "../service/order.service";
import { orderEvents } from "../service/order.events";

// SSE endpoint for order status updates
export const streamOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id as string;

  // Verify order exists
  const order = orderService.getOrderById(orderId);
  if (!order) {
    res.status(404).json({
      success: false,
      error: "Order not found",
    });
    return;
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable buffering in nginx

  // Send initial order state
  res.write(`data: ${JSON.stringify(order)}\n\n`);

  // Listen for order updates
  const onOrderUpdate = (updatedOrder: any) => {
    res.write(`data: ${JSON.stringify(updatedOrder)}\n\n`);
  };

  orderEvents.on(`order:${orderId}`, onOrderUpdate);

  // Handle client disconnect
  req.on("close", () => {
    orderEvents.off(`order:${orderId}`, onOrderUpdate);
    res.end();
  });
};
