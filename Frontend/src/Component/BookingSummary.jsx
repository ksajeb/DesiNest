import { ListingDataContext } from "@/Context/ListingContext";
import { useContext } from "react";
import { PiMedalMilitary } from "react-icons/pi";

function BookingSummary() {
  const { cardDetails } = useContext(ListingDataContext);

  //temporary night
  const nights = 3;
  const pricePerNight = cardDetails?.rent || 0;
  const subtotal = nights * pricePerNight;
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes;

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white sticky top-24">
      {/* Image + Title */}
      <div className="flex gap-4">
        <img
          src={cardDetails?.images?.[0]}
          alt="hotel"
          className="w-24 h-24 rounded-lg object-cover"
        />

        <div>
          <h3 className="font-semibold text-base leading-tight">
            {cardDetails?.title}
          </h3>
          <p className="text-sm text-gray-600">
            {cardDetails?.landmark}, {cardDetails?.city}
          </p>
          <p className="text-sm mt-1 flex items-center gap-2 whitespace-nowrap">
            <span>⭐ 4.78 (32)</span>
            <span className="flex items-center gap-1">
              <PiMedalMilitary className="text-black" />
              Superhost
            </span>
          </p>
        </div>
      </div>

      {/* Cancellation */}
      <div className="mt-6 text-sm">
        <p className="font-semibold text-sm">Free cancellation</p>
        <p className="text-gray-600">
          Cancel before 7 February for a full refund.
        </p>
      </div>

      {/* Dates */}
      <div className="mt-6 flex justify-between">
        <div>
          <p className="font-semibold text-sm">Dates</p>
          <p className="text-gray-600">8–11 Feb 2026</p>
        </div>
        <button className="underline text-sm cursor-pointer">Change</button>
      </div>

      {/* Guests */}
      <div className="mt-4 flex justify-between">
        <div>
          <p className="font-semibold text-sm">Guests</p>
          <p className="text-gray-600">1 adult</p>
        </div>
        <button className="underline text-sm cursor-pointer">Change</button>
      </div>

      <hr className="my-6" />

      {/* Price */}
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>
            {nights} nights × ₹{pricePerNight}
          </span>
          <span>₹{subtotal.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>₹{taxes.toFixed(1)}</span>
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex justify-between font-semibold text-base mt-2">
        <span>Total INR</span>
        <span>₹{total.toFixed(1)}</span>
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

export default BookingSummary;
