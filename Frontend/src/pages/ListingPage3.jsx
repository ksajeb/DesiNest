import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoClose,
  IoHomeOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoPricetagOutline,
  IoBusinessOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";

import { ListingDataContext } from "@/Context/ListingContext";

function ListingPage3() {
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  const openGallery = () => {
    setShowGallery(true);
  };

  const {
    title,
    description,
    rent,
    city,
    category,
    images,
    landmark,
    maxGuests,
    handleAddListing,
    adding,
  } = useContext(ListingDataContext);

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] relative">
      <div className="pt-28 px-6 md:px-10 max-w-6xl mx-auto">
        {/* TITLE */}
        <h1 className="text-white text-3xl font-semibold mb-8">
          Review Your Listing
        </h1>

        {/* IMAGE GRID */}
        {/* IMAGE GRID */}
        {images?.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3
    rounded-2xl overflow-hidden h-[420px] shadow-xl"
          >
            {/* MAIN IMAGE */}
            <div className="md:col-span-2 md:row-span-2">
              <img
                src={URL.createObjectURL(images[0])}
                alt="main"
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-500"
                onClick={openGallery}
              />
            </div>

            {/* OTHER IMAGES */}
            {images.slice(1, 5).map((image, index) => {
              const isLastVisible = index === 3 && images.length > 5;

              return (
                <div
                  key={index}
                  className="relative w-full h-full cursor-pointer"
                  onClick={openGallery}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />

                  {/* SHOW ALL BUTTON OVERLAY */}
                  {isLastVisible && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <button
                        className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold
                hover:scale-105 transition cursor-pointer"
                      >
                        Show All Photos ({images.length})
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* DETAILS CARD */}
        <div
          className="mt-10 bg-white/5 backdrop-blur-md border border-white/10 
          rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* PRICE BADGE */}
          <div
            className="absolute top-6 right-6 bg-gradient-to-r from-[#FA6436] to-[#FF4163] 
          text-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold"
          >
            ₹ {rent} / day
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* LEFT */}
            <div className="space-y-6">
              <InfoItem icon={<IoHomeOutline />} label="Title" value={title} />

              <Divider />

              <InfoItem
                icon={<IoDocumentTextOutline />}
                label="Description"
                value={description}
              />

              <Divider />

              <InfoItem
                icon={<IoLocationOutline />}
                label="City"
                value={city}
              />

              <Divider />

              <InfoItem
                icon={<IoBusinessOutline />}
                label="Landmark"
                value={landmark}
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <InfoItem
                icon={<IoPricetagOutline />}
                label="Category"
                value={category}
                highlight
              />

              <Divider />

              <InfoItem
                icon={<IoPeopleOutline />}
                label="Max Guests"
                value={maxGuests}
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-10 pb-16 flex gap-4 w-full">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/listingpage2")}
            className="flex-1 h-12 rounded-xl flex justify-center items-center text-white
            bg-[#FA6436] hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)]
            hover:-translate-y-1 transition duration-500 cursor-pointer"
          >
            <IoArrowBackOutline className="w-6 h-6 mr-2" />
            Back
          </button>

          {/* Add Listing Button */}
          <button
            type="button"
            onClick={handleAddListing}
            disabled={adding}
            className={`flex-1 h-12 rounded-xl flex justify-center items-center text-white
            bg-gradient-to-r from-[#FA6436] to-[#FF4163]
            hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)]
            hover:-translate-y-1 transition duration-500 cursor-pointer
            ${
              adding
                ? "opacity-50 cursor-not-allowed hover:shadow-none hover:-translate-y-0"
                : ""
            }`}
          >
            {adding ? "Adding..." : "Add Listing"}
          </button>
        </div>
      </div>

      {/* FULLSCREEN GALLERY */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-[999] overflow-y-auto">
          <div className="flex justify-between items-center p-6">
            <h2 className="text-white text-xl font-semibold">
              All Photos ({images.length})
            </h2>

            <IoClose
              className="text-white text-2xl cursor-pointer"
              onClick={() => setShowGallery(false)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt="gallery"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition duration-500"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* INFO ITEM */
function InfoItem({ icon, label, value, highlight }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-4 group">
      {/* ICON */}
      <div
        className="text-[#FA6436] text-xl mt-1 
        group-hover:scale-110 transition duration-300"
      >
        {icon}
      </div>

      {/* TEXT */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
          {label}
        </p>

        <p
          className={`text-lg font-semibold leading-relaxed ${
            highlight ? "text-[#FF4163]" : "text-white"
          } ${label === "Description" ? "line-clamp-3" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* DIVIDER */
function Divider() {
  return <div className="w-full h-px bg-white/10" />;
}

export default ListingPage3;
