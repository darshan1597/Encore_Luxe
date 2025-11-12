import express from "express"
import { getDesigners } from "../controllers/designer.controller.js"

const getDesignerRouter = express.Router()

getDesignerRouter.get("/get-designers", getDesigners)

export default getDesignerRouter
