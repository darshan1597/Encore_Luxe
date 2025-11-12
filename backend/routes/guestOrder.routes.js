import express from "express";
import { createGuestOrder, getAllGuestOrders, verifyGuestPayment } from "../controllers/guestOrder.controller.js";

const guestRouter = express.Router();

guestRouter.post("/create-guest-order", createGuestOrder);
guestRouter.post("/verify-guest-payment", verifyGuestPayment);
guestRouter.get("/get-all-guest-orders", getAllGuestOrders);

export default guestRouter;
