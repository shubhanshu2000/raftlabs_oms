import { Router } from "express";
import * as orderController from "../controller/order.controller";
import * as sseController from "../controller/sse.controller";
import { validate } from "../middleware/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";

const router = Router();

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/:id", orderController.getOrder);
router.get("/:id/stream", sseController.streamOrderStatus);
router.patch(
  "/:id/status",
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);
router.get("/", orderController.getAllOrders);

export default router;
