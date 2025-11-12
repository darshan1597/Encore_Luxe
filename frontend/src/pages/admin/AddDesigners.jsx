import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function AddDesigners() {
    const [name, setName] = useState("");
    const [designers, setDesigners] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const fetchDesigners = async () => {
        const res = await axios.get(`${serverUrl}/api/getDesigners/get-designers`);
        setDesigners(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await axios.post(`${serverUrl}/api/designers/add-designers`, { name });
            alert("Designer Added Successfully!");
            setName("");
            fetchDesigners();
            setLoading(false)
        } catch (error) {
            alert("Error Adding Designer!");
            setLoading(false)
        }
        
    };

    useEffect(() => {
        fetchDesigners();
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`} >
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
                            <button onClick={() => axios.delete(`${serverUrl}/api/designers/delete-designer/${b._id}`).then(fetchDesigners) } className="text-red-500 cursor-pointer" >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AddDesigners;
