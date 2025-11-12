import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import countryData from "country-list-with-dial-code-and-flag";
import Navbar from "./components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners"
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";

function SellWithUs() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        agree: false,
    });

    const [products, setProducts] = useState([
        {
            id: Date.now(),
            category: "",
            description: "",
            condition: "",
            designer: "",
            uploadedFiles: [],
            size: "",
            mrp: "",
        },
    ]);

    const [loaded, setLoaded] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: "" });
    const [loading, setLoading] = useState(false)
    const [successOverlay, setSuccessOverlay] = useState(false);
    const navigate = useNavigate()

    // Show popup
    const showPopup = (message) => {
        setPopup({ show: true, message });
    };

    const closePopup = () => {
        setPopup({ show: false, message: "" });
        setLoading(false)
    };

    // Handle main form data
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    // Handle product-level data
    const handleProductChange = (id, field, value) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const handleFileUpload = (e, productId) => {
        const files = Array.from(e.target.files);

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

        const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));
        const validImages = files.filter((file) => allowedTypes.includes(file.type));

        let messages = [];

        if (invalidFiles.length > 0) {
            invalidFiles.forEach((file) => {
                messages.push(`"${file.name}" has an unsupported format!`);
            });
        }

        setProducts((prevProducts) => {
            const allFiles = prevProducts.flatMap((p) =>
                p.uploadedFiles.map((f) => ({
                    name: f.name,
                    size: f.size,
                    productId: p.id,
                }))
            );

            const updated = prevProducts.map((p) => {
                if (p.id !== productId) return p;
                
                const newFiles = [];
                for (const file of validImages) {
                    if (file.size > 5 * 1024 * 1024) {
                        messages.push(`"${file.name}" exceeds 5 MB limit!`);
                        continue;
                    }

                    const duplicateInSameProduct = p.uploadedFiles.some(
                        (f) => f.name === file.name && f.size === file.size
                    );

                    const duplicateInOtherProduct = allFiles.some(
                        (f) =>
                        f.name === file.name &&
                        f.size === file.size &&
                        f.productId !== productId
                    );

                    if (duplicateInSameProduct) {
                        messages.push(`"${file.name}" already uploaded in this product!`);
                    }
                    else if (duplicateInOtherProduct) {
                        messages.push(`"${file.name}" already uploaded in another product!`);
                    } 
                    else {
                        newFiles.push(file);
                    }
                }

                const totalFiles = p.uploadedFiles.length + newFiles.length;

                if (totalFiles > 10) {
                    messages.push(`You can upload a maximum of 10 images per product!`);
                    return p;
                }

                return {
                    ...p,
                    uploadedFiles: [...p.uploadedFiles, ...newFiles],
                };
            });

            if (messages.length > 0) {
                setTimeout(() => showPopup(messages.join("\n")), 0);
            }

            return updated;
        });

        e.target.value = null;
    };

    const handleDeleteFile = (productId, fileName) => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === productId
                ? {
                    ...p,
                    uploadedFiles: p.uploadedFiles.filter((f) => f.name !== fileName),
                    }
                : p
            )
        );
    };

    const handleDeleteAllFiles = (productId) => {
        setProducts((prev) =>
                prev.map((p) =>
                p.id === productId ? { ...p, uploadedFiles: [] } : p
            )
        );
        showPopup("All images deleted for this product!");
    };

    const addMoreProduct = () => {
        setProducts((prev) => [
            ...prev,
            {
                id: Date.now(),
                category: "",
                description: "",
                condition: "",
                designer: "",
                size: "",
                uploadedFiles: [],
                mrp: "",
            },
        ]);
    };

    const removeProduct = (id) => {
        if (products.length === 1) {
            showPopup("At least one product is required!");
            return;
        }
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showPopup("Product removed");
    };

    const validateSellerInfo = () => {
        const requiredFields = [
            "firstName",
            "email",
            "phone"
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                showPopup(`Please fill "${field}"`);
                return false;
            }

            if(!formData.agree){
                showPopup(`Please Accept our Terms and Conditions`);
                return false;
            }
        }

        return true;
    };

    const validateProducts = () => {
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const productFields = ["category", "description", "condition", "mrp"];

            for (const field of productFields) {
                if (!p[field]) {
                    showPopup(`Please fill "${field}" in Product ${i + 1}`);
                    return false;
                }
            }

            if (!p.uploadedFiles || p.uploadedFiles.length < 5) {
                showPopup(`Please upload atleast 5 images for Product ${i + 1}`);
                return false;
            }

            if (p.uploadedFiles.length > 10) {
                showPopup(`Maximum 10 images allowed for Product ${i + 1}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        if (!validateSellerInfo()) return;

        if (!validateProducts()) return;

        try {
            const sellerResult = await axios.post(`${serverUrl}/api/seller/seller-info`, formData , {withCredentials: true})
            const sellerId = sellerResult.data._id

            for (const p of products) {
                const productData = {
                    sellerId,
                    category: p.category,
                    description: p.description,
                    condition: p.condition,
                    designer: p.designer,
                    size: p.size,
                    mrp: p.mrp,
                }
                const productResult = await axios.post(`${serverUrl}/api/seller/seller-product`, productData, { withCredentials: true });
                const productId = productResult.data._id

                if (p.uploadedFiles.length > 0) {
                    const formDataImages = new FormData();
                    formDataImages.append("sellerProductId", productId);

                    p.uploadedFiles.forEach((file) => {
                        formDataImages.append("images", file);
                    });

                    await axios.post(`${serverUrl}/api/seller/seller-product-images`, formDataImages, {
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true
                    })
                }
            }
            setSuccessOverlay(true);
            setLoading(false);
        }
        catch (error) {
            console.log(error)
            setLoading(false)
        }
    };

    const countries = countryData.getAll();

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>

            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>
        
            <div className="flex flex-col items-center justify-center bg-white mb-20">
                <section className="py-6 px-4 flex flex-col items-center text-center mt-52">
                    <h2 className="text-3xl font-semibold mb-4">SELL WITH US</h2>
                    <p className="text-gray-600 mb-8 max-w-4xl">
                        Give your luxury pieces a new story. <br />
                        At Encore Luxe, we provide a seamless and trusted way to resell your pre-loved designer pieces. Our platform connects your items with a discerning audience that values authenticity and craftsmanship as much as you do. <br />
                        1. Submit Your Item: Complete the form below and upload clear, well-lit photos of your product (preferably against a neutral background) along with details of its condition. <br />
                        2. We Curate & Promote - Once approved by our team, your item will be professionally listed, marketed, and presented to potential buyers across our platform.
                    </p>
                </section>

                {/* Popup */}
                {popup.show && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center w-[300px] relative animate-fadeIn">
                            <button onClick={closePopup} className="absolute top-1 right-2 text-gray-500 hover:text-gray-800 text-lg" >
                                <IoMdClose className="text-2xl cursor-pointer" />
                            </button>
                            <p className="text-gray-800 font-medium text-sm mt-2 whitespace-pre-line text-left">{popup.message}</p>
                        </div>
                    </div>
                )}

                <form className="w-full max-w-2xl bg-white border border-gray-300 rounded-md p-8 shadow-sm" >
                    {/* Personal Info */}
                    <label className="text-l font-bold mb-2">
                        Personal Info
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="firstName" placeholder="FIRST NAME*" value={formData.firstName} onChange={handleChange} className="border border-gray-300 rounded-sm p-2 text-sm focus:bg-gray-200" required />
                        <input type="text" name="lastName" placeholder="LAST NAME" value={formData.lastName} onChange={handleChange} className="border border-gray-300 rounded-sm p-2 text-sm focus:bg-gray-200" required />
                    </div>

                    <input type="email" name="email" placeholder="EMAIL*" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-sm p-2 text-sm w-full mb-4 focus:bg-gray-200" required />

                    <div className="flex items-center gap-2 w-full mb-4">
                        <select name="country" value={formData.country || "India"} onChange={handleChange} className="w-38 border border-gray-300 rounded-sm p-2 text-sm focus:bg-gray-200 cursor-pointer" >
                            {countries.map((country, index) => (
                                <option key={index} value={country.name}>
                                    {country.name} {country.dial_code}
                                </option>
                            ))}
                        </select>
                        <input type="text" name="phone" placeholder="PHONE*" value={formData.phone} onChange={handleChange} className="border border-gray-300 rounded-sm p-2 w-full text-sm focus:bg-gray-200" required />
                    </div>

                    {/* Product Blocks */}
                    {products.map((p, index) => (
                    <div key={p.id} className="border border-gray-200 rounded-md p-4 mb-6">
                        <h3 className="font-medium mb-3 text-gray-800 text-xl">
                            {index + 1}
                        </h3>

                        {/* Category */}
                        <div className="mb-6">
                            <p className="text-l font-bold mb-2">What would you like to sell - Category <span className="text-red-500">*</span></p>
                            <div className="flex flex-wrap gap-4 text-sm ml-7">
                                {["Womens", "Mens", "Kids", "Hand Bags", "Shoes", "Accessories", "Jewellery", "Others"].map((cat) => (
                                    <label key={cat} className="flex items-center gap-1">
                                        <input type="radio" name={`category-${p.id}`} className="accent-black" value={cat} checked={p.category === cat} onChange={(e) => handleProductChange(p.id, "category", e.target.value) } required />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <label className="text-l font-bold mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea name={`description-${p.id}`} placeholder="DETAILED DESCRIPTION*" value={p.description} onChange={(e) => handleProductChange(p.id, "description", e.target.value) } rows="3" className="border border-gray-300 rounded-sm p-2 w-full text-sm mb-3 focus:bg-gray-200" required ></textarea>

                        {/* Condition */}
                        <div className="mb-3">
                            <p className="text-l font-bold mb-2">Condition <span className="text-red-500">*</span></p>
                            <div className="flex flex-wrap gap-4 text-sm ml-7">
                                {["Excellent", "Very Good", "Good"].map((c) => (
                                    <label key={c} className="flex items-center gap-1">
                                        <input type="radio" name={`condition-${p.id}`} className="accent-black" value={c} checked={p.condition === c} onChange={(e) => handleProductChange(p.id, "condition", e.target.value) } required />
                                        {c}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Know More about condition */}
                        <div className="ml-7 mt-2">
                        <button
                            type="button"
                            onClick={() =>
                                showPopup(
                                    "Excellent - Items that are new, like new, or near flawless. Showing no visible signs of wear.\n\n" +
                                    "Very Good - Items that are gently used with minimal signs of wear. They may have very light marks or minor imperfections that are barely noticeable.\n\n" +
                                    "Good - Items that show visible signs of use or wear, such as scuffing, slight discoloration, or small marks. Still in wearable and presentable condition."
                                )
                            }
                            className="text-sm mb-3 text-blue-600 underline hover:text-blue-800 cursor-pointer"
                        >
                            Know what these mean?
                        </button>
                        </div>

                        {/* Designer */}
                        <label className="text-l font-bold mb-2">
                            Product designer (if applicable)
                        </label>
                        <input type="text" name={`designer-${p.id}`} placeholder="Designer" value={p.designer} onChange={(e) => handleProductChange(p.id, "designer", e.target.value) } className="border border-gray-300 rounded-sm p-2 text-sm w-full mb-6 focus:bg-gray-200" required />

                        {/* Upload */}
                        <div className="mb-6">
                            <label className="block text-l font-bold mb-2">
                                Upload Product Images (Min 5, Max 10) <span className="text-red-500">*</span>
                            </label>

                            {/* Recommended info */}
                            <p className="text-xs text-gray-500 mb-3">
                                (Recommended: under 5MB • JPG, WebP, JPEG, PNG)
                            </p>

                            <label htmlFor={`fileUpload-${p.id}`} className="cursor-pointer bg-black text-white text-sm px-4 py-2 rounded-sm hover:bg-gray-700 transition" >
                                Upload Photos
                            </label>
                            <input id={`fileUpload-${p.id}`} type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, p.id)} className="hidden" />

                            <ul className="text-sm mt-2">
                                {p.uploadedFiles.map((file) => (
                                <li key={file.name} className="flex items-center gap-1" >
                                    <span className="truncate text-gray-700">{file.name}</span>
                                    <button type="button" onClick={() => handleDeleteFile(p.id, file.name)} className="text-red-600 text-xs hover:underline cursor-pointer" >
                                        <IoMdClose className="text-xl" />
                                    </button>
                                </li>
                                ))}
                                {p.uploadedFiles.length > 1 && (
                                    <div className="pt-2 ml-1">
                                        <button type="button" onClick={() => handleDeleteAllFiles(p.id)} className="text-red-600 text-xs hover:underline font-medium cursor-pointer">
                                            Delete All
                                        </button>
                                    </div>
                                )}
                            </ul>
                        </div>

                        {/* size */}
                        <div className="mb-3">
                            <p className="text-l font-bold mb-2">Select Size(if applicable/ Skip if not sure)</p>
                            <div className="flex flex-wrap gap-4 text-sm ml-7">
                                {["S", "M", "L", "XL", "XXL"].map((size) => (
                                    <label key={size} className="flex items-center gap-1">
                                        <input type="radio" name={`size-${p.id}`} className="accent-black" value={size} checked={p.size === size} onChange={(e) => handleProductChange(p.id, "size", e.target.value) } />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <p className="text-l font-bold mb-2">MRP</p>
                            <input type="number" placeholder="MRP" name={`mrp-${p.id}`} value={p.mrp} onChange={(e) => handleProductChange(p.id, "mrp", e.target.value)} className="border border-gray-300 rounded-sm p-2 text-sm focus:bg-gray-200 w-full" required />
                        </div>

                        {/* Remove Product Button */}
                        <button type="button" onClick={() => removeProduct(p.id)} className="text-red-600 text-xs hover:underline cursor-pointer" >
                            Remove Product
                        </button>
                    </div>
                    ))}

                    {/* Add More Button */}
                    <button type="button" onClick={addMoreProduct} className="w-full border border-gray-400 text-gray-700 py-2 mb-6 rounded-sm hover:bg-gray-100 transition text-sm font-medium cursor-pointer" >
                        + Add More Products
                    </button>

                    {/* Agree + Submit */}
                    <label className="flex items-center text-sm mb-4">
                        <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required className="mr-2 accent-black" />
                        <p>I agree to the website <span className="underline cursor-pointer" onClick={() => navigate("/terms-and-condition")}> terms and conditions</span> <span className="text-red-500"> *</span></p>
                    </label>

                    <div className="flex items-center justify-center mt-8 w-full">
                        <button type="submit" className="bg-black text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-gray-700 transition cursor-pointer" onClick={handleSubmit}  disabled={loading} >
                            {loading? <ClipLoader size={20} color='currentColor'/>: "Submit"}
                        </button>
                    </div>
                </form>
            </div>
            {/* Footer */}
            <Footer />
            {successOverlay && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 ">
                    <div className="bg-white rounded-lg shadow-xl p-8 text-center w-[90%] max-w-[600px] relative">
                    <h2 className="text-3xl font-bold mb-3 text-gray-800">Thank You!</h2>
                    <p className="text-gray-600 mb-6">
                        We've received your submission.<br />Our expert will get back to you for next steps shortly.
                    </p>
                    <button onClick={() => navigate("/")} className="bg-black text-white px-6 py-2 rounded-sm text-lg hover:bg-gray-800 transition cursor-pointer" >
                        Home
                    </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellWithUs
