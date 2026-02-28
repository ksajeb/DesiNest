import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ListingDataContext } from "@/Context/ListingContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function HomePage() {
  const [date, setDate] = useState();
  const navigate = useNavigate();
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [location, setLocation] = useState("");
  const { searchListings } = useContext(ListingDataContext);
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
  const handleSearch = async () => {
    let start = null;
    let end = null;

    if (date?.from) {
      start = format(date.from, "yyyy-MM-dd");
    }

    if (date?.to) {
      end = format(date.to, "yyyy-MM-dd");
    }
    if (!location && !date?.from && !date?.to && totalGuests === 0) {
      toast.info("Please enter at least one search filter");
      return;
    }

    await searchListings({
      city: location,
      startDate: start,
      endDate: end,
      guests: totalGuests,
    });

    navigate("/hotels");
  };

  return (
    <div className="bg-[#161D3A] w-full py-16">
      <div className="flex flex-col items-center justify-center text-center pt-3">
        <div className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
          Find your perfect stay
          <br />
          <span className="text-red-500">anywhere in India</span>
        </div>

        <p className="text-gray-200 mt-5 text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Discover hotels, resorts, and unique stays at the best prices
        </p>
      </div>

      {/* search bar */}
      <div className="w-full max-w-6xl px-4 pt-10 mx-auto">
        <div
          className="flex flex-col md:flex-row
          rounded-3xl
          shadow-lg
          border border-gray-300
          overflow-hidden
          bg-white"
        >
          <div className="flex flex-col flex-1 px-6 py-4">
            <span className="text-[#73809B] text-sm font-semibold">
              Location
            </span>
            <input
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-gray-700 text-sm outline-none mt-1"
            />
          </div>
          <div className="hidden md:block w-px bg-gray-300"></div>

          <Popover>
            <PopoverTrigger asChild>
              <div className="flex flex-col flex-1 px-6 py-4 cursor-pointer">
                <span className="text-[#73809B] text-sm font-semibold">
                  Check-In
                </span>
                <span className="text-gray-700 text-sm mt-1">
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd MMM")} -{" "}
                        {format(date.to, "dd MMM")}
                      </>
                    ) : (
                      format(date.from, "dd MMM")
                    )
                  ) : (
                    "When you are planning?"
                  )}
                </span>
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
          <div className="hidden md:block w-px bg-gray-300"></div>
          <Popover>
            <PopoverTrigger asChild>
              <div
                className="flex flex-col md:flex-row
                md:items-center
                justify-between
                flex-1
                px-6 py-4
                gap-4 md:gap-0
                cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-[#73809B] text-sm font-semibold">
                    Guests
                  </span>
                  <span className="text-gray-700 text-sm mt-1">
                    {guestText}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearch();
                  }}
                  className="
                    bg-[#FA6432]
                    hover:bg-[#FA6436]
                    w-full md:w-28
                    h-12
                    rounded-lg
                    flex items-center justify-center
                    text-white font-semibold
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)]
                  "
                >
                  Search
                </button>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[90vw] md:w-[320px] p-5 rounded-2xl shadow-xl"
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
      </div>
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

export default HomePage;
