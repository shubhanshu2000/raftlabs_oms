import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import app from "../../../api/index";
import { OrderStatus } from "../../types/order.types";

describe("Order API Integration", () => {
  let request: any;

  beforeAll(() => {
    request = supertest(app);
  });

  describe("POST /api/orders", () => {
    it("should create a new order with valid data", async () => {
      const response = await request.post("/api/v1/orders").send({
        items: [
          { menuItemId: "1", quantity: 2 },
          { menuItemId: "2", quantity: 1 },
        ],
        deliveryDetails: {
          name: "John Doe",
          address: "123 Main St",
          phone: "1234567890",
        },
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.status).toBe(OrderStatus.RECEIVED);
    });

    it("should return 400 for invalid data (Zod Validation)", async () => {
        const response = await request.post("/api/v1/orders").send({
            items: [], // Invalid: empty array
            deliveryDetails: {
                name: "J", // Invalid: too short
            }
        });

        expect(response.status).toBe(400);
        // Zod error structure
        expect(response.body.issues).toBeDefined(); 
    });
  });

  describe("GET /api/orders/:id", () => {
      it("should return 404 for non-existent order", async () => {
          const response = await request.get("/api/v1/orders/non-existent-id");
          expect(response.status).toBe(404);
      });
  });
});
