import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Toast from "../components/Toast";

function DeleteAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate()
    const [toast, setToast] = useState(null);
    const {adminData} = useSelector(state=>state.admin)

    const fetchAdmins = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/admin/all-admins`, { withCredentials: true });
            setAdmins(res.data.admins);
        } catch (err) {
            setToast({ message: "Failed to load admins", type: "error" });
        }
    };

    const handleDelete = async (adminId) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;

        setLoading(true);
        try {
            await axios.delete(`${serverUrl}/api/admin/delete-admin/${adminId}`, { withCredentials: true });
            setAdmins((prev) => prev.filter((a) => a._id !== adminId));
            setToast({ message: "Admin Deleted", type: "success" });
        } catch (err) {
            setToast({ message: err?.response?.data?.message || "Error deleting admin", type: "error" });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAdmins();
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>

            <div className="relative max-w-4xl mx-auto bg-white shadow-2xl p-6 rounded-lg mt-48 mb-20">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">Manage Admins</h3>
                </div>

                <div className="space-y-4">
                    {admins.length === 0 ? (
                        <p className="text-center text-gray-600">No Admins Found</p>
                    ) : (
                        admins.map((admin) => (
                            <div key={admin._id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow" >
                                <div>
                                    <p className="font-semibold">{admin.fullName}</p>
                                    <p className="text-gray-600 text-sm">{admin.email}</p>
                                    <p className="text-gray-600 text-sm">{admin.mobile}</p>
                                </div>

                                {admin._id === adminData?._id ? (
                                    <button className="px-4 py-2 bg-gray-400 text-white rounded-full cursor-not-allowed" disabled >
                                        Cannot Delete
                                    </button>
                                ) : (
                                    <button onClick={() => handleDelete(admin._id)} className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-white hover:text-red-600 border hover:border-red-600 transition cursor-pointer" >
                                        {loading ? <ClipLoader size={20} color="currentColor" /> : "Delete"}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
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

export default DeleteAdmins;
