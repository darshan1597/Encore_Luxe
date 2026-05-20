import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import Toast from "../components/Toast";

function ViewDiscount() {
    const [list, setList] = useState([]);
    const navigate = useNavigate()
    const [toast, setToast] = useState(null);

    const load = async () => {
        const res = await axios.get(`${serverUrl}/api/discounts/get-discounts`);
        setList(res?.data?.discounts);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this discount code?")) return;
        await axios.delete(`${serverUrl}/api/discounts/delete-discount/${id}`)
        setToast({ message: "Discount Code Deleted.", type: "success" });
        load();
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="min-h-screen w-full transition-opacity duration-1000 bg-white">
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="relative max-w-4xl mx-auto bg-white shadow-2xl p-6 rounded-lg mt-48 mb-20">
                <div className="flex justify-between items-center mb-6">
                    <div className='flex gap-4 items-center'>
                        <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                        <h1 className="text-2xl font-bold">Discount Codes</h1>
                    </div>
                    <Link to="/admin/add-discount-codes" className="bg-blue-600 text-white px-4 py-2 rounded" >
                        + Add Code
                    </Link>
                </div>

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 border">Code</th>
                            <th className="p-3 border">Type</th>
                            <th className="p-3 border">Value</th>
                            <th className="p-3 border">Expiry</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((d) => (
                            <tr key={d._id}>
                                <td className="p-3 border font-bold">{d.code}</td>
                                <td className="p-3 border capitalize">{d.type}</td>
                                <td className="p-3 border">
                                    {d.type === "percentage"
                                        ? `${d.value}%`
                                        : `₹${d.value}`}
                                </td>
                                <td className="p-3 border">
                                    {new Date(d.expiresAt).toLocaleDateString()}
                                </td>
                                <td className="p-3 border">
                                    <div className="flex justify-between">
                                        <button className="text-blue-600 mr-4 cursor-pointer" onClick={() => navigate(`/admin/edit-discount-code/${d._id}`)} >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(d._id)} className="text-red-600 cursor-pointer" >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default ViewDiscount;