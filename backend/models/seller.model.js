import mongoose from "mongoose"

const sellerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
}, {timestamps: true})

const Seller = mongoose.model("Seller", sellerSchema)

export default Seller