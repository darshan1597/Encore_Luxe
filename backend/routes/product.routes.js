import express from "express"
import { getProducts } from "../controllers/product.controller.js"

const getProductRouter = express.Router()

getProductRouter.get("/get-products", getProducts)

export default getProductRouter
