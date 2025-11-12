import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverUrl } from '../App';
import axios from "axios";
import { ClipLoader } from "react-spinners"

function ForgotPassword() {

    const [loaded, setLoaded] = useState(false);
    const [step, setStep] = useState(1)
    const[email, setEmail] = useState("")
    const[otp, setOtp] = useState("")
    const[newPassword, setNewPassword] = useState("")
    const[confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSentOtp = async () => {
        setLoading(true)
        try {
            if(email == ""){
                setLoading(false)
                return setError("Email is required")
            }
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, {email}, {withCredentials:true})
            console.log(result)
            setError("")
            setStep(2)
            setLoading(false)
        } catch (error) {
            setError(error?.response?.data?.message)
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            if(otp == ""){
                setLoading(false)
                return setError("OTP is required")
            }
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, {email, otp}, {withCredentials:true})
            console.log(result)
            setError("")
            setStep(3)
            setLoading(false)
        } catch (error) {
            setError(error?.response?.data?.message)
            setLoading(false)
        }
    }

    const handleResetPassword = async () => {
        setLoading(true)
        try {
            if(newPassword == "" || newPassword.length<6){
                setLoading(false)
                return setError("Password must be atleast 6 characters")
            }
            if(newPassword != confirmPassword){
                setLoading(false)
                return setError("New Password and Confirm Password does not match")
            }
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, {email, newPassword}, {withCredentials:true})
            console.log(result)
            setError("")
            navigate("/signin")
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
        <div className={`min-h-screen w-full transition-opacity duration-1000 flex flex-col items-center bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>

            {/* Navbar */}
            <nav className="top-0 z-20 flex justify-between items-center pt-3 pb-5 transition-all duration-300">
                <img src={logo} alt="Enocre Luxe"  className="cursor-pointer rounded-full shadow-2xl" width={150} onClick={()=>navigate("/")} />
            </nav>

            <div className="lg:px-20 px-5 py-8 rounded-3xl lg:w-[600px] md:w-[500px] w-[350px] flex flex-col justify-center bg-gray-100 shadow-2xl mt-20">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/signin")} />
                    <h3 className="text-2xl font-bold text-black">Forgot Password</h3>
                </div>

                {step == 1 &&
                    <div>
                        <div className="relative w-full flex flex-col mb-6">
                            <label htmlFor="email" className="text-black font-semibold text-lg ml-1" >
                                Email
                            </label>
                            <input type="email" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} value={email} required />
                        </div>

                        {error && (
                            <div className='flex justify-center mt-2'>
                                <p className='text-red-500 w-max flex items-center justify-center underline rounded-xl font-semibold'>{error}</p>
                            </div>
                        )}

                        <div className='flex justify-center mt-6 mb-3'>
                            <button type="button" className="py-3 w-3/4 bg-gray-800 text-white border rounded-xl hover:bg-white hover:text-black transition font-medium cursor-pointer hover:border hover:border-gray-800" onClick={handleSentOtp} disabled={loading} >
                                {loading? <ClipLoader size={20} color='currentColor'/>: "Send OTP"}
                            </button>
                        </div>
                    </div>
                }

                {step == 2 &&
                    <div>
                        <div className="relative w-full flex flex-col mb-6">
                            <label htmlFor="otp" className="text-black font-semibold text-lg ml-1" >
                                OTP
                            </label>
                            <input type="text" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)} value={otp} required />
                        </div>

                        {error && (
                            <div className='flex justify-center mt-2'>
                                <p className='text-red-500 w-max flex items-center justify-center underline rounded-xl font-semibold'>{error}</p>
                            </div>
                        )}

                        <div className='flex justify-center mt-6 mb-3'>
                            <button type="button" className="py-3 w-3/4 bg-gray-800 text-white border rounded-xl hover:bg-white hover:text-black transition font-medium cursor-pointer hover:border hover:border-gray-800" onClick={handleVerifyOtp} disabled={loading}>
                                {loading? <ClipLoader size={20} color='currentColor'/>: "Verify OTP"}
                            </button>
                        </div>
                    </div>
                }

                {step == 3 &&
                    <div>
                        <div className="relative w-full flex flex-col mb-6">
                            <label htmlFor="newPassword" className="text-black font-semibold text-lg ml-1" >
                                New Password
                            </label>
                            <input type="text" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Enter New Password" onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} required />
                        </div>
                        <div className="relative w-full flex flex-col mb-6">
                            <label htmlFor="confirmPassword" className="text-black font-semibold text-lg ml-1" >
                                Confirm Password
                            </label>
                            <input type="text" className="w-full px-4 py-3 text-black bg-gray-100 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black mt-2" placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} required />
                        </div>

                        {error && (
                            <div className='flex justify-center mt-2'>
                                <p className='text-red-500 w-max flex items-center justify-center underline rounded-xl font-semibold'>{error}</p>
                            </div>
                        )}

                        <div className='flex justify-center mt-6 mb-3'>
                            <button type="button" className="py-3 w-3/4 bg-gray-800 text-white border rounded-xl hover:bg-white hover:text-black transition font-medium cursor-pointer hover:border hover:border-gray-800" onClick={handleResetPassword} disabled={loading}>
                                {loading? <ClipLoader size={20} color='currentColor'/>: "Reset Password"}
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ForgotPassword
