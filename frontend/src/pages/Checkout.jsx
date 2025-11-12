import React, { useEffect, useState } from "react";
import { PiCreditCardThin } from "react-icons/pi";
import upiIcon from '../assets/upi/upiIcon.png';
import mastercardIcon from "../assets/upi/mastercardIcon.png";
import visaIcon from "../assets/upi/visaIcon.png";
import Navbar from "./components/Navbar";
import { serverUrl } from "../App";
import axios from "axios";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        country: "",
        address: "",
        apt: "",
        city: "",
        state: "",
        pin: "",
        phone: "",
        sameBilling: true,
        accept: false
    });
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [billingData, setBillingData] = useState({
        fullName: "",
        phone: "",
        address: "",
        apt: "",
        city: "",
        state: "",
        pin: "",
    });
    const [payment, setPayment] = useState("razorpay");
    const [address, setAddress] = useState("Same as shipping address");
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [showErrorPopup, setShowErrorPopup] = useState("");
    const navigate = useNavigate();
    const { userData: currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchSavedAddresses = async () => {
            if (!currentUser?._id) return;

            try {
                const res = await axios.get(`${serverUrl}/api/user/get-addresses/${currentUser._id}`);
                if (res.data.success && res.data.addresses) {
                    setSavedAddresses(res.data.addresses.slice(0, 3));
                }
            } catch (err) {
                console.error("Error fetching saved addresses:", err);
            }
        };

        fetchSavedAddresses();
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            setFormData((prev) => ({
                ...prev,
                email: currentUser.email || "",
                fullName: currentUser.fullName || "",
                address: currentUser?.address?.fullAddress || "",
                apt: currentUser?.address?.apt || "",
                city: currentUser?.address?.city || "",
                state: currentUser?.address?.state || "",
                pin: currentUser?.address?.pincode || "",
                phone: currentUser?.mobile || "",
            }));
        }
        if (currentUser?.addressList?.length) {
            setSavedAddresses(currentUser.addressList.slice(0, 3));
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && address === "Same as shipping address") {
            setBillingData({
                fullName: currentUser.fullName || "",
                phone: currentUser.mobile || "",
                address: currentUser.address || "",
                apt: currentUser.apt || "",
                city: currentUser.city || "",
                state: currentUser.state || "",
                pin: currentUser.pincode || "",
            });
        }
    }, [currentUser, address]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleApplyCoupon = async () => {
        if (!coupon.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        try {
            setCouponError("");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/coupon/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: coupon }),
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setDiscount(data.discountAmount || 0);
                alert("Coupon applied successfully!");
            } else {
                setDiscount(0);
                setCouponError(data.message || "Invalid coupon code");
            }
        } catch (error) {
            console.error(error);
            setCouponError("Something went wrong. Try again later.");
        }
    };

    const handlePayment = async () => {

        const requiredFields = [
            "email",
            "fullName",
            "address",
            "city",
            "state",
            "pin",
            "phone",
        ];

        for (let field of requiredFields) {
            if (!formData[field]?.trim()) {
                alert(`Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()} before proceeding.`);
                return;
            }
        }

        if (!formData.accept) {
            alert(`Please aceept our Return Policy before proceeding.`);
            return;
        }

        try {
            setLoading(true);

            const orderPayload = {
                userId: currentUser?._id || null,
                guestId: currentUser ? null : crypto.randomUUID(),
                items: cartItems.map(item => ({
                    productId: item.productId?._id || item.productId || item._id,
                    name: item.name,
                    price: item.discountedPrice || item.price,
                    quantity: item.quantity,
                })),
                totalAmount: total,
                paymentMethod: payment,
                [currentUser ? "shippingInfo" : "guestInfo"]: {
                    name: `${formData.fullName}`,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pin,
                },
                billingInfo: address === "Same as shipping address"
                ? {
                    sameAsShipping: true,
                    name: `${formData.fullName}`,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pin,
                }
                : {
                    sameAsShipping: false,
                    fullName: `${billingData.fullName}`,
                    phone: billingData.phone,
                    address: billingData.address,
                    city: billingData.city,
                    state: billingData.state,
                    pincode: billingData.pin,
                },
            };

            const apiRoute = currentUser ? `${serverUrl}/api/orders/create-order` : `${serverUrl}/api/guest-orders/create-guest-order`;

            const { data } = await axios.post(apiRoute, orderPayload);

            if (payment === "cod") {
                setLoading(false);

                if (!data.newOrder) {
                    const errorMsg = data.message || "Product out of stock. Please refresh your cart.";
                    setShowErrorPopup(errorMsg)
                    return;
                }
                localStorage.removeItem("cart");
                window.dispatchEvent(new Event("cartUpdated"));
                
                setShowErrorPopup("")
                setShowSuccessPopup(true);
                return;
            }

            setLoading(false);

            // Razorpay handling
            if (!data.success) {
                setLoading(false);
                alert(data.message || "Failed to create order, please try again.");
                return;
            }


            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: "INR",
                name: "Encore Luxe",
                description: "Order Payment",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        setLoading(true)

                        const verifyRoute = currentUser ? `${serverUrl}/api/orders/verify-payment` : `${serverUrl}/api/guest-orders/verify-guest-payment`;

                        const verifyRes = await axios.post(verifyRoute, {...response, userId: currentUser?._id || null,})

                        setLoading(false);

                        if (verifyRes.data.success) {
                            localStorage.removeItem("cart");
                            window.dispatchEvent(new Event("cartUpdated"));
                            setShowSuccessPopup(true);
                        } else {
                            setShowErrorPopup(verifyRes.data.message || "Product out of stock, refund initiated.")
                        }
                    } catch (error) {
                        setLoading(false);
                        const backendMsg = error?.response?.data?.message;
                        setShowErrorPopup(backendMsg || "Error verifying payment.")
                    }
                },
                prefill: {
                    name: `${formData.fullName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: { color: "#000000" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            const backendMsg = error?.response?.data?.message;
            setShowErrorPopup(backendMsg || "Something went wrong while starting payment.")
        }
    };

    const handleSaveAddress = async () => {
        if (!currentUser?._id) {
            alert("Please log in to save your address.");
            return;
        }

        const { address, apt, city, state, pin, country } = formData;

        if (!address || !city || !state || !pin) {
            alert("Please fill all required address fields before saving.");
            return;
        }

        const newAddress = {
            fullAddress: address.trim(),
            apt: apt.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pin.trim(),
            country: country.trim(),
        };

        if (!editingAddressId) {
            const isDuplicate = savedAddresses.some((addr) => {
                return (
                    addr.fullAddress?.toLowerCase().replace(/\s+/g, "") === newAddress.fullAddress.toLowerCase().replace(/\s+/g, "") &&
                    addr.city?.toLowerCase() === newAddress.city.toLowerCase() &&
                    addr.state?.toLowerCase() === newAddress.state.toLowerCase() &&
                    addr.pincode === newAddress.pincode
                );
            });

            if (isDuplicate) {
                alert("This address already exists in your saved addresses.");
                return;
            }

            if (savedAddresses.length >= 3) {
                alert("You can only save up to 3 addresses.");
                return;
            }
        }

        try {
            
            let res

            if (editingAddressId) {
                res = await axios.put( `${serverUrl}/api/user/update-address/${currentUser._id}/${editingAddressId}`, newAddress );
            }
            else {
                res = await axios.put( `${serverUrl}/api/user/save-address/${currentUser._id}`, newAddress );
            }

            if (res.data.success) {
                alert(editingAddressId ? "Address updated successfully!" : "Address saved successfully!");

                const refreshed = await axios.get(`${serverUrl}/api/user/get-addresses/${currentUser._id}`);
                if (refreshed.data.success) {
                    setSavedAddresses(refreshed.data.addresses.slice(0, 3));
                }
                setFormData({
                    ...formData,
                    address: "",
                    apt: "",
                    city: "",
                    state: "",
                    pin: "",
                    country: "India",
                });
                setEditingAddressId(null);
            } else {
                alert("Failed to save address. Try again.");
            }
        } catch (err) {
            console.error("Save address error:", err);
            alert("Something went wrong while saving address.");
        }
    };

    useEffect(() => {
        if (showSuccessPopup) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        window.location.href = "/";
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showSuccessPopup]);

    useEffect(() => {
        const loadCart = async () => {
            try {
                if (currentUser) {
                    const res = await axios.get(`${serverUrl}/api/cart/get-cart/${currentUser._id}`);
                    setCartItems(res.data?.cart?.items || []);
                    console.log(cartItems)
                } else {
                    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
                    setCartItems(storedCart);
                    console.log(storedCart)
                }
            } catch (err) {
                console.error("Failed to load cart:", err);
            }
        };

        loadCart();
        window.addEventListener("cartUpdated", loadCart);
        return () => window.removeEventListener("cartUpdated", loadCart);
    }, []);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + ((item?.discountedPrice > 0 ? item.discountedPrice : item?.mrp) * item.quantity),
        0
    );

    const total = Math.max(subtotal - discount, 0);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 150);
    }, []);
    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>
            <section className="relative flex flex-col justify-between z-10">
                <Navbar/>
            </section>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:pl-60 md:pl-0 sm:pl-0 mt-35 sm:mt-40 pb-20">
                <div className="max-w-10xl mx-auto flex flex-col-reverse lg:flex-row lg:gap-8 px-2 sm:px-6 lg:px-16">
                    {/* Left Side: Form */}
                    <div className="flex-1 bg-white p-6 max-w-[550px]">
                        <h2 className="text-xl font-semibold mb-4">Contact</h2>

                        <div className="flex gap-4">
                            <input type="text" name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />
                        </div>

                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />

                        <input type="tel" name="phone" placeholder="Phone *" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />

                        <h2 className="text-xl font-semibold mb-4">Delivery</h2>

                        {/* Saved Addresses Section */}
                        {savedAddresses.length > 0 && (
                            <div className="mb-4">
                                <p className="text-gray-700 font-medium mb-2">Choose a saved address:</p>
                                <div className="flex flex-col gap-3">
                                    {savedAddresses.map((addr, index) => (
                                        <div key={index}
                                            onClick={() => {
                                                setSelectedAddressIndex(index);
                                                setFormData({
                                                ...formData,
                                                address: addr.fullAddress || "",
                                                apt: addr.apt || "",
                                                city: addr.city || "",
                                                state: addr.state || "",
                                                pin: addr.pincode || "",
                                                country: addr.country || "India",
                                                });
                                            }}
                                            className={`cursor-pointer border rounded-md p-3 text-sm transition-all relative group ${ selectedAddressIndex === index ? "border-black bg-gray-100" : "border-gray-300" }`}
                                        >
                                            <p className="font-semibold">{addr.fullAddress}</p>
                                            <p>{addr.city}, {addr.state} - {addr.pincode}</p>

                                            {/* Edit & Delete Buttons */}
                                            <div className="top-2 right-2 flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm("Are you sure you want to delete this address?")) {
                                                            try {
                                                                const res = await axios.delete(
                                                                `${serverUrl}/api/user/delete-address/${currentUser._id}/${addr._id}`
                                                                );
                                                                if (res.data.success) {
                                                                alert("Address deleted successfully!");
                                                                setSavedAddresses((prev) =>
                                                                    prev.filter((_, i) => i !== index)
                                                                );
                                                                setSelectedAddressIndex(null);
                                                                } else {
                                                                alert("Failed to delete address.");
                                                                }
                                                            } catch (err) {
                                                                console.error("Delete address error:", err);
                                                                alert("Error deleting address.");
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Disable manual input when 3 addresses saved */}
                        {savedAddresses.length >= 3 ? (
                        <p className="text-sm text-gray-600 italic mb-4">
                            You've saved the maximum of 3 addresses. Please edit or delete one to add a new address.
                        </p>
                        ) : (
                        <>
                            <input type="text" name="country" placeholder="India *" value={formData.country} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />

                            <input type="text" name="address" placeholder="Address *" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />

                            <div className="flex gap-4">
                                <input type="text" name="apt" placeholder="Apartment, suite, etc. (optional)" value={formData.apt} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />
                                <input type="text" name="pin" placeholder="PIN code *" value={formData.pin} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />
                            </div>

                            <div className="flex gap-4 mb-4">
                                <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />
                                <input type="text" name="state" placeholder="State *" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4" />
                            </div>

                            {currentUser && (
                            <button onClick={handleSaveAddress} className="w-full bg-gray-800 text-white p-2 rounded-md mb-4 hover:bg-black transition cursor-pointer" >
                                Save Address
                            </button>
                            )}
                        </>
                        )}

                        <div className="overflow-hidden">
                            <h2 className="text-xl font-semibold mb-4 pt-4">Payment</h2>

                            {/* Razorpay Option */}
                            <div className={`transition-all duration-300 rounded-2xl ${ payment === "razorpay" ? "bg-gray-200" : "bg-white" }`} >
                                <label className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setPayment("razorpay")} >
                                    <div className="flex items-center gap-2">
                                        <input type="radio" name="payment" checked={payment === "razorpay"} onChange={() => setPayment("razorpay")} className="accent-black" />
                                        <span className="font-medium">
                                            Razorpay Secure (UPI, Cards, Credit Cards, Wallets)
                                        </span>
                                    </div>

                                    {/* Payment Icons */}
                                    <div className="flex items-center gap-2">
                                        <img src={upiIcon} alt="UPI" className="h-5" />
                                        <img src={visaIcon} alt="Visa" className="h-8 w-15" />
                                        <img src={mastercardIcon} alt="Mastercard" className="h-9 w-15" />
                                        <span className="text-gray-500 text-sm font-semibold">+18</span>
                                    </div>
                                </label>

                                {payment === "razorpay" && (
                                <div className="border-t border-gray-200 bg-gray-50 text-center py-5 px-4">
                                    <div className="flex justify-center">
                                        <PiCreditCardThin className="text-gray-700 text-9xl" />
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        After clicking "Pay now", you will be redirected to Razorpay
                                        Secure (UPI, Cards, Credit Cards, Wallets) to complete your
                                        purchase securely.
                                    </p>
                                </div>
                                )}
                            </div>

                            {/* Cash on Delivery Option */}
                            <div className={`border-t border-gray-200 transition-all duration-300 rounded-2xl ${ payment === "cod" ? "bg-gray-200" : "bg-white" }`} >
                                <label className="flex items-center gap-2 p-4 cursor-pointer" onClick={() => setPayment("cod")} >
                                    <input type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} className="accent-black" />
                                    <span className="font-medium">Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <h2 className="text-xl font-semibold mb-4 pt-4">Billing Address</h2>

                            {/* Same as shipping address */}
                            <div className={`border-t border-gray-200 transition-all duration-300 rounded-2xl ${ address === "Same as shipping address" ? "bg-gray-200" : "bg-white" }`} >
                                <label className="flex items-center gap-2 p-4 cursor-pointer" onClick={() => setAddress("Same as shipping address")} >
                                    <input type="radio" name="billing" checked={address === "Same as shipping address"} onChange={() => setAddress("Same as shipping address")} className="accent-black" />
                                    <span className="font-medium">Same as shipping address</span>
                                </label>
                            </div>

                            {/* Differenet */}
                            <div className={`transition-all duration-300 rounded-2xl ${ address === "Use a different billing address" ? "bg-gray-200" : "bg-white" }`} >
                                <label className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setAddress("Use a different billing address")} >
                                    <div className="flex items-center gap-2">
                                        <input type="radio" name="billing" checked={address === "Use a different billing address"} onChange={() => setAddress("Use a different billing address")} className="accent-black" />
                                        <span className="font-medium">
                                            Use a different billing address
                                        </span>
                                    </div>
                                </label>

                                {address === "Use a different billing address" && (
                                <div className="border-t border-gray-200 bg-gray-50 text-center py-5 px-4">
                                    
                                    <div className="flex gap-4 mb-4">
                                        <input type="text" name="fullName" placeholder="Full name *" value={billingData.fullName} onChange={handleBillingChange} className="flex-1 border border-gray-300 rounded-sm p-2 bg-white" />
                                    </div>

                                    <input type="tel" name="phone" placeholder="Phone (Optional)" value={billingData.phone} onChange={handleBillingChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4 bg-white" />

                                    <input type="text" name="address" placeholder="Address *" value={billingData.address} onChange={handleBillingChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4 bg-white" />

                                    <div className="flex gap-4 mb-4">
                                        <input type="text" name="apt" placeholder="Apartment, suite, etc. (optional)" value={billingData.apt} onChange={handleBillingChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4 bg-white" />
                                        <input type="text" name="pin" placeholder="PIN code *" value={billingData.pin} onChange={handleBillingChange} className="w-full border border-gray-300 rounded-sm p-2 mb-4 bg-white" />
                                    </div>

                                    <div className="flex gap-4 mb-4">
                                        <input type="text" name="city" placeholder="City *" value={billingData.city} onChange={handleBillingChange} className="flex-1 border border-gray-300 rounded-sm p-2 bg-white" />
                                        <input type="text" name="state" placeholder="City *" value={billingData.state} onChange={handleBillingChange} className="flex-1 border border-gray-300 rounded-sm p-2 bg-white" />
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center mb-6 mt-6">
                            <input type="checkbox" name="accept" id="accept" className="mr-2 accent-black" checked={formData.accept} onChange={(e) => setFormData({ ...formData, accept: e.target.checked })} required />
                            <label htmlFor="accept">By proceeding with payment, you accept our <span className="underline cursor-pointer" onClick={() => window.open("/terms-and-condition", "_blank")}>Return Policy.</span></label>
                        </div>

                        <button className="w-full bg-black text-white p-3 rounded-md cursor-pointer hover:bg-gray-900" >
                            {/* onClick={handlePayment} */}  {/* to be added inside button */}
                            
                            {payment === "razorpay" ? (
                                <>
                                Pay now <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                                </>
                            ) : (
                                "Place order"
                            )}
                        </button>
                    </div>

                    {/* Right Side: Fixed Summary */}
                    <div className="lg:w-2/5 w-full lg:mt-0 self-start">
                        <div className="p-6 bg-gray-100">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            {cartItems.length === 0 ? 
                                (
                                    <p className="text-gray-500">Your cart is empty.</p>
                                ):(
                                    cartItems.map((item) => (
                                        <>
                                            <div className="flex gap-4 mb-4">
                                                <img src={`${serverUrl}/productImages/${item.image}`} alt="Product" className="w-16 h-full object-cover bg-white cursor-pointer" />
                                                <div>
                                                    <p className="font-semibold capitalize">{item?.name}</p>
                                                    {item?.discountedPrice != 0 &&
                                                        <p className="text-sm text-gray-500">₹{item.discountedPrice || item.price}</p>
                                                    }
                                                    {item?.discountedPrice === 0 &&
                                                        <p className="text-sm text-gray-500">₹{item.mrp || item.mrp}</p>
                                                    }
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            
                                        </>
                                    ))
                                )
                            }
                            <div className="flex gap-2">
                                <input type="text" placeholder="Enter Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full border bg-white rounded-sm p-2 mb-4" />
                                <button className="bg-black p-2 mb-4 rounded-sm text-white px-5 font-bold cursor-pointer hover:bg-gray-800" onClick={handleApplyCoupon}>Apply</button>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold mb-4">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                        {couponError && (
                            <p className="text-red-500 text-sm mb-2">{couponError}</p>
                        )}
                    </div>
                </div>
            </div>
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center relative w-[350px]">
                        {/* Countdown in top-right */}
                        <span className="absolute top-3 right-4 text-gray-500 text-sm font-semibold">
                            {countdown}s
                        </span>

                        <h2 className="text-2xl font-semibold mb-2 text-green-600">Order Successful!</h2>
                        <p className="text-gray-700 text-sm">
                            Mail has been sent with your order receipt.
                        </p>
                    </div>
                </div>
            )}

            {showErrorPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center relative w-[450px]">

                        <h2 className="text-2xl font-semibold mb-2 text-red-600">Order Failed!</h2>
                        <p className="text-gray-700 text-sm">
                            {showErrorPopup}
                        </p>
                        <button className="mt-5 bg-black text-white px-2 py-1 rounded-lg cursor-pointer" onClick={()=>navigate("/")}>Home</button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black mx-auto mb-3"></div>
                        <p className="text-gray-700 font-medium">Processing your order, Please Wait...</p>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Checkout;
