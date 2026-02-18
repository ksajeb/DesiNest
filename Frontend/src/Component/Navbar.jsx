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

  const navItems = ["Home", "Hotel", "About", "Contact"];

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
        {/* navItems */}
        <div className="flex items-center justify-center gap-4">
          <ul className="flex items-center justify-center gap-10 list-none font-semibold">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="relative cursor-pointer text-black hover:text-[#FA6432]
        after:content-[''] after:absolute after:left-0 after:bottom-[-4px]
        after:w-0 after:h-[2px] after:bg-[#FA6432]
        after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-3 relative">
          {!userData?.id && (
            <>
              <span
                className="hidden md:block cursor-pointer rounded-full px-5 py-2 hover:bg-[#FA6432] text-[#FA6432] hover:text-white hover:duration-700 border-2 border-[#FA6432] hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)] font-semibold hover:-translate-y-1"
                onClick={() => navigate("/listingpage1")}
              >
                Become a host
              </span>

              <span
                className="hidden md:block cursor-pointer rounded-full px-7 py-2 hover:bg-[#1A213F] text-black hover:text-white hover:duration-500 border-2 font-semibold"
                onClick={() => navigate("/login")}
              >
                Login
              </span>

              <span
                className="hidden md:block cursor-pointer rounded-full px-5 py-2 bg-[#FA6432] hover:bg-[#FA6436] text-white hover:duration-500 hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)] font-semibold hover:-translate-y-1"
                onClick={() => navigate("/signup")}
              >
                SignUp
              </span>
            </>
          )}
          {userData?.id && (
            <>
              <span
                className="hidden md:block cursor-pointer rounded-full px-5 py-2 hover:bg-[#FA6432] text-[#FA6432] hover:text-white hover:duration-700 border-2 border-[#FA6432] hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)] font-semibold hover:-translate-y-1"
                onClick={() => navigate("/listingpage1")}
              >
                Become a host
              </span>

              <span
                className="hidden md:block cursor-pointer rounded-full px-5 py-2 
  border-2 border-[#1A213F] 
  text-[#1A213F] 
  hover:bg-[#1A213F] 
  hover:text-white 
  hover:shadow-[0_8px_25px_rgba(26,33,63,0.6)] 
  transition-all duration-500 
  font-semibold 
  hover:-translate-y-1"
                onClick={() => navigate("/my-bookings")}
              >
                My Bookings
              </span>
            </>
          )}

          <button
            onClick={() => setShowPopup(!showPopup)}
            className="flex items-center gap-2 border border-gray-600 rounded-full px-2 py-2 hover:bg-none cursor-pointer"
          >
            {/* <RxHamburgerMenu className="text-black" /> */}

            {userData && userData.email ? (
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                {userData.email.charAt(0).toUpperCase()}
              </div>
            ) : (
              <CgProfile className="text-black text-xl " />
            )}
          </button>

          {showPopup && (
            <div className="absolute top-[140%] -right-7.5 z-10 w-56 overflow-hidden rounded-lg border bg-white shadow-lg">
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
                      onClick={() => {
                        navigate("/mylisting");
                        setShowPopup(false);
                      }}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-black duration-200"
                    >
                      My Listings
                    </li>

                    <hr className="border-gray-200" />

                    <li
                      onClick={handleLogout}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-black duration-200"
                    >
                      Logout
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
