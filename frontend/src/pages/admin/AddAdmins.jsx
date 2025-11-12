import React, { useEffect, useState } from 'react'
import AdminNavbar from '../components/AdminNavbar';
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';

function AddAdmins() {
    const [loaded, setLoaded] = useState(false);
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleAddAdmin = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/admin/add-admin`, {
                fullName, email, mobile, password
            }, {withCredentials: true})
            setError("")
            alert("Admin Added")
            setLoading(false)
        } catch (error) {
            setError(error?.response?.data?.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`}>
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="p-6 max-w-2xl mx-auto mt-48 shadow-2xl mb-30 rounded-3xl bg-gray-100">
                <div className="relative w-full flex flex-col">
                    <label htmlFor="fullName" className="text-black font-semibold text-lg ml-1" >
                        FullName
                    </label>
                    <input type="text" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter Your Full Name" onChange={(e)=>setFullName(e.target.value)} value={fullName} required />
                </div>

                <div className="relative w-full flex flex-col">
                    <label htmlFor="email" className="text-black font-semibold text-lg ml-1" >
                        Email
                    </label>
                    <input type="email" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} value={email} required />
                </div>

                <div className="relative w-full flex flex-col">
                    <label htmlFor="mobile" className="text-black font-semibold text-lg ml-1" >
                        Phone Number
                    </label>
                    <input type="tel" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter Your Mobile Number" onChange={(e)=>setMobile(e.target.value)} value={mobile} required />
                </div>

                <div className="relative w-full flex flex-col">
                    <label htmlFor="password" className="text-black font-semibold text-lg ml-1" >
                        Password
                    </label>
                    <input type="text" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter Your Password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
                </div>

                {error && (
                    <div className='flex justify-center mt-2'>
                        <p className='text-red-500 w-max font-semibold'>{error}</p>
                    </div>
                )}

                <div className="w-full max-w-sm mx-auto text-center mt-6">
                    <button type="button" className="w-full py-3 border bg-gray-800 text-white rounded-full hover:bg-white hover:text-black transition font-medium cursor-pointer hover:border hover:border-gray-800" onClick={handleAddAdmin} disabled={loading}>
                        {loading? <ClipLoader size={20} color='currentColor'/>: "Add Admin"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddAdmins
