import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { OrderStatusComponent } from "../OrderStatus";
import * as api from "../../services/api";
import { OrderStatus } from "../../types";
import type { Order } from "../../types";

// Mock API
vi.mock("../../services/api");

// Mock Data
const mockOrder: Order = {
  id: "123",
  status: OrderStatus.RECEIVED,
  items: [{ menuItemId: "1", name: "Burger", quantity: 2, price: 10 }],
  totalAmount: 20,
  deliveryDetails: {
    name: "John Doe",
    address: "123 Main St",
    phone: "1234567890",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface MockEventSource {
  onmessage: ((event: { data: string }) => void) | null;
  onerror: ((error: unknown) => void) | null;
  close: ReturnType<typeof vi.fn>;
}

describe("OrderStatus Component", () => {
  let eventSourceMock: MockEventSource;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock EventSource
    eventSourceMock = {
      onmessage: null,
      onerror: null,
      close: vi.fn(),
    };
    
    globalThis.EventSource = class {
      constructor() {
        return eventSourceMock;
      }
    } as unknown as typeof EventSource;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    // Mock API to return promise that doesn't resolve immediately
    vi.mocked(api.getOrderStatus).mockReturnValue(new Promise(() => {}));

    render(<OrderStatusComponent orderId="123" onNewOrder={() => {}} />);
    expect(screen.getByText(/Loading order status/i)).toBeInTheDocument();
  });

  it("renders order details after load", async () => {
    vi.mocked(api.getOrderStatus).mockResolvedValue(mockOrder);

    render(<OrderStatusComponent orderId="123" onNewOrder={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Order #123")).toBeInTheDocument();
      expect(screen.getByText(OrderStatus.RECEIVED)).toBeInTheDocument();
    });
  });

  it("updates status via SSE", async () => {
    vi.mocked(api.getOrderStatus).mockResolvedValue(mockOrder);

    render(<OrderStatusComponent orderId="123" onNewOrder={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Order #123")).toBeInTheDocument();
    });

    // Simulate SSE message
    act(() => {
      if (eventSourceMock.onmessage) {
        const event = {
          data: JSON.stringify({ ...mockOrder, status: OrderStatus.PREPARING }),
        };
        eventSourceMock.onmessage(event);
      }
    });

    expect(screen.getByText(OrderStatus.PREPARING)).toBeInTheDocument();
  });

  it("closes SSE connection on delivery", async () => {
    vi.mocked(api.getOrderStatus).mockResolvedValue(mockOrder);

    render(<OrderStatusComponent orderId="123" onNewOrder={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Order #123")).toBeInTheDocument();
    });

    // Simulate Delivered SSE message
    act(() => {
      if (eventSourceMock.onmessage) {
        const event = {
          data: JSON.stringify({ ...mockOrder, status: OrderStatus.DELIVERED }),
        };
        eventSourceMock.onmessage(event);
      }
    });

    expect(screen.getByText("🎉 Your order has been delivered! Enjoy your meal!")).toBeInTheDocument();
    expect(eventSourceMock.close).toHaveBeenCalled();
  });
});
