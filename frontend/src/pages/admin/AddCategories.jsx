import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { MdKeyboardBackspace } from "react-icons/md";
import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { LuDelete } from "react-icons/lu";
import { ClipLoader } from "react-spinners";
import Toast from "../components/Toast";

function AddCategories() {
    const [categoryName, setCategoryName] = useState("");
    const [branchCount, setBranchCount] = useState(0)
    const [branches, setBranches] = useState([])
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null);

    const handleBranchCount = (count) => {
        const newBranches = Array.from({ length: count }, () => ({
            hierarchy: [""],
            subcategories: [""],
        }));
        setBranches(newBranches);
        setBranchCount(count);
    };

    const handleHierarchyChange = (index, value) => {
        const updated = [...branches];
        updated[index].hierarchy[0] = value;
        setBranches(updated);
    };

    const handleSubChange = (branchIndex, subIndex, value) => {
        const updated = [...branches];
        updated[branchIndex].subcategories[subIndex] = value;
        setBranches(updated);
    };

    const addSubcategory = (branchIndex) => {
        const updated = [...branches];
        updated[branchIndex].subcategories.push("");
        setBranches(updated);
    };

    const removeSubcategory = (branchIndex, subIndex) => {
        const updated = [...branches];
        updated[branchIndex].subcategories.splice(subIndex, 1);
        setBranches(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        // Capitalize first letter of each input
        const formattedCategory = {
            name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
            branches: branches.map((b) => ({
                hierarchy: [b.hierarchy[0].charAt(0).toUpperCase() + b.hierarchy[0].slice(1)],
                subcategories: b.subcategories.map(
                    (s) => s.charAt(0).toUpperCase() + s.slice(1)
                ),
            })),
        };

        try {
            await axios.post(`${serverUrl}/api/categories/add-category`, formattedCategory);
            setToast({ message: "Category Added Successfully!", type: "success" });
            setCategoryName("");
            setBranches([]);
            setBranchCount(0);
            setLoading(false)
        } catch (error) {
            setToast({ message: "Error Adding Category!", type: "error" });
            setLoading(false)
        }
        
    };

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>

            <div className="p-6 max-w-3xl mx-auto bg-white shadow-2xl rounded-lg mt-48">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/manage-categories")} />
                    <h3 className="text-2xl font-bold text-black">Add Category</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Category name */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Main Category</label>
                        <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="border rounded-md p-2 w-full" required />
                    </div>

                    {/* Branch count */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Number of Branches</label>
                        <input type="number" min="1" value={branchCount} onChange={(e) => handleBranchCount(parseInt(e.target.value) || 0)} className="border rounded-md p-2 w-full" required />
                    </div>

                    {/* Branches */}
                    {branches.map((branch, i) => (
                    <div key={i} className="border p-3 rounded-md mb-3">
                        <h3 className="font-medium mb-2">Branch {i + 1}</h3>

                        <input type="text" placeholder="Branch name (e.g. clothing)" value={branch.hierarchy[0]} onChange={(e) => handleHierarchyChange(i, e.target.value)} className="border rounded-md p-2 w-full mb-3" required />

                        <label className="font-medium mb-2 block">Subcategories:</label>
                        {branch.subcategories.map((sub, j) => (
                            <div key={j} className="flex items-center mb-2 gap-2">
                                <input type="text" placeholder="Subcategory (e.g. T Shirt)" value={sub} onChange={(e) => handleSubChange(i, j, e.target.value)} className="border rounded-md p-2 w-full" required />
                                {j > 0 && (
                                    <button type="button" onClick={() => removeSubcategory(i, j)} className="bg-red-500 text-white px-2 py-2 rounded-md cursor-pointer text-2xl" >
                                        <LuDelete />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={() => addSubcategory(i)} className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer" >
                            + Add Subcategory
                        </button>
                    </div>
                    ))}

                    <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold cursor-pointer" >
                        {loading? <ClipLoader size={20} color='currentColor'/>: "Add Category"}
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

export default AddCategories;
