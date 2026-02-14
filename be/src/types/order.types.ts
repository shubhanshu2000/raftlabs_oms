export enum OrderStatus {
  RECEIVED = "Order Received",
  PREPARING = "Preparing",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  deliveryDetails: DeliveryDetails;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  deliveryDetails: DeliveryDetails;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
