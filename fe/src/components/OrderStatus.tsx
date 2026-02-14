import { useState, useEffect } from "react";
import type { Order } from "../types";
import { OrderStatus } from "../types";
import { getOrderStatus, API_BASE_URL } from "../services/api";

interface OrderStatusProps {
  orderId: string;
  onNewOrder: () => void;
}

const statusSteps = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];


export const OrderStatusComponent = ({
  orderId,
  onNewOrder,
}: OrderStatusProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial order state
    loadOrder();

    // Set up SSE connection for real-time updates
    const eventSource = new EventSource(
      `${API_BASE_URL}/orders/${orderId}/stream`
    );

    eventSource.onmessage = (event) => {
      try {
        const updatedOrder = JSON.parse(event.data);
        setOrder(updatedOrder);
        setLoading(false);
        
        // Close connection when order is delivered
        if (updatedOrder.status === OrderStatus.DELIVERED) {
          eventSource.close();
        }
      } catch (err) {
        console.error("Failed to parse SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
      
      // Do not poll if we already know the order doesn't exist (handled by loadOrder)
      // But if SSE fails due to connection, we might fallback.
      // However, to prevent 404 loops for non-existent orders:
      const intervalId = setInterval(async () => {
        try {
          const orderData = await getOrderStatus(orderId);
           if (orderData) {
             setOrder(orderData);
             setLoading(false);
           }
        } catch (error) {
           // If 404, stop polling
           clearInterval(intervalId);
        }
      }, 3000);
      
      return () => clearInterval(intervalId);
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setError(null);
      const orderData = await getOrderStatus(orderId);
      setOrder(orderData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load order status");
      setLoading(false);
    }
  };

  if (loading && !order) {
    return <div className="loading">Loading order status...</div>;
  }

  if (error && !order) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={loadOrder} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = statusSteps.indexOf(order.status);
  const isDelivered = order.status === OrderStatus.DELIVERED;

  return (
    <div className="bg-white rounded-brand p-8 shadow-brand-lg">
      <div className="mb-8 pb-4 border-b-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order #{order.id}</h2>
        <p className="text-gray-500 text-sm">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mb-12 py-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-10 text-center">Order Status</h3>
        <div className="flex justify-between relative mx-auto max-w-[90%]">
          {statusSteps.map((status, index) => (
            <div
              key={status}
              className={`flex-1 flex flex-col items-center relative z-10 ${index <= currentStepIndex ? "text-brand-success font-semibold" : "text-gray-500"} ${index === currentStepIndex && !isDelivered ? "text-brand-primary font-bold" : ""}`}
            >
              <div className="flex flex-col items-center relative w-full">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 z-20 relative ${
                  index < currentStepIndex || (index === currentStepIndex && isDelivered)
                    ? "bg-brand-success border-4 border-brand-success text-white scale-110 shadow-[0_4px_6px_-1px_rgba(16,185,129,0.3)]"
                    : index === currentStepIndex
                      ? "bg-white border-4 border-brand-primary text-brand-primary scale-125 shadow-[0_0_0_6px_rgba(234,88,12,0.15)]"
                      : "bg-white border-4 border-gray-200 text-gray-400"
                }`}>
                  {index < currentStepIndex || (index === currentStepIndex && isDelivered) ? (
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`absolute top-7 left-1/2 w-full h-1 z-0 -translate-y-1/2 transition-colors duration-500 ${
                    index < currentStepIndex 
                      ? "bg-brand-success" 
                      : index === currentStepIndex && !isDelivered
                        ? "bg-gradient-to-r from-brand-success to-gray-200"
                        : "bg-gray-200"
                  }`}></div>
                )}
              </div>
              <div className={`mt-6 text-sm text-center max-w-[140px] leading-tight transition-all duration-300 ${
                index <= currentStepIndex ? (index === currentStepIndex && !isDelivered ? "translate-y-0.5" : "") : ""
              }`}>
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-gray-500 text-sm">x{item.quantity}</span>
              </div>
              <span className="font-semibold text-brand-primary">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200 text-xl">
          <strong className="text-gray-800 font-bold">Total:</strong>
          <strong className="text-brand-primary text-2xl font-bold">${order.totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Details</h3>
        <p className="mb-2 text-gray-800 leading-relaxed">
          <strong className="mr-2">Name:</strong> {order.deliveryDetails.name}
        </p>
        <p className="mb-2 text-gray-800 leading-relaxed">
          <strong className="mr-2">Address:</strong> {order.deliveryDetails.address}
        </p>
        <p className="mb-2 text-gray-800 leading-relaxed">
          <strong className="mr-2">Phone:</strong> {order.deliveryDetails.phone}
        </p>
      </div>

      {isDelivered && (
        <div className="text-center p-8 bg-gradient-to-b from-green-100 to-green-200 rounded-brand mt-8">
          <p className="text-xl font-semibold text-green-900 mb-6">
            🎉 Your order has been delivered! Enjoy your meal!
          </p>
          <button className="btn btn-primary mt-4" onClick={onNewOrder}>
            Place New Order
          </button>
        </div>
      )}
    </div>
  );
};
