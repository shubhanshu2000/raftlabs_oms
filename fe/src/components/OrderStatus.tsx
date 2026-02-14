import { useState, useEffect } from "react";
import type { Order } from "../types";
import { OrderStatus } from "../types";
import { getOrderStatus } from "../services/api";
import "./OrderStatus.css";

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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

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
    <div className="order-status">
      <div className="order-header">
        <h2>Order #{order.id}</h2>
        <p className="order-date">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="status-tracker">
        <h3>Order Status</h3>
        <div className="status-steps">
          {statusSteps.map((status, index) => (
            <div
              key={status}
              className={`status-step ${index <= currentStepIndex ? "completed" : ""} ${index === currentStepIndex && !isDelivered ? "current" : ""}`}
            >
              <div className="step-indicator">
                <div className="step-circle">
                  {index < currentStepIndex || (index === currentStepIndex && isDelivered) ? (
                    <svg viewBox="0 0 24 24" className="check-icon">
                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className="step-line"></div>
                )}
              </div>
              <div className="step-label">{status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-details">
        <h3>Order Items</h3>
        <div className="order-items">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="order-item-info">
                <span className="order-item-name">{item.name}</span>
                <span className="order-item-quantity">x{item.quantity}</span>
              </div>
              <span className="order-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total:</strong>
          <strong>${order.totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="delivery-details">
        <h3>Delivery Details</h3>
        <p>
          <strong>Name:</strong> {order.deliveryDetails.name}
        </p>
        <p>
          <strong>Address:</strong> {order.deliveryDetails.address}
        </p>
        <p>
          <strong>Phone:</strong> {order.deliveryDetails.phone}
        </p>
      </div>

      {isDelivered && (
        <div className="order-complete">
          <p className="success-message">
            🎉 Your order has been delivered! Enjoy your meal!
          </p>
          <button className="btn btn-primary" onClick={onNewOrder}>
            Place New Order
          </button>
        </div>
      )}
    </div>
  );
};
