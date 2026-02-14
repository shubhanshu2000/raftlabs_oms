import { Router } from "express";
import * as menuController from "../controller/menu.controller";

const router = Router();

router.get("/", menuController.getMenu);
router.get("/categories", menuController.getCategories);
router.get("/:id", menuController.getMenuItem);

export default router;
