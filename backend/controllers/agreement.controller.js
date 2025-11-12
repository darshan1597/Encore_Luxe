import Agreement from "../models/agreement.model.js";
import Product from "../models/product.model.js";


export const createAgreement = async (req, res) => {
    try {
        const { productId, sellerName, sellerEmail, sellerNumber, agreementAccepted } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const files = req.files?.map(file => `/agreements/${file.filename}`) || [];

        const agreement = new Agreement({
            product: productId,
            sellerName,
            sellerEmail,
            sellerNumber,
            agreementFiles: files,
            agreementAccepted,
        });

        await agreement.save();

        res.status(201).json({ message: "Agreement saved successfully", agreement });
    } catch (error) {
        console.error("Error creating agreement:", error);
        res.status(500).json({ message: `Error creating agreement: ${error.message}` });
    }
};
