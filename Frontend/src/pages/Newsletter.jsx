import React, { useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email.trim() === "") {
      toast.error("Please enter a valid email!");
      return;
    }
    toast.success("Subscribed successfully!");
    setEmail("");
  };
  return (
    <div className="w-full bg-[#F5F7FA] py-24 flex flex-col items-center justify-center text-center">
      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-200 to-purple-300 mb-6">
        <IoMailOutline className="text-2xl text-purple-600" />
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
        Get Exclusive Deals
      </h2>

      {/* Subtext */}
      <p className="text-gray-500 text-lg mb-10 max-w-2xl">
        Join 250,000+ travelers receiving weekly deals, travel tips and
        inspiration
      </p>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl px-6">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-8 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
        />

        <button
          onClick={handleSubscribe}
          className="
  cursor-pointer 
  rounded-lg
  px-8 py-4 
  bg-[#FA6432] 
  hover:bg-[#FA6436]
  text-white 
  font-semibold 
  transition duration-500 
  hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)]
  hover:-translate-y-1
  "
        >
          Subscribe →
        </button>
      </div>

      {/* Bottom text */}
      <p className="text-gray-400 text-sm mt-6">
        No spam, unsubscribe anytime.
      </p>
    </div>
  );
};

export default Newsletter;
