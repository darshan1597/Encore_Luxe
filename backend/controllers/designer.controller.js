import Designer from "../models/designer.model.js";

export const getDesigners = async (req, res) => {
    try {
        const designers = await Designer.find();

        return res.status(201).json(designers);
    } catch (error) {
        return res.status(500).json({message: `Error fetching Designers ${error}`});
    }
};