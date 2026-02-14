import { useState } from "react";
import type { DeliveryDetails } from "../types";
import "./CheckoutForm.css";

interface CheckoutFormProps {
  onSubmit: (details: DeliveryDetails) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const CheckoutForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
}: CheckoutFormProps) => {
  const [formData, setFormData] = useState<DeliveryDetails>({
    name: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<DeliveryDetails>>({});

  const validateField = (field: keyof DeliveryDetails, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        break;
      case "address":
        if (!value.trim()) return "Address is required";
        if (value.trim().length < 5) return "Address must be at least 5 characters";
        break;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        // Remove non-digits for validation
        const cleanPhone = value.replace(/\D/g, "");
        if (!/^\d{10}$/.test(cleanPhone)) {
          return "Please enter a valid 10-digit phone number";
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DeliveryDetails> = {};
    
    // Validate all fields based on current state
    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;

    const addressError = validateField("address", formData.address);
    if (addressError) newErrors.address = addressError;

    const phoneError = validateField("phone", formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    field: keyof DeliveryDetails,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // If there is an existing error for this field, validate it on change
    // This ensures the error persists until the input is valid
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  return (
    <div className="checkout-form">
      <h2>Delivery Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "error" : ""}
            disabled={isSubmitting}
          />
          <span className="error-message">{errors.name || ''}</span>
        </div>

        <div className="form-group">
          <label htmlFor="address">Delivery Address *</label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            rows={3}
            className={errors.address ? "error" : ""}
            disabled={isSubmitting}
          />
          <span className="error-message">{errors.address || ''}</span>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="123-456-7890"
            className={errors.phone ? "error" : ""}
            disabled={isSubmitting}
          />
          <span className="error-message">{errors.phone || ''}</span>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Back to Cart
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};
