import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { MdKeyboardBackspace } from "react-icons/md";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";

const ViewOrders = () => {
    const [activeTab, setActiveTab] = useState("user");
    const [userOrders, setUserOrders] = useState([]);
    const [guestOrders, setGuestOrders] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchOrders();
        setTimeout(() => setLoaded(true), 150);
    }, [activeTab]);

    const fetchOrders = async () => {
        try {
            const endpoint =
                activeTab === "user"
                    ? `${serverUrl}/api/orders/get-all-orders`
                    : `${serverUrl}/api/guest-orders/get-all-guest-orders`;
            const res = await axios.get(endpoint);

            if (activeTab === "user") {
                setUserOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
            } else {
                setGuestOrders(Array.isArray(res.data.orders) ? res.data.orders : res.data || []);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const rawOrders = activeTab === "user" ? userOrders : guestOrders;

    const ordersToShow = rawOrders.filter((order) => {
        const query = searchQuery.toLowerCase();

        return (
            order._id?.toLowerCase().includes(query) ||
            order.paymentMethod?.toLowerCase().includes(query) ||
            order.paymentStatus?.toLowerCase().includes(query) ||
            order.orderStatus?.toLowerCase().includes(query) ||
            order.guestInfo?.name?.toLowerCase().includes(query) ||
            order.shippingInfo?.name?.toLowerCase().includes(query) ||
            order.guestInfo?.email?.toLowerCase().includes(query) ||
            order.shippingInfo?.email?.toLowerCase().includes(query)
        );
    });

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${ loaded ? "opacity-100" : "opacity-0" }`} >
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>
            <div className="p-8 bg-white min-h-screen mt-40">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">View Orders</h3>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button className={`px-4 py-2 rounded-md font-medium cursor-pointer ${ activeTab === "user" ? "bg-black text-white" : "bg-white text-gray-700 border" }`} onClick={() => setActiveTab("user")} >
                        User Orders
                    </button>
                    <button className={`px-4 py-2 rounded-md font-medium cursor-pointer ${ activeTab === "guest" ? "bg-black text-white" : "bg-white text-gray-700 border" }`} onClick={() => setActiveTab("guest")} >
                        Guest Orders
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                    />
                </div>

                {/* Orders Table */}
                {ordersToShow.length === 0 ? (
                    <p className="text-gray-500">No orders found.</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-3 border">Si. No</th>
                                    <th className="p-3 border">Order Id</th>
                                    <th className="p-3 border">Customer</th>
                                    <th className="p-3 border">Email</th>
                                    <th className="p-3 border">Amount</th>
                                    <th className="p-3 border">Payment</th>
                                    <th className="p-3 border">Payment Status</th>
                                    <th className="p-3 border">Order Status</th>
                                    <th className="p-3 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersToShow.map((order, i) => (
                                    <tr key={order._id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 border">{i + 1}</td>
                                        <td className="p-3 border">
                                            {order._id}
                                        </td>
                                        <td className="p-3 border capitalize">
                                            {order.guestInfo?.name || order.shippingInfo?.name}
                                        </td>
                                        <td className="p-3 border">{order.guestInfo?.email || order.shippingInfo?.email}</td>
                                        <td className="p-3 border">₹{order.totalAmount}</td>
                                        <td className="p-3 border capitalize">
                                            {order.paymentMethod}
                                        </td>
                                        <td className={`p-3 border font-medium ${ order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600" }`} >
                                            {order.paymentStatus}
                                        </td>
                                        <td className="p-3 border capitalize">
                                            {order.orderStatus}
                                        </td>
                                        <td className="p-3 border">
                                            <button type="button" className="bg-black px-3 py-1 cursor-pointer text-white rounded-lg"  onClick={()=>navigate(`/admin/view-order/${order._id}`)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewOrders;
