import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { MenuList } from "../components/MenuList";
import { Cart } from "../components/Cart";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "@tanstack/react-router";

interface MenuSearch {
  page?: number
  limit?: number
  category?: string
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>): MenuSearch => {
    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 6,
      category: (search?.category as string) || "All",
    };
  },
  component: IndexComponent,
});

function IndexComponent() {
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
          <div className="cart-summary-badge">{getTotalItems()} items</div>
        )}
      </div>
    </div>
  );
}
