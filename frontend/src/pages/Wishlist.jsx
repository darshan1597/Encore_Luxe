import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";
import { IoMdCart } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Wishlist() {
    const { userData: currentUser } = useSelector((state) => state.user);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser?._id) fetchWishlist();
    }, [currentUser]);

    const fetchWishlist = async () => {
        try {
        const res = await axios.get(`${serverUrl}/api/wishlist/${currentUser._id}`);
        setWishlist(res.data);
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-8">Your Wishlist</h1>
                {wishlist.length > 0 ? 
                    (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                            {wishlist.map((p) => {
                            const primaryImage = p.images?.find(img => img.isPrimary)?.name;
                            const imageUrl = `${serverUrl}/productImages/${primaryImage}`;
                            return (
                                <div key={p._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/product/${p._id}`)} >
                                <img src={imageUrl} alt={p.name} className="w-full h-64 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-800 text-sm">{p.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        ₹{p.discountedPrice}
                                    </p>
                                    <button className="flex items-center gap-2 mt-3 px-3 py-1.5 text-sm border rounded hover:bg-black hover:text-white transition cursor-pointer">
                                    <IoMdCart /> Add to Cart
                                    </button>
                                </div>
                                </div>
                            );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No items in your wishlist.</p>
                    )
                }
            </div>
        </div>
    );
}

export default Wishlist;
