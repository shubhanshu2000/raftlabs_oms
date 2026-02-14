import { Router } from "express";
import * as orderController from "../controller/order.controller";
import * as sseController from "../controller/sse.controller";
import { validate } from "../middleware/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";

const router = Router();

router.post("/orders", validate(createOrderSchema), orderController.createOrder);
router.get("/orders/:id", orderController.getOrder);
router.get("/orders/:id/stream", sseController.streamOrderStatus);
router.patch(
  "/orders/:id/status",
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);
router.get("/orders", orderController.getAllOrders);

export default router;
