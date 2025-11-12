import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Footer from './components/Footer';

function Profile() {
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState(null);
    const { userData: currentUser } = useSelector((state) => state.user);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const fetchUser = async () => {
        try {
            const id = currentUser._id
            const res = await axios.get(`${serverUrl}/api/user/fetch-user/${id}`);
            setUser(res.data);
            setFormData({
                name: res.data.fullName,
                email: res.data.email,
                phone: res.data.mobile,
            });
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${serverUrl}/api/user/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(formData);
            setEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
  };

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
        if (currentUser?._id) {
            fetchUser();
        }
        console.log(currentUser)
    }, [currentUser]);

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Please Login...</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>
            <div className="max-w-5xl mx-auto px-4 py-10 mt-42">
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between border-b pb-4 mb-6">
                        <div className="flex items-center gap-4">
                            <span className='bg-gray-700 text-white py-[3px] px-[10px] rounded-full cursor-pointer'>  
                                {user.fullName.slice(0,1)} 
                            </span> 
                            <div>
                                <h1 className="text-2xl font-semibold">{user.name}</h1>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all cursor-pointer" >
                            <MdEdit />
                            {editing ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    {/* Editable Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium text-gray-700">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} disabled={!editing} className={`w-full mt-1 p-3 border rounded-xl ${ editing ? "bg-white" : "bg-gray-100 cursor-not-allowed" }`} />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700">Email</label>
                            <input name="email" value={formData.email} onChange={handleChange} disabled={!editing} className={`w-full mt-1 p-3 border rounded-xl ${ editing ? "bg-white" : "bg-gray-100 cursor-not-allowed" }`} />
                        </div>

                        {editing && (
                            <button onClick={handleSave} className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all" >
                                Save Changes
                            </button>
                        )}
                        {/* Address Section */}
                        <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Saved Addresses</h2>
                            </div>

                            {user.address && user.address.length > 0 ? 
                                (
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {user.address.map((addr, index) => (
                                            <div key={index} className="p-4 border rounded-xl bg-gray-50 hover:shadow-md transition-all" >
                                                <h3 className="font-medium text-gray-700 mb-2">
                                                    Address {index + 1}
                                                </h3>
                                                <div className="text-gray-600 text-sm space-y-1">
                                                    {addr.fullAddress && <p>{addr.fullAddress}</p>}
                                                    {addr.apt && <p>{addr.apt}</p>}
                                                    <p>
                                                        {[addr.city, addr.state, addr.pincode]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </p>
                                                    {addr.country && <p>{addr.country}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No addresses saved yet.</p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Profile
