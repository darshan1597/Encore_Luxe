import React from 'react'
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate()

    const phoneNumber = "919274717330";
    const message = "Hello! I'd like to know more about your Encore Luxe.";

    const handleContact = () => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <footer className="bg-[#1C1C1C] text-gray-200 py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Encore Luxe</h2>
                    <p className="text-gray-400">
                        Elevate your style with premium fashion collections. Trendy, classy, and always elegant.
                    </p>
                </div>
                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>Home</li>
                        <li className="hover:text-white cursor-pointer" onClick={() => navigate("/about-us")}>About</li>
                        <li className="hover:text-white cursor-pointer" onClick={handleContact}>Contact</li>
                    </ul>
                </div>
                {/* Customer Service */}
                <div>
                    <h3 className="font-semibold mb-4">Customer Service</h3>
                    <ul className="space-y-2">
                        <li className="hover:text-white cursor-pointer" onClick={() => window.open("/shipping-policy", "_blank")}>Shipping</li>
                        <li className="hover:text-white cursor-pointer" onClick={() => window.open("/returns-and-refund", "_blank")}>Returns and Refund</li>
                        <li className="hover:text-white cursor-pointer" onClick={() => window.open("/terms-and-condition", "_blank")}>Terms & Conditions</li>
                        <li className="hover:text-white cursor-pointer" onClick={() => window.open("/privacy-policy", "_blank")}>Privacy Policy</li>
                    </ul>
                </div>
                {/* Socials */}
                <div className="flex gap-4 text-2xl">
                    <FaFacebookF className="hover:text-white cursor-pointer"  />
                    <FaXTwitter className="hover:text-white cursor-pointer" />
                    <FaInstagram className="hover:text-white cursor-pointer" onClick={() => window.open("https://www.instagram.com/encore_luxe_/", "_blank")} />
                </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Encore Luxe. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
