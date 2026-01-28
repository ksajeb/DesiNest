import React, { useContext, useState } from "react";
import { IoSearchOutline, IoBedOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { MdWhatshot, MdOutlinePool, MdBedroomParent } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { AuthDataContext } from "@/Context/AuthContext";
import { ListingDataContext } from "@/Context/ListingContext";
import { UserDataContext } from "@/Context/UserContext";

import logo from "../assets/logo.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { filterByCategory, activeCategory } = useContext(ListingDataContext);
  const { userData, setUserData } = useContext(UserDataContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setShowPopup(false);
    navigate("/");
  };

  const trendingItems = [
    { icon: MdWhatshot, title: "Trending", value: "Trending" },
    { icon: GiFamilyHouse, title: "Villa", value: "VILLA" },
    { icon: FaTreeCity, title: "Farm House", value: "FARM_HOUSE" },
    { icon: MdOutlinePool, title: "Pool House", value: "POOL_HOUSE" },
    { icon: MdBedroomParent, title: "Rooms", value: "ROOM" },
    { icon: BiBuildingHouse, title: "Flat", value: "FLAT" },
    { icon: IoBedOutline, title: "PG", value: "PG" },
    { icon: GiWoodCabin, title: "Cabins", value: "CABIN" },
    { icon: SiHomeassistantcommunitystore, title: "Shops", value: "SHOP" },
  ];

  const [date, setDate] = useState();
  const [guests, setGuests] = useState({
    adults: 0,
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

  return (
    <div>
      {/* TOP NAVBAR */}
      <div className="w-full px-[40px] py-4 flex items-center justify-between  border-b border-red-500/50 md:px-10">
        {/* LOGO */}
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* SEARCH BAR (DESKTOP) */}
        <div className="w-[40%] hidden md:block">
          <div className="flex items-center h-15 rounded-full shadow-lg border border-gray-300 overflow-hidden bg-white">
            <div className="flex flex-col flex-1 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-200">
              <span className="text-black text-xs font-semibold">Where</span>
              <input
                type="text"
                placeholder="Search destinations"
                className="bg-transparent text-gray-700 text-sm outline-none"
              />
            </div>
            <div className="h-8 w-px bg-gray-300"></div>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col flex-1 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-200 cursor-pointer">
                  <span className="text-black text-xs font-semibold">When</span>
                  <span className="text-gray-700 text-sm">
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
                      "Add dates"
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
                />
              </PopoverContent>
            </Popover>
            <div className="h-8 w-px bg-gray-300"></div>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center justify-between flex-1 px-6 py-3 rounded-full hover:bg-gray-100 transition duration-200 cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-black text-xs font-semibold">
                      Who
                    </span>
                    <span className="text-gray-700 text-sm">{guestText}</span>
                  </div>

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="ml-4 bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center text-white transition cursor-pointer"
                  >
                    <IoSearchOutline size={18} />
                  </button>
                </div>
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
        </div>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-3 relative">
          <span
            className="hidden md:block  cursor-pointer rounded-full px-5 py-2 hover:bg-[#EA6E8F] text-black hover:text-white hover:duration-500"
            onClick={() => navigate("/listingpage1")}
          >
            Become a host
          </span>

          <button
            onClick={() => setShowPopup(!showPopup)}
            className="flex items-center gap-2 border border-gray-600 rounded-full px-4 py-2 hover:bg-none cursor-pointer"
          >
            <RxHamburgerMenu className="text-black" />

            {userData && userData.email ? (
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                {userData.email.charAt(0).toUpperCase()}
              </div>
            ) : (
              <CgProfile className="text-black text-xl " />
            )}
          </button>

          {showPopup && (
            <div className="absolute top-[110%] right-0 z-10 w-56 overflow-hidden rounded-lg border bg-white shadow-lg">
              <ul className="flex flex-col">
                <li
                  onClick={() => navigate("/listingpage1")}
                  className="px-4 py-3 cursor-pointer flex items-center gap-2 font-bold hover:bg-gray-400 hover:text-black duration-500"
                >
                  Become a host
                </li>

                <hr className="border-gray-200" />

                {!userData?.id && (
                  <>
                    <li
                      onClick={() => navigate("/login")}
                      className="px-4 py-3 cursor-pointer font-bold hover:bg-gray-400 hover:text-black duration-500"
                    >
                      Login
                    </li>
                    <hr className=" border-gray-200" />
                    <li
                      onClick={() => navigate("/signup")}
                      className="px-4 py-3 cursor-pointer font-bold hover:bg-gray-400 hover:text-black duration-500"
                    >
                      Signup
                    </li>
                  </>
                )}

                {userData?.id && (
                  <>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-black duration-200"
                    >
                      Logout
                    </li>
                    <li
                      onClick={() => navigate("/mylisting")}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-black duration-200"
                    >
                      My Listing
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="w-screen bg-white flex gap-10 overflow-x-auto md:justify-center px-4 py-3">
        {trendingItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={() => filterByCategory(item.value)}
              className={`flex flex-col items-center cursor-pointer text-sm ${
                activeCategory === item.value ? "border-b-2 border-red-500" : ""
              }`}
            >
              <Icon className="text-black w-7 h-7" />
              <span className="mt-1">{item.title}</span>
            </div>
          );
        })}
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

export default Navbar;
