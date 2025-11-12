import React from "react";
import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {
    const phoneNumber = "919274717330";
    const message = "Hello! I'd like to know more about your products.";

    const handleClick = () => {
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

  return (
        <button onClick={handleClick} className="fixed bottom-10 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all cursor-pointer z-9999" aria-label="Chat on WhatsApp" >
            <FaWhatsapp size={28} />
        </button>
    );
}

export default WhatsAppButton;
