import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import Toast from "../components/Toast";

function AddEditDiscount() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        code: "",
        type: "percentage",
        value: "",
        minOrderAmount: "",
        expiresAt: "",
        active: true
    });

    const loadDiscount = async () => {
        if (!id) return;
        const res = await axios.get(`${serverUrl}/api/discounts/get-one-discount/${id}`);
        setForm(res.data.discount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (id) {
            await axios.put(`${serverUrl}/api/discounts/update-discount/${id}`, form);
            setToast({ message: "Discount Code Edited Successfully!", type: "success" });
            setLoading(false)
            setTimeout(() => {
                navigate("/admin/view-discount-codes");
            }, 1000);
        } else {
            await axios.post(`${serverUrl}/api/discounts/create-discount`, form);
            setLoading(false)
            setForm({
                code: "",
                type: "percentage",
                value: "",
                minOrderAmount: "",
                expiresAt: "",
                active: true
            })
            setToast({ message: "Discount Code Added Successfully!.", type: "success" });
            navigate("/admin/add-discount-codes");
        }
    };

    useEffect(() => {
        loadDiscount();
    }, []);

    return (
        <div className="min-h-screen w-full transition-opacity duration-1000 bg-white">
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="relative max-w-4xl mx-auto bg-white shadow-2xl p-6 rounded-lg mt-48 mb-20">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">{id ? "Edit Discount Code" : "Add Discount Code"}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-medium">Code</label>
                        <input type="text" className="w-full p-2 border rounded" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value }) } required />
                    </div>

                    <div>
                        <label className="font-medium">Type</label>
                        <select className="w-full p-2 border rounded" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value }) }                    >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-medium">Value</label>
                        <input type="number" className="w-full p-2 border rounded" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value }) } required />
                    </div>

                    <div>
                        <label className="font-medium">Minimum Order Amount</label>
                        <input type="number" className="w-full p-2 border rounded" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value }) } />
                    </div>

                    <div>
                        <label className="font-medium">Expiry Date</label>
                        <input type="date" className="w-full p-2 border rounded" value={form.expiresAt?.substring(0, 10)} onChange={(e) => setForm({ ...form, expiresAt: e.target.value }) } required />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer mt-8" >
                        {loading? (<ClipLoader size={20} color='currentColor'/>): (id ? "Update" : "Create")}
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

export default AddEditDiscount;