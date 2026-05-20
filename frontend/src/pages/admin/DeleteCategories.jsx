import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function DeleteCategories() {
    const [categories, setCategories] = useState([]);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate()

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${serverUrl}/api/getCategories/get-categories`);
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories()
    }, []);

    // Handle category select
    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${name}" and all its branches?`);
        if (!confirmDelete) return;

        try {
            await axios.delete(`${serverUrl}/api/categories/delete-category/${id}`);
            setToast({ message: `Category "${name}" deleted successfully!`, type: "success" });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            setToast({ message: "Failed to delete category!", type: "error" });
        }
    };

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>

            <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg mt-48">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/manage-categories")} />
                    <h3 className="text-2xl font-bold text-black">Delete Category</h3>
                </div>

                {categories.length === 0 ? 
                    (
                        <p className="text-gray-600">No categories found.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">
                                        Branches & Subcategories
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 font-medium">
                                            {cat.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {cat.branches.map((b, i) => (
                                                <div key={i} className="mb-2">
                                                <strong>{b.hierarchy[0]}</strong> →{" "}
                                                {b.subcategories.join(", ")}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <button onClick={() => handleDelete(cat._id, cat.name)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md font-medium cursor-pointer" >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
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

export default DeleteCategories;
