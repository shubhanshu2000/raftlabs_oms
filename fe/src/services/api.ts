import type {
  MenuItem,
  Order,
  CreateOrderRequest,
  ApiResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const fetchMenu = async (
  page = 1,
  limit = 10,
  category?: string,
): Promise<{ menu: MenuItem[]; total: number }> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (category && category !== "All") {
      queryParams.append("category", category);
    }

    const response = await fetch(`${API_BASE_URL}/menu?${queryParams}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch menu");
    }

    // Backend returns { success: true, data: [...], pagination: { total, ... } }
    // OR { success: true, menu: [...], total: ... } depending on implementation.
    // My controller returns: { success: true, data: result.menu, pagination: { total: result.total } }

    return {
      menu: data.data || [],
      total: data.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/categories`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return ["All", ...data.data];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ["All"];
  }
};

export const createOrder = async (
  orderRequest: CreateOrderRequest,
): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    const data: ApiResponse<Order> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to create order");
    }

    return data.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    const data: ApiResponse<Order> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch order");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
