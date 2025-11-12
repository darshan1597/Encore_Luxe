import User from "../../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../../utils/user/token.js"
import { sentOtp } from "../../utils/mail.js"

export const signUp = async (req, res) => {
    try {
        const {fullName, email, password} = req.body
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: "User Already exist."})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters."})
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        user = await User.create({
            fullName,
            email,
            password: hashedPassword
        })

        const token = await genToken(user._id)
        res.cookie("token", token,{
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(201).json({user})
    } catch (error) {
        return res.status(500).json(`Sign Up error ${error}`)
    }
}

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User does not exist."})
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            return res.status(400).json({message: "Incorrect password"})
        }

        const token = await genToken(user._id)
        res.cookie("token", token,{
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(`Sign In error ${error}`)
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message: "Logged out Successfully"})
    } catch (error) {
        return res.status(500).json({message: `Sign out Error ${error}`})
    }
}

export const sendOtp = async (req, res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User does not Exist."})
        }
        
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpires = Date.now()+5*60*1000
        user.isOtpVerified = false
        await user.save()
        await sentOtp(email, otp)
        return res.status(200).json({message: "OTP sent successfully"})
    } catch (error) {
        return res.status(500).json({message: `error while sending OTP ${error}`})
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User does not Exist."})
        }
        if(user.resetOtp != otp || user.otpExpires < Date.now()){
            return res.status(400).json({message: "Ivalid/ Expired OTP"})
        }

        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        
        return res.json(200).json({message: "OTP verified"})
    } catch (error) {
        return res.status(500).json({message: `Verify OTP error ${error}`})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {email, newPassword} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User does not Exist."})
        }
        if(!user.isOtpVerified){
            return res.status(400).json({message: "OTP verification required"})
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()

        return res.status(200).json({message: "Your password was reset successfully."})
    } catch (error) {
        return res.status(500).json({message: `Password reset error ${error}`})
    }
}

export const signUpGoogleAuth = async (req, res) => {
    try {
        const {fullName, email} = req.body
        let user = await User.findOne({email})

        if(!user){
            user = await User.create({
                fullName,
                email
            })
        }

        const token = await genToken(user._id)
        res.cookie("token", token,{
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message: `Sign Up with Google error: ${error}`})
    }
}

export const signInGoogleAuth = async (req, res) => {
    try {
        const { email } = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Email does not exist. Please Sign Up"})
        }

        const token = await genToken(user._id)
        res.cookie("token", token,{
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message: `Sign In with Google error: ${error}`})
    }
}