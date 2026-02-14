import { createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as checkoutRoute } from "./routes/checkout";
import { Route as orderRoute } from "./routes/order.$orderId";

const routeTree = rootRoute.addChildren([
  indexRoute,
  checkoutRoute,
  orderRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
