import Navbar from "@/Component/Navbar";
import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <Navbar/>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-[#0A0E27] to-[#1B1F3B] text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About DesiNest</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed">
          Discover beautiful stays across India with comfort, trust, and
          simplicity. DesiNest connects travelers with unique homes and
          unforgettable experiences.
        </p>
      </section>

      {/* MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-[#0A0E27]">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our mission is to make travel accessible, affordable, and enjoyable
            for everyone. We empower hosts to earn while offering travelers safe
            and comfortable stays.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe in building trust, transparency, and technology-driven
            solutions that simplify the booking experience.
          </p>
        </div>

        <div className="bg-[#FA6436] rounded-3xl p-10 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Why We Started</h3>
          <p className="leading-relaxed">
            DesiNest was built to bring Indian hospitality into the digital age
            — combining local warmth with modern convenience.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
          <div>
            <h3 className="text-4xl font-bold text-[#FA6436]">500+</h3>
            <p className="text-gray-600 mt-2">Properties Listed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-[#FA6436]">10K+</h3>
            <p className="text-gray-600 mt-2">Happy Travelers</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-[#FA6436]">100+</h3>
            <p className="text-gray-600 mt-2">Verified Hosts</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-[#FA6436]">24/7</h3>
            <p className="text-gray-600 mt-2">Customer Support</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#0A0E27]">
          Why Choose DesiNest?
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500">
            <h3 className="text-xl font-semibold mb-4 text-[#FA6436]">
              Trusted Listings
            </h3>
            <p className="text-gray-600">
              Every property is verified to ensure safety and quality.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500">
            <h3 className="text-xl font-semibold mb-4 text-[#FA6436]">
              Affordable Pricing
            </h3>
            <p className="text-gray-600">
              Competitive pricing without compromising comfort.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-500">
            <h3 className="text-xl font-semibold mb-4 text-[#FA6436]">
              Seamless Booking
            </h3>
            <p className="text-gray-600">
              Easy and fast booking process powered by modern technology.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-[#0A0E27] text-white py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Meet Our Team</h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-[#1B1F3B] p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition duration-500">
            <div className="w-24 h-24 mx-auto bg-[#FA6436] rounded-full mb-4"></div>
            <h3 className="font-semibold text-lg">Founder</h3>
            <p className="text-gray-400">Vision & Strategy</p>
          </div>

          <div className="bg-[#1B1F3B] p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition duration-500">
            <div className="w-24 h-24 mx-auto bg-[#FA6436] rounded-full mb-4"></div>
            <h3 className="font-semibold text-lg">Tech Lead</h3>
            <p className="text-gray-400">Platform Development</p>
          </div>

          <div className="bg-[#1B1F3B] p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition duration-500">
            <div className="w-24 h-24 mx-auto bg-[#FA6436] rounded-full mb-4"></div>
            <h3 className="font-semibold text-lg">Operations</h3>
            <p className="text-gray-400">Customer Success</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-[#FA6436] to-[#FF4163] text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Explore?</h2>
        <p className="mb-8 text-lg">Start your journey with DesiNest today.</p>
        <button
          onClick={() => navigate("/hotels")}
          className="bg-white text-[#FA6436] font-semibold px-8 py-3 rounded-full hover:scale-105 transition duration-300 shadow-lg cursor-pointer"
        >
          Browse Hotels
        </button>
      </section>
    </div>
  );
};

export default About;
