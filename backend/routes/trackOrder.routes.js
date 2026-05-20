import express from "express"
import { trackOrder } from "../controllers/trackOrder.controller.js"

const trackOrderRouter = express.Router()

trackOrderRouter.get("/", trackOrder)

export default trackOrderRouter
