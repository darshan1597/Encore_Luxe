import Discount from "../models/discount.model.js";

export const applyDiscount = async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        if (!code || !subtotal) {
            return res.status(400).json({ message: "Please Enter Discount Code." });
        }

        const discount = await Discount.findOne({ code: code.trim() });

        if (!discount) return res.status(404).json({ message: "Invalid coupon code" });

        if (!discount.active) return res.status(400).json({ message: "Coupon inactive" });

        if (discount.expiresAt < new Date())
            return res.status(400).json({ message: "Coupon expired" });

        // Check expiry
        if (discount.expiresAt < new Date()) {
            return res.status(400).json({ message: "Discount code has expired" });
        }

        // Check min order amount
        if (subtotal < discount.minOrderAmount) {
            return res.status(400).json({
                message: `Minimum order amount should be ₹${discount.minOrderAmount}`
            });
        }

        let discountAmount = 0;

        // Apply discount
        if (discount.type === "percentage") {
            discountAmount = (subtotal * discount.value) / 100;
        } else {
            discountAmount = discount.value;
        }

        const newTotal = subtotal - discountAmount;

        res.json({
            success: true,
            discountAmount,
            newTotal,
            message: "Discount applied successfully!"
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
