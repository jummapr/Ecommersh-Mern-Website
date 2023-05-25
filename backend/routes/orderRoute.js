import express from "express";
import { isAdmin, isAuthentication } from "../middlewares/auth.js";
import {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/order/new").post(isAuthentication, createNewOrder);
router.route("/orders/:id").get(isAuthentication,  getSingleOrder);

router.get("/my",isAuthentication,getMyOrders);

router.route("/admin/orders").get(isAuthentication,isAdmin,getAllOrders);

router.route("/admin/order/:id").put(isAuthentication,isAdmin,updateOrderStatus).delete(isAuthentication,isAdmin,deleteOrder)

export default router;
