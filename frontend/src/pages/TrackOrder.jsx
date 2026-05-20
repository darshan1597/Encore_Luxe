import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

const TrackOrder = () => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [tracking, setTracking] = useState(null);
    const [error, setError] = useState("");

    const handleTrack = async () => {
        if (!input.trim()) {
            setError("Please Enter the AWB / Order ID.");
            return;
        }

        setLoading(true);
        setError("");
        setTracking(null);

        try {
            const res = await axios.get(`/api/track?awb=${input}`);
            setTracking(res.data);
        } catch (err) {
            setError("Tracking not found. Check the AWB / Order ID.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full transition-opacity duration-1000">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>

            <div className="text-gray-800 px-6 py-10 md:px-16 lg:px-32 leading-relaxed mt-42">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Track Your Order</h1>

                    {/* Input Box */}
                    <div className="flex gap-2">
                        <input type="text" placeholder="Enter AWB Number or Order ID" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" />
                        <button onClick={handleTrack} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer" >
                            Track
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <p className="text-center mt-4 text-blue-600 font-medium">
                            Fetching tracking details...
                        </p>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-center mt-4 text-red-600 font-medium">{error}</p>
                    )}

                    {/* Tracking Details */}
                    {tracking && (
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                            <h2 className="text-xl font-semibold mb-2">Tracking Details</h2>

                            <p><strong>Status:</strong> {tracking.status}</p>
                            <p><strong>Current Location:</strong> {tracking.current_location}</p>
                            <p><strong>AWB:</strong> {tracking.awb}</p>

                            <h3 className="font-semibold mt-4">Tracking History:</h3>
                            <ul className="mt-2 space-y-2">
                                {tracking?.history?.map((event, i) => (
                                    <li key={i} className="p-2 border rounded bg-white">
                                    <p><strong>Date:</strong> {event.date}</p>
                                    <p><strong>Activity:</strong> {event.activity}</p>
                                    <p><strong>Location:</strong> {event.location}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}

export default TrackOrder;