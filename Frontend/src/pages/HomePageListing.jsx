import React from "react";
import { useNavigate } from "react-router-dom";

function HomePageListing() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FA6436] h-auto md:h-96 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-8 md:mt-10 text-white font-bold">
          Own a hotel or homestay?
        </h1>
        <p className="mt-4 md:mt-6 text-white text-base sm:text-lg md:text-xl">
          Start earning by listing your property on DesiNest
        </p>
      </div>
      <div>
        <button
          className="
            bg-white rounded-full mt-8 md:mt-10 cursor-pointer w-64 sm:w-72 md:w-80 h-14 sm:h-16 md:h-20 font-bold text-lg md:text-xl text-[#FA6436] transition duration-300 hover:shadow-lg"
          onClick={() => navigate("/listingpage1")}
        >
          Add your hotel
        </button>
      </div>
    </div>
  );
}

export default HomePageListing;
