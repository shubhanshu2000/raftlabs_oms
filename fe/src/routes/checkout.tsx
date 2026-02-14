import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { CheckoutPage } from "../pages/Checkout";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
