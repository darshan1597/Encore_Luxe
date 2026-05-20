import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Toast from "../components/Toast";

function AddDesigners() {
    const [name, setName] = useState("");
    const [designers, setDesigners] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null);

    const fetchDesigners = async () => {
        const res = await axios.get(`${serverUrl}/api/getDesigners/get-designers`);
        setDesigners(res.data);
    };

    const handleDeleteDesigner = async (designerId) => {
        try {
            await axios.delete(`${serverUrl}/api/designers/delete-designer/${designerId}`);
            await fetchDesigners();
            setToast({ message: "Designer Deleeted Successfully!", type: "success" })
        } catch (error) {
            setToast({ message: "Error Deleting Designer!", type: "error" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await axios.post(`${serverUrl}/api/designers/add-designers`, { name });
            setToast({ message: "Designer Added Successfully!", type: "success" });
            setName("");
            fetchDesigners();
            setLoading(false)
        } catch (error) {
            setToast({ message: "Error Adding Designer!", type: "error" });
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchDesigners();
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-48">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">Add Designers</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">Designer Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded-md w-full mb-3" required />

                    <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-md cursor-pointer" >
                        {loading? <ClipLoader size={20} color='currentColor'/>: "Add Designer"}
                    </button>
                </form>

                <h3 className="text-xl font-semibold mt-6 mb-3">All Designers</h3>
                <ul className="space-y-2">
                    {designers.map((d) => (
                        <li key={d._id} className="flex justify-between border-b py-1">
                            {d.name}
                            <button type="button" onClick={() => handleDeleteDesigner(d._id)} className="text-red-500 cursor-pointer" >
                                {loading? <ClipLoader size={20} color='currentColor'/>: "Delete"}
                            </button>
                        </li>
                    ))}
                </ul>
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

export default AddDesigners;
