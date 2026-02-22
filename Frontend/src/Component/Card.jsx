import { ListingDataContext } from "@/Context/ListingContext";
import { UserDataContext } from "@/Context/UserContext";
import { useContext } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Card({ list }) {
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const { getListingById } = useContext(ListingDataContext);

  const handleClick = (id) => {
  getListingById(id);
  navigate(`/listing/${id}`);
};

  return (
    <div
      onClick={() => handleClick(list.id)}
      className="
        cursor-pointer
        bg-white               
        rounded-3xl              
        shadow-md                
        hover:shadow-xl          
        transition-all
        duration-300
        overflow-hidden
      "
    >
      {/* Image Section */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={list.images?.[0]}
          alt={list.title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-300
            hover:scale-110      
          "
        />

        {/*Category Badge (Featured) */}
        <span
          className="
            absolute
            top-4
            right-4
            bg-white/90
            backdrop-blur
            px-4
            py-1
            rounded-full
            text-sm
            font-semibold
            shadow
          "
        >
          {list.category || "Featured"}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800">
          {list.title || `Room in ${list.landmark}`}
        </h3>

        {/* Location with icon */}
        <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
          <FaMapMarkerAlt className="text-pink-500" />
          <span>{list.location || list.landmark}</span>
        </div>

        {/* Divider line */}
        <div className="border-t my-4"></div>

        {/*  Price + Rating Row */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div>
            <span className="text-2xl font-bold text-orange-500">
              ₹{list.rent}
            </span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-500 font-semibold">
            <FaStar />
            <span>{list.rating || "4.8"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
