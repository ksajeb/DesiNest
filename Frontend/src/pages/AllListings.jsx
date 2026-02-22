import React, { useContext, useEffect } from "react";
import { ListingDataContext } from "@/Context/ListingContext";
import Card from "@/Component/Card";

const AllListings = () => {
  const { listingData, getListing } = useContext(ListingDataContext);

  useEffect(() => {
    getListing();
  }, []);

  return (
    <div className="w-full min-h-screen px-6 md:px-10 py-10">
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