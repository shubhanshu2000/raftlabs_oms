import { describe, it, expect } from "vitest";
import { getMenu, getMenuItemById } from "../../service/menu.service";
import { menuItems } from "../../model/menu.data";

describe("Menu Service", () => {
  describe("getMenu", () => {
    it("should return all available items when no filter is applied", () => {
      const result = getMenu({});
      expect(result.menu.length).toBeGreaterThan(0);
      expect(result.total).toBe(menuItems.filter((i) => i.available).length);
    });

    it("should filter by category", () => {
      const category = "Main Course";
      const result = getMenu({ category });
      const allMainCourse = result.menu.every(
        (item) => item.category === category,
      );
      expect(allMainCourse).toBe(true);
    });

    it("should paginate results", () => {
      const result = getMenu({ page: 1, limit: 2 });
      expect(result.menu.length).toBeLessThanOrEqual(2);
    });
  });

  describe("getMenuItemById", () => {
    it("should return item if found", () => {
      const item = menuItems[0];
      const result = getMenuItemById(item.id);
      expect(result).toEqual(item);
    });

    it("should return undefined if not found", () => {
      const result = getMenuItemById("non-existent-id");
      expect(result).toBeUndefined();
    });
  });
});
