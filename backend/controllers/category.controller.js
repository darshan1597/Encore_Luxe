import Category from "../models/category.model.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        
        return res.status(201).json(categories);
    } catch (error) {
        return res.status(500).json({message: `Error fetching Categories ${error}`})
    }
}
