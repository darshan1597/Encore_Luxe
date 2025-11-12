import mongoose from "mongoose";

const sellerProductImageSchema = mongoose.Schema({
    sellerProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerProduct",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isPrimary: { 
        type: Boolean, 
        default: false 
    },
}, {timestamps: true})

const SellerProductImage = mongoose.model("SellerProductImage", sellerProductImageSchema)

export default SellerProductImage