import React, { useContext } from "react";
import UpiIcon from "../assets/upi-ar21.svg";
import CreditCard from "../assets/credit-card-svgrepo-com.svg";
import Bank from "../assets/bank.svg";
import { bookingDataContext } from "@/Context/BookingContext";
import { paymentDataContext } from "@/Context/PaymentContext";
import { useLocation } from "react-router-dom";

function PaymentMethod() {
  const { totalAmount, createBooking } = useContext(bookingDataContext);
  const { startPayment, paymentLoading } = useContext(paymentDataContext);
  const location = useLocation();
  const retryBookingId = location.state?.bookingId;
  const retryAmount = location.state?.amount;
  const payableAmount = retryAmount || totalAmount;

  const handlePay = async () => {
    try {
      // If coming from MyBooking (retry case)
      if (retryBookingId) {
        await startPayment(retryBookingId, retryAmount);
      }
      // Normal new booking case
      else {
        const booking = await createBooking();
        if (booking?.id) {
          await startPayment(booking.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-8 bg-white">
      <h2 className="text-xl font-semibold mb-4">1. Add a payment method</h2>

      <p className="text-gray-600 mb-4">
        Available payment methods for INR.{" "}
        <span className="underline cursor-pointer hover:text-black">
          Switch currency
        </span>
      </p>

      <div className="space-y-4">
        <PaymentOption label="UPI QR code" icon={UpiIcon} />
        <PaymentOption label="UPI ID" icon={UpiIcon} />
        <PaymentOption label="Credit or debit card" icon={CreditCard} />
        <PaymentOption label="Net Banking" icon={Bank} />
      </div>

      <button
        onClick={handlePay}
        disabled={!payableAmount || payableAmount <= 0 || paymentLoading}
        className={`mt-8 ml-auto block px-8 py-3 rounded-lg font-semibold
    ${
      !payableAmount || payableAmount <= 0 || paymentLoading
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-neutral-900 text-white hover:bg-black cursor-pointer"
    }`}
      >
        {paymentLoading ? "Processing..." : `Pay ₹${payableAmount}`}
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
