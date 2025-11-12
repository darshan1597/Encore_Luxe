import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const TermsAndConditions = () => {
  return (
        <div className={`min-h-screen bg-gray-50 w-full transition-opacity duration-1000`}>
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>
            <div className="text-gray-800 px-6 py-10 md:px-16 lg:px-32 leading-relaxed mt-42">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                        Terms and Conditions
                    </h1>

                    <p className="mb-6">
                        Welcome to <strong>Encore Luxe</strong>. These Terms and Conditions
                        (“Terms”) govern your use of our website{" "}
                        <a href="https://encoreluxe.com" className="text-blue-600 hover:underline" >
                            encoreluxe.in
                        </a>{" "}
                        and related services, including purchasing products from our store. By
                        using our website, you agree to comply with and be bound by these
                        Terms.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">1. General Information</h2>
                        <p>
                            This website is owned and operated by <strong>Encore Luxe</strong>
                            (“we”, “us”, or “our”). We reserve the right to update or modify
                            these Terms at any time without prior notice. Continued use of the
                            site constitutes your acceptance of any such changes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
                        <p>
                            By using this site, you confirm that you are at least 18 years old
                            or accessing it under the supervision of a parent or guardian and
                            that you are legally capable of entering into a binding contract.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">3. Account Registration</h2>
                        <p>
                            You may need to create an account to access certain features. You
                            agree to provide accurate information, maintain confidentiality of
                            your credentials, and notify us of any unauthorized access. We are
                            not liable for any loss resulting from unauthorized account use.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">4. Product Information</h2>
                        <p>
                            We strive for accuracy in product details, images, and pricing.
                            However, we reserve the right to correct errors, change
                            specifications, or cancel orders if information is found to be
                            inaccurate.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">5. Pricing & Payment</h2>
                        <p>
                            All prices are listed in INR and include applicable taxes unless
                            stated otherwise. We accept secure online payments through Razorpay, including UPI and major credit/debit cards. We may cancel any order if payment verification
                            fails.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">
                            6. Shipping & Delivery
                        </h2>
                        <p>
                            Delivery times are estimates and may vary. We are not responsible
                            for delays caused by courier services, customs, or unforeseen
                            circumstances. Ownership transfers to you once your order is
                            shipped.
                        </p>
                        <p className="mt-2">
                            For more details, please refer to our{" "}
                            <a href="/shipping-policy" className="text-blue-600 hover:underline">
                                Shipping Policy
                            </a>
                            .
                        </p>
                    </section>

                    <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">7. Returns & Refunds</h2>
                        <p>
                            You may request a return or exchange within 3 days of delivery if
                            the product is unused and in its original condition. Refunds will be
                            processed using the original payment method within 5–7 business
                            days. Please see our{" "}
                            <a href="/refund-policy" className="text-blue-600 hover:underline" >
                            Return and Refund Policy
                            </a>{" "}
                            for more details.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">
                            8. Intellectual Property
                        </h2>
                        <p>
                            All content on this website, including text, images, graphics, logos,
                            and software, is the property of Encore Luxe and protected under
                            copyright and trademark laws. Unauthorized use is prohibited.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">9. Prohibited Uses</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Using the site for unlawful purposes.</li>
                            <li>Attempting to hack or disrupt the site.</li>
                            <li>Uploading viruses or malicious code.</li>
                            <li>Engaging in fraudulent or deceptive practices.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">
                            10. Limitation of Liability
                        </h2>
                        <p>
                            We are not liable for any direct or indirect damages resulting from
                            the use or inability to use our services, unauthorized data access,
                            or any errors on the website. Our total liability shall not exceed
                            the amount paid for the product purchased.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">11. Third-Party Links</h2>
                        <p>
                            Our website may include links to third-party websites. We are not
                            responsible for their content, privacy policies, or practices. Use
                            them at your own risk.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">12. Privacy Policy</h2>
                        <p>
                            Your use of this website is also governed by our{" "}
                            <a href="/privacy-policy" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </a>
                            , which explains how we collect, use, and protect your information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">13. Governing Law</h2>
                        <p>
                            These Terms are governed by the laws of India. Any disputes shall be
                            subject to the exclusive jurisdiction of the courts
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">14. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, contact us at: <br />
                            <strong>Email:</strong>{" "}
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com" target="_blank" className="text-blue-600 hover:underline" > encoreluxerevive@gmail.com</a>
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TermsAndConditions