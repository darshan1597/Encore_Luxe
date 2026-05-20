import Admin from "../../models/admin.model.js"
import Designer from "../../models/designer.model.js"
import Category from "../../models/category.model.js"
import Product from "../../models/product.model.js"
import fs from "fs";
import path from "path";
import GuestOrder from "../../models/guestOrder.model.js";
import SellerProduct from "../../models/sellerProduct.model.js";
import Seller from "../../models/seller.model.js";
import SellerProductImage from "../../models/sellerProductImage.model.js";
import crypto from "crypto";
import Order from "../../models/order.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const getCurrentAdmin = async (req, res) => {
    try {
        const adminId = req.adminId
        if(!adminId){
            return res.status(400).json({message: "Admin id not found"})
        }
        const admin = await Admin.findById(adminId)
        if(!admin){
            return res.status(400).json({message: "Admin not found"})
        }
        return res.status(200).json(admin)
    } catch (error) {
        return res.status(500).json({message: `Error while finding current Admin: ${error}`})
    }
}

// category
export const addCategory = async (req, res) => {
    try {
        const { name, branches } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        let category = await Category.findOne({ name });

        if (!category) {
            category = new Category({
                name,
                branches
            });
        }
        else {
            category.branches.push(...branches)
        }

        await category.save();

        return res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
        return res.status(500).json({message: `Error adding Category ${error}`})
    }
}

export const editCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

        return res.status(200).json({ message: "Branch updated", updatedCategory });
    } catch (error) {
        return res.status(500).json({message: `Error editing Branch ${error}`})
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Error deleting category ${error}` });
    }
}

// designer
export const addDesigner = async (req, res) => {
    try {
        const { name } = req.body;

        const existing = await Designer.findOne({ name });
        if (existing) return res.status(400).json({ message: "Designer already exists" });

        const designer = new Designer({ name });
        await designer.save();

        return res.status(201).json({ message: "Designer added successfully", designer });
    } catch (error) {
        return res.status(500).json({message: `Error adding Designer ${error}`})
    }
};

export const deleteDesigner = async (req, res) => {
    try {
        await Designer.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Designer deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// product
export const addProduct = async (req, res) => {
    try {
        const images = req.files.map((file, index) => ({
            name: file.filename,
            isPrimary: index === 0
        }));

        const uniqueCode = "ENCLX-" + crypto.randomBytes(3).toString("hex").toUpperCase();

        const newProduct = new Product({
            ...req.body,
            images,
            sku: uniqueCode
        });

        await newProduct.save();

        return res.status(201).json({ message: "Product added successfully", newProduct });
    } catch (error) {
        return res.status(500).json({message: `Error adding Product ${error}`})
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.images && product.images.length > 0) {
            product.images.forEach((img) => {
                const imagePath = path.join("public", "productImages", img.name);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath); // delete the image file
                }
            });
        }
        await Product.findByIdAndDelete(req.params.id);

        return res.status(201).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({message: `Error deleting Product ${error}`})
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("designer");
        if (!product) return res.status(404).json({ message: "Product not found" });

        return res.status(200).json({ product });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching product: ${error}` });
    }
};

export const setPrimaryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageName } = req.body;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.images = product.images.map(img => ({
            ...img.toObject(),
            isPrimary: img.name === imageName,
        }));

        await product.save();
        return res.status(200).json({ message: "Primary image updated successfully", product });
    } catch (error) {
        console.error("Error setting primary image:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageName } = req.body;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Remove from DB
        product.images = product.images.filter(img => img.name !== imageName);
        await product.save();

        // Remove from folder
        const imagePath = path.join(process.cwd(), "public", "productImages", imageName);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => ({
                name: file.filename,
                isPrimary: false,
            }));
            product.images.push(...newImages);
        }

        const fieldsToUpdate = [
            "name",
            "category",
            "hierarchy",
            "subcategory",
            "shortDescription",
            "mrp",
            "discountedPrice",
            "designer",
            "productDescription",
            "material",
            "color",
            "condition",
            "stock",
            "featured",
            "latest",
            "status",
            "onSiteDisplay",
            "displaySold"
        ];

        fieldsToUpdate.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        await product.save();

        return res.status(200).json({ message: "Product updated successfully", product, });

    } catch (error) {
        return res.status(500).json({ message: `Failed to update product: ${error}` });
    }
};

// guest
export const getSingleOrder = async (req, res) => {
    try {
        const order = await GuestOrder.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        return res.status(200).json({ order });
    } catch (err) {
        return res.status(500).json({ message: `Error fetching order: ${error}` });
    }
};

// user
export const getSingleUserOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        return res.status(200).json({ order });
    } catch (err) {
        return res.status(500).json({ message: `Error fetching order: ${error}` });
    }
};

export const updateUserOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const orderStatus = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, orderStatus, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order });
    } catch (error) {
        return res.status(500).json({ message: `Error updating order status: ${error}` });
    }
};

export const updateUserPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const paymentStatus = req.body;
        const order = await Order.findByIdAndUpdate(id, paymentStatus, { new: true });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order });
    } catch (error) {
        return res.status(500).json({ message: `Error updating payment status: ${error}` });
    }
};

export const updateGuestOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const orderStatus = req.body;
        const order = await GuestOrder.findByIdAndUpdate(id, orderStatus, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order });
    } catch (error) {
        return res.status(500).json({ message: `Error updating order status: ${error}` });
    }
};

export const updateGuestPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const paymentStatus = req.body;
        const order = await GuestOrder.findByIdAndUpdate(req.params.id, paymentStatus, { new: true });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order });
    } catch (error) {
        return res.status(500).json({ message: `Error updating payment status: ${error}` });
    }
};

// seller
export const approveSellerProduct = async (req, res) => {
    try {
        const { sellerProductId } = req.params;

        const sellerProduct = await SellerProduct.findById(sellerProductId);
            if (!sellerProduct) {
            return res.status(404).json({ message: "Seller product not found" });
        }

        const seller = await Seller.findById(sellerProduct.sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerImages = await SellerProductImage.find({ sellerProductId });
        const newImages = [];

        const sellerFolder = path.join("public", "sellerProductImages");
        const productFolder = path.join("public", "productImages");

        if (!fs.existsSync(productFolder)) {
            fs.mkdirSync(productFolder, { recursive: true });
        }

        for (const img of sellerImages) {
            const sourcePath = path.join(sellerFolder, img.image);
            const destPath = path.join(productFolder, img.image);

            fs.copyFileSync(sourcePath, destPath);

            newImages.push({
                name: img.image,
                isPrimary: img.isPrimary,
            });
        }

        const uniqueCode = "ENCLX-" + crypto.randomBytes(3).toString("hex").toUpperCase();

        const newProduct = new Product({
            name: "Product Name",
            shortDescription: sellerProduct.description.slice(0, 60),
            category: sellerProduct.category,
            hierarchy: sellerProduct.category,
            subcategory: sellerProduct.category,
            mrp: Number(sellerProduct.mrp),
            discountedPrice: "",
            designer: "",
            size: sellerProduct.size || "Free Size",
            productDescription: sellerProduct.description,
            material: "Not specified",
            color: "Not specified",
            condition: sellerProduct.condition,
            images: newImages,
            seller: sellerProduct.sellerId,
            sellerName: `${seller.firstName}'s Product`,
            sellerNumber: `${seller.phone}`,
            sellerEmail: `${seller.email}`,
            status: "recently added",
            sku: uniqueCode
        });

        await newProduct.save();

        sellerProduct.status = "approved";
        await sellerProduct.save();

        res.status(201).json({
            success: true,
            message: "Product approved and moved successfully!",
            product: newProduct,
        });
    } catch (error) {
        console.error("Error approving seller product:", error);
        res.status(500).json({
            success: false,
            message: "Server error while approving product",
            error: error.message,
        });
    }
};

export const uploadSellerAgreementPdf = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
        return res.status(404).json({ message: "Product not found" });
        }

        if (req.files && req.files.length > 0) {
            const pdfPaths = req.files.map(
                (file) => `/sellerAgreements/${file.filename}`
            );

            product.agreementFile.push(...pdfPaths);
            product.agreementSigned = true;
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Agreement uploaded successfully",
            product,
        });
    } catch (error) {
        console.error("Error uploading agreement:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-password");

        return res.status(200).json({ admins });
    } catch (error) {
        console.log("Get Admins Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        if (req.adminId === adminId) {
            return res.status(400).json({ message: "You cannot delete your own admin account" });
        }

        const adminData = await Admin.findById(adminId);
        if (!adminData) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (adminData.role === "superAdmin") {
            return res.status(403).json({ message: "You cannot delete the super admin" });
        }

        await Admin.findByIdAndDelete(adminId);

        return res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.log("Delete Admin Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.params.id;

        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ admin });
    } catch (error) {
        console.log("Profile Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log("Password Change Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};