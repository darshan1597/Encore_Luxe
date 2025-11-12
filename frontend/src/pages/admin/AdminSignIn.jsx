import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import axios from "axios";
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setAdminData } from '../../redux/adminSlice';

function AdminSignIn() {
    const [loaded, setLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    const handleSignIn = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/admin/admin-signin`, {
                email, password
            }, {withCredentials: true})
            dispatch(setAdminData(result.data))
            setError("")
            setLoading(false)
            navigate("/admin/admin-panel")
        } catch (error) {
            setError(error?.response?.data?.message)
            setLoading(false)
        }
    }

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 flex flex-col items-center bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>

            {/* Navbar */}
            <nav className="top-0 z-20 flex justify-between items-center pt-3 pb-5 transition-all duration-300">
                <img src={logo} alt="Enocre Luxe"  className="cursor-pointer rounded-full shadow-2xl" width={150} />
            </nav>

            {/* Content */}
            <div className="lg:px-20 px-5 py-8 rounded-3xl lg:w-[600px] md:w-[500px] w-[350px] flex flex-col justify-start bg-gray-100 shadow-2xl pb-18">
                <h2 className="text-5xl font-bold text-black mb-10 text-center">Log in</h2>

                <div className="relative w-full flex flex-col">
                    <label htmlFor="email" className="text-black font-semibold text-lg ml-1" >
                        Email
                    </label>
                    <input type="email" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} value={email} required />
                </div>

                <div className="relative w-full flex flex-col">
                    <label htmlFor="password" className="text-black font-semibold text-lg ml-1" >
                        Password
                    </label>
                    <input type={`${showPassword ? "text" : "password"}`} className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter Your Password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
                    <button type='button' className='absolute right-5 top-13.5 cursor-pointer text-black' onClick={() => setShowPassword(prev=>!prev)}>{!showPassword ? <FaEye /> : <FaEyeSlash /> }</button>
                </div>
                
                {error && (
                    <div className='flex justify-center mt-2'>
                        <p className='text-red-500 w-max flex items-center justify-center underline rounded-xl font-semibold'>{error}</p>
                    </div>
                )}

                <div className="w-full max-w-sm mx-auto text-center mt-6">
                    <button type="button" className="w-full py-3 bg-gray-800 text-white rounded-full hover:bg-white hover:text-black transition font-medium cursor-pointer hover:border hover:border-gray-800 border" onClick={handleSignIn} disabled={loading}>
                        {loading? <ClipLoader size={20} color='currentColor'/>: "Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminSignIn
