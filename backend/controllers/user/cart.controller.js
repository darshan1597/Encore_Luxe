import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;   

        const product = await Product.findById(productId);
        if (!product){
            return res.status(404).json({ message: "Product not found" });
        } 

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 0;
        } else {
            cart.items.push({
                productId,
                name: product.name,
                sku: product.sku,
                image: product.images?.[0]?.name || "",
                discountedPrice: product.discountedPrice,
                mrp: product.mrp,
                quantity,
            });
        }

        await cart.save();
        console.log("Cart saved:", cart);
        return res.status(200).json({ cart });
    } catch (error) {
        console.log("Error adding to cart:", error);
        return res.status(500).json({ message: `Error adding to Cart: ${error}` });
    }
};

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate("items.productId");

        return res.status(200).json({cart});
    } catch (error) {
        return res.status(500).json({ message: `Failed to fetch cart: ${error}` });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );

        await cart.save();
        return res.status(200).json({ message: "Item removed", cart });
    } catch (err) {
        return res.status(500).json({ message: `Failed to remove cart items: ${error}` });
    }
};
