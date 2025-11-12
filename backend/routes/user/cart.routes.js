import express from "express";
import { addToCart, getCart, removeFromCart } from "../../controllers/user/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", addToCart);
cartRouter.get("/get-cart/:userId", getCart);
cartRouter.post("/remove-from-cart", removeFromCart);

export default cartRouter;
