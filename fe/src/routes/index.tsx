import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { HomePage } from "../pages/Home";

interface MenuSearch {
  page?: number
  limit?: number
  category?: string
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>): MenuSearch => {
    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 6,
      category: (search?.category as string) || "All",
    };
  },
  component: HomePage,
});
