import { Router } from "express";
import {
  getAllOrders,
  updateOrderStatus,
  getCustomerOrders,
} from "../controllers/orderController";

const router = Router();

router.get("/", getAllOrders);
router.get("/customer/:id", getCustomerOrders);
router.put("/:id/status", updateOrderStatus);

export default router;
