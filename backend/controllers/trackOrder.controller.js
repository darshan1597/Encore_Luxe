import express from "express";
import axios from "axios";
import { getShiprocketToken } from "../utils/shiprocket.js";

const router = express.Router();

export const trackOrder = async (req, res) => {
    const { awb } = req.query;

    if (!awb) {
        return res.status(400).json({ message: "AWB number is required" });
    }

    try {
        const token = await getShiprocketToken();

        const { data } = await axios.get(
            `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const shipment = data?.tracking_data;

        if (!shipment) {
            return res.status(404).json({ message: "Tracking info not found" });
        }

        // Format clean JSON
        const response = {
            awb,
            status: shipment.shipment_status,
            current_location: shipment.current_status_location,
            history:
                shipment.scan_details?.map((e) => ({
                date: e.date,
                activity: e.activity,
                location: e.location
                })) || []
        };

        return res.json(response);
    } catch (error) {
        console.error("Tracking error:", error.response?.data || error.message);
        return res.status(500).json({
        message: "Failed to fetch tracking details"
        });
    }
};
