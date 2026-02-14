import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import app from "../../index";

import { MenuItem } from "../../types/menu.types";

describe("Menu API Integration", () => {
  let request: supertest.Agent;

  beforeAll(() => {
    request = supertest(app);
  });

  describe("GET /api/menu", () => {
    it("should return a list of menu items", async () => {
      const response = await request.get("/api/v1/menu");
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pagination.total).toBeGreaterThan(0);
    });

    it("should supports pagination", async () => {
        const response = await request.get("/api/v1/menu?page=1&limit=2");
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeLessThanOrEqual(2);
        expect(response.body.pagination.page).toBe(1);
    });

    it("should filter by category", async () => {
        const response = await request.get("/api/v1/menu?category=Main Course");
        expect(response.status).toBe(200);
        response.body.data.forEach((item: MenuItem) => {
            expect(item.category).toBe("Main Course");
        });
    });
  });

  describe("GET /api/menu/:id", () => {
      it("should return menu item details", async () => {
          // Get first item to find a valid ID
          const listResponse = await request.get("/api/v1/menu");
          const firstItem = listResponse.body.data[0];

          const response = await request.get(`/api/v1/menu/${firstItem.id}`);
          expect(response.status).toBe(200);
          expect(response.body.data.id).toBe(firstItem.id);
          expect(response.body.data.name).toBe(firstItem.name);
      });

      it("should return 404 for non-existent item", async () => {
          const response = await request.get("/api/v1/menu/non-existent-id");
          expect(response.status).toBe(404);
      });
  });
});
