import Card from "@/Component/Card";
import Navbar from "@/Component/Navbar";
import { ListingDataContext } from "@/Context/ListingContext";
import React, { useContext } from "react";

function Home() {
  const { listingData } = useContext(ListingDataContext);

  return (
    <div>
      <Navbar />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6">
        {listingData.map((list) => (
          <Card key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}

export default Home;
