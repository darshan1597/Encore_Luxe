import axios from "axios";

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

export const getShiprocketToken = async () => {
    try {
        const { data } = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD,
        });
        return data.token;
    } catch (error) {
        console.error("Error getting Shiprocket token:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with Shiprocket");
    }
};

export const createShiprocketOrder = async (orderData) => {
    try {
        const token = await getShiprocketToken();

        const { data } = await axios.post(
            "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return data;
    } catch (error) {
        console.error("Error creating Shiprocket order:", error.response?.data || error.message);
        throw new Error("Failed to create Shiprocket shipment");
    }
};

export const generateAWB = async (shipment_id) => {
    const token = await getShiprocketToken();

    const { data } = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
        { shipment_id },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
};