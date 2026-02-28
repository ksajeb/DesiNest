import React, { createContext, useContext, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import { UserDataContext } from "./UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { differenceInCalendarDays } from "date-fns";
export const bookingDataContext = createContext();

function BookingContext({ children }) {
  const { serverUrl } = useContext(AuthDataContext);
  const { userData } = useContext(UserDataContext);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);
  const [listingId, setListingId] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [baseAmount, setBaseAmount] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);

  const SERVICE_PERCENT = 0.05;

  const calculateBooking = (rent, checkInDate, checkOutDate) => {
    const nightsCount = differenceInCalendarDays(checkOutDate, checkInDate);

    if (nightsCount <= 0) return;

    const base = rent * nightsCount;
    const service = base * SERVICE_PERCENT;
    const finalAmount = base + service;

    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    setNights(nightsCount);

    setBaseAmount(base);
    setServiceFee(service);
    setTotalAmount(finalAmount);
  };

  const resetBooking = () => {
    setCheckIn(null);
    setCheckOut(null);
    setNights(0);
    setBaseAmount(0);
    setServiceFee(0);
    setTotalAmount(0);
    setListingId(null);
  };

  const createBooking = async () => {
    if (!userData?.id || !listingId || totalAmount <= 0) return;
    if (!userData?.id) {
      toast.error("Please login to continue 🔐");
      return;
    }
    setBookingLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/bookings`,
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
      toast.error(error.response?.data?.message || "Booking failed ❌");
      throw error;
    } finally {
      setBookingLoading(false);
    }
  };

  const getUserBookings = async () => {
    if (!userData?.id) return;

    try {
      const res = await axios.get(`${serverUrl}/bookings/user/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
        `${serverUrl}/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Booking cancelled successfully ❌");
      return true;
    } catch (error) {
      console.error("Cancel booking failed", error);
      toast.error(error.response?.data?.message || "Cancel failed ❌");
      return false;
    }
  };

  let value = {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    nights,
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
    baseAmount,
    serviceFee,
    totalAmount,
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
