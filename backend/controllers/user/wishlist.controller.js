import Wishlist from "../../models/wishlist.model.js";

export const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        const itemIndex = wishlist.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            wishlist.items.splice(itemIndex, 1);
            await wishlist.save();
            return res.json({ message: "Removed from wishlist" });
        } else {
            wishlist.items.push({ productId });
            await wishlist.save();
            return res.json({ message: "Added to wishlist" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");

        if (!wishlist) return res.json({ items: [] });

        res.json(wishlist.items.map((item) => item.productId));
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
