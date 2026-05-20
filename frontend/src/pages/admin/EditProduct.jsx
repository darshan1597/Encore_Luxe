import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import Toast from "../components/Toast";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        hierarchy: "",
        subcategory: "",
        shortDescription: "",
        mrp: "",
        discountedPrice: "",
        designer: "",
        productDescription: "",
        material: "",
        color: "",
        condition: "",
        stock: "",
        sellerName: "",
        sellerNumber: "",
        sellerEmail: "",
        featured: "",
        latest: "",
        status: "",
        onSiteDisplay: "",
        displaySold: ""
    });
    
    const [agreementFiles, setAgreementFiles] = useState([])
    const [categories, setCategories] = useState([]);
    const [hierarchies, setHierarchies] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/getCategories/get-categories`);
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (catName) => {
        setFormData({ ...formData, category: catName, hierarchy: "", subcategory: "" });
        const cat = categories.find((c) => c.name === catName);
        if (cat) {
            const uniqueHierarchies = [...new Set(cat.branches.map((b) => b.hierarchy[0]))];
            setHierarchies(uniqueHierarchies);
            setSubcategories([]);
        } else {
            setHierarchies([]);
            setSubcategories([]);
        }
    };

    const handleHierarchyChange = (hierarchy) => {
        setFormData({ ...formData, hierarchy, subcategory: "" });

        const cat = categories.find((c) => c.name === formData.category);
        if (cat) {
            const branch = cat.branches.find((b) => b.hierarchy[0] === hierarchy);
            setSubcategories(branch ? branch.subcategories : []);
        } else {
            setSubcategories([]);
        }
    };

    // Fetch product
    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/products/get-single-product/${id}`);
            const p = res.data.product;

            setFormData({
                name: p?.name,
                category: p?.category,
                hierarchy: p?.hierarchy,
                subcategory: p?.subcategory,
                shortDescription: p?.shortDescription,
                mrp: p?.mrp,
                discountedPrice: p?.discountedPrice,
                designer: p?.designer,
                productDescription: p?.productDescription,
                material: p?.material,
                color: p?.color,
                condition: p?.condition,
                stock: p?.stock,
                featured: p?.featured,
                sellerName: p?.sellerName,
                sellerEmail: p?.sellerEmail,
                sellerNumber: p?.sellerNumber,
                latest: p?.latest,
                status: p?.status,
                onSiteDisplay: p?.onSiteDisplay,
                displaySold: p?.displaySold,
                agreementFile: p?.agreementFile || []
            });

            setExistingImages(p.images || []);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const fetchDesigners = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/getDesigners/get-designers`);
            setDesigners(res.data);
        } catch (err) {
            console.error("Error fetching designers:", err);
        }
    };

    useEffect(() => {
        fetchProduct()
        fetchDesigners()
    }, [id]);

    useEffect(() => {
        if (categories.length > 0 && formData.category) {
            const selectedCategory = categories.find((c) => c.name === formData.category);
            if (selectedCategory) {
                const uniqueHierarchies = [...new Set(selectedCategory.branches.map((b) => b.hierarchy[0]))];
                setHierarchies(uniqueHierarchies);

                const branch = selectedCategory.branches.find((b) => b.hierarchy[0] === formData.hierarchy);
                setSubcategories(branch ? branch.subcategories : []);
            }
        }
    }, [categories, formData.category, formData.hierarchy]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAgreementSelect = async (e) => {
        const files = Array.from(e.target.files);
        const validPdfs = files.filter(f => f.type === "application/pdf");

        if (validPdfs.length === 0) {
            setToast({ message: "Please upload only PDF files", type: "error" })
            return;
        }

        const existingCount = formData.agreementFile ? formData.agreementFile.length : 0;
        if (existingCount + validPdfs.length > 3) {
            setToast({ message: `You can upload up to 3 agreements total. Seller already has ${existingCount} file(s).`, type: "error" })
            return;
        }

        setAgreementFiles(prev => [...prev, ...validPdfs]);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSetPrimary = async (img) => {
        try {
            await axios.put(`${serverUrl}/api/products/set-primary-image/${id}`, {
            imageName: img.name
            });

            setExistingImages((prev) =>
                prev.map((i) => ({
                    ...i,
                    isPrimary: i.name === img.name,
                }))
            );
        } catch (error) {
            console.error("Error setting primary image:", error);
            setToast({ message: "Failed to set primary image", type: "error" })
        }
    }

    const handleDeleteImage = async (img) => {
        setLoading(true)
        if (!window.confirm("Delete this image?")){
            setLoading(false)
            return;
        } 
        try {
            await axios.delete(`${serverUrl}/api/products/delete-image/${id}`, {
                data: { imageName: img.name },
            });
            setExistingImages((prev) =>
                prev.filter((i) => i.name !== img.name)
            );
            setLoading(false)
        } catch (error) {
            console.error("Error deleting image:", error);
            setToast({ message: "Failed to delete image", type: "error" })
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const productData = new FormData();
            Object.keys(formData).forEach((key) => {
                let value = formData[key];

                if (key === "discountedPrice") {
                    if (value === "" || value === null || value === undefined) {
                        value = 0;
                    } else {
                        value = Number(value);
                    }
                }

                if (typeof value === "boolean") {
                    value = value.toString();
                }

                productData.append(key, value)
            });

            newImages.forEach((img) => productData.append("images", img));

            await axios.put(`${serverUrl}/api/products/update-product/${id}`, productData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (agreementFiles.length > 0) {
                const agreementData = new FormData();
                agreementFiles.forEach((file) => agreementData.append("agreements", file));

                await axios.post(`${serverUrl}/api/products/upload-agreements/${id}`, agreementData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            alert("Product updated successfully!");
            navigate("/admin/view-products");
            setAgreementFiles([]);
            setLoading(false)
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product");
            setLoading(false)
        }
    };

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`}>
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="p-6 max-w-5xl mx-auto mt-48 shadow-2xl mb-30">
                <div className="flex items-center gap-4 mb-8">
                    <MdKeyboardBackspace className="text-2xl cursor-pointer" onClick={() => navigate("/admin/view-products")} />
                    <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-5">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter product name" required />
                    </div>

                    {/* Category */}
                    <div className="">
                        <select value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)} className="border p-2 rounded-md w-full" >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Hierarchy */}
                        <select value={formData.hierarchy} onChange={(e) => handleHierarchyChange(e.target.value)} className="border p-2 rounded-md" >
                            <option value="">Select Hierarchy</option>
                            {hierarchies.map((h, i) => (
                                <option key={i} value={h}>
                                    {h}
                                </option>
                            ))}
                        </select>

                        {/* Subcategory */}
                        <select value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value }) } className="border p-2 rounded-md" >
                            <option value="">Select Subcategory</option>
                            {subcategories.map((sub, i) => (
                                <option key={i} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                        <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter Short Description" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter stock" required />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designer</label>
                            <select value={formData.designer} onChange={(e) => setFormData({ ...formData, designer: e.target.value }) } className="w-full border border-gray-300 rounded-lg px-4 py-2" >
                                <option value="">Select Designer</option>
                                {designers.map((designer) => (
                                    <option key={designer._id} value={designer.name}>
                                        {designer.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            {/* changesite */}
                            <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value }) } className="border p-2 rounded-md w-full" >
                                <option value="">Select Condition</option>
                                {["Excellent", "Very Good", "Good", "New"].map((cond) => (
                                    <option value={cond}>
                                        {cond}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                            <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                            <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Enter product description" ></textarea>
                    </div>

                    {/* Existing Images with Edit Options */}
                    <div>
                        <h3 className="font-semibold mb-2">Existing Images</h3>
                        <div className="flex flex-wrap gap-4">
                            {existingImages.length > 0 ? (
                                existingImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={`${serverUrl}/productImages/${img.name}`} alt="existing" className={`w-24 h-24 object-cover rounded-lg border ${ img.isPrimary ? "border-4 border-blue-600" : "" }`} />

                                        {/* Primary Badge */}
                                        {img.isPrimary && (
                                            <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                Primary
                                            </span>
                                        )}

                                        {/* Hover Controls */}
                                        <div className="absolute bg-opacity-40 flex flex-col justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                            {/* Set as Primary Button */}
                                            {!img.isPrimary && (
                                                <button onClick={() =>handleSetPrimary(img)} className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 cursor-pointer" >
                                                    Set Primary
                                                </button>
                                            )}

                                            {/* Delete Button */}
                                            <button onClick={() => handleDeleteImage(img)} className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 cursor-pointer" >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                                ) : (
                                <p className="text-gray-500">No images found</p>
                            )}
                        </div>
                    </div>

                    {/* Upload New Images */}
                    <div>
                        <h3 className="font-semibold mb-2">Upload New Images</h3>
                        <input type="file" multiple onChange={handleImageUpload} className="mb-4 cursor-pointer bg-black text-white p-2 rounded-2xl pl-20" accept="image/*" />
                        {previewImages.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {previewImages.map((src, idx) => (
                                    <img key={idx} src={src} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked }) } className="w-4 h-4 accent-black" />
                            <span className="font-medium text-gray-700">Featured Product</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.latest} onChange={(e) => setFormData({ ...formData, latest: e.target.checked }) } className="w-4 h-4 accent-black" />
                            <span className="font-medium text-gray-700">Latest Product</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.onSiteDisplay} onChange={(e) => setFormData({ ...formData, onSiteDisplay: e.target.checked }) } className="w-4 h-4 accent-black" />
                            <span className="font-medium text-gray-700">On Site Display</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.displaySold} onChange={(e) => setFormData({ ...formData, displaySold: e.target.checked }) } className="w-4 h-4 accent-black" />
                            <span className="font-medium text-gray-700">Display Sold</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" >
                            <option value="recently added">Recently Added</option>
                            <option value="approved">Approved</option>
                            <option value="shipped to warehouse">Shipped To Warehouse</option>
                            <option value="onsite display">Onsite Display</option>
                            <option value="shipped to buyer">Shipped To Buyer</option>
                            <option value="paid to seller">Paid To Seller</option>
                        </select>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold">Seller Details</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
                        <input type="text" name="sellerName" value={formData.sellerName} className="w-full border border-gray-300 rounded-lg px-4 py-2 read-only cursor-not-allowed" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input type="text" name="phone" value={formData.sellerNumber} className="w-full border border-gray-300 rounded-lg px-4 py-2 read-only cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" value={formData.sellerEmail} className="w-full border border-gray-300 rounded-lg px-4 py-2 read-only cursor-not-allowed" />
                        </div>
                    </div>

                    {Array.isArray(formData.agreementFile) && formData.agreementFile.length > 0 && (
                        <div className="mt-3">
                            <p className="text-gray-700 text-sm mb-1">Existing Agreements:</p>
                            <ul className="space-y-1">
                                {formData.agreementFile.map((file, idx) => (
                                    <li key={idx}>
                                    <a href={`${serverUrl}${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm hover:text-blue-800" >
                                        View PDF {idx + 1}
                                    </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Upload input always visible if admin chooses to add or if agreement flag is true */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Agreement (PDF) - you can upload up to {3 - (formData.agreementFile?.length || 0)} more (Recommended 10MB per PDF)
                        </label>
                        <input type="file" accept="application/pdf" multiple onChange={handleAgreementSelect} className="w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer" />

                        {/* Show selected (new) PDF files */}
                        {agreementFiles.length > 0 && (
                            <ul className="mt-2 text-sm text-gray-700 space-y-1">
                            {agreementFiles.map((file, i) => (
                                <li key={i} className="flex items-center justify-between">
                                <span>{file.name}</span>
                                <button type="button" onClick={() => setAgreementFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 text-xs hover:underline cursor-pointer">
                                    Remove
                                </button>
                                </li>
                            ))}
                            </ul>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer" >
                        {loading? <ClipLoader size={20} color='currentColor'/>: "Update Product"}
                    </button>
                </form>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default EditProduct;
