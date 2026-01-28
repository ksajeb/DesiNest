import { ListingDataContext } from "@/Context/ListingContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";
import { UserDataContext } from "@/Context/UserContext";
import UpdateListing from "@/Component/UpdateListing";

function ViewCard() {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { cardDetails, getListingById, deleteListing } =
    useContext(ListingDataContext);
  const { userData } = useContext(UserDataContext);
  const [updatePopUp, setUpdatePopUp] = useState(false);

  const [showGallery, setShowGallery] = useState(false);
  const { id } = useParams();

  let { setTitle, setDescription, setRent, setCity, setLandmark, setImages } =
    useContext(ListingDataContext);
  let { deleting } = useContext(ListingDataContext);

  useEffect(() => {
    if (id) {
      getListingById(id);
    }
  }, [id]);

  if (!cardDetails) {
    return (
      <div className="w-full min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">
        Loading listing...
      </div>
    );
  }

  const { title, description, rent, city, category, images, landmark } =
    cardDetails;

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] relative">
      {/* BACK BUTTON */}
      <div
        className="fixed top-6 left-10 z-50 w-[100px] h-[40px] bg-[#FF4163] hover:bg-[#AA001F]
          cursor-pointer rounded-2xl flex justify-center items-center text-white"
        onClick={() => navigate("/")}
      >
        <IoArrowBackOutline className="w-6 h-6" />
      </div>

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
                src={images[0]}
                alt="main"
                className="w-full h-full object-cover"
              />
            </div>

            {/* SMALL IMAGES (2–5) */}
            {images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-full object-cover"
                />

                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-end p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGallery(true);
                      }}
                      className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
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
        <div className="mt-10 rounded-2xl bg-[#111] border border-white/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN: DESCRIPTION + LANDMARK */}
            <div className="space-y-6">
              {/* DESCRIPTION */}
              {description && (
                <div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                    Description
                  </h3>
                  <p
                    className={`text-white text-base leading-relaxed ${
                      showFullDesc ? "" : "line-clamp-5"
                    }`}
                  >
                    {description}
                  </p>
                  {description.split(" ").length > 20 && (
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="text-sm text-[#FF4163] mt-1 hover:underline"
                    >
                      {showFullDesc ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              {/* LANDMARK */}
              {landmark && (
                <div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                    Landmark
                  </h3>
                  <p className="text-white text-lg font-medium">{landmark}</p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: CATEGORY + RENT */}
            <div className="space-y-6">
              {/* CATEGORY */}
              {category && (
                <div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                    Category
                  </h3>
                  <p className="text-[#FF4163] text-xl font-semibold">
                    {category}
                  </p>
                </div>
              )}

              {/* RENT */}
              {rent && (
                <div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                    Rent
                  </h3>
                  <p className="text-[#FF4163] text-xl font-semibold">
                    ₹ {rent}{" "}
                    <span className="text-xl font-semibold text-gray-400">
                      / day
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ================= ACTION BUTTONS ================= */}
        <div className="mt-6 pb-10 w-full">
          {cardDetails.ownerUserId === userData?.id && (
            <div className="flex gap-4">
              <button
                className="group/btn relative block h-10 w-1/2 rounded-md
    bg-gradient-to-br from-black to-neutral-600
    font-medium text-white
    shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
    dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900
    dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]
    border-2 hover:cursor-pointer hover:text-black transition-colors duration-700 ease-in-out hover:bg-green-500
"
                onClick={() => {
                  setTitle(cardDetails.title);
                  setDescription(cardDetails.description);
                  setRent(cardDetails.rent);
                  setCity(cardDetails.city);
                  setLandmark(cardDetails.landmark);
                  setImages(cardDetails.images);
                  setUpdatePopUp(true);
                }}
              >
                Edit Listing
              </button>
              <button
                className="group/btn relative block h-10 w-1/2 rounded-md
    bg-gradient-to-br from-black to-neutral-600
    font-medium text-white
    shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
    dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900
    dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]
    border-2 hover:cursor-pointer hover:text-black transition-colors duration-700 ease-in-out hover:bg-red-500"
                onClick={deleteListing}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}

          {cardDetails.ownerUserId != userData?.id && (
            <div className="flex justify-center">
              <button
                className="group/btn relative block h-10 w-1/2 rounded-md
        bg-gradient-to-br from-black to-neutral-600
        font-medium text-white
        shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
        border-2 hover:cursor-pointer hover:text-black
        transition-colors duration-700 ease-in-out hover:bg-green-500"
              onClick={()=>navigate("/booking")}>
                Reserve
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= FULLSCREEN GALLERY ================= */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-999 ">
          <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-black/80 backdrop-blur-md z-[1000] border-b border-white/10">
            <h2 className="text-white text-xl font-semibold">
              All Photos ({images.length})
            </h2>
            <button
              onClick={() => setShowGallery(false)}
              className="text-white text-2xl"
            >
              <IoClose className="cursor-pointer" />
            </button>
          </div>

          <div className="overflow-y-auto h-full pt-24 px-6 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="gallery"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* update listing page */}
      {updatePopUp && (
        <UpdateListing
          listingId={cardDetails.id}
          onClose={() => setUpdatePopUp(false)}
        />
      )}
    </div>
  );
}

export default ViewCard;
