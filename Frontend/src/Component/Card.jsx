import { ListingDataContext } from "@/Context/ListingContext";
import { UserDataContext } from "@/Context/UserContext";
import { useContext, useState } from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Card({ list }) {
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const [liked, setLiked] = useState(false);
  const { getListingById } = useContext(ListingDataContext);

  const handleClick = (id) => {
    if (userData) {
      getListingById(id);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="
   cursor-pointer w-full
  "
      onClick={() => handleClick(list.id)}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-neutral-800">
        <img
          src={list.images?.[0]}
          alt={list.title}
          className=" w-full
    h-full
    object-cover
    object-center
    transition-transform
    duration-300
    hover:scale-105
    select-none"
        />

        {/* Badge */}
        <span className="absolute top-3 left-3 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow">
          Guest favourite
        </span>

        {/* Heart */}
        <FaHeart
          className={`absolute top-3 right-3 text-xl drop-shadow-md hover:scale-110 transition
    ${liked ? "text-red-500" : "text-white"}`}
          onClick={(e) => {
            e.stopPropagation();

            if (!userData) {
              navigate("/login");
              return;
            }

            setLiked((prev) => !prev);
          }}
        />
      </div>

      {/* Content */}
      <div className="mt-1 ">
        <div className="flex justify-between items-start">
          <h3 className="text-white text-sm truncate mix-blend-difference">
            Room in {list.landmark}
          </h3>
        </div>

        <p className="text-gray-400 text-xs">₹{list.rent} for 3 nights</p>
      </div>
    </div>
  );
}

export default Card;
