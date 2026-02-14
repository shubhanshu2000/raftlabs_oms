import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckoutForm } from "../components/CheckoutForm";
import { useCart } from "../hooks/useCart";
import { createOrder as createOrderAPI } from "../services/api";
import type { DeliveryDetails, CartItem } from "../types";

export function CheckoutPage() {
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
    <div className="max-w-[800px] mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-brand mb-6 flex justify-between items-center animate-slide-up">
          {error}
          <button className="bg-transparent border-none text-red-800 text-2xl font-bold cursor-pointer px-2 hover:text-red-900" onClick={() => setError(null)}>✕</button>
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
