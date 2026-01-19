import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

function MyListing() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] flex justify-center text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2
                   bg-[#FCAE38] hover:bg-[#AA001F]
                   px-4 py-2 rounded-full shadow-lg
                   transition-all duration-200 cursor-pointer"
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Content */}
      <div className="w-full max-w-6xl px-6 mt-24">
        <h1 className="text-3xl font-semibold mb-6">My Listings</h1>

        {/* Placeholder for listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#242424] rounded-xl p-5 shadow-md flex gap-6">
            <p className="text-gray-300">No listings yet</p>
            <button
              className="border px-6 rounded-lg cursor-pointer text-lg hover:bg-[#FCAE38] duration-150  hover:delay-150"
              onClick={() => navigate("/listingpage1")}
            >
              Create a listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyListing;
