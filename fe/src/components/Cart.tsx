import type { CartItem } from "../types";
import "./Cart.css";

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onCheckout: () => void;
  totalPrice: number;
}

export const Cart = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalPrice,
}: CartProps) => {
  if (cartItems.length === 0) {
    return (
      <div className="cart empty-cart">
        <h3>Your Cart</h3>
        <p>Your cart is empty. Add some delicious items!</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h3>Your Cart ({cartItems.length} items)</h3>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.menuItem.id} className="cart-item">
            <img
              src={item.menuItem.image}
              alt={item.menuItem.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h4>{item.menuItem.name}</h4>
              <p className="cart-item-price">
                ${item.menuItem.price.toFixed(2)} each
              </p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() =>
                    onUpdateQuantity(item.menuItem.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() =>
                    onUpdateQuantity(item.menuItem.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <button
                className="btn-remove"
                onClick={() => onRemoveItem(item.menuItem.id)}
              >
                Remove
              </button>
            </div>
            <div className="cart-item-total">
              ${(item.menuItem.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <strong>Total:</strong>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
        <button className="btn btn-primary btn-checkout" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
