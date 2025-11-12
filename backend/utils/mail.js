import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export const sentOtp = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "Reset Your Password",
        html: `<p>Your OTP for resetting password is <b>${otp}</b>. It expires in 5 minutes</p>
            <p>If you didn't request this, you can safely ignore this email.</p>`
    })
}

export const sendOrderConfirmationEmail = async (to, order) => {
    const html = `
        <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:30px;">
            <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
                <div style="background:#000; color:#fff; padding:20px; text-align:center;">
                    <h2 style="margin:0;">Thank you for your order!</h2>
                    <p style="margin:5px 0 0;">Order #${order.displayOrderNumber}</p>
                </div>

                <div style="padding:20px;">
                    <p>Hi <strong style="text-transform: capitalize">${order.guestInfo?.fullName || order.shippingInfo?.fullName || "Customer"}</strong>,</p>
                    <p>We’ve received your order and are getting it ready to be shipped. We’ll notify you when it has been sent.</p>
                    
                    <h3 style="margin-top:30px;">Order Details</h3>
                    <table width="100%" cellspacing="0" cellpadding="10" style="border-collapse:collapse;">
                        ${order.items.map(item => `
                            <tr style="border-bottom:1px solid #ddd; text-transform: capitalize">
                                <td>
                                    <strong>${item.name}</strong><br/>
                                    Price: ₹${item.price} <br/>
                                    Qty: ${item.quantity} <br/>
                                </td>
                            </tr>`).join('')
                        }
                    </table>

                    <h3 style="margin-top:30px;">Order Summary</h3>
                    <p><strong>Subtotal:</strong> ₹${order.totalAmount.toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod === "razorpay" ? "Online Payment (Razorpay)" : "Cash on Delivery"}</p>
                    <p><strong>Shipping Address:</strong><br/>
                        <span style="text-transform: capitalize">
                            ${(order.guestInfo?.address || order.shippingInfo?.address) || ""}, 
                            ${(order.guestInfo?.city || order.shippingInfo?.city) || ""}, 
                            ${(order.guestInfo?.state || order.shippingInfo?.state) || ""} -
                            ${(order.guestInfo?.pincode || order.shippingInfo?.pincode) || ""}
                        </span>
                    </p>

                    <div style="margin-top:30px; text-align:center;">
                        <a href="${process.env.CLIENT_URL}/track-order/${order.displayOrderNumber}" style="background:#000; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px;">
                            Track Your Order
                        </a>
                    </div>

                    <p style="font-size:13px; color:#555; margin-top:30px; text-align:center;">
                        Thank you for shopping with <strong>Encore Luxe</strong>.<br/>
                        For any questions, contact us at <a href="mailto:support@encoreluxe.com">support@encoreluxe.com</a>.
                    </p>
                </div>

                <div style="background:#111; color:#ccc; text-align:center; padding:10px; font-size:12px;">
                    © ${new Date().getFullYear()} Encore Luxe. All rights reserved.
                </div>
            </div>
        </div>
    `;

    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: `Your Encore Luxe Order #${order.displayOrderNumber} Confirmation`,
        html,
    });
};