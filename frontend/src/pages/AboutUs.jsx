import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50 w-full transition-opacity duration-1000">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>

            <div className="text-gray-800 px-6 py-10 md:px-16 lg:px-32 leading-relaxed mt-42">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        About Us
                    </h1>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">The Next Life of Luxury: Sustainable, Authentic, Shared.</h2>
                    <p className="mb-6">
                        At Encore Luxe, we believe true luxury is enduring, not disposable. 
                        We are a community-driven platform transforming the way people engage 
                        with high-end fashion—moving beyond fast consumption to embrace a cycle 
                        of conscious acquisition and elegant exchange. Our mission is simple yet 
                        powerful: redefining the secondary luxury market through <strong>authenticity, environmental responsibility, and timeless value.</strong> 
                    </p>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">💚 Our Core Mission</h2>
                    <p className="mb-6">
                        We created Encore Luxe to honor a vital promise: to merge luxury 
                        aspiration with the <strong>Go Green Initiative</strong>.
                    </p>

                    <p className="mb-6">
                        <strong>Sustainable Fashion:</strong> Every piece sold prevents manufacturing 
                        waste and reduces the fashion industry's carbon footprint. We are making 
                        luxury inherently more sustainable, one beautiful item at a time.
                    </p>

                    <p className="mb-6">
                        <strong>Back to Basics:</strong> We celebrate the heritage of luxury—the era 
                        when high-quality pieces were cherished and passed down. We foster a 
                        culture where <strong>sharing within the community is not a taboo</strong>, but a mark 
                        of smart, responsible stewardship.
                    </p>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                        For the Buyer: Conscious Acquisition
                    </h2>
                    
                    <p className="mb-4">
                        You are not just shopping; you are investing in a verified piece of history.
                    </p>

                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li>
                            <strong>Authenticity Guaranteed:</strong> Our rigorous, multi-point 
                            inspection ensures that every handbag, watch, and accessory is 100% genuine.
                        </li>
                        <li>
                            <strong>Affordable Access:</strong> Secure the world's most desired designer 
                            assets at accessible price points, making elite fashion attainable 
                            without compromise.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">For Sellers: Responsible Stewardship</h2>
                    <p className="mb-4">
                        You are becoming a powerful agent of change and value retention.
                    </p>

                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li>
                            <strong>Maximum Returns:</strong> Our optimized platform is built to deliver 
                            competitive commission and efficient liquidation, ensuring your luxury 
                            assets retain their maximum value.
                        </li>
                        <li>
                            <strong>Impact:</strong> By consigning with us, you contribute directly to 
                            a <strong>circular economy</strong>, ensuring your cherished items lead a second, 
                            meaningful life and reducing needless waste.
                        </li>
                    </ul>
                    
                    <p className="mt-6">
                        Encore Luxe is where timeless elegance finds its sustainable, second chapter.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AboutUs
