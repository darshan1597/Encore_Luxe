import Product from "../models/product.model.js";

export const reserveProductStock = async (items) => {
    for (const item of items) {
        const productId = item.productId || item._id;
        const quantity = item.quantity || 1;

        if (quantity > 1) {
            throw new Error(`Only 1 quantity is available for "${item.name}".`);
        }

        const updated = await Product.findOneAndUpdate(
            { _id: productId, stock: { $gte: quantity  } },
            { $inc: { stock: -quantity } },
            { new: true }
        );

        if (!updated) {
            throw new Error(`Product "${item.name}" is out of stock`);
        }

        if (updated.stock === 0) {
            await Product.findByIdAndUpdate(productId, { displaySold: true });
        }
    }
};
