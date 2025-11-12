import express from "express"
import { deleteAddress, fetchUser, getCurrentUser, getSavedAddress, saveAddress } from "../../controllers/user/user.controller.js"
import isAuth from "../../middlewares/user/isAuth.js"

const userRouter = express.Router()

userRouter.get("/current-user", isAuth, getCurrentUser)
userRouter.put("/save-address/:id", saveAddress)
userRouter.get("/get-addresses/:userId", getSavedAddress)
userRouter.get("/fetch-user/:userId", fetchUser)
userRouter.delete("/delete-address/:userId/:addressId", deleteAddress)

export default userRouter
