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

    const handleAddToCart = async (product) => {
        const newItem = {
            _id: product._id,
            name: product.name,
            sku: product.sku,
            discountedPrice: product.discountedPrice,
            mrp: product.mrp,
            image: `${product.images?.[0]?.name}`,
            quantity: 1,
        };

        if (!currentUser) {
            const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

            const existingItem = existingCart.find((item) => item._id === newItem._id);
            if (existingItem) {
                existingItem.quantity += 0;
            } else {
                existingCart.push(newItem);
            }

            localStorage.setItem("cart", JSON.stringify(existingCart));
            window.dispatchEvent(new Event("cartUpdated"));
            window.dispatchEvent(new Event("openCart"));

            return
        } 

        try {
            await axios.post(`${serverUrl}/api/cart/add-to-cart`, {
                userId: currentUser?._id,
                productId: product?._id,
                quantity: 1,
            });

            window.dispatchEvent(new Event("cartUpdated"));

            window.dispatchEvent(new Event("openCart"));
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>
            <div className="max-w-7xl mx-auto px-6 py-10 mt-42">
                <h1 className="text-2xl font-bold mb-8">Your Wishlist</h1>
                {wishlist.length > 0 ? 
                    (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                            {wishlist.map((p) => {
                            const primaryImage = p.images?.find(img => img.isPrimary)?.name;
                            const imageUrl = `${serverUrl}/productImages/${primaryImage}`;
                            return (
                                <div key={p._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer" >
                                <img src={imageUrl} alt={p.name} className="w-full h-64 object-cover" onClick={() => navigate(`/product/${p._id}`)} />
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-800 text-sm">{p.name}</h3>
                                    {p?.discountedPrice != 0 && 
                                        <>
                                            <p className="text-gray-700 font-medium">₹{p?.discountedPrice}</p>
                                            <p className="text-red-700 font-medium line-through">₹{p?.mrp}</p>
                                        </>
                                    }
                                    {p?.discountedPrice === 0 && 
                                        <>
                                            <p className="text-gray-700 font-medium">₹{p.mrp}</p>
                                        </>
                                    }
                                    <button className="flex items-center gap-2 mt-3 px-3 py-1.5 text-sm border rounded hover:bg-black hover:text-white transition cursor-pointer" onClick={() => handleAddToCart(p)}>
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
