import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    isPrimary: { 
        type: Boolean, 
        default: false 
    }
})

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    shortDescription: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    hierarchy: {
        type: String,
        required: true
    },
    subcategory: { 
        type: String, 
        required: true 
    },
    mrp: { 
        type: Number, 
        required: true 
    },
    discountedPrice: { 
        type: Number,
        default: 0
    },
    designer: { 
        type: String,
    },
    size: { 
        type: String
    },
    productDescription: { 
        type: String,
        required: true
    },
    material: { 
        type: String,
        required: true
    },
    color: { 
        type: String,
        required: true
    },
    condition: { 
        type: String,
        required: true
    },
    images: [
        ImageSchema
    ],
    stock: {
        type: Number,
        default: 1
    },
    featured: {
        type: Boolean,
        default: false
    },
    latest: {
        type: Boolean,
        default: false
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: false
    },
    sellerName: {
        type: String,
    },
    sellerNumber: {
        type: String,
    },
    sellerEmail: {
        type: String,
    },
    agreementFile: [
        {
            type: String
        }
    ],
    agreementSigned: {
        type: Boolean,
        default: false
    },
    sku: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: String,
        enum: ["recently added", "approved", "shipped to warehouse", "onsite display", "shipped to buyer", "paid to seller"],
        default: "recently added"
    },
    onSiteDisplay: {
        type: Boolean,
        default: false
    },
    displaySold: {
        type: Boolean,
        default: false
    },
    approvedDate: { 
        type: Date 
    },
    warehouseDate: { 
        type: Date 
    },
    liveDate: { 
        type: Date  
    },
    soldDate: { 
        type: Date 
    },
}, {timestamps: true});

const Product = mongoose.model("Product", ProductSchema)

export default Product
