import { ListingDataContext } from "@/Context/ListingContext";
import React, { useContext } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ListingPage1() {
  const navigate = useNavigate();

  let {
    title,
    setTitle,
    description,
    setDescription,
    rent,
    setRent,
    city,
    setCity,
    landmark,
    setLandmark,
    images,
    setImages,
    maxGuests,
    setMaxGuests,
  } = useContext(ListingDataContext);

  // Handle multiple image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove selected image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    // <div className="w-full min-h-screen bg-[#1a1a1a] relative flex flex-col items-center overflow-y-auto">
    <div className="w-full min-h-screen bg-[#1a1a1a] relative flex flex-col items-center overflow-y-auto">
      {/* HEADER */}
      <div className="w-full text-center pt-20 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Create Your Listing
        </h1>

        <p className="text-gray-400 mt-3 max-w-xl mx-auto">
          Share details about your place — add photos, description, and pricing
          so guests can discover your property easily.
        </p>
      </div>

      <form
        className="w-[700px] max-w-full flex flex-col gap-6 pt-4 pb-20 px-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/listingpage2");
        }}
      >
        {/* TITLE */}
        <div className="flex flex-col gap-2">
          <label className="text-lg text-white">Title</label>
          <input
            type="text"
            className="input"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <label className="text-lg text-white">Description</label>
          <textarea
            className="textarea"
            required
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>

        {/* IMAGE */}
        <div className="flex flex-col gap-3">
          <label className="text-lg text-white">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full h-12 rounded-lg bg-transparent border border-gray-600 text-white cursor-pointer
    file:bg-gradient-to-r file:from-[#FA6436] file:to-[#FF4163]
    file:border-none file:text-white file:px-4 file:h-12
    file:rounded-lg file:cursor-pointer file:font-medium
    hover:border-[#FA6436] transition"
          />
          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-gray-600"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-32 object-cover"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/70 text-white
                     w-7 h-7 rounded-full flex items-center justify-center
                     opacity-100 transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GRID ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-white">Rent</label>
            <input
              type="text"
              className="input"
              required
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white">City</label>
            <input
              type="text"
              className="input"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white">Max Guests</label>
            <input
              type="number"
              className="input"
              required
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white">Landmark</label>
            <input
              type="text"
              className="input"
              required
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>
        </div>

        {/* BUTTON */}
        {/* BUTTONS */}
        <div className="flex gap-4 mt-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 h-12
      cursor-pointer rounded-xl flex justify-center items-center text-white
      bg-[#FA6436]
      hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)]
      hover:-translate-y-1
      transition duration-700"
          >
            <IoArrowBackOutline className="w-6 h-6 mr-2" />
            Back
          </button>

          {/* Next Button */}
          <button
            type="submit"
            className="flex-1 h-12
      cursor-pointer rounded-xl flex justify-center items-center text-white
      bg-[#FA6436]
      hover:shadow-[0_8px_25px_rgba(250,100,50,0.6)]
      hover:-translate-y-1
      transition duration-700"
          >
            Next →
          </button>
        </div>
      </form>
    </div>
  );
}

export default ListingPage1;
