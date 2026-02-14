import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckoutForm } from "../CheckoutForm";

describe("CheckoutForm Component", () => {
  it("renders form fields correctly", () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <CheckoutForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Delivery Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Place Order/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
        <CheckoutForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          isSubmitting={false}
        />,
      );
  
      const submitBtn = screen.getByRole("button", { name: /Place Order/i });
      fireEvent.click(submitBtn);
  
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Address is required")).toBeInTheDocument();
      expect(screen.getByText("Phone number is required")).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <CheckoutForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Delivery Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });

    const submitBtn = screen.getByRole("button", { name: /Place Order/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      address: "123 Main St",
      phone: "1234567890",
    });
  });

  it("calls onCancel when back button is clicked", () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <CheckoutForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
      />,
    );

    const backBtn = screen.getByRole("button", { name: /Back to Cart/i });
    fireEvent.click(backBtn);

    expect(onCancel).toHaveBeenCalled();
  });
});
