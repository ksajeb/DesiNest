import { bookingDataContext } from "@/Context/BookingContext";
import { UserDataContext } from "@/Context/UserContext";
import React, { useContext, useEffect, useState } from "react";

const MyBooking = () => {
  const { getUserBookings } = useContext(bookingDataContext);
  const { userData } = useContext(UserDataContext);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const data = await getUserBookings();
    setBookings(data || []);
  };
  useEffect(() => {
    fetchBookings();
  }, [userData]);
  return (
    <div className="p-10">
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
          </div>
        ))
      )}
    </div>
  );
};

export default MyBooking;
