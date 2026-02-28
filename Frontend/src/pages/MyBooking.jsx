import { bookingDataContext } from "@/Context/BookingContext";
import { UserDataContext } from "@/Context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { paymentDataContext } from "@/Context/PaymentContext";

const MyBooking = () => {
  const { getUserBookings, cancelBooking } = useContext(bookingDataContext);
  const { userData } = useContext(UserDataContext);
  const { startPayment } = useContext(paymentDataContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    const data = await getUserBookings();
    setBookings(data || []);
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmCancel) return;

    const success = await cancelBooking(bookingId);
    if (success) {
      fetchBookings();
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchBookings();
    }
  }, [userData]);

  return (
    <div>
      <div
        className="py-8 ml-5 flex items-center gap-1
        text-b cursor-pointer font-medium 
        hover:text-[#FA6436] transition duration-300"
        onClick={() => navigate("/")}
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span>Back to home</span>
      </div>
      <div className="px-10 pb-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="border p-4 mb-4 rounded-lg shadow">
              <p>
                <b>Booking Number:</b> {booking.id}
              </p>
              <p>
                <b>Status:</b> {booking.status}
              </p>
              <p>
                <b>Amount:</b> ₹{booking.totalAmount}
              </p>
              <p>
                <b>Check In:</b> {booking.checkInDate}
              </p>
              <p>
                <b>Check Out:</b> {booking.checkOutDate}
              </p>

              {/* Booking cancel button */}
              <div className="flex gap-3 mt-3">
                {/* Cancel Button */}
                {booking.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Complete Payment Button */}
                {booking.status === "PAYMENT_PENDING" && (
                  <button
                    onClick={() =>
                      navigate("/booking", {
                        state: {
                          bookingId: booking.id,
                          amount: booking.totalAmount,
                        },
                      })
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                  >
                    Complete Payment
                  </button>
                )}
              </div>

              {booking.status === "CANCELLED" && (
                <p className="text-red-500 mt-2 font-semibold">
                  This booking is cancelled
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBooking;
