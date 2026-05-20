import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import { serverUrl } from "../../App";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Toast from "../components/Toast";

function ViewForms() {
    const [loaded, setLoaded] = useState(false);
    const [sellerForms, setSellerForms] = useState([])
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState("all");
    const [allSellerForms, setAllSellerForms] = useState([]);
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null);

    const handleApprove = async (sellerProductId) => {
        setLoading(true)
        try {
            const res = await axios.post(`${serverUrl}/api/admin/approve-seller-product/${sellerProductId}`);
            setToast({ message: "Product approved and moved to Product DB!", type: "success" })
            setLoading(false)
        } catch (error) {
            console.error(error);
            setToast({ message: "Error approving product", type: "error" })
            setLoading(false)
        }
    };

    useEffect(() => {
        const fetchSellerForms = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/seller/get-seller-forms`);
                console.log(sellerForms);
                setSellerForms(result.data);
                setAllSellerForms(result.data);
            } catch (error) {
                return console.log(error)
            }
        }
        fetchSellerForms();
    }, [])

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>

            <div className="p-4 md:p-10 mt-32 md:mt-40">
                <div className='flex gap-4 items-center'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">All Seller Forms</h3>
                </div>
                
                <div>
                    {/* Filter Boxes */}
                    <div className="flex justify-end gap-3 mb-6">
                        {["all", "approved", "pending"].map((type) => (
                            <div
                                key={type}
                                onClick={() => {
                                    setActiveFilter(type);
                                    if (type === "all") {
                                        setSellerForms(allSellerForms);
                                    } else if (type === "approved") {
                                        setSellerForms(allSellerForms.filter(seller =>
                                            seller.products.some(p => p.status === "approved")
                                        ));
                                    } else if (type === "pending") {
                                        setSellerForms(allSellerForms.filter(seller =>
                                            seller.products.some(p => p.status === "notapproved")
                                        ));
                                    }
                                }}
                                className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-medium transition-all
                                    ${activeFilter === type
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {type === "all" && "All Forms"}
                                {type === "approved" && "Approved"}
                                {type === "pending" && "Pending Approval"}
                            </div>
                        ))}
                    </div>

                    {sellerForms.map((seller) => (
                        <div key={seller._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{seller.firstName} {seller.lastName}</h3>
                                <p className="text-gray-600 text-sm">Email: {seller.email}</p>
                                <p className="text-gray-600 text-sm">Phone: {seller.phone}</p>
                            </div>

                            <h4 className="text-md font-semibold text-gray-700 mb-2">Products:</h4>
                            <div className="space-y-4">
                                {seller.products.map((prod, index) => (
                                    <div key={prod._id} className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                                        <p className="font-medium text-gray-800 mb-2">Product {index+1}</p>
                                        <div className="mb-5">
                                            <p className="text-gray-600 text-sm">
                                                Category: {" "}
                                                <span className="font-semibold text-gray-800">
                                                    {prod.category}
                                                </span>
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Description: {" "}
                                                <span className="font-semibold text-gray-800">
                                                    {prod.description}
                                                </span>
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Condition: {" "}
                                                <span className="font-semibold text-gray-800">
                                                    {prod.condition}
                                                </span>
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Designers: {" "}
                                                <span className="font-semibold text-gray-800">
                                                    {prod?.designer?.trim() ? prod.size : "Not mentioned"}
                                                </span>
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Size: {" "}
                                                <span className="font-semibold text-gray-800">
                                                    {prod?.size?.trim() ? prod.size : "Not mentioned"}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                MRP: {" "}
                                                <span className="font-semibold text-gray-800">
                                                    ₹{prod.mrp}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {prod.images.map((img) => (
                                                <img key={img._id} src={`${serverUrl}/sellerProductImages/${img.image}`} alt="" className="h-auto object-cover rounded-xl shadow-md mx-auto w-[250px]" />
                                            ))}
                                        </div>
                                        {Array.isArray(seller.agreementFile) && seller.agreementFile.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-gray-700 text-sm mb-1">Existing Agreements:</p>
                                                <ul className="space-y-1">
                                                    {seller.agreementFile.map((file, idx) => (
                                                        <li key={idx}>
                                                        <a href={`${serverUrl}${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm hover:text-blue-800" >
                                                            View PDF {idx + 1}
                                                        </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {prod.status === "approved" ? 
                                            (
                                                <button disabled className="mt-4 bg-green-600 px-3 py-2 text-white rounded-lg cursor-not-allowed border border-green-600" >
                                                    Approved
                                                </button>
                                            ) : (
                                                <button className="mt-4 bg-black px-3 py-2 text-white rounded-lg cursor-pointer hover:bg-white hover:text-black border border-black" onClick={() => handleApprove(prod._id)} >
                                                    {loading? <ClipLoader size={20} color='currentColor'/>: "Approve"}
                                                </button>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
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
    )
}

export default ViewForms
