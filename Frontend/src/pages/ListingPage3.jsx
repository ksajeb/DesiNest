import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";
import { ListingDataContext } from "@/Context/ListingContext";
import { Landmark } from "lucide-react";

function ListingPage3() {
  const navigate = useNavigate();

  const {
    title,
    description,
    rent,
    city,
    category,
    images,
    landmark,
    handleAddListing,
    adding,
    setAdding,
  } = useContext(ListingDataContext);

  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] relative">
      {/* BACK BUTTON */}
      <div
        className="fixed top-6 left-10 z-50 w-[100px] h-[40px] bg-[#FF4163] hover:bg-[#AA001F]
        cursor-pointer rounded-2xl flex justify-center items-center text-white"
        onClick={() => navigate("/listingpage2")}
      >
        <IoArrowBackOutline className="w-6 h-6" />
      </div>

      {/* RIGHT BUTTON */}
      {/* <div className="fixed top-6 right-10 z-50">
        <button className="px-8 py-2 rounded-full bg-[#FF4163] hover:bg-[#AA001F] text-lg text-white">
          Setup Your Category
        </button>
      </div> */}

      {/* ================= MAIN CONTENT ================= */}
      <div className="pt-28 px-6 md:px-10 max-w-7xl mx-auto">
        {/* TITLE */}
        <h1 className="text-white text-3xl font-semibold mb-8">
          In <span className="text-[#FF4163]">{title?.toUpperCase()}</span>,{" "}
          <span className="text-[#FF4163]">{city?.toUpperCase()}</span>
        </h1>

        {/* ================= IMAGE GALLERY ================= */}
        {images?.length > 0 && (
          <div
            className="
              grid grid-cols-1
              md:grid-cols-4
              md:grid-rows-2
              gap-3
              rounded-2xl
              overflow-hidden
              h-[420px]
              cursor-pointer
            "
            onClick={() => setShowGallery(true)}
          >
            {/* BIG IMAGE */}
            <div className="md:col-span-2 md:row-span-2 overflow-hidden">
              <img
                src={URL.createObjectURL(images[0])}
                alt="main"
                className="w-full h-full object-cover"
              />
            </div>

            {/* SMALL IMAGES (2–5) */}
            {images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />

                {/* SHOW ALL PHOTOS BUTTON */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-end p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGallery(true);
                      }}
                      className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Show all photos
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= LISTING DETAILS ================= */}
        <div className="mt-10  rounded-2xl p-6 space-y-6">
          {/* DESCRIPTION */}
          {description && (
            <div>
              {/* <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-1">
                Description
              </h3> */}
              <p className="text-white text-lg leading-relaxed">
                {landmark.toUpperCase()}
              </p>
            </div>
          )}

          {/* CATEGORY & RENT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {category && (
              <div>
                {/* <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-1">
                  Category
                </h3> */}
                <p className="text-[#FF4163] text-xl font-semibold">
                  {description}
                </p>
              </div>
            )}

            {rent && (
              <div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-1">
                  Rent
                </h3>
                <p className="text-[#FF4163] text-xl font-semibold">
                  ₹ {rent} / day
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="group/btn relative block h-10 w-full rounded-md
             bg-gradient-to-br from-black to-neutral-600
             font-medium text-white
             shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
             dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900
             dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]
             border-2 hover:cursor-pointer hover:text-black hover:bg-green-400
             duration-200 delay-100"
              onClick={handleAddListing}
              disabled={adding}
            >
              {adding ? "Adding...." : "Add Listing"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= FULLSCREEN GALLERY ================= */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-[999] overflow-y-auto">
          <div className="flex justify-between items-center p-6">
            <h2 className="text-white text-xl font-semibold">
              All Photos ({images.length})
            </h2>
            <button
              onClick={() => setShowGallery(false)}
              className="text-white text-2xl"
            >
              <IoClose />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt="gallery"
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingPage3;
