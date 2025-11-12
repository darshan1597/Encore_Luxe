import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "GuestOrder" 
    },
    paymentId: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "failed", "completed"], 
        default: "pending" 
    },
    retryCount: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Refund = mongoose.model("Refund", refundSchema)

export default Refund