import { ListingDataContext } from "@/Context/ListingContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoClose } from "react-icons/io5";
import { UserDataContext } from "@/Context/UserContext";
import UpdateListing from "@/Component/UpdateListing";
import BookingSummary from "@/Component/BookingSummary";
import { toast } from "react-toastify";
import { bookingDataContext } from "@/Context/BookingContext";
import Footer from "./Footer";

function ViewCard() {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { cardDetails, getListingById, deleteListing, deleting } =
    useContext(ListingDataContext);
  const { userData } = useContext(UserDataContext);
  const [updatePopUp, setUpdatePopUp] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const { id } = useParams();

  let { setTitle, setDescription, setRent, setCity, setLandmark, setImages } =
    useContext(ListingDataContext);
  let { totalAmount } = useContext(bookingDataContext);

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

  const handleBooking = () => {
    if (!userData) {
      toast.error("Please login first 🔐");
      navigate("/login");
      return;
    }
    console.log("Total Amount:", totalAmount);
    if (!totalAmount || totalAmount <= 0) {
      toast.warning("Please select booking dates first 📅");
      return;
    }
    navigate(`/booking`);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] relative">
      {/* BACK BUTTON */}
      <div
        className="pt-10 ml-12 flex items-center gap-1
  text-white cursor-pointer font-medium 
  hover:text-[#FA6436] transition duration-300"
        onClick={() => navigate("/")}
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span>Back to results</span>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="pt-16 px-6 md:px-10 max-w-7xl mx-auto">
        {/* TITLE */}
        <h1 className="text-white text-md font-semibold mb-1">
          <span className="text-white">{title?.toUpperCase()}</span> {" "}
          <span className="text-white">{category?.toUpperCase()}</span>
        </h1>

        {/* ================= IMAGE GALLERY ================= */}
        {images?.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3
            rounded-2xl overflow-hidden h-[420px] cursor-pointer"
            onClick={() => setShowGallery(true)}
          >
            <div className="md:col-span-2 md:row-span-2 overflow-hidden">
              <img
                src={images[0]}
                alt="main"
                className="w-full h-full object-cover"
              />
            </div>

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

        
        {/* ================= LISTING DETAILS + BOOKING SIDE BY SIDE ================= */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT → LISTING DETAILS ================= */}
          <div
            className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 
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
                <InfoItem label="Title" value={title} />
                <Divider />

                <InfoItem
                  label="Description"
                  value={description}
                  isDescription
                  showFullDesc={showFullDesc}
                  setShowFullDesc={setShowFullDesc}
                />

                <Divider />
                <InfoItem label="City" value={city} />
                <Divider />
                <InfoItem label="Landmark" value={landmark} />
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <InfoItem label="Category" value={category} highlight />
                <Divider />
                <InfoItem label="Rent" value={`₹ ${rent} / day`} />
              </div>
            </div>
          </div>

          {/* ================= RIGHT → BOOKING SUMMARY ================= */}
          {cardDetails.ownerUserId !== userData?.id && (
            <div className="lg:col-span-1 lg:sticky lg:top-28 h-fit">
              {/* BOOKING SUMMARY CARD */}
              <div
                className="bg-white/5 backdrop-blur-md border border-white/10 
      rounded-2xl p-6 shadow-2xl"
              >
                <BookingSummary />

                {/* BOOK BUTTON */}
                <button
                  className="mt-4 w-full h-11 rounded-lg
          bg-gradient-to-r from-[#FA6436] via-[#ff7a50] to-[#FF4163]
          text-white font-semibold tracking-wide
          shadow-lg shadow-[#FA6436]/25
          hover:shadow-[0_12px_35px_rgba(250,100,50,0.6)]
          hover:-translate-y-1 hover:scale-[1.03]
          active:scale-95
          transition duration-500 ease-out cursor-pointer"
                  onClick={handleBooking}
                >
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="mt-6 pb-10 w-full">
          {cardDetails.ownerUserId === userData?.id && (
            <div className="flex gap-4">
              {/* EDIT BUTTON */}
              <button
                className="h-11 w-1/2 rounded-lg
        bg-gradient-to-r from-[#FA6436] via-[#ff7a50] to-[#FF4163]
        text-white font-semibold tracking-wide
        shadow-lg shadow-[#FA6436]/20
        hover:shadow-[0_10px_30px_rgba(250,100,50,0.55)]
        hover:-translate-y-1 hover:scale-[1.02]
        active:scale-95
        transition duration-500 ease-out cursor-pointer"
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

              {/* DELETE BUTTON */}
              <button
                className="h-11 w-1/2 rounded-lg 
        bg-gradient-to-r from-[#FA6436] to-[#FF4163]
        text-white font-semibold tracking-wide
        shadow-lg shadow-[#FA6436]/20
        hover:shadow-[0_10px_30px_rgba(250,100,50,0.55)]
        hover:-translate-y-1 hover:scale-[1.02]
        active:scale-95
        transition duration-500 ease-out cursor-pointer"
                onClick={deleteListing}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : " Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= FULLSCREEN GALLERY ================= */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-[999]">
          <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
            <h2 className="text-white text-xl font-semibold">
              All Photos ({images.length})
            </h2>

            <button onClick={() => setShowGallery(false)}>
              <IoClose className="text-white text-2xl cursor-pointer" />
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

      {/* UPDATE POPUP */}
      {updatePopUp && (
        <UpdateListing
          listingId={cardDetails.id}
          onClose={() => setUpdatePopUp(false)}
        />
      )}
      <Footer />
    </div>
  );
}

/* ================= INFO ITEM ================= */
function InfoItem({
  label,
  value,
  highlight,
  isDescription,
  showFullDesc,
  setShowFullDesc,
}) {
  if (!value) return null;

  return (
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
        {label}
      </p>

      <p
        className={`text-lg font-semibold leading-relaxed ${
          highlight ? "text-[#FF4163]" : "text-white"
        } ${isDescription && !showFullDesc ? "line-clamp-3" : ""}`}
      >
        {value}
      </p>

      {isDescription && value?.length > 120 && (
        <button
          onClick={() => setShowFullDesc(!showFullDesc)}
          className="text-sm text-[#FF4163] mt-1 hover:underline"
        >
          {showFullDesc ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/* ================= DIVIDER ================= */
function Divider() {
  return <div className="w-full h-px bg-white/10" />;
}

export default ViewCard;
