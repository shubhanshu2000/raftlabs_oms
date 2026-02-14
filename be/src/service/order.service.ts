import { orders, generateOrderId } from "../model/order.data";
import {
  Order,
  OrderStatus,
  CreateOrderRequest,
  OrderItem,
} from "../types/order.types";
import { getMenuItemById } from "./menu.service";
import { orderEvents } from "./order.events";

export const createOrder = (request: CreateOrderRequest): Order | null => {
  // Validate that all menu items exist
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const item of request.items) {
    const menuItem = getMenuItemById(item.menuItemId);
    if (!menuItem) {
      throw new Error(`Menu item with ID ${item.menuItemId} not found`);
    }
    if (!menuItem.available) {
      throw new Error(`Menu item ${menuItem.name} is not available`);
    }
    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const orderItem: OrderItem = {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
    };

    orderItems.push(orderItem);
    totalAmount += menuItem.price * item.quantity;
  }

  // Validate delivery details
  if (
    !request.deliveryDetails.name ||
    !request.deliveryDetails.address ||
    !request.deliveryDetails.phone
  ) {
    throw new Error("All delivery details are required");
  }

  // Create the order
  const order: Order = {
    id: generateOrderId(),
    items: orderItems,
    deliveryDetails: request.deliveryDetails,
    status: OrderStatus.RECEIVED,
    totalAmount: Math.round(totalAmount * 100) / 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  orders.set(order.id, order);

  // Emit order created event
  orderEvents.emitOrderUpdate(order.id, order);

  // Start simulated status updates
  simulateStatusUpdates(order.id);

  return order;
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.get(id);
};

export const updateOrderStatus = (
  id: string,
  status: OrderStatus,
): Order | null => {
  const order = orders.get(id);
  if (!order) {
    return null;
  }

  order.status = status;
  order.updatedAt = new Date();
  orders.set(id, order);

  // Emit order update event
  orderEvents.emitOrderUpdate(id, order);

  return order;
};

export const getAllOrders = (): Order[] => {
  return Array.from(orders.values());
};

// Simulate automatic status progression
export const simulateStatusUpdates = (orderId: string): void => {
  const statusProgression = [
    { status: OrderStatus.PREPARING, delay: 5000 }, // 5 seconds
    { status: OrderStatus.OUT_FOR_DELIVERY, delay: 10000 }, // 10 seconds
    { status: OrderStatus.DELIVERED, delay: 15000 }, // 15 seconds
  ];

  statusProgression.forEach(({ status, delay }) => {
    setTimeout(() => {
      const order = orders.get(orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date();
        orders.set(orderId, order);
        
        // Emit event for SSE
        orderEvents.emitOrderUpdate(orderId, order);
      }
    }, delay);
  });
};
