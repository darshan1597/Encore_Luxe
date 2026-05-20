import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { ClipLoader } from "react-spinners";
import Toast from "../components/Toast";

function AddProduct() {
    const [categories, setCategories] = useState([]);
    const [designers, setDesigners] = useState([]);
    const [hierarchies, setHierarchies] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        shortDescription: "",
        category: "",
        hierarchy: "",
        subcategory: "",
        mrp: "",
        discountedPrice: "",
        designer: "",
        size: "",
        productDescription: "",
        material: "",
        color: "",
        condition: "",
        sellerName: "",
        sellerNumber: "",
        sellerEmail: "",
        featured: false,
        latest: false,
    });

    // Fetch categories and designers
    useEffect(() => {
        fetchCategories();
        fetchDesigners();
        setTimeout(() => setLoaded(true), 150);
    }, []);

    const fetchCategories = async () => {
        const res = await axios.get(`${serverUrl}/api/getCategories/get-categories`);
        setCategories(res.data);
    };

    const fetchDesigners = async () => {
        const res = await axios.get(`${serverUrl}/api/getDesigners/get-designers`);
        setDesigners(res.data);
    };

    // Category - Hierarchy dependency
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

    // Hierarchy - subcategory dependency
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

    // Handle multiple image uploads with duplicate prevention
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        let newFiles = [...images];
        let newPreviews = [...preview];
        let duplicateFound = false;

        files.forEach((file) => {
            const isDuplicate = newFiles.some(
                (f) => f.name === file.name && f.size === file.size
            );

            if (isDuplicate) {
                duplicateFound = true;
            } else {
                newFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }
        });

        if (duplicateFound) {
            setToast({ message: "Some images were duplicates and not added.", type: "error" });
        }

        if (newFiles.length > 10) {
            setToast({ message: "You can upload a maximum of 10 images only.", type: "error" });
            return;
        }

        setImages(newFiles);
        setPreview(newPreviews);
    };

    // Remove image
    const removeImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...preview];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setPreview(newPreviews);
    };

    // Validate required fields
    const validateForm = () => {
        const requiredFields = [
            "name",
            "shortDescription",
            "category",
            "hierarchy",
            "subcategory",
            "mrp",
            "material",
            "color",
            "condition",
            "productDescription"
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setToast({ message: `Please fill in the ${field} field.`, type: "error" });
                setLoading(false)
                return false;
            }
        }

        if (images.length < 3 || images.length > 10) {
            setToast({ message: `Please upload 3 to 10 images.`, type: "error" });
            setLoading(false)
            return false;
        }

        setLoading(false)
        return true;
    };

    // Submit product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (!validateForm()) return;

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));
        images.forEach((img) => data.append("images", img));

        try {
            await axios.post(`${serverUrl}/api/products/add-product`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setToast({ message: "Product added successfully!", type: "success" });

            setFormData({
                name: "",
                shortDescription: "",
                category: "",
                hierarchy: "",
                subcategory: "",
                mrp: "",
                discountedPrice: "",
                designer: "",
                size: "",
                productDescription: "",
                material: "",
                color: "",
                condition: "",
                sellerName: "",
                sellerNumber: "",
                sellerEmail: "",
            });
            setImages([]);
            setPreview([]);
            setHierarchies([]);
            setSubcategories([]);
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setToast({ message: "Failed to add product. Please try again.", type: "error" });
        }
    };

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="relative max-w-4xl mx-auto bg-white shadow-2xl p-6 rounded-lg mt-48 mb-20">

                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">Add Product</h3>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded-md" />

                        <input type="text" placeholder="Short Description" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value }) } className="border p-2 rounded-md" />

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

                        <input type="number" placeholder="MRP" value={formData.mrp} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} className="border p-2 rounded-md" />

                        <input type="number" placeholder="Discounted Price" value={formData.discountedPrice} onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value }) } className="border p-2 rounded-md" />

                        <select value={formData.designer} onChange={(e) => setFormData({ ...formData, designer: e.target.value }) } className="border p-2 rounded-md" >
                            <option value="">Select Designer</option>
                            {designers.map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        <input type="text" placeholder="Size" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value }) } className="border p-2 rounded-md" />

                        <input type="text" placeholder="Material" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value }) } className="border p-2 rounded-md" />

                        <input type="text" placeholder="Color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value }) } className="border p-2 rounded-md" />
                    </div>

                    <div className="mt-4">
                        <select name="condition" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value }) } className="border p-2 rounded-md w-full" >
                            <option value="">Select Condition</option>
                            {["Excellent", "Very Good", "Good", "New"].map((cond) => (
                                <option name="condition" value={cond}>
                                    {cond}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product description */}
                    <textarea placeholder="Product Description" value={formData.productDescription} onChange={(e) => setFormData({ ...formData, productDescription: e.target.value }) } className="border p-2 rounded-md w-full mt-4 h-32" />

                    {/* Image upload */}
                    <div className="mt-4 mb-4">
                        <label className="block mb-2 font-semibold">Upload Images (3–10)</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border border-gray-300 rounded-lg p-2 w-full cursor-pointer" />

                        {preview.length > 0 && (
                            <div className="flex gap-3 mt-3 flex-wrap">
                                {preview.map((src, i) => (
                                    <div key={i} className="relative group">
                                        <img src={src} alt="preview" className="w-24 h-24 object-cover rounded-md border" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition" >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-bold mb-3">Seller Info</h3>
                    {/* Seller Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Seller Name" value={formData.sellerName} onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })} className="border p-2 rounded-md" />

                        <input type="text" placeholder="Seller Number" value={formData.sellerNumber} onChange={(e) => setFormData({ ...formData, sellerNumber: e.target.value }) } className="border p-2 rounded-md" />

                        <input type="email" placeholder="Seller Email" value={formData.sellerEmail} onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value }) } className="border p-2 rounded-md" />
                    </div>

                    <div className="mt-5 flex items-center gap-6">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked }) } className="w-4 h-4 accent-black" />
                            <span className="font-medium text-gray-700">Featured Product</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={formData.latest} onChange={(e) => setFormData({ ...formData, latest: e.target.checked }) } className="w-4 h-4 accent-black"
                            />
                            <span className="font-medium text-gray-700">Latest Product</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer mt-8" >
                        {loading? <ClipLoader size={20} color='currentColor'/>: "Add Product"}
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

export default AddProduct;
