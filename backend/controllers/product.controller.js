import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({message: `Error fetching Products ${error}`})
    }
};

export const getOnSiteProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: "onsite display" });

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({message: `Error fetching On site Products ${error}`})
    }
}