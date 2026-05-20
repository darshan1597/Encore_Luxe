import express from "express";
import { applyDiscount } from "../controllers/applyDiscount.controller.js";

const applyDiscountRouter = express.Router();

applyDiscountRouter.post("/apply-discount", applyDiscount);

export default applyDiscountRouter;
