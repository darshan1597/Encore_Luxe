import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const ReturnRefundPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 w-full transition-opacity duration-1000">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>

            <div className="text-gray-800 px-6 py-10 md:px-16 lg:px-32 leading-relaxed mt-42">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        Return & Refund Policy
                    </h1>

                    <p className="mb-6">
                        Thank you for shopping with <strong>Encore Luxe</strong>. We value
                        your trust and satisfaction. This Return & Refund Policy explains
                        how we handle returns, and refunds for purchases made
                        through our website{" "}
                        <a href="https://encoreluxe.in" className="text-blue-600 hover:underline" >
                            encoreluxe.in
                        </a>
                        .
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">1. Eligibility for Returns</h2>
                        <p>
                            You may request a return within{" "}
                            <strong>3 days of delivery</strong> if:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>The product is unused, unwashed, and in its original condition.</li>
                            <li>The product has all original tags and packaging intact.</li>
                            <li>You received a wrong or damaged item.</li>
                        </ul>
                        <p className="mt-2">
                            Items that do not meet these conditions may not be eligible for return.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">2. Non-Returnable Items</h2>
                        <p>
                            Certain products cannot be returned due to hygiene or final sale
                            conditions, including:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Personal care items</li>
                            <li>Accessories and intimate wear</li>
                            <li>Customized or special-order products</li>
                            <li>Items marked “Final Sale” or “Non-Returnable”</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">3. Return Process</h2>
                        <p>
                            To initiate a return, please contact us at{" "}
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com" target="_blank" className="text-blue-600 hover:underline" >
                                encoreluxerevive@gmail.com
                            </a>{" "}
                            within 3 days of receiving your order. Our team will review your
                            request and guide you through the return steps.
                        </p>
                        <p className="mt-2">
                            Once approved, please ship the product back to us using a reliable
                            courier service. The return shipping cost is borne by the customer
                            unless the product is defective or incorrect.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">4. Refunds</h2>
                        <p>
                            After receiving and inspecting your returned product, we will
                            notify you about the approval or rejection of your refund.
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>
                                Approved refunds will be processed within{" "}
                                <strong>5–7 business days</strong>.
                            </li>
                            <li>
                                The refund will be credited to your original payment method
                                (via Razorpay, UPI, or card).
                            </li>
                            <li>
                                Shipping charges are non-refundable.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">5. Damaged or Wrong Items</h2>
                        <p>
                            If you receive a damaged or incorrect product, please contact us
                            immediately with supporting photos or videos. Once verified, we
                            will arrange a replacement or issue a full refund.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">6. Late or Missing Refunds</h2>
                        <p>
                            If you haven't received your refund within the expected timeline,
                            please check your bank account first. Then contact your payment
                            provider or bank, as processing times may vary. If the issue
                            persists, reach out to us at{" "}
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com" target="_blank" className="text-blue-600 hover:underline" >
                                encoreluxerevive@gmail.com
                            </a>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
                        <p>
                            For any questions or assistance regarding returns or refunds,
                            please contact our support team at: <br />
                            <strong>Email:</strong>{" "}
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com" target="_blank" className="text-blue-600 hover:underline" >
                                encoreluxerevive@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReturnRefundPolicy;
