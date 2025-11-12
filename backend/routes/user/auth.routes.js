import express from "express"
import { resetPassword, sendOtp, signIn, signInGoogleAuth, signOut, signUp, signUpGoogleAuth, verifyOtp } from "../../controllers/user/auth.controller.js"

const userAuthRouter = express.Router()

userAuthRouter.post("/signup", signUp)
userAuthRouter.post("/signin", signIn)
userAuthRouter.get("/signout", signOut)
userAuthRouter.post("/send-otp", sendOtp)
userAuthRouter.post("/verify-otp", verifyOtp)
userAuthRouter.post("/reset-password", resetPassword)
userAuthRouter.post("/signin-google-auth", signInGoogleAuth)
userAuthRouter.post("/signup-google-auth", signUpGoogleAuth)

export default userAuthRouter
