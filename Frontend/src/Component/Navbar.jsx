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

  return (
    <div>
      {/* TOP NAVBAR */}
      <div className="w-full px-[40px] py-4 flex items-center justify-between bg-[#0f0f0f] border-b border-red-500/50 md:px-10">
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
          <div className="flex items-center bg-[#232628] h-15 rounded-full shadow-md">
            <div className="flex flex-col flex-1 px-6 border-r border-gray-600">
              <span className="text-white text-xs font-semibold">Where</span>
              <input
                type="text"
                placeholder="Search destinations"
                className="bg-transparent text-gray-400 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col flex-1 px-6 border-r border-gray-600">
              <span className="text-white text-xs font-semibold">When</span>
              <span className="text-gray-400 text-sm">Add dates</span>
            </div>

            <div className="flex flex-col flex-1 px-6">
              <span className="text-white text-xs font-semibold">Who</span>
              <span className="text-gray-400 text-sm">Add guests</span>
            </div>

            <button className="mr-2 bg-red-600 w-10 h-10 rounded-full flex items-center justify-center text-white">
              <IoSearchOutline size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-3 relative">
          <span
            className="hidden md:block text-white cursor-pointer rounded-full px-5 py-2 hover:bg-[#1D1F20]"
            onClick={() => navigate("/listingpage1")}
          >
            Become a host
          </span>

          <button
            onClick={() => setShowPopup(!showPopup)}
            className="flex items-center gap-2 border border-gray-600 rounded-full px-4 py-2 hover:bg-[#1D1F20]"
          >
            <RxHamburgerMenu className="text-white" />

            {userData && userData.email ? (
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                {userData.email.charAt(0).toUpperCase()}
              </div>
            ) : (
              <CgProfile className="text-white text-xl" />
            )}
          </button>

          {showPopup && (
            <div className="absolute bg-white top-[110%] right-0 border rounded-lg w-56 z-10">
              <ul className="flex flex-col">
                {!userData?.id && (
                  <li
                    onClick={() => navigate("/login")}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    Login
                  </li>
                )}

                {userData?.id && (
                  <>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </li>

                    <li
                      onClick={() => navigate("/mylisting")}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
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

export default Navbar;
