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

                    <p className="mb-6">
                        At Encore Luxe, we honor a legacy that predates written history. Our garments are not merely woven; they are the result of an unbroken, three-thousand-year-old dialogue between the artisan, the loom, and the land. In a world of fast fashion, we champion Slow Luxury—where every thread holds the memory of a master's hands, a regional art form, and the commitment to a beautiful, sustainable future.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AboutUs
