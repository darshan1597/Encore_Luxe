import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    resetOtp:{
        type: String
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    otpExpires: {
        type: Date
    },
    address: [
        {
            fullAddress: String,
            apt: String,
            pincode: String,
            city: String,
            state: String,
            country: String
        }
    ]
}, {timestamps:true})

const User = mongoose.model("User", userSchema)

export default User