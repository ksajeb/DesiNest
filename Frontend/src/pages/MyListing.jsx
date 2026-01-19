import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { ListingDataContext } from "@/Context/ListingContext";
import { UserDataContext } from "@/Context/UserContext";

function MyListing() {
  const navigate = useNavigate();
  const { myListings, getUsersListings } = useContext(ListingDataContext);
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    if (userData?.id) {
      getUsersListings();
    }
  }, [userData]);
  if (!userData) {
    return <div className="text-white">Loading...</div>;
  }

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
          {myListings.length === 0 ? (
            <div className="bg-[#242424] rounded-xl p-5 shadow-md">
              <p className="text-gray-300 mb-4">No listings yet</p>
              <button
                className="border px-6 rounded-lg cursor-pointer text-lg
                   hover:bg-[#FCAE38] duration-150"
                onClick={() => navigate("/listingpage1")}
              >
                Create a listing
              </button>
            </div>
          ) : (
            myListings.map((item) => (
              <div
                key={item.id}
                className="bg-[#242424] rounded-xl p-5 shadow-md"
              >
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-400">{item.city}</p>
                <p className="text-[#FCAE38] font-bold mt-2">₹{item.rent}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyListing;
