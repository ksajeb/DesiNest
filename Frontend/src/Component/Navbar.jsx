import React, { useContext, useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthDataContext } from "@/Context/AuthContext";
import { ListingDataContext } from "@/Context/ListingContext";
import { UserDataContext } from "@/Context/UserContext";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosContact } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { filterByCategory, activeCategory } = useContext(ListingDataContext);
  const { userData, setUserData } = useContext(UserDataContext);
  //responsiveness
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setShowPopup(false);
    setMobileMenuOpen(false);
    toast.success("Logged out successfully 👋");
    navigate("/");
  };
  const handleBecomeHost = () => {
    if (!userData?.id) {
      toast.error("Please login first to become a host");
      navigate("/login");
      setMobileMenuOpen(false);
      return;
    }

    navigate("/listingpage1");
    setMobileMenuOpen(false);
  };
  const handleNavItemClick = (item) => {
    if (item === "Home") navigate("/");
    if (item === "Hotel") navigate("/hotels");
    if (item === "About") navigate("/about");
    if (item === "Contact") navigate("/contact");
    setMobileMenuOpen(false);
  };
  const navItems = ["Home", "Hotel", "About", "Contact"];

  return (
    <div>
      {/* TOP NAVBAR */}
      <div className="w-full px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between border-b border-red-500/50">
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>

          <span className="text-2xl">DesiNest</span>
        </div>
        {/* navItems */}
        <div className="hidden md:flex items-center justify-center">
          <ul className="flex items-center justify-center gap-6 list-none font-semibold">
            {navItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleNavItemClick(item)}
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
        <div className="flex items-center gap-3 relative" ref={popupRef}>
          {!userData?.id && (
            <>
              <span
                className="hidden md:block cursor-pointer rounded-full px-5 py-2 hover:bg-[#FA6432] text-[#FA6432] hover:text-white hover:duration-700 border-2 border-[#FA6432] hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)] font-semibold hover:-translate-y-1"
                onClick={handleBecomeHost}
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
                Sign up Free
              </span>
            </>
          )}
          {userData?.id && (
            <>
              <span
                className="hidden md:block cursor-pointer rounded-full px-5 py-2 hover:bg-[#FA6432] text-[#FA6432] hover:text-white hover:duration-700 border-2 border-[#FA6432] hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)] font-semibold hover:-translate-y-1"
                onClick={handleBecomeHost}
              >
                Become a host
              </span>
              <span
                className="hidden md:block cursor-pointer rounded-full px-5 py-2 border-2 border-[#1A213F] text-[#1A213F] hover:bg-[#1A213F] hover:text-white hover:shadow-[0_8px_25px_rgba(26,33,63,0.6)] transition-all duration-500 font-semibold hover:-translate-y-1"
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

          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full border border-gray-400 text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <HiX className="text-xl" />
            ) : (
              <HiMenu className="text-xl" />
            )}
          </button>
          {showPopup && (
            <div className="absolute top-[140%] right-0 z-10 w-56 overflow-hidden rounded-lg border bg-white shadow-lg">
              <ul className="flex flex-col">
                {userData?.id && (userData?.name || userData?.fullName) && (
                  <>
                    <li className="px-4 py-3 flex flex-col">
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        Signed in as
                      </span>
                      <span className="font-bold text-[#1A213F] text-sm truncate">
                        {userData?.fullName || userData?.name}
                      </span>
                    </li>
                    <hr className="border-gray-200" />
                  </>
                )}
                <li
                  onClick={handleBecomeHost}
                  className="px-4 py-3 cursor-pointer flex items-center gap-1 font-bold hover:bg-gray-400 hover:text-black duration-500"
                >
                  <IoIosContact className="text-xl" />
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
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-black duration-200 font-bold flex items-center gap-1"
                    >
                      <FaList />
                      My Listings
                    </li>

                    <hr className="border-gray-200" />

                    <li
                      onClick={handleLogout}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 hover:text-black duration-200 flex items-center gap-1 font-bold "
                    >
                      <AiOutlineLogout />
                      Logout
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-white border-b border-red-500/30 shadow-lg z-20 animate-[fadeDown_0.2s_ease-out]">
          {/* CHANGE: Show user full name at top of mobile menu if logged in [NEW ELEMENT] */}
          {userData?.id && (userData?.name || userData?.fullName) && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Signed in as
              </p>
              <p className="font-bold text-[#1A213F]">
                {userData?.fullName || userData?.name}
              </p>
            </div>
          )}

          {/* MOBILE NAV LINKS */}
          <ul className="flex flex-col list-none font-semibold">
            {navItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleNavItemClick(item)}
                className="px-6 py-4 cursor-pointer border-b border-gray-100 text-black hover:text-[#FA6432] hover:bg-orange-50 transition-colors duration-200"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* MOBILE ACTION BUTTONS */}
          <div className="flex flex-col gap-3 px-6 py-4">
            <button
              onClick={handleBecomeHost}
              className="w-full rounded-full px-5 py-2 border-2 border-[#FA6432] text-[#FA6432] hover:bg-[#FA6432] hover:text-white transition-all duration-300 font-semibold"
            >
              Become a host
            </button>

            {userData?.id ? (
              <>
                <button
                  onClick={() => {
                    navigate("/my-bookings");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full px-5 py-2 border-2 border-[#1A213F] text-[#1A213F] hover:bg-[#1A213F] hover:text-white transition-all duration-300 font-semibold"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    navigate("/mylisting");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full px-5 py-2 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <FaList /> My Listings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full px-5 py-2 bg-red-500 text-white hover:bg-red-600 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <AiOutlineLogout /> Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full px-5 py-2 border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full px-5 py-2 bg-[#FA6432] text-white hover:bg-[#e5572a] transition-all duration-300 font-semibold"
                >
                  Sign up Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
