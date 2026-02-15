import React from "react";
import { useNavigate } from "react-router-dom";

function HomePageListing() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FA6436] h-96 flex flex-col items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-6xl mt-16 text-white font-bold">
          Own a hotel or homestay?
        </h1>
        <p className="mt-6 text-white text-xl">
          Start earning by listing your property on DesiNest
        </p>
      </div>
      <div>
        <button
          className="bg-white rounded-full mt-10 cursor-pointer w-80 h-20 font-bold text-xl text-[#FA6436]"
          onClick={() => navigate("/listingpage1")}
        >
          Add your hotel
        </button>
      </div>
    </div>
  );
}

export default HomePageListing;
