import React from "react";
import UpiIcon from "../assets/upi-ar21.svg";
import CreditCard from "../assets/credit-card-svgrepo-com.svg";
import Bank from "../assets/bank.svg";

function PaymentMethod() {
  return (
    <div className="border border-gray-200 rounded-xl p-8 bg-white">
      <h2 className="text-xl font-semibold mb-4">1. Add a payment method</h2>

      <p className="text-gray-600 mb-4">
        Available payment methods for INR.{" "}
        <span className="underline cursor-pointer">Switch currency</span>
      </p>

      <div className="space-y-4">
        <PaymentOption label="UPI QR code" icon={UpiIcon} />
        <PaymentOption label="UPI ID" icon={UpiIcon} />
        <PaymentOption label="Credit or debit card" icon={CreditCard} />
        <PaymentOption label="Net Banking" icon={Bank} />
      </div>

      <button
        className="mt-8 ml-auto block bg-neutral-900 text-white px-8 py-3 rounded-lg font-semibold
  hover:bg-black transition-colors duration-500 ease-in-out cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
function PaymentOption({ label, icon }) {
  return (
    <label className="flex justify-between items-center border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-gray-600 transition hover:scale-105">
      <div className="flex items-center gap-3">
        <img src={icon} alt={label} className="w-6 h-6 object-contain" />
        <span>{label}</span>
      </div>

      <input type="radio" name="payment" />
    </label>
  );
}

export default PaymentMethod;
