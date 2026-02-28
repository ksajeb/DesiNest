import Card from "@/Component/Card";
import Navbar from "@/Component/Navbar";
import { ListingDataContext } from "@/Context/ListingContext";
import React, { useContext } from "react";
import HomePage from "./HomePage";
import HomePageListing from "./HomePageListing";
import ChooseUs from "./ChooseUs";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Newsletter from "./Newsletter";

function Home() {
  const { listingData } = useContext(ListingDataContext);
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };
  const shuffledListings = shuffleArray(listingData).slice(0, 8);
  const totalListings = listingData?.length || 0;
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <HomePage />
      <div className="px-6 md:px-12 lg:px-24 mt-16 flex flex-col justify-center items-center">
        <h2 className="text-5xl font-bold">Featured Stays</h2>
        <p className="my-4 text-2xl text-[#6C7A96]">
          Handpicked properties for unforgettable experiences
        </p>
      </div>

      <div
        className="grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-3
    xl:grid-cols-4
    gap-8
    px-6 md:px-12 lg:px-24
    py-12"
      >
        {shuffledListings.slice(0, 8).map((list) => (
          <Card key={list.id} list={list} />
        ))}
        {/* <button>Explore all Listings</button> */}
      </div>
      <div className="flex justify-center mb-16">
        <button
          onClick={() => navigate("/hotels")}
          className="hidden md:block cursor-pointer rounded-lg px-20 py-5 bg-[#FA6432] hover:bg-[#FA6436] text-white hover:duration-500 hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)] font-semibold hover:-translate-y-1.5"
        >
          Explore all {totalListings} Hotel{totalListings !== 1 ? "s" : ""}
        </button>
      </div>
      <HomePageListing />
      <ChooseUs />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Home;
