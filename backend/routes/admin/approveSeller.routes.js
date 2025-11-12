import express from "express";
import { approveSellerProduct } from "../../controllers/admin/admin.controller.js";

const approveSellerProcutrouter = express.Router();

approveSellerProcutrouter.post("/approve-seller-product/:sellerProductId", approveSellerProduct);

export default approveSellerProcutrouter;
