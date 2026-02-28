import { ListingDataContext } from "@/Context/ListingContext";
import { bookingDataContext } from "@/Context/BookingContext";
import { useContext, useState } from "react";
import { PiMedalMilitary } from "react-icons/pi";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format, differenceInCalendarDays, subDays } from "date-fns";

function BookingSummary() {
  const { cardDetails } = useContext(ListingDataContext);
  const {
    checkIn,
    checkOut,
    nights,
    totalAmount,
    baseAmount,
    serviceFee,
    calculateBooking,
    setListingId,
  } = useContext(bookingDataContext);

  const [date, setDate] = useState();

  const pricePerNight = cardDetails?.rent || 0;

  const base = baseAmount;
  const service = serviceFee;
  const total = totalAmount;

  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const updateGuests = (type, value) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value),
    }));
  };

  const totalGuests = guests.adults + guests.children;

  const guestText =
    totalGuests > 0
      ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}${
          guests.infants > 0 ? ` · ${guests.infants} infant` : ""
        }`
      : "Add guests";

  const FREE_CANCELLATION_DAYS = 5;
  const cancellationDate = date?.from
    ? subDays(date.from, FREE_CANCELLATION_DAYS)
    : null;

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white">
      {/* Image + Title */}
      <div className="flex gap-4">
        <h3 className="font-semibold text-base  flex items-baseline gap-2">
          <span className="text-2xl">₹{cardDetails?.rent}</span>
          <span className="text-sm text-gray-400 ">/night</span>
        </h3>
      </div>

      {/* Cancellation */}
      <div className="mt-6 text-sm">
        <p className="font-semibold text-sm">Free cancellation</p>
        <p className="text-gray-600">
          {cancellationDate
            ? `Cancel before ${format(
                cancellationDate,
                "dd MMMM yyyy",
              )} for a full refund.`
            : "Select check-in date to see cancellation policy."}
        </p>
      </div>

      {/* Dates */}
      <div className="mt-6 flex justify-between items-center">
        <div>
          <p className="font-semibold text-sm">Dates</p>
          <p className="text-gray-600">
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMM yyyy")} –{" "}
                  {format(date.to, "dd MMM yyyy")}
                </>
              ) : (
                format(date.from, "dd MMM yyyy")
              )
            ) : (
              "Add dates"
            )}
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="text-sm font-semibold cursor-pointer border rounded px-3 py-1.5 bg-gray-200 hover:bg-gray-300 hover:text-black">
              Change
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={date}
              onSelect={(range) => {
                setDate(range);
                if (range?.from && range?.to) {
                  calculateBooking(cardDetails?.rent, range.from, range.to);
                  setListingId(cardDetails?.id);
                }
              }}
              numberOfMonths={2}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Guests */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="font-semibold text-sm">Guests</p>
          <p className="text-gray-600">{guestText}</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="text-sm font-semibold cursor-pointer border rounded px-3 py-1.5 bg-gray-200 hover:bg-gray-300 hover:text-black">
              Change
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[320px] p-5 rounded-2xl shadow-xl"
            align="end"
          >
            <GuestRow
              title="Adults"
              subtitle="Ages 13 or above"
              count={guests.adults}
              onAdd={() => updateGuests("adults", 1)}
              onRemove={() => updateGuests("adults", -1)}
            />

            <GuestRow
              title="Children"
              subtitle="Ages 2–12"
              count={guests.children}
              onAdd={() => updateGuests("children", 1)}
              onRemove={() => updateGuests("children", -1)}
            />

            <GuestRow
              title="Infants"
              subtitle="Under 2"
              count={guests.infants}
              onAdd={() => updateGuests("infants", 1)}
              onRemove={() => updateGuests("infants", -1)}
            />

            <GuestRow
              title="Pets"
              subtitle="Bringing a service animal?"
              count={guests.pets}
              onAdd={() => updateGuests("pets", 1)}
              onRemove={() => updateGuests("pets", -1)}
              isLast
            />
          </PopoverContent>
        </Popover>
      </div>

      <hr className="my-6" />

      {/* Price */}
      <div className="space-y-3 text-sm text-gray-700">
        {nights === 0 && (
          <p className="text-xs text-red-500">
            Please select check-in and check-out dates
          </p>
        )}
        <div className="flex justify-between">
          <span>
            {nights > 0
              ? `${nights} night${nights > 1 ? "s" : ""} × ₹${pricePerNight}`
              : "Select dates to see price"}
          </span>
          <span>₹{base.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service fee (5%)</span>
          <span>₹{service.toFixed(1)}</span>
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex justify-between font-semibold text-base mt-2">
        <span>Total INR</span>
        <span>₹{total.toFixed(1)}</span>
      </div>

      <p className="underline text-sm mt-3 cursor-pointer">Price breakdown</p>
    </div>
  );
}

function GuestRow({ title, subtitle, count, onAdd, onRemove, isLast }) {
  return (
    <div
      className={`flex items-center justify-between py-4 ${
        !isLast && "border-b border-gray-200"
      }`}
    >
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-gray-500 text-xs">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRemove}
          disabled={count === 0}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-xl leading-none disabled:opacity-30 cursor-pointer"
        >
          −
        </button>

        <span className="w-5 text-center">{count}</span>

        <button
          onClick={onAdd}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-xl leading-none cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;
