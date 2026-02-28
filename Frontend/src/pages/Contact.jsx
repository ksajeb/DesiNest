import React from "react";
import Navbar from "@/Component/Navbar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#0a0e27] to-[#1b1f3b] flex items-center justify-center px-6 py-16">
        <div className="max-w-6xl w-full grid md:grid-cols-2 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          {/* LEFT SIDE */}
          <div className="p-12 text-white">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

            <p className="text-gray-300 leading-relaxed mb-8">
              Have questions about bookings, hosting, or partnerships? Our team
              is here to help you 24/7.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#FA6432]">Email</h3>
                <p className="text-gray-300">support@desinest.com</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#FA6432]">Phone</h3>
                <p className="text-gray-300">+91 98765 43210</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#FA6432]">
                  Location
                </h3>
                <p className="text-gray-300">Mumbai, India</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white p-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
              Send Message
            </h2>

            <form className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FA6432] focus:border-[#FA6432] transition"
                required
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FA6432] focus:border-[#FA6432] transition"
                required
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full p-4 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#FA6432] focus:border-[#FA6432] transition"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full py-4 bg-[#FA6432] text-white font-semibold rounded-xl hover:bg-[#ff7b4d] hover:shadow-[0_10px_25px_rgba(250,100,50,0.4)] hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
