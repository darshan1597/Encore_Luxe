import Seller from "../../models/seller.model.js"
import SellerProduct from "../../models/sellerProduct.model.js";
import SellerProductImage from "../../models/sellerProductImage.model.js";

export const seller = async (req, res) => {
    try {
        const {firstName, lastName, email, phone} = req.body

        const seller = await Seller.create({
            firstName,
            lastName,
            email,
            phone
        })

        return res.status(201).json(seller);
    } catch (error) {
        return res.status(500).json({message: `Error creating Seller ${error}`})
    }
}

export const sellerProducts = async (req, res) => {
    try {
        const {sellerId, category, description, condition, designer, size, mrp} = req.body

        const sellerProduct = await SellerProduct.create({
            sellerId,
            category,
            description,
            condition,
            designer,
            size,
            mrp
        })

        return res.status(201).json(sellerProduct);
    } catch (error) {
        return res.status(500).json({message: `Error creating Products ${error}`})
    }
}

export const uploadSellerProductImages = async (req, res) => {
    try {
        const { sellerProductId } = req.body;

        if (!sellerProductId) {
            return res.status(400).json({ message: "Product ID is not matching" });
        }

        if (!req.files || req.files.length < 5) {
            return res.status(400).json({ message: "At least 5 images are required" });
        }

        const imageDocs = req.files.map((file, index) => ({
            sellerProductId,
            image: file.filename,
            isPrimary: index === 0,
        }));

        const savedImages = await SellerProductImage.insertMany(imageDocs);

        return res.status(201).json({message: `Images uploaded successfully: ${savedImages}`})
    } catch (error) {
        return res.status(500).json({message: `Image upload error: ${error}`})
    }
}

export const getAllSellersForm = async (req, res) => {
    try {
        const sellers = await Seller.find();

        const fullData = await Promise.all(
            sellers.map(async (seller) => {
                const products = await SellerProduct.find({ sellerId: seller._id });

                const productImages = await Promise.all(
                    products.map(async (product) => {
                        const images = await SellerProductImage.find({ sellerProductId: product._id })
                        return { ...product._doc, images };
                    })
                )
                return { ...seller._doc, products: productImages }
            })
        )
        res.status(200).json(fullData);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching seller data ${error}` });
    }
}

export const getSingleSellerForm = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findById(id);

        if (!seller) return res.status(404).json({ message: "Seller not found" });

        console.log(id)

        return res.status(200).json({ seller });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching seller data ${error}` });
    }
}
