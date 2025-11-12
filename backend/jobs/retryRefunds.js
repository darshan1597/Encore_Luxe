import Refund from "../models/refund.model.js";
import { refundPayment } from "../utils/refundPayment.js";

export const startRefundRetryJob = () => {
    const retryFailedRefunds = async () => {
        const failedRefunds = await Refund.find({ status: "failed" });

        for (const r of failedRefunds) {
            try {
                await refundPayment(r.paymentId, r.amount, r.orderId);
                r.status = "completed";
                await r.save();
            } catch (err) {
                r.retryCount += 1;
                await r.save();
                console.error(`Retry refund failed for ${r._id}`);
            }
        }
    };

    // Run every 5 minutes
    setInterval(retryFailedRefunds, 5 * 60 * 1000);
};