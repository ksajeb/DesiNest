import React from "react";
import { FaMoneyBillWave, FaStar, FaPhoneAlt, FaBolt } from "react-icons/fa";

const ChooseUs = () => {
  const features = [
    {
      id: 1,
      title: "Best Prices",
      description: "Get the best deals with our price match guarantee",
      icon: <FaMoneyBillWave />,
    },
    {
      id: 2,
      title: "Trusted Reviews",
      description: "Read genuine reviews from verified travelers",
      icon: <FaStar />,
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Our team is available round the clock",
      icon: <FaPhoneAlt />,
    },
    {
      id: 4,
      title: "Easy Booking",
      description: "Book your perfect stay in just a few clicks",
      icon: <FaBolt />,
    },
  ];
  return (
    <div className="bg-gray-100 py-20">
      {/* Heading */}
      <div className="text-center mb-12 flex flex-col items-center gap-3">
        <span className="px-4 py-2 rounded-full bg-[#FFEDD5] font-semibold text-[#FA6436]">
          Why DesiNest
        </span>
        <h2 className="text-6xl font-bold text-gray-900">Travel Reimagined</h2>
        <p className="text-[#6C7A96] mt-6 text-xl">
          We handle every detail so you can focus on the experience
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {features.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg transition h-80"
          >
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-400 to-green-400 text-white text-2xl my-4">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-gray-500 text-xl px-3">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseUs;
