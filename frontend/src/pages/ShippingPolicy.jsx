import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full transition-opacity duration-1000">
      <section className="relative flex flex-col justify-between z-10">
        <Navbar />
      </section>

      <div className="text-gray-800 px-6 py-10 md:px-16 lg:px-32 leading-relaxed mt-42">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Shipping Policy
          </h1>

          <p className="mb-6">
            Thank you for shopping with <strong>Encore Luxe</strong>. This
            Shipping Policy outlines how we process, handle, and deliver orders
            placed through our website{" "}
            <a
              href="https://encoreluxe.in"
              className="text-blue-600 hover:underline"
            >
              encoreluxe.in
            </a>
            .
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">1. Order Processing</h2>
            <p>
              Orders are typically processed within{" "}
              <strong>1–2 business days</strong> after confirmation. Orders
              placed on weekends or public holidays will be processed on the
              next working day.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">2. Shipping Time</h2>
            <p>
              Once processed, your order will be shipped and delivered within{" "}
              <strong>3–7 business days</strong>, depending on your location and
              courier service availability.
            </p>
            <p className="mt-2">
              Delivery times may vary during festive seasons or due to
              unforeseen delays by courier partners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Shipping Charges</h2>
            <p>
              Shipping charges, if applicable, will be displayed at checkout
              before payment. We occasionally offer free shipping promotions,
              which will be clearly mentioned on the product or checkout page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. Order Tracking</h2>
            <p>
              Once your order is shipped, you will receive an email or message
              with the tracking details. You can use the tracking link to check
              your shipment status in real time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Delivery Areas</h2>
            <p>
              We currently deliver across India through our trusted courier
              partners. Please ensure your address and contact details are
              accurate to avoid delays or failed deliveries.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">6. Delayed or Lost Packages</h2>
            <p>
              While we strive for timely delivery, delays may occur due to
              weather, logistics, or unforeseen factors. If your package is
              delayed beyond the expected time frame, please contact us at{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                encoreluxerevive@gmail.com
              </a>
              , and we’ll assist in tracking or resolving the issue.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">7. Damaged Packages</h2>
            <p>
              If your order arrives damaged or tampered with, please take clear
              photos or videos of the package and contact us within{" "}
              <strong>24 hours of delivery</strong>. We will investigate and
              arrange a replacement or refund as applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
            <p>
              For any questions regarding shipping or delivery, please reach out
              to our support team at: <br />
              <strong>Email:</strong>{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=encoreluxerevive@gmail.com"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
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

export default ShippingPolicy;
