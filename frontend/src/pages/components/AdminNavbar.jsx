import React, { useState } from 'react'
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../../App';
import { setAdminData } from '../../redux/adminSlice';

function AdminNavbar() {
    const {adminData} = useSelector(state=>state.admin)
    const [accountLoginMenuOpen, setAccountLoginMenuOpen] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleAdminLogout = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/admin/signout`, {withCredentials: true})
            dispatch(setAdminData(null))
            navigate("/admin/admin-signin")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <nav className="fixed w-full top-0 flex justify-between items-center px-6 md:px-16 py-5 bg-white">
                <div className="">
                    <img src={logo} alt="Encore Luxe" className="cursor-pointer rounded-full w-[100px] sm:w-[120px] md:w-[130px] flex justify-center shadow-2xl transition-all duration-300 ease-in-out hover:scale-108" onClick={() => navigate("/admin/admin-panel")} />
                </div>

                <div>
                    <ul className="flex justify-end items-center gap-2">
                        {adminData && (
                            <>
                                <li className='cursor-pointer relative z-20' onClick={() => setAccountLoginMenuOpen((prev) => !prev)}>
                                    <MdAccountCircle size={35} />
                                    <div className={`absolute right-0 mt-2 w-max px-1 font-bold bg-white border border-gray-200 rounded-lg shadow-2xl py-2 z-[999] transform transition-all duration-300 ease-out origin-top cursor-pointer ${ accountLoginMenuOpen ? "opacity-100 scale-100 -translate-x-5 translate-y-0" : "opacity-0 scale-0 translate-x-15 translate-y-0 pointer-events-none" }`}>
                                        <p className="px-4 py-2 text-black text-lg border-b cursor-default capitalize" >
                                            Hello {adminData?.fullName?.split(" ")[0]}
                                        </p>
                                        <p className="px-4 py-2 text-gray-700 text-lg hover:text-black flex items-center group gap-2" onClick={() =>  { navigate("/admin/admin-profile"); setAccountLoginMenuOpen(false); }} >
                                            <span className='bg-gray-700 text-white py-[2px] px-[10px] rounded-full group-hover:bg-black uppercase'> {adminData?.fullName?.slice(0,1)} </span> 
                                            Profile
                                        </p>
                                        <button className="px-4 py-2 text-lg text-red-500 hover:text-red-600 flex items-center gap-2 cursor-pointer" onClick={handleAdminLogout} >
                                            <RiLogoutBoxFill size={28} />
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}

                        {/* Account Slider (logged in) */}
                        {accountLoginMenuOpen && (
                            <div className="fixed inset-0" onClick={() => setAccountLoginMenuOpen(false)} ></div>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default AdminNavbar
