import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { OrderStatusComponent } from "../components/OrderStatus";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$orderId",
  component: OrderStatusRoute,
});

function OrderStatusRoute() {
  const navigate = useNavigate();
  const { orderId } = Route.useParams();

  const handleNewOrder = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="order-status-view">
      <OrderStatusComponent orderId={orderId} onNewOrder={handleNewOrder} />
    </div>
  );
}
