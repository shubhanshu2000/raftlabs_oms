import { EventEmitter } from "events";
import { Order } from "../types/order.types";

// Event emitter for order status updates
class OrderEventEmitter extends EventEmitter {
  emitOrderUpdate(orderId: string, order: Order) {
    this.emit(`order:${orderId}`, order);
  }
}

export const orderEvents = new OrderEventEmitter();
