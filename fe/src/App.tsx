import { useState } from "react";
import "./App.css";
import { useCart } from "./hooks/useCart";
import { MenuList } from "./components/MenuList";
import { Cart } from "./components/Cart";
import { CheckoutForm } from "./components/CheckoutForm";
import { OrderStatusComponent } from "./components/OrderStatus";
import { createOrder as createOrderAPI } from "./services/api";
import type { DeliveryDetails, CartItem } from "./types";

type AppView = "menu" | "checkout" | "orderStatus";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("menu");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setCurrentView("checkout");
  };

  const handleCancelCheckout = () => {
    setCurrentView("menu");
  };

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
      setOrderId(order.id);
      clearCart();
      setCurrentView("orderStatus");
    } catch (err: unknown) {
      setError("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    setOrderId(null);
    setCurrentView("menu");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FoodExpress</h1>
        <p className="tagline">Delicious food delivered to your door</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {currentView === "menu" && (
          <div className="menu-view">
            <div className="menu-section">
              <MenuList onAddToCart={addToCart} />
            </div>
            <div className="cart-section">
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                totalPrice={getTotalPrice()}
              />
              {getTotalItems() > 0 && (
                <div className="cart-summary-badge">
                  {getTotalItems()} items
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === "checkout" && (
          <div className="checkout-view">
            <CheckoutForm
              onSubmit={handleSubmitOrder}
              onCancel={handleCancelCheckout}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {currentView === "orderStatus" && orderId && (
          <div className="order-status-view">
            <OrderStatusComponent orderId={orderId} onNewOrder={handleNewOrder} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 FoodExpress. Made with ❤️ for delicious food lovers.</p>
      </footer>
    </div>
  );
}

export default App;
