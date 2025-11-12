import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ViewProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts();
        setTimeout(() => setLoaded(true), 150);
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/getProducts/get-products`);
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (!confirmDelete) return;

        try {
            await axios.delete(`${serverUrl}/api/products/delete-product/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            alert("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    }

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`}>
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="p-6 max-w-7xl mx-auto mt-48">
                <div className="flex justify-between items-center mb-6">
                    <div className='flex gap-4 items-center mb-10'>
                        <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                        <h3 className="text-2xl font-bold text-black">View Products</h3>
                    </div>
                    <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="py-3 px-4">Image</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Designer</th>
                                <th className="py-3 px-4">Created</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((p) => (
                                    <tr key={p._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <img src={`${serverUrl}/productImages/${p.images?.find(i => i.isPrimary)?.name}`} alt={p.name} className="w-30 h-30 object-cover rounded-lg" />
                                        </td>
                                        <td className="py-3 px-4 font-medium">{p.name}</td>
                                        <td className="py-3 px-4">{p.category}</td>
                                        <td className="py-3 px-4">
                                            ₹{p.discountedPrice}
                                            <span className="text-gray-400 line-through ml-2">
                                                ₹{p.mrp}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{p.designer?.name || "—"}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="pl-5 space-x-5">
                                            <button className="text-blue-500 hover:text-blue-600 cursor-pointer text-2xl" onClick={()=>navigate(`/admin/edit-product/${p._id}`)}>
                                                <FiEdit />
                                            </button>
                                            <button className="text-red-500 hover:text-red-600 cursor-pointer text-2xl" onClick={() => handleDelete(p._id, p.name)} >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewProducts;
