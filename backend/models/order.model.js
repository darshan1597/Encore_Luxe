import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product" 
            },
            name: String,
            price: Number,
            quantity: Number
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["razorpay", "cod"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["initiated", "pending", "paid", "failed"],
        default: "initiated",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    shippingInfo: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
    },
    billingInfo: {
        sameAsShipping: { 
            type: Boolean, 
            default: true 
        },
        name: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
    },
    orderNumber: {
        type: String
    },
    displayOrderNumber: { 
        type: Number
    },
    shiprocket_order_id: { 
        type: String 
    },
    shiprocket_shipment_id: { 
        type: String 
    },
    shiprocket_awb: { 
        type: String 
    },
    tracking_url: { 
        type: String 
    },
    orderStatus: {
        type: String,
        default: "Pending" 
    },
    shiprocket_status: { 
        type: String,  
        default: "Pending" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
