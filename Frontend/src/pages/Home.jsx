import Card from "@/Component/Card";
import Navbar from "@/Component/Navbar";
import { ListingDataContext } from "@/Context/ListingContext";
import React, { useContext } from "react";
import HomePage from "./HomePage";
import HomePageListing from "./HomePageListing";
import ChooseUs from "./ChooseUs";
import Footer from "./Footer";

function Home() {
  const { listingData } = useContext(ListingDataContext);

  return (
    <div>
      <Navbar />
      <HomePage />
      <div className="px-24 mt-16  flex flex-col justify-center items-center">
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
    px-24
    py-12"
      >
        {listingData.slice(0, 8).map((list) => (
          <Card key={list.id} list={list} />
        ))}
      </div>
      <HomePageListing />
      <ChooseUs />
      <Footer />
    </div>
  );
}

export default Home;
