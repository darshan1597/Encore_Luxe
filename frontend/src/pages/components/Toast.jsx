import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded-md shadow-lg text-white text-sm animate-toast z-9999 ${type === "success" ? "bg-green-600" : "bg-red-600"} `} >
            {message}
        </div>
    );
};

export default Toast;
