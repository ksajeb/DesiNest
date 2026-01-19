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
    <div className="w-full min-h-screen bg-[#1a1a1a] relative flex justify-center overflow-y-auto">
      {/* Back Button */}
      <div
        className="fixed top-6 left-10 z-50 w-[100px] h-[40px] bg-[#FF4163] hover:bg-[#AA001F]
             cursor-pointer rounded-2xl flex justify-center items-center text-white"
        onClick={() => navigate("/")}
      >
        <IoArrowBackOutline className="w-6 h-6" />
      </div>

      {/* Right Button */}
      <div className="fixed top-6 right-10 z-50">
        <button className="px-8 py-2 rounded-full bg-[#FF4163] hover:bg-[#AA001F] text-lg text-white">
          Setup your home
        </button>
      </div>

      {/* FORM */}
      <form
        className="w-[420px] flex flex-col gap-6 pt-32 pb-20"
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
            className="w-full h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-lg text-white focus:outline-none focus:border-[#FF4163]"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <label className="text-lg text-white">Description</label>
          <textarea
            className="w-full h-40 rounded-lg bg-transparent border border-gray-500 px-4 py-3 text-lg text-white resize-none focus:outline-none focus:border-[#FF4163]"
            required
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col gap-3">
          <label className="text-lg text-white">Upload Images</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-white cursor-pointer
                       file:bg-[#FF4163] file:border-none file:text-white file:px-4 file:py-2
                       file:rounded-lg file:cursor-pointer"
          />

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-2 cursor-pointer">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                    className="w-full h-24 object-cover rounded-lg border border-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXTRA TITLE */}
        <div className="flex flex-col gap-2">
          <label className="text-lg text-white">Rent</label>
          <input
            type="text"
            className="w-full h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-lg text-white focus:outline-none focus:border-[#FF4163]"
            required
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg text-white">City</label>
          <input
            type="text"
            className="w-full h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-lg text-white focus:outline-none focus:border-[#FF4163]"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg text-white">Landmark</label>
          <input
            type="text"
            className="w-full h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-lg text-white focus:outline-none focus:border-[#FF4163]"
            required
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
        </div>

        <div>
          <button
            className="group/btn relative block h-10 w-full rounded-md
             bg-gradient-to-br from-black to-neutral-600
             font-medium text-white
             shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
             dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900
             dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]
             border-2 hover:cursor-pointer hover:text-black hover:bg-green-400
             duration-200 delay-100"
            type="submit"
            onClick={() => navigate("/listingpage2")}
          >
            Next &rarr;
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

export default ListingPage1;
