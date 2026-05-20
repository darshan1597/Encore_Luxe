import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import img1 from "../assets/howItWorks/howItWorks1.png"
import img2 from "../assets/howItWorks/howItWorks2.png"
import img3 from "../assets/howItWorks/howItWorks3.png"
import img4 from "../assets/howItWorks/howItWorks4.png"
import img5 from "../assets/howItWorks/howItWorks5.png"

function HowItWorks() {
    return (
        <div className="min-h-screen bg-gray-50 w-full transition-opacity duration-1000">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>

            <div className="text-gray-800 px-6 py-10 md:px-16 lg:px-32 leading-relaxed mt-42">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        Welcome to Encore Luxe: Your Partner for Resale
                    </h1>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">The Next Life of Luxury: Sustainable, Authentic, Shared.</h2>
                    <p className="mb-6">
                        We're here to give your beloved luxury items a new life and ensure you get the best possible experience when reselling them. 
                    </p>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">1. Get Started: Submit Your Items</h2>
                    <p className="mb-6">
                        <strong>Tell Us About It:</strong> Begin by simply filling out our {" "} 
                        <a href="/sell-with-us" target="_blank" rel="noopener noreferrer" className="text-black underline hover:opacity-70" >
                            Sell With Us
                        </a>{" "}
                        form.
                    </p>

                    <p className="mb-6">
                        This is where you'll provide the necessary images, detailed descriptions, and condition of your items.
                    </p>

                    <div className="flex items-center justify-center">
                        <img src={img1} alt="" className="mt-3 mb-10 w-[400px]" />
                    </div>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                        2. Encore Luxe Review & Proposal
                    </h2>
                    
                    <p className="mb-4">
                        You are not just shopping; you are investing in a verified piece of history.
                    </p>

                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li>
                            <strong>Our Assessment:</strong> After you submit the form, our expert team will carefully review your product images, details, and descriptions.
                        </li>
                        <li>
                            <strong>Your Proposal:</strong> Once approved, we will send you the <strong>Seller Agreement</strong> which includes details with our <strong>pricing proposal</strong> for your items.
                        </li>
                    </ul>

                    <div className="flex items-center justify-center">
                        <img src={img2} alt="" className="mt-3 mb-10 w-[400px]" />
                    </div>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">3. Review, Agree, and Ship</h2>

                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li>
                            <strong>Your Approval:</strong> If you are happy with the pricing and terms, please sign and return the Seller Agreement via email at {" "}
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com" target="_blank" className="text-blue-600 hover:underline" >
                                encoreluxerevive@gmail.com
                            </a>{" "}
                            .
                        </li>
                        <li>
                            <strong>Item Submission:</strong> We’ll do free pickup for you (address mentioned in agreement).
                        </li>
                    </ul>

                    <div className="flex items-center justify-center">
                        <img src={img3} alt="" className="mt-3 mb-10 w-[400px]" />
                    </div>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">4. Listing and Display</h2>

                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li>
                            <strong>Go Live:</strong> Within <strong>two weeks</strong> of receiving your items, we will professionally photograph them and feature them either on the <strong>Encore Luxe website</strong> or at our <strong>display gallery</strong>.
                        </li>
                        <li>
                            <strong>Listing Duration:</strong> Your items will be listed for a minimum of <strong>3 months</strong> and a maximum of <strong>6 months</strong>.
                        </li>
                    </ul>

                    <div className="flex items-center justify-center">
                        <img src={img4} alt="" className="mt-3 mb-10 w-[400px]" />
                    </div>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">5. Sales & Payment</h2>

                    <ul className="list-disc ml-6 mb-6 space-y-2">
                        <li>
                            <strong>Get Paid: </strong>As soon as one of your items sells, our accounts team will contact you within 10 days to finalize the transaction and request your <strong>bank details</strong> for payment.
                        </li>
                    </ul>

                    <div className="flex items-center justify-center">
                        <img src={img5} alt="" className="mt-3 mb-10 w-[400px]" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default HowItWorks
