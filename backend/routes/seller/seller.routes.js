import express from "express"
import { getAllSellersForm, getSingleSellerForm, seller, sellerProducts, uploadSellerProductImages } from "../../controllers/seller/seller.controller.js"
import { uploadSellerProductImagesMulter } from "../../middlewares/multer.js"

const sellerRouter = express.Router()

sellerRouter.post("/seller-info", seller)
sellerRouter.post("/seller-product", sellerProducts)
sellerRouter.post("/seller-product-images", uploadSellerProductImagesMulter.array("images", 10), uploadSellerProductImages)
sellerRouter.get("/get-seller-forms", getAllSellersForm)
sellerRouter.get("/get-single-seller-form/:id", getSingleSellerForm)

export default sellerRouter
