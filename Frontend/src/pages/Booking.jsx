import BookingSummary from "@/Component/BookingSummary";
import MessageToHost from "@/Component/MessageToHost";
import PaymentMethod from "@/Component/PaymentMethod";
import React from "react";
import { useNavigate } from "react-router-dom";

import { IoArrowBackOutline } from "react-icons/io5";

function Booking() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white px-12 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="fixed top-10 left-10 z-50 w-25 h-10  hover:bg-black bg-neutral-800
                cursor-pointer rounded-2xl flex justify-center items-center text-white hover:scale-105"
          onClick={() => navigate("/")}
        >
          <IoArrowBackOutline className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-semibold mb-10">Request to book</h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT SECTION */}
          <div className="flex-1 space-y-8">
            <PaymentMethod />
            <MessageToHost />
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-[420px]">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
