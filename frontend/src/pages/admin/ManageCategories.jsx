import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { IoAddSharp } from "react-icons/io5";
import AdminNavbar from "../components/AdminNavbar";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate()

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${serverUrl}/api/getCategories/get-categories`);
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="p-6 bg-gray-100 min-h-screen mt-40">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">Manage Category</h3>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <button className="bg-green-500 text-white p-10 rounded-xl shadow-md hover:scale-105 transform transition-all duration-200 text-lg font-semibold cursor-pointer" onClick={()=>navigate("/admin/add-categories")} >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl">
                                <IoAddSharp />
                            </span>
                            <span>
                                Add Category
                            </span>
                        </div>
                    </button>

                    <button className="bg-blue-500 text-white p-10 rounded-xl shadow-md hover:scale-105 transform transition-all duration-200 text-lg font-semibold cursor-pointer" onClick={()=>navigate("/admin/edit-categories")} >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl">
                                <FaEdit />
                            </span>
                            <span>
                                Edit Category
                            </span>
                        </div>
                    </button>

                    <button className="bg-red-500 text-white p-10 rounded-xl shadow-md hover:scale-105 transform transition-all duration-200 text-lg font-semibold cursor-pointer"  onClick={()=>navigate("/admin/delete-categories")} >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl">
                                <MdDeleteForever />
                            </span>
                            <span>
                                Delete Category
                            </span>
                        </div>
                    </button>
                </div>

                {/* 🔹 Available Categories */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">Available Categories</h3>

                    {categories.length === 0 ? 
                        (
                            <p className="text-gray-500 italic">No categories found.</p>
                        ) : (
                            <div className="space-y-4">
                                {categories.map((cat) => (
                                    <div key={cat._id} className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200" >
                                        <h4 className="text-lg font-bold text-gray-800">{cat.name}</h4>

                                        {cat.branches.map((branch, idx) => (
                                            <div key={idx} className="ml-4 mt-2 text-gray-700">
                                                <p><strong>Hierarchy:</strong> {branch.hierarchy}</p>
                                                <p><strong>Subcategories:</strong> {branch.subcategories.join(", ")}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default ManageCategories;
