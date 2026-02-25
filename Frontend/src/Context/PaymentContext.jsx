import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { bookingDataContext } from "./BookingContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthDataContext } from "./AuthContext";

export const paymentDataContext = createContext(null);

function PaymentContext({ children }) {
  const navigate = useNavigate();
  const { serverUrl } = useContext(AuthDataContext);

  const { totalAmount, resetBooking } = useContext(bookingDataContext);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const startPayment = async (bookingId) => {
    if (!bookingId) {
      toast.error("Booking not created properly ❌");
      return;
    }

    setPaymentLoading(true);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load ❌");
      setPaymentLoading(false);
      return;
    }

    try {
      const orderResponse = await axios.post(
        `${serverUrl}/payments/create-order`,
        {
          bookingId: bookingId,
          amount: totalAmount,
        },
      );

      const { razorpayOrderId } = orderResponse.data;

      const options = {
        key: "rzp_test_SBB1ElloLuHfk8",
        amount: totalAmount,
        currency: "INR",
        order_id: razorpayOrderId,
        name: "EventSphere",
        description: "Hotel Booking Payment",

        handler: async function (response) {
          await verifyPayment(response);
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Order creation failed", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment ❌",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (response) => {
    try {
      await axios.post(`${serverUrl}/payments/verify`, {
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
      toast.success("Payment successful 🎉 Booking confirmed!");

      resetBooking();
      navigate("/my-bookings");
    } catch (error) {
      console.error("Payment verification failed", error);
      toast.error(
        error.response?.data?.message ||
          "Payment verification failed. Contact support ❌",
      );
    }
  };

  return (
    <paymentDataContext.Provider value={{ startPayment, paymentLoading }}>
      {children}
    </paymentDataContext.Provider>
  );
}

export default PaymentContext;
