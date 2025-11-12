import express from "express"
import { addAdmin, adminSignIn, signOut } from "../../controllers/admin/auth.controller.js"

const adminAuthRouter = express.Router()

adminAuthRouter.post("/add-admin", addAdmin)
adminAuthRouter.post("/admin-signin", adminSignIn)
adminAuthRouter.get("/signout", signOut)

export default adminAuthRouter
