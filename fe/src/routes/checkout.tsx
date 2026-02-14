import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { CheckoutForm } from "../components/CheckoutForm";
import { useCart } from "../hooks/useCart";
import { createOrder as createOrderAPI } from "../services/api";
import type { DeliveryDetails, CartItem } from "../types";
import { useState } from "react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutComponent,
});

function CheckoutComponent() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitOrder = async (deliveryDetails: DeliveryDetails) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderRequest = {
        items: cartItems.map((item: CartItem) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
        })),
        deliveryDetails,
      };

      const order = await createOrderAPI(orderRequest);
      clearCart();
      navigate({ to: "/order/$orderId", params: { orderId: order.id } });
    } catch (err: unknown) {
      setError("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="checkout-view">
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
      <CheckoutForm
        onSubmit={handleSubmitOrder}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
