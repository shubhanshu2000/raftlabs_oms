import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { OrderStatusPage } from "../pages/OrderStatus";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$orderId",
  component: OrderStatusRoute,
});

function OrderStatusRoute() {
  const { orderId } = Route.useParams();

  return <OrderStatusPage orderId={orderId} />;
}
