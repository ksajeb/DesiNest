import Card from "@/Component/Card";
import Navbar from "@/Component/Navbar";
import { ListingDataContext } from "@/Context/ListingContext";
import React, { useContext, useEffect, useState } from "react";

const nearbyPlaces = [
  "Mahalakshmi Race Course",
  "Gateway of India",
  "Marine Drive",
  "Bandra Bandstand",
  "Juhu Beach",
];

function Home() {
  const { listingData } = useContext(ListingDataContext);
  const [place, setPlace] = useState("");

  useEffect(() => {
    setPlace(nearbyPlaces[Math.floor(Math.random() * nearbyPlaces.length)]);
  }, []);

  return (
    <div>
      <Navbar />

      <h2 className="px-24 mb-4 text-[20px] font-semibold">
        Stay near {place}
      </h2>
      <div
        className="grid
    gap-4
    px-24
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-5
    xl:grid-cols-7"
      >
        {listingData.map((list) => (
          <Card key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}

export default Home;
