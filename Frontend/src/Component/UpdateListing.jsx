import React, { useContext } from "react";
import { X } from "lucide-react";
import { ListingDataContext } from "@/Context/ListingContext";
import { MdWhatshot, MdOutlinePool, MdBedroomParent } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { IoBedOutline } from "react-icons/io5";
import { SiHomeassistantcommunitystore } from "react-icons/si";

function UpdateListing({ listingId, onClose }) {
  const {
    title,
    description,
    rent,
    city,
    landmark,
    images,
    setTitle,
    setDescription,
    setRent,
    setCity,
    setLandmark,
    setImages,
    updateListing,
    adding,
    category,
    setCategory,
  } = useContext(ListingDataContext);

  const trendingItems = [
    { icon: MdWhatshot, title: "Hotel", value: "HOTEL" },
    { icon: GiFamilyHouse, title: "Villa", value: "VILLA" },
    { icon: FaTreeCity, title: "Farm Stay", value: "FARM_STAY" },
    { icon: MdOutlinePool, title: "Resort", value: "RESORT" },
    { icon: MdBedroomParent, title: "Apartment", value: "APARTMENT" },
    { icon: BiBuildingHouse, title: "Apartment", value: "APARTMENT" },
    { icon: IoBedOutline, title: "PG", value: "HOSTEL" },
    { icon: GiWoodCabin, title: "Cottage", value: "COTTAGE" },
    {
      icon: SiHomeassistantcommunitystore,
      title: "Boutique",
      value: "BOUTIQUE",
    },
    { icon: FaTreeCity, title: "Tree House", value: "TREE_HOUSE" },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000c7] z-50 backdrop-blur-md">
      <div
        className="bg-[#111] rounded-2xl p-6 shadow-2xl 
                max-h-[90vh] overflow-y-auto"
      >
        <form className="w-[420px] flex flex-col gap-6">
          {/* TITLE */}
          <div className="flex flex-col gap-2">
            <label className="text-lg text-white">Title</label>
            <input
              type="text"
              className="w-full h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-lg text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-2">
            <label className="text-lg text-white">Description</label>
            <textarea
              className="w-full h-40 rounded-lg bg-transparent border border-gray-500 px-4 py-3 text-lg text-white resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
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
              className="w-full h-12 rounded-lg bg-transparent border border-gray-500 text-white cursor-pointer
    file:bg-[#FF4163] file:border-none file:text-white file:px-4 file:h-12
    file:rounded-lg file:cursor-pointer file:font-medium"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RENT */}
          <div className="flex flex-col gap-3">
            <label className="text-lg text-white">Rent</label>
            <input
              type="text"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-white"
              placeholder="Rent"
            />
          </div>

          {/* CITY */}
          <div className="flex flex-col gap-3">
            <label className="text-lg text-white">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-white"
              placeholder="City"
            />
          </div>

          {/* LANDMARK */}
          <div className="flex flex-col gap-3">
            <label className="text-lg text-white">Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="h-12 rounded-lg bg-transparent border border-gray-500 px-4 text-white"
              placeholder="Landmark"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-lg text-white">Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 rounded-lg bg-black border border-gray-500 px-4 text-white"
              required
            >
              <option value="" className="text-lg bg-none">
                Select category
              </option>

              {trendingItems
                .filter(
                  (item, index, self) =>
                    index === self.findIndex((t) => t.value === item.value),
                )
                .map(({ value, title }) => (
                  <option key={value} value={value}>
                    {title}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="button"
            disabled={adding}
            onClick={() => updateListing(listingId, onClose)}
            className="group/btn relative block h-10 w-full rounded-md
    bg-gradient-to-br from-black to-neutral-600
    font-medium text-white
    shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
    dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900
    dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]
    border-2 hover:cursor-pointer hover:text-black transition-colors duration-700 ease-in-out hover:bg-green-500
"
          >
            {adding ? "Updating..." : "Update Listing"}
            <BottomGradient />
          </button>
        </form>
      </div>

      <X
        className="fixed top-6 left-10 z-50 w-10 h-10 cursor-pointer text-white"
        onClick={() => {
          onClose();
        }}
      />
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
export default UpdateListing;
