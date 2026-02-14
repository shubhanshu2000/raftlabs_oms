import type { CartItem } from "../types";

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
      <div className="bg-white rounded-brand p-6 shadow-brand-lg sticky top-4 text-center py-8 px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b-2 border-gray-200">Your Cart</h3>
        <p className="text-gray-500 mt-2">Your cart is empty. Add some delicious items!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-brand p-6 shadow-brand-lg sticky top-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b-2 border-gray-200">Your Cart ({cartItems.length} items)</h3>
      
      <div className="max-h-[400px] overflow-y-auto mb-4">
        {cartItems.map((item) => (
          <div key={item.menuItem.id} className="grid grid-cols-[60px_1fr_auto] gap-4 py-4 border-b border-gray-200 items-center last:border-b-0">
            <img
              src={item.menuItem.image}
              alt={item.menuItem.name}
              className="w-[60px] h-[60px] object-cover rounded-lg"
            />
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-gray-800 mb-1 truncate">{item.menuItem.name}</h4>
              <p className="text-sm text-gray-500">
                ${item.menuItem.price.toFixed(2)} each
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                <button
                  className="bg-brand-primary text-white border-none w-7 h-7 rounded-md text-lg cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-brand-primary-dark"
                  onClick={() =>
                    onUpdateQuantity(item.menuItem.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className="font-semibold text-gray-800 min-w-[24px] text-center">{item.quantity}</span>
                <button
                  className="bg-brand-primary text-white border-none w-7 h-7 rounded-md text-lg cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-brand-primary-dark"
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
            <div className="font-bold text-brand-primary text-lg col-span-3 text-right">
              ${(item.menuItem.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center text-xl mb-4">
          <strong className="text-gray-800">Total:</strong>
          <strong className="text-brand-primary text-2xl">${totalPrice.toFixed(2)}</strong>
        </div>
        <button className="btn btn-primary btn-checkout" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
