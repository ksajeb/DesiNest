import React, { useContext, useEffect } from "react";
import { ListingDataContext } from "@/Context/ListingContext";
import Card from "@/Component/Card";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AllListings = () => {
  const { listingData } = useContext(ListingDataContext);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen px-6 md:px-10 py-10">
      <div
        className="pb-6 ml-3 inline-flex items-center gap-1
              text-b cursor-pointer font-medium 
              hover:text-[#FA6436] transition duration-500"
        onClick={() => navigate("/")}
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span>Back to home</span>
      </div>
      <h1 className="text-3xl font-bold mb-8">All Hotels</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listingData?.map((list) => (
          <Card key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};

export default AllListings;
