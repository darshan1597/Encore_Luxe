import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaTags, FaListAlt, FaTruck } from "react-icons/fa";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdAddBusiness } from "react-icons/md";
import AdminNavbar from "../components/AdminNavbar";
import { MdOutlineAddHome } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";

function AdminPanel() {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();
    const {adminData} = useSelector(state=>state.admin)
    const role = adminData?.role;

    const cards = [
        {
            title: "Add Admins",
            icon: <IoPersonAddSharp size={40} className="text-black-500" />,
            path: "/admin/add-admins",
            color: "hover:bg-gray-200",
            role: "superAdmin",
        },
        {
            title: "Delete Admin",
            icon: <TiDelete size={40} className="text-red-500" />,
            path: "/admin/delete-admins",
            color: "hover:bg-red-200",
            role: "superAdmin",
        },
        {
            title: "Manage Categories",
            icon: <FaListAlt size={40} className="text-indigo-500" />,
            path: "/admin/manage-categories",
            color: "hover:bg-indigo-50",
        },
        {
            title: "Add Designers",
            icon: <MdOutlineAddHome size={40} className="text-gray-500" />,
            path: "/admin/add-designers",
            color: "hover:bg-gray-50",
        },
        {
            title: "Add Products",
            icon: <MdAddBusiness size={40} className="text-blue-500" />,
            path: "/admin/add-products",
            color: "hover:bg-blue-50",
        },
        {
            title: "View Forms",
            icon: <FaClipboardList size={40} className="text-green-500" />,
            path: "/admin/view-forms",
            color: "hover:bg-green-50",
        },
        {
            title: "View Products",
            icon: <FaBoxOpen size={40} className="text-orange-500" />,
            path: "/admin/view-products",
            color: "hover:bg-orange-50",
        },
        {
            title: "View Guest Orders",
            icon: <FaTruck size={40} className="text-purple-500" />,
            path: "/admin/view-guest-orders",
            color: "hover:bg-purple-50",
        },
        {
            title: "View User Orders",
            icon: <FaTruck size={40} className="text-green-400" />,
            path: "/admin/view-orders",
            color: "hover:bg-purple-50",
        },
        {
            title: "Add Discount Codes",
            icon: <BiSolidEditAlt size={40} className="text-pink-500" />,
            path: "/admin/add-discount-codes",
            color: "hover:bg-pink-50",
        },
        {
            title: "View Discount Codes",
            icon: <FaTags size={40} className="text-yellow-500" />,
            path: "/admin/view-discount-codes",
            color: "hover:bg-yellow-50",
        }
    ];

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>

            {/* Admin dashboard cards */}
            <section className="pb-20 px-10 pt-5 relative bg-white flex flex-col mt-40">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.filter(card => !card.role || card.role === role).map((card, index) => (
                        <div key={index} onClick={() => navigate(card.path)} className={`cursor-pointer flex flex-col items-center justify-center border border-gray-200 rounded-2xl shadow-md p-8 transition-transform duration-300 hover:-translate-y-2 ${card.color}`} >
                            {card.icon}
                            <h2 className="text-xl font-medium mt-4 text-gray-700">{card.title}</h2>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default AdminPanel;
