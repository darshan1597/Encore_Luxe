import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 w-full transition-opacity duration-1000">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>

            <div className="text-gray-800 px-6 py-10 md:px-16 lg:px-32 leading-relaxed mt-42">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        Privacy Policy
                    </h1>

                    <p className="mb-6">
                        Welcome to <strong>Encore Luxe</strong> (“we”, “our”, “us”). Your
                        privacy is important to us. This Privacy Policy explains how we
                        collect, use, and protect your personal information when you visit
                        our website{" "}
                        <a href="https://encoreluxe.in" className="text-blue-600 hover:underline" >
                            encoreluxe.in
                        </a>{" "}
                        or make a purchase from our store.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                        <p>
                            We may collect personal information when you interact with our
                            site, including:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Name, email address, phone number, and shipping address.</li>
                            <li>Payment details (processed securely via Razorpay or UPI).</li>
                            <li>
                                Technical data such as IP address, browser type, and device
                                information.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Process and deliver your orders.</li>
                            <li>Communicate with you about orders, offers, or updates.</li>
                            <li>Improve our website, services, and user experience.</li>
                            <li>Ensure payment security and prevent fraud.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">3. Payment Information</h2>
                        <p>
                            All online payments are processed securely through{" "}
                            <strong>Razorpay</strong>. We do not store your card or UPI
                            details on our servers. Razorpay may collect certain transaction
                            data to verify payments and ensure security. For details, please
                            refer to{" "}
                            <a href="https://razorpay.com/privacy/" target="_blank" className="text-blue-600 hover:underline"                            >
                                Razorpay's Privacy Policy
                            </a>
                            .
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
                        <p>
                            We do not sell, rent, or trade your personal information. We may
                            share data only with:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Trusted logistics and courier partners for delivery.</li>
                            <li>Payment gateways for secure transactions.</li>
                            <li>Legal authorities if required by law.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
                        <p>
                            We use cookies to enhance your browsing experience. You can
                            disable cookies in your browser settings, but some parts of the
                            site may not function properly without them.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
                        <p>
                            We use SSL encryption and other security measures to protect your
                            personal data. However, no online transmission is completely
                            secure, and we cannot guarantee absolute safety.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal
                            data. For any requests, please contact us at{" "}
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com" target="_blank" className="text-blue-600 hover:underline" >
                                encoreluxerevive@gmail.com
                            </a>
                            .
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes
                            will be posted on this page with the updated date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact
                            us at: <br />
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

export default PrivacyPolicy;
