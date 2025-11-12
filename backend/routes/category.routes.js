import express from "express"
import { getCategories } from "../controllers/category.controller.js"

const getCategoryRouter = express.Router()

getCategoryRouter.get("/get-categories", getCategories)

export default getCategoryRouter
