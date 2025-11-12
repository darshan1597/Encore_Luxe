import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const { userData: currentUser } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        if (!currentUser?._id) return;

        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/orders/get-user-order/${currentUser?._id}`);
                console.log("User orders fetched:", res.data.orders);
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, [currentUser]);

    const statusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-600 bg-green-100";
            case "Shipped":
                return "text-blue-600 bg-blue-100";
            case "Processing":
                return "text-yellow-700 bg-yellow-100";
            case "Cancelled":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 w-full transition-opacity duration-1000`}>
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>

            <div className="min-h-screen py-8 px-4 md:px-8 mt-45">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-semibold mb-6 text-gray-800">My Orders</h1>

                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white shadow-sm rounded-lg border p-4 md:p-6" >
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 mb-4">
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-800">
                                            Order #{order.displayOrderNumber}
                                        </h2>
                                        <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right mt-2 md:mt-0">
                                        <p className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${statusColor(order.shiprocket_status || order.paymentStatus)}`} >
                                            {order.shiprocket_status}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.shiprocket_status === "Delivered" && order.deliveredAt && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Product List */}
                                <div className="space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 border-b last:border-none pb-3" >
                                            <img src={`${serverUrl}/productImages/${item.image}`} alt={item.image} className="w-20 h-20 object-cover rounded-md cursor-pointer" onClick={() => navigate(`/product/${item.itemId}`)} />
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-800">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Qty: {item.quantity}
                                                </p>
                                                {item.discountedPrice === 0 &&
                                                    <p className="text-sm text-gray-600">
                                                        Price: ₹{item.mrp}
                                                    </p>
                                                }
                                                {item.discountedPrice > 0 &&
                                                    <p className="text-sm text-gray-600">
                                                        Price: ₹{item.discountedPrice}
                                                    </p>
                                                }
                                                <p className="text-sm text-gray-600">
                                                    Payment Method: <span className="uppercase">{order.paymentMethod}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                        Total:{" "}
                                        <span className="font-medium text-gray-800">
                                            ₹{order.totalAmount}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}

                        {orders.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                You haven't placed any orders yet. <br />
                                <button className="py-3 px-8 bg-black text-white cursor-pointer mt-5 rounded-sm">Shop Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyOrders;