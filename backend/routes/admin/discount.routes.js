import express from "express";
import { createDiscount, deleteDiscount, getAllDiscounts, getDiscount, updateDiscount } from "../../controllers/admin/discount.controller.js";

const discountRouter = express.Router();

discountRouter.post("/create-discount", createDiscount);
discountRouter.get("/get-discounts", getAllDiscounts);
discountRouter.get("/get-one-discount/:id", getDiscount);
discountRouter.put("/update-discount/:id", updateDiscount);
discountRouter.delete("/delete-discount/:id", deleteDiscount);

export default discountRouter;
