import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import upiIcon from '../../assets/upi/upiIcon.png';
import mastercardIcon from "../../assets/upi/mastercardIcon.png";
import visaIcon from "../../assets/upi/visaIcon.png";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function CartSlider({ isCartOpen, setIsCartOpen }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const { userData: currentUser } = useSelector((state) => state.user);

    const syncCart = (updatedCart) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    useEffect(() => {
        const loadCart = async () => {
            if (currentUser?._id) {
                try {
                    const res = await axios.get(`${serverUrl}/api/cart/get-cart/${currentUser._id}`);
                    const data = await res.data;

                    const normalized = (data.cart?.items || []).map((item) => ({
                        _id: item.productId?._id || item._id,
                        name: item.productId?.name || item.name,
                        sku: item.sku,
                        discountedPrice:
                            item.productId?.discountedPrice || item.discountedPrice || item.price || 0,
                        mrp:
                            item.productId?.mrp || item.mrp,
                        image: item.productId?.images?.[0]?.name || item.image || "",
                        quantity: item.quantity || 1,
                    }));

                    setCartItems(normalized);
                } catch (error) {
                    console.error("Failed to load user cart:", error);
                }
            }
            else {
                const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
                setCartItems(storedCart);
            }
        };

        loadCart();

        const handleCartUpdate = async () => {
            await loadCart();
        };
        
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

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
        setIsCartOpen(false);
        window.dispatchEvent(new Event("cartUpdated"));
        setTimeout(() => {
            navigate('/checkout');
        }, 300);
    }

    const subtotal = cartItems.reduce(
        (sum, item) => sum + ((item?.discountedPrice > 0 ? item.discountedPrice : item?.mrp) * item.quantity),
        0
    );

    return (
        <div className={`fixed top-0 right-0 h-full md:w-[60%] w-full xl:w-[450px] bg-white z-9999 shadow-lg transform transition-transform duration-500 ease-in-out ${ isCartOpen ? "translate-x-0" : "translate-x-full" }`} >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold">
                    Your Cart{" "}
                    <span className="text-sm font-normal text-gray-500">
                        Items {cartItems.length}
                    </span>
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-black text-lg font-bold cursor-pointer" >
                    <IoMdClose className="text-2xl" />
                </button>
            </div>

            {/* Cart Items */}
            <div className="p-6 overflow-y-auto space-y-6 z-9999 lg:max-h-[50vh] max-h-[40vh]">
                {cartItems.length === 0 ? 
                    (
                        <>
                            <p className="text-center text-gray-500 mt-20">
                                Your cart is empty
                            </p>
                            <div className="flex items-center justify-center">
                                <button className="text-center text-white px-2 py-2 rounded-lg cursor-pointer bg-gray-700" onClick={() => {navigate(`/#explore`); setIsCartOpen(false)}}>
                                    Continue Shopping
                                </button>
                            </div>
                        </>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item._id} className="flex gap-4 items-start border-b pb-4">
                                <img src={`${serverUrl}/productImages/${item.image}`} alt={item.image} className="w-20 h-24 object-cover rounded-md cursor-pointer" onClick={() => {navigate(`/product/${item._id}`); setIsCartOpen(false)}} />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800 leading-tight capitalize">
                                        {item.name}
                                    </h3>
                                    {item?.discountedPrice != 0 &&
                                        <p className="text-gray-800 mt-1 font-semibold">MRP ₹{item.discountedPrice}</p>
                                    }
                                    {item?.discountedPrice === 0 &&
                                        <p className="text-gray-800 mt-1 font-semibold">MRP ₹{item.mrp}</p>
                                    }
                                </div>
                                <button className="text-gray-400 hover:text-red-500 mt-1" onClick={() => handleRemove(item._id)}>
                                    <IoMdClose />
                                </button>
                            </div>
                        ))
                    )
                }
            </div>

            {/* Footer Section */}
            {cartItems.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-6 space-y-4">
                    <div className="flex justify-between font-semibold text-gray-800">
                        <span>Subtotal</span>
                        <span>₹{loading? <ClipLoader size={12} color='currentColor'/>: <>{subtotal.toLocaleString()}</>}</span>
                    </div>

                    <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-white hover:border hover:border-black hover:text-black transition cursor-pointer border" onClick={handleCheckout} >
                        {loading? <ClipLoader size={18} color='currentColor'/>: "PROCEED TO  CHECKOUT" }
                    </button>

                    <button className="w-full border border-gray-400 py-3 rounded-md font-medium hover:bg-black hover:text-white transition cursor-pointer" onClick={()=>{setIsCartOpen(false); navigate("/cart");}}>
                        {loading? <ClipLoader size={20} color='currentColor'/>: "VIEW CART" }
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                        By clicking on checkout you are agreeing to{" "}
                        <a href="#" className="text-blue-700 hover:underline">Return Policy</a>.
                    </p>

                    {/* Payment Icons */}
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
                </div>
            )}
        </div>
    )
}

export default CartSlider
