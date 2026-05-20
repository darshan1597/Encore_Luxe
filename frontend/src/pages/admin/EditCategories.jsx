import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { MdKeyboardBackspace } from "react-icons/md";
import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { LuDelete } from "react-icons/lu";
import Toast from "../components/Toast";

function EditCategories() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [branches, setBranches] = useState([]);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate()

    // Fetch all categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await axios.get(`${serverUrl}/api/getCategories/get-categories`);
        setCategories(res.data);
    };

    // When a category is selected
    const handleSelectCategory = (categoryId) => {
        const category = categories.find((c) => c._id === categoryId);
        setSelectedCategory(category);
        setBranches(category.branches || []);
    };

    // Handle hierarchy (branch name)
    const handleHierarchyChange = (index, value) => {
        const updated = [...branches];
        updated[index].hierarchy[0] = value;
        setBranches(updated);
    };

    // Handle subcategory change
    const handleSubChange = (branchIndex, subIndex, value) => {
        const updated = [...branches];
        updated[branchIndex].subcategories[subIndex] = value;
        setBranches(updated);
    };

    // Add a new subcategory to a branch
    const addSubcategory = (branchIndex) => {
        const updated = [...branches];
        updated[branchIndex].subcategories.push("");
        setBranches(updated);
    };

    // Remove a subcategory
    const removeSubcategory = (branchIndex, subIndex) => {
        const updated = [...branches];
        updated[branchIndex].subcategories.splice(subIndex, 1);
        setBranches(updated);
    };

    // Add a new branch
    const addBranch = () => {
        setBranches([
        ...branches,
        { hierarchy: [""], subcategories: [""] },
        ]);
    };

    // Remove branch
    const removeBranch = (index) => {
        const updated = [...branches];
        updated.splice(index, 1);
        setBranches(updated);
    };

    // Submit changes
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formattedCategory = {
            name:
                selectedCategory.name.charAt(0).toUpperCase() +
                selectedCategory.name.slice(1),
            branches: branches.map((b) => ({
                hierarchy: [
                b.hierarchy[0].charAt(0).toUpperCase() + b.hierarchy[0].slice(1),
                ],
                subcategories: b.subcategories.map(
                    (s) => s.charAt(0).toUpperCase() + s.slice(1)
                )
            }))
        }

        await axios.put(`${serverUrl}/api/categories/edit-category/${selectedCategory._id}`, formattedCategory);
        setToast({ message: "Category Updated Successfully!", type: "success" });
        fetchCategories();
    };

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white`}>
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>

            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-48">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/manage-categories")} />
                    <h3 className="text-2xl font-bold text-black">Edit Category</h3>
                </div>

            {/* Select Category */}
            <div className="mb-5">
                <label className="block font-medium mb-2">Select a Category</label>
                <select onChange={(e) => handleSelectCategory(e.target.value)} className="border p-2 rounded-md w-full" >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCategory && (
                <form onSubmit={handleUpdate}>
                    <h3 className="text-xl font-medium mb-4">
                        Editing: {selectedCategory.name}
                    </h3>

                    {branches.map((branch, i) => (
                        <div key={i} className="border p-4 mb-4 rounded-md relative bg-gray-50" >
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Branch {i + 1}</h4>
                                <button type="button" onClick={() => removeBranch(i)} className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer" >
                                    Remove Branch
                                </button>
                            </div>

                            {/* Hierarchy */}
                            <input type="text" placeholder="Branch name (e.g. clothing)" value={branch.hierarchy[0]} onChange={(e) => handleHierarchyChange(i, e.target.value)} className="border rounded-md p-2 w-full mb-3" required />

                            {/* Subcategories */}
                            <label className="font-medium mb-2 block">Subcategories:</label>
                            {branch.subcategories.map((sub, j) => (
                                <div key={j} className="flex items-center mb-2 gap-2">
                                    <input type="text" value={sub} onChange={(e) => handleSubChange(i, j, e.target.value)} className="border rounded-md p-2 w-full" required />
                                    {j > 0 && (
                                        <button type="button" onClick={() => removeSubcategory(i, j)} className="bg-red-500 text-white px-2 py-2 rounded-md cursor-pointer text-2xl" >
                                            <LuDelete />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button type="button" onClick={() => addSubcategory(i)} className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2 cursor-pointer" >
                                + Add Subcategory
                            </button>
                        </div>
                    ))}

                    <div className="flex gap-3">
                        <button type="button" onClick={addBranch} className="bg-yellow-500 text-white px-4 py-2 rounded-md mb-4 cursor-pointer" >
                            + Add Branch
                        </button>

                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold mb-4 cursor-pointer" >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}
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

export default EditCategories;
