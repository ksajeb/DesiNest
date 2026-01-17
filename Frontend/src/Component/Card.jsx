import { FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Card({ list }) {
  const navigate = useNavigate();
  return (
    <div className="w-[280px] cursor-pointer mx-9">
      {/* Image */}
      <div className="relative w-full h-[260px] rounded-xl overflow-hidden">
        <img
          src={list.images?.[0]}
          alt={list.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Badge */}
        <span className="absolute top-3 left-3 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
          Guest favourite
        </span>

        {/* Heart */}
        <FaHeart
          className="absolute top-3 right-3 text-white text-xl drop-shadow-md hover:scale-110 transition"
          onClick={() => navigate("/login")}
        />
      </div>

      {/* Content */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-white text-lg truncate">
            Place to stay in {list.title}
          </h3>

          <div className="flex items-center gap-1 text-white text-sm">
            <FaStar className="text-xs" />
            <span>{list.rating ?? "New"}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm">₹{list.rent} for 2 nights</p>
      </div>
    </div>
  );
}

export default Card;
