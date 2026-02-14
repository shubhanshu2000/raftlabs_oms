import { MenuList } from "../components/MenuList";
import { Cart } from "../components/Cart";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "@tanstack/react-router";

export function HomePage() {
  const navigate = useNavigate();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate({ to: "/checkout" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      <div className="min-w-0">
        <MenuList onAddToCart={addToCart} />
      </div>
      <div className="flex flex-col gap-4">
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
          totalPrice={getTotalPrice()}
        />
        {getTotalItems() > 0 && (
          <div className="bg-brand-primary text-white py-3 px-4 rounded-full text-center font-medium shadow-brand-lg">
            {getTotalItems()} items
          </div>
        )}
      </div>
    </div>
  );
}
