import { menuItems } from "../model/menu.data";
import { MenuItem, MenuQuery, MenuResponse } from "../types/menu.types";

export const getMenu = (query: MenuQuery): MenuResponse => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const category = query.category;

  // Filter by category if provided
  let filteredItems = menuItems.filter((item) => item.available);
  if (category) {
    filteredItems = filteredItems.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    menu: paginatedItems,
    total: filteredItems.length,
    page,
    limit,
  };
};


export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};

export const getCategories = (): string[] => {
  const categories = new Set(menuItems.map((item) => item.category));
  return Array.from(categories);
};
