import Razorpay from "razorpay";
import Refund from "../models/refund.model.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const refundPayment = async (orderId, paymentId, amount) => {
    try {
        await razorpay.payments.refund(paymentId, { amount: Math.round(amount * 100) });

        await Refund.create({ orderId, paymentId, amount, status: "completed" });
    } catch (err) {
        console.error("Refund failed:", err);
        await Refund.create({ orderId, paymentId, amount, status: "failed", retryCount: 0 });
    }
};
