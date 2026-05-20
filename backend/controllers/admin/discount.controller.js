import Discount from "../../models/discount.model.js";

// CREATE
export const createDiscount = async (req, res) => {
    try {
        const discount = new Discount(req.body);
        await discount.save();
        res.status(201).json({ success: true, discount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET ALL
export const getAllDiscounts = async (req, res) => {
    try {
        const list = await Discount.find().sort({ createdAt: -1 });
        res.json({ success: true, discounts: list });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET ONE
export const getDiscount = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);
        res.json({ success: true, discount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE
export const updateDiscount = async (req, res) => {
    try {
        const updated = await Discount.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ success: true, discount: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE
export const deleteDiscount = async (req, res) => {
    try {
        await Discount.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Discount code deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
