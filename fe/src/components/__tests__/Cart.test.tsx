import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Cart } from "../Cart";
import type { CartItem } from "../../types";

// Mock data
const mockCartItems: CartItem[] = [
  {
    menuItem: {
      id: "1",
      name: "Burger",
      description: "Delicious",
      price: 10,
      category: "Main",
      available: true,
      image: "burger.jpg",
    },
    quantity: 2,
  },
];

describe("Cart Component", () => {
  it("renders empty state when cart is empty", () => {
    const onUpdateQuantity = vi.fn();
    const onRemoveItem = vi.fn();
    const onCheckout = vi.fn();

    render(
      <Cart
        cartItems={[]}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onCheckout={onCheckout}
        totalPrice={0}
      />,
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("renders cart items and total", () => {
    const onUpdateQuantity = vi.fn();
    const onRemoveItem = vi.fn();
    const onCheckout = vi.fn();

    render(
      <Cart
        cartItems={mockCartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onCheckout={onCheckout}
        totalPrice={20}
      />,
    );

    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // Quantity
    expect(screen.getAllByText("$20.00")[0]).toBeInTheDocument(); // Total
  });

  it("calls updateQuantity when +/- buttons are clicked", () => {
    const onUpdateQuantity = vi.fn();
    const onRemoveItem = vi.fn();
    const onCheckout = vi.fn();

    render(
      <Cart
        cartItems={mockCartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onCheckout={onCheckout}
        totalPrice={20}
      />,
    );

    const increaseBtn = screen.getByRole("button", { name: "+" });
    fireEvent.click(increaseBtn);
    expect(onUpdateQuantity).toHaveBeenCalledWith("1", 3);

    const decreaseBtn = screen.getByRole("button", { name: "-" });
    fireEvent.click(decreaseBtn);
    expect(onUpdateQuantity).toHaveBeenCalledWith("1", 1);
  });
});
