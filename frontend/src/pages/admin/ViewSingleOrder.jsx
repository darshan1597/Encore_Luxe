import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";

const ViewSingleOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [images, setImages] = useState("")
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        fetchOrder()
        setTimeout(() => setLoaded(true), 150);
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/guest-order/fetch-order/${id}`);
            setOrder(res.data.order);
            setStatus(res.data.orderStatus);
            fetchProduct(res.data.order.items);
        } catch (guestErr) {
            console.log("Guest order not found, trying user order...");

            try {
                const res = await axios.get(`${serverUrl}/api/user-order/fetch-user-order/${id}`);
                console.log("User order fetched");
                console.log(res.data.order)
                setOrder(res.data.order);
                setStatus(res.data.orderStatus);
                fetchProduct(res.data.order.items);
            } catch (userErr) {
                console.error("Order not found in guest or user", userErr);
            }
        }
    };

    const fetchProduct = async (items) => {
        try {
            const productDataMap = {};
            await Promise.all(
                items.map(async (item) => {
                    const productId = item.productId;
                    const res = await axios.get(`${serverUrl}/api/products/get-single-product/${productId}`);
                    const product = res.data.product;

                    productDataMap[productId] = {
                        image: product.images[0],
                        price: product.discountedPrice || product.price,
                        name: product.name
                    }
                })
            )
            setImages(productDataMap);
        } catch (error) {
            console.error("Error fetching product images:", error);
        }
        
    }

    const handleStatusUpdate = async () => {
        try {
            setUpdating(true);

            try {
                await axios.put(`${serverUrl}/api/guest-order/update-status/${id}`, { orderStatus: status });
                alert("Guest order status updated!");
            }
            catch (guestErr) {
                console.log("Guest update failed, trying user update...", guestErr);

                try {
                    await axios.put(`${serverUrl}/api/user-order/update-status/${id}`, { orderStatus: status});
                    alert("User order status updated!");
                } catch (userErr) {
                    console.error("Failed updating both guest & user:", userErr);
                    alert("Failed to update order status.");
                }
            }
        } finally {
            setUpdating(false);
        }
    }

    const handlePaymentStatusUpdate = async () => {
        try {
            setUpdating(true);

            try {
                await axios.put(`${serverUrl}/api/guest-order/update-payment-status/${id}`, { paymentStatus });
                alert("Guest order status updated!");
            } 
            catch (guestErr) {
                console.log("Guest update failed, trying user update...", guestErr);

                try {
                    await axios.put(`${serverUrl}/api/user-order/update-payment-status/${id}`, { paymentStatus});
                    alert("User order status updated!");
                } catch (userErr) {
                    console.error("Failed updating both guest & user:", userErr);
                    alert("Failed to update order status.");
                }
            }
        } finally {
            setUpdating(false);
        }
    }

    if (!order) return <p className="p-6 text-red-500">Order not found.</p>;

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="min-h-screen bg-gray-100 p-8 mt-48">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/view-orders")} />
                    <h3 className="text-2xl font-bold text-black">Order Management</h3>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT - Product Details */}
                    <div>
                    <h2 className="text-2xl font-semibold mb-4">Ordered Items</h2>
                    {order.items?.length > 0 ? (
                        <div className="space-y-4">
                        {order.items.map((item, index) => {
                            const productId = item.productId;
                            const productData = images[productId];
                            return (
                                <div key={index} className="flex gap-4 border-b pb-3">
                                    {productData ? 
                                        (
                                            <img  src={`${serverUrl}/productImages/${productData.image.name}`} alt={item?.name} className="w-28 h-28 object-cover rounded-md border" onClick={()=>navigate(`/admin/edit-product/${productId}`)} />
                                        ) : (
                                            <div className="w-28 h-28 bg-gray-200 rounded-md animate-pulse" />
                                        )
                                    }
                                    <div>
                                        <p className="font-semibold text-gray-800 capitalize">{item?.name}</p>
                                        <p className="text-gray-500">Qty: {item?.quantity}</p>
                                        <p className="text-gray-500"> ₹{item?.price} </p>
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No items found for this order.</p>
                    )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Order Information</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Order Number:</strong> {order?.displayOrderNumber}</p>
                            <p><strong>Name:</strong> {order?.guestInfo?.name || order?.shippingInfo?.name}</p>
                            <p><strong>Email:</strong> {order?.guestInfo?.email || order?.shippingInfo?.email}</p>
                            <p><strong>Phone:</strong> {order?.guestInfo?.phone || order?.shippingInfo?.phone}</p>
                            <p><strong>Address:</strong> {order?.guestInfo?.address || order?.shippingInfo?.address}, {order?.guestInfo?.city || order?.shippingInfo?.city}, {order?.guestInfo?.state || order?.shippingInfo?.state} - {order?.guestInfo?.pincode || order?.shippingInfo?.pincode}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                        </div>

                        <div className="mt-6">
                            <label className="block mb-2 font-medium">Update Order Status:</label>
                            <select value={order.orderStatus} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded w-full" >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <button onClick={handleStatusUpdate} disabled={updating} className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-50 cursor-pointer" >
                                {updating ? "Updating..." : "Save Order Status"}
                            </button>
                        </div>

                        {order?.paymentMethod.toLowerCase() === "cod" &&
                            <div className="mt-6">
                                <label className="block mb-2 font-medium mt-5">Update Payment Status:</label>
                                <select value={order?.paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="border p-2 rounded w-full" >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                </select>

                                <button onClick={handlePaymentStatusUpdate} disabled={updating} className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-50 cursor-pointer" >
                                    {updating ? "Updating..." : "Save Payment Status"}
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>    
    );
};

export default ViewSingleOrder;
