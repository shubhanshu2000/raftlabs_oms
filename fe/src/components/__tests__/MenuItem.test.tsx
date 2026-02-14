import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MenuItem } from "../MenuItem";
import type { MenuItem as MenuItemType } from "../../types";

// Mock data
const mockItem: MenuItemType = {
  id: "1",
  name: "Burger",
  description: "Delicious burger",
  price: 10,
  category: "Main",
  available: true,
  image: "burger.jpg",
};

describe("MenuItem Component", () => {
  it("renders item details correctly", () => {
    const onAddToCart = vi.fn();
    render(<MenuItem item={mockItem} onAddToCart={onAddToCart} />);

    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("Delicious burger")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });

  it("calls onAddToCart when button is clicked", () => {
    const onAddToCart = vi.fn();
    render(<MenuItem item={mockItem} onAddToCart={onAddToCart} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    expect(onAddToCart).toHaveBeenCalledWith(mockItem, 1);
  });
});
