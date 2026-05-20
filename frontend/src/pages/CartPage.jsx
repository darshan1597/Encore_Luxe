import React, { useEffect, useState } from "react";
import upiIcon from '../assets/upi/upiIcon.png';
import mastercardIcon from "../assets/upi/mastercardIcon.png";
import visaIcon from "../assets/upi/visaIcon.png";
import Navbar from "./components/Navbar";
import { serverUrl } from "../App";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners"
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [loaded, setLoaded] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const { userData: currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const loadCart = async () => {
            try {
                if (currentUser) {
                    const res = await axios.get(`${serverUrl}/api/cart/get-cart/${currentUser._id}`);
                    setCartItems(res.data?.cart?.items || []);
                } else {
                    const stored = JSON.parse(localStorage.getItem("cart")) || [];
                    setCartItems(stored);
                }
            } catch (error) {
                console.log("Error loading cart:", error)
            }
        };
        loadCart();
        window.addEventListener("cartUpdated", loadCart);
        return () => window.removeEventListener("cartUpdated", loadCart);
    }, []);

    const syncCart = async (updated) => {
        localStorage.setItem("cart", JSON.stringify(updated));
        setCartItems(updated);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const handleRemove = async (id) => {
        setLoading(true)
        if (currentUser?._id) {
            try {
                const item = cartItems.find(i => i._id === id || i.productId?._id === id);
                const productId = item?.productId?._id || item?._id;

                await axios.post(`${serverUrl}/api/cart/remove-from-cart`, {
                    userId: currentUser._id,
                    productId,
                });

                const res = await axios.get(`${serverUrl}/api/cart/get-cart/${currentUser._id}`);
                const normalized = (res.data.cart?.items || []).map((item) => ({
                    _id: item.productId?._id || item._id,
                    name: item.productId?.name || item.name,
                    discountedPrice:
                        item.productId?.discountedPrice || item.discountedPrice || item.price || 0,
                    image: item.productId?.images?.[0]?.name || item.image || "",
                    size: item.size || "N/A",
                    quantity: item.quantity || 1,
                }));
                setCartItems(normalized);
                window.dispatchEvent(new Event("cartUpdated"));
                setLoading(false)
            } catch (err) {
                console.error("Failed to remove item:", err);
                setLoading(false)
            }
        }
        else{
            const updated = cartItems.filter(item => item._id !== id);
            setCartItems(updated);
            syncCart(updated)
            setLoading(false)
        }
    };

    const handleCheckout = () => {
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => {
            navigate('/checkout');
        }, 300);
    }

    const subtotal = cartItems.reduce(
        (sum, item) => sum + ((item?.discountedPrice > 0 ? item.discountedPrice : item?.mrp) * item.quantity),
        0
    );

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>

            <section className="relative flex flex-col justify-between z-10">
                <Navbar/>
            </section>

            <div className="px-6 py-10 mt-45">
                <>
                    {/* CART SECTION */}
                    <div className="flex flex-col lg:flex-row justify-between gap-10">
                        {/* Left - Product */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold mb-6">Your Shopping Cart</h2>
                            {cartItems.length === 0 ? (
                                <div className="text-black text-2xl font-bold h-[100px] text-center flex items-center justify-center">
                                    <p>
                                        Your cart is empty
                                    </p>
                                </div>
                            ):(
                                cartItems.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row border-b pb-6 mb-6">
                                    <img src={`${serverUrl}/productImages/${item.image}`} alt={item?.name} className="w-40 h-56 object-cover rounded-lg cursor-pointer" onClick={() => navigate(`/product/${item?.productId?._id}`)} />
                                    <div className="sm:ml-6 mt-4 sm:mt-0">
                                        <h2 className="text-xl font-semibold mb-2 line-clamp-2 capitalize">{item?.name}</h2>
                                        {item?.discountedPrice != 0 &&
                                            <p className="text-gray-800 mt-1 font-semibold">MRP ₹{item.discountedPrice}</p>
                                        }
                                        {item?.discountedPrice === 0 &&
                                            <p className="text-gray-800 mt-1 font-semibold">MRP ₹{item.mrp}</p>
                                        }
                                        <div className="text-sm text-blue-600 flex gap-4">
                                            <button className="hover:underline cursor-pointer" onClick={() => handleRemove(item._id)}>Remove</button>
                                            <button className="hover:underline cursor-pointer">Add to Wishlist</button>
                                        </div>
                                    </div>
                                </div>
                                ))
                            )}
                        </div>

                        {/* Right - Order Summary */}
                        <div className="w-full lg:w-1/3 border rounded-lg p-6 shadow-md h-fit">
                            {cartItems.length === 0 ? 
                                (
                                    <div className="flex items-center justify-center">
                                        <button className="text-center text-white px-2 py-2 rounded-lg cursor-pointer bg-gray-700" onClick={() => navigate(`/#explore`)}>
                                            Continue Shopping
                                        </button>
                                    </div>
                                ):(
                                    <>
                                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                                        <div className="flex justify-between mb-2">
                                            <span>Subtotal</span>
                                            <span>₹{loading? <ClipLoader size={12} color='currentColor'/>: <>{subtotal.toLocaleString()}</>}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Shipping & Handling</span>
                                            <span className="text-green-600 font-medium">Free</span>
                                        </div>
                                        <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-lg">
                                            <span>Estimated total</span>
                                            <span>₹{loading? <ClipLoader size={12} color='currentColor'/>: <>{subtotal.toLocaleString()}</>}</span>
                                        </div>
                                        <button className="mt-8 w-full bg-black text-white py-3 rounded-md font-medium hover:bg-white hover:border hover:border-black hover:text-black transition cursor-pointer border" onClick={handleCheckout}>
                                            {loading? <ClipLoader size={18} color='currentColor'/>: "PROCEED TO  CHECKOUT" }
                                        </button>
                                        <p className="text-xs text-center mt-3 text-gray-600">
                                            By clicking on checkout you are agreeing to our{" "}
                                            <a href="#" className="text-blue-600 underline">
                                                Return Policy
                                            </a>.
                                        </p>
                                        <div className="flex flex-col gap-2 mt-3">
                                            <p className="text-xl text-black font-medium">We Accept</p>
                                            <div className="flex gap-3 text-3xl text-gray-700 justify-center">
                                                <img src={upiIcon} alt="UPI" className="h-6 w-10 mt-1" />
                                                <img src={visaIcon} alt="Visa" className="h-8 w-10" />
                                                <img src={mastercardIcon} alt="Mastercard" className="h-9 w-10" />
                                                <p className="text-sm h-6 w-14 font-bold">Cash On Delivery</p>
                                                <span className="text-gray-500 text-sm h-6 w-10 font-semibold mt-2">+18</span>
                                            </div>
                                        </div>
                                    </>
                                )
                            } 
                        </div>
                    </div>
                </>
            </div>
            <Footer />
        </div>
    );
}

export default CartPage;