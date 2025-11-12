import mongoose from "mongoose";

const sellerProductSchema = mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    category: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    condition: {
        type: String,
        require: true
    },
    designer: {
        type: String
    },
    size: {
        type: String
    },
    mrp: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ["approved", "notapproved"],
        default: "notapproved",
    }
}, {timestamps: true})

const SellerProduct = mongoose.model("SellerProduct", sellerProductSchema)

export default SellerProduct
