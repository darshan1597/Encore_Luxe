import express from "express";
import { getWishlist, toggleWishlist } from "../../controllers/user/wishlist.controller.js";

const wishlistRoutes = express.Router();

wishlistRoutes.post("/toggle", toggleWishlist);
wishlistRoutes.get("/:userId", getWishlist);

export default wishlistRoutes;
