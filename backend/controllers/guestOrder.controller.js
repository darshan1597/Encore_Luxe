import GuestOrder from "../models/guestOrder.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import { sendOrderConfirmationEmail } from "../utils/mail.js";
import { reserveProductStock } from "../utils/productStock.js";
import { refundPayment } from "../utils/refundPayment.js";
import { createShiprocketOrder } from "../utils/shiprocket.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createGuestOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, guestInfo, billingInfo, guestId } = req.body;

        if (paymentMethod === "cod") {
            try {
                await reserveProductStock(items);
            } catch (err) {
                return res.status(400).json({ success: false, message: "Product out of stock. Please refresh your cart." });
            }

            const { padded, visible } = await generateOrderNumber();

            const newOrder = await GuestOrder.create({
                guestId,
                items,
                totalAmount,
                paymentMethod,
                guestInfo,
                billingInfo,
                paymentStatus: "pending",
                orderNumber: padded,
                displayOrderNumber: visible,
                orderStatus: "processing",
            });

            const updatedOrder = await GuestOrder.findById(newOrder._id);

            try {
                const shiprocketData = {
                    order_id: updatedOrder._id.toString(),
                    order_date: new Date().toISOString(),
                    pickup_location: "Home",
                    billing_customer_name: updatedOrder.billingInfo.name,
                    billing_last_name: "",
                    billing_address: updatedOrder.billingInfo.address,
                    billing_city: updatedOrder.billingInfo.city,
                    billing_pincode: updatedOrder.billingInfo.pincode,
                    billing_state: updatedOrder.billingInfo.state,
                    billing_country: "India",
                    billing_email: updatedOrder.billingInfo.email,
                    billing_phone: updatedOrder.billingInfo.phone,
                    shipping_is_billing: true,
                    order_items: updatedOrder.items.map((item) => ({
                        name: item.name,
                        sku: item.productId.toString(),
                        units: item.quantity,
                        selling_price: item.price,
                    })),
                    payment_method: "COD",
                    sub_total: updatedOrder.totalAmount,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    weight: 1,
                }

                const shiprocketRes = await createShiprocketOrder(shiprocketData);

                updatedOrder.shiprocket_order_id = shiprocketRes.order_id;
                updatedOrder.shiprocket_shipment_id = shiprocketRes.shipment_id;
                updatedOrder.shiprocket_status = shiprocketRes.status || "created";

                await updatedOrder.save();
                
                await sendOrderConfirmationEmail(updatedOrder.guestInfo.email, updatedOrder);

            } catch (error) {
                updatedOrder.shiprocket_status = "pending";
                await updatedOrder.save();
                await sendOrderConfirmationEmail(updatedOrder.guestInfo.email, updatedOrder);
            }

            return res.json({ newOrder });
        }

        if (paymentMethod === "razorpay") {
            const newOrder = await GuestOrder.create({
                guestId,
                items,
                totalAmount,
                paymentMethod,
                guestInfo,
                billingInfo,
                paymentStatus: "initiated",
            });

            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: newOrder._id.toString(),
            });

            newOrder.razorpayOrderId = razorpayOrder.id;
            await newOrder.save();

            return res.json({
                success: true,
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: `Error Creating Guest order: ${error}` });
    }
};

export const verifyGuestPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const order = await GuestOrder.findOne({ razorpayOrderId: razorpay_order_id });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        let stockReserved = false;

        try {
            await reserveProductStock(order.items);
            stockReserved = true
        } catch (err) {
            stockReserved = false;
        }

        const { padded, visible } = await generateOrderNumber();
        
        order.paymentStatus = "paid";
        order.razorpayPaymentId = razorpay_payment_id;
        order.orderNumber = padded;
        order.displayOrderNumber = visible;

        if (stockReserved) {
            order.orderStatus = "processing";
            await order.save();

            try {
                const shiprocketData = {
                    order_id: order._id.toString(),
                    order_date: new Date().toISOString(),
                    pickup_location: "Home",
                    billing_customer_name: order.billingInfo.name,
                    billing_last_name: "",
                    billing_address: order.billingInfo.address,
                    billing_city: order.billingInfo.city,
                    billing_pincode: order.billingInfo.pincode,
                    billing_state: order.billingInfo.state,
                    billing_country: "India",
                    billing_email: order.billingInfo.email,
                    billing_phone: order.billingInfo.phone,
                    shipping_is_billing: true,
                    order_items: order.items.map(item => ({
                        name: item.name,
                        sku: item.productId.toString(),
                        units: item.quantity,
                        selling_price: item.price,
                    })),
                    payment_method: "Prepaid",
                    sub_total: order.totalAmount,
                    length: 10,
                    breadth: 10,
                    height: 10,
                    weight: 1,
                };

                const shiprocketRes = await createShiprocketOrder(shiprocketData);

                order.shiprocket_order_id = shiprocketRes.order_id;
                order.shiprocket_shipment_id = shiprocketRes.shipment_id;
                order.shiprocket_status = shiprocketRes.status || "created";

                await order.save();

                await sendOrderConfirmationEmail(order.guestInfo.email, order);
            } catch (error) {
                order.shiprocket_status = "pending";
                await order.save();
            }

            return res.json({ success: true, message: "Payment verified, order processing", order });
        } else {
            order.orderStatus = "failed";
            await order.save();

            await refundPayment(order._id, order.razorpayPaymentId, order.totalAmount);

            return res.json({
                success: false,
                message: "Payment received but product is out of stock. Refund initiated.",
                order
            });
        }
    } catch (error) {
        return res.status(500).json({ message: `Guest Payment Verification Error: ${error}` });
    }
};

export const getAllGuestOrders = async (req, res) => {
    try {
        const orders = await GuestOrder.find().sort({ createdAt: -1 });
        return res.json({ orders });
    } catch (error) {
        return res.status(500).json({ message: `Error getting Guest Orders: ${error}` });
    }
};
