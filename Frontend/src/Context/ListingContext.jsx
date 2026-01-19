import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./UserContext";

export const ListingDataContext = createContext();

function ListingContext({ children }) {
  const { serverUrl2 } = useContext(AuthDataContext);
  const { userData } = useContext(UserDataContext);

  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [listingData, setListingData] = useState([]);
  const [allListingData, setAllListingData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [myListings, setMyListings] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);

  // Add new listing
  const handleAddListing = async () => {
    if (!userData?.id) {
      navigate("/login");
      return;
    }

    setAdding(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ownerUserId", userData.id);
      formData.append("rent", Number(rent));
      formData.append("city", city);
      formData.append("landmark", landmark);
      formData.append("category", category);

      images.forEach((file) => formData.append("images", file));

      await axios.post(`${serverUrl2}/listing`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await getListing();
      navigate("/");

      // reset
      setTitle("");
      setDescription("");
      setRent("");
      setCity("");
      setLandmark("");
      setCategory("");
      setImages([]);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // Fetch all listings
  const getListing = async () => {
    try {
      const result = await axios.get(`${serverUrl2}/listing`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setListingData(result.data);
      setAllListingData(result.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setListingData([]);
        setAllListingData([]);
      } else {
        console.error("Error fetching listings:", error);
      }
    }
  };

  // Filter listings by category
  const filterByCategory = (category) => {
    setActiveCategory(category);

    if (category === "Trending") {
      setListingData(allListingData);
      return;
    }

    const filtered = allListingData.filter(
      (item) => item.category === category,
    );
    setListingData(filtered);
  };

  const getUsersListings = async () => {
    if (!userData?.id) return;

    try {
      const result = await axios.get(
        `${serverUrl2}/listing/user/${userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setMyListings(result.data || []);
    } catch (error) {
      setMyListings([]);
      console.error("Error fetching my listings:", error);
    }
  };

  // Fetch listings on mount
  useEffect(() => {
    getListing();
  }, []);

  const value = {
    listingData,
    setListingData,
    allListingData,
    filterByCategory,
    activeCategory,
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
    category,
    setCategory,
    images,
    setImages,
    handleAddListing,
    adding,
    myListings,
    getUsersListings,
  };

  return (
    <ListingDataContext.Provider value={value}>
      {children}
    </ListingDataContext.Provider>
  );
}

export default ListingContext;
