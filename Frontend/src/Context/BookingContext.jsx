import React, { createContext, useContext, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import { UserDataContext } from "./UserContext";
import axios from "axios";
export const bookingDataContext = createContext();

function BookingContext({ children }) {
  const { serverUrl3 } = useContext(AuthDataContext);
  const { userData } = useContext(UserDataContext);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);
  const [listingId, setListingId] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const [bookingLoading, setBookingLoading] = useState(false);

  const calculateBooking = (pricePerNight, startDate, endDate) => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end - start;
    const diffDays = Math.max(1, diffTime / (1000 * 60 * 60 * 24));

    setCheckIn(startDate);
    setCheckOut(endDate);
    setNights(diffDays);
    setTotalAmount(diffDays * pricePerNight);
  };

  const resetBooking = () => {
    setCheckIn("");
    setCheckOut("");
    setNights(0);
    setTotalAmount(0);
    setListingId(null);
  };

  const createBooking = async () => {
    if (!userData?.id || !listingId || totalAmount <= 0) return;
    console.log("BOOKING DATA SENDING:", {
      listingId,
      userId: userData?.id,
      checkIn,
      checkOut,
      totalAmount,
    });

    setBookingLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl3}/bookings`,
        {
          listingId,
          userId: userData.id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setBookingId(res.data.id);
      return res.data;
    } catch (error) {
      console.error("Booking failed", error);
      alert(error.response?.data?.message || "Booking failed");
      throw error;
    } finally {
      setBookingLoading(false);
    }
  };

  const getUserBookings = async () => {
    if (!userData?.id) return;

    try {
      const res = await axios.get(
        `${serverUrl3}/bookings/user/${userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      return [];
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!bookingId) return;

    try {
      await axios.put(
        `${serverUrl3}/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return true;
    } catch (error) {
      console.error("Cancel booking failed", error);
      alert(error.response?.data?.message || "Cancel failed");
      return false;
    }
  };

  let value = {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    nights,
    totalAmount,
    listingId,
    setListingId,
    calculateBooking,
    resetBooking,
    createBooking,
    bookingLoading,
    getUserBookings,
    bookingId,
    setBookingId,
    cancelBooking,
  };

  return (
    <div>
      <bookingDataContext.Provider value={value}>
        {children}
      </bookingDataContext.Provider>
    </div>
  );
}

export default BookingContext;
