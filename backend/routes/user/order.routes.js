import express from "express"
import { createOrder, getAllOrders, getUserOrders, verifyPayment } from "../../controllers/user/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/create-order", createOrder);
orderRouter.post("/verify-payment", verifyPayment);
orderRouter.get("/get-all-orders", getAllOrders);
orderRouter.get("/get-user-order/:userId", getUserOrders)

export default orderRouter;
