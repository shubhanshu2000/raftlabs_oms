import { useNavigate } from "@tanstack/react-router";
import { OrderStatusComponent } from "../components/OrderStatus";

interface OrderStatusPageProps {
  orderId: string;
}

export function OrderStatusPage({ orderId }: OrderStatusPageProps) {
  const navigate = useNavigate();

  const handleNewOrder = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <OrderStatusComponent orderId={orderId} onNewOrder={handleNewOrder} />
    </div>
  );
}
