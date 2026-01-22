import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdWhatshot, MdOutlinePool, MdBedroomParent } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import ListingContext, { ListingDataContext } from "@/Context/ListingContext";

function ListingPage2() {
  const trendingItems = [
    { icon: MdWhatshot, title: "Hotel", value: "HOTEL" },
    { icon: GiFamilyHouse, title: "Villa", value: "VILLA" },
    { icon: FaTreeCity, title: "Farm Stay", value: "FARM_STAY" },
    { icon: MdOutlinePool, title: "Resort", value: "RESORT" },
    { icon: MdBedroomParent, title: "Apartment", value: "APARTMENT" },
    { icon: IoBedOutline, title: "PG", value: "HOSTEL" },
    { icon: GiWoodCabin, title: "Cottage", value: "COTTAGE" },
    {
      icon: SiHomeassistantcommunitystore,
      title: "Boutique",
      value: "BOUTIQUE",
    },
    { icon: FaTreeCity, title: "Tree House", value: "TREE_HOUSE" },
  ];

  let navigate = useNavigate();

  let { category, setCategory } = useContext(ListingDataContext);
  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] relative flex justify-center overflow-y-auto">
      <div
        className="fixed top-6 left-10 z-50 w-[100px] h-[40px] bg-[#FF4163] hover:bg-[#AA001F]
                   cursor-pointer rounded-2xl flex justify-center items-center text-white"
        onClick={() => navigate("/listingpage1")}
      >
        <IoArrowBackOutline className="w-6 h-6" />
      </div>

      <div className="w-full max-w-[420px] px-4 sm:px-0 flex flex-col gap-6 pt-16 sm:pt-32 pb-20">
        {/* HEADER */}
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white whitespace-nowrap">
            Which of these best describes your place?
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Choose a category that fits your listing
          </p>
        </div>

        {/* TRENDING GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {trendingItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => setCategory(item.value)}
                className={`flex flex-col items-center justify-center gap-2
          h-[110px] sm:h-[130px]
          rounded-xl border border-gray-600
          text-white cursor-pointer
          transition-all duration-200 ease-out
          hover:border-[#FF4163] hover:bg-[#2a2a2a]
          hover:scale-105 sm:hover:scale-110
          ${category === item.value ? "border-[#FF4163] bg-[#2a2a2a]" : ""}`}
              >
                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h3 className="text-xs sm:text-sm font-medium text-center">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
        <button
          className="group/btn relative block h-10 w-full rounded-md
             bg-gradient-to-br from-black to-neutral-600
             font-medium text-white
             shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
             dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900
             dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]
             border-2 hover:cursor-pointer hover:text-black hover:bg-green-400
             transition-colors duration-700 ease-in-out"
          type="submit"
          onClick={() => navigate("/listingpage3")}
          disabled={!category}
        >
          Next &rarr;
          <BottomGradient />
        </button>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
export default ListingPage2;
