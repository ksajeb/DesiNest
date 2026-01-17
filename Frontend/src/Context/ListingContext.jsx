import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import { WiNightClear } from "react-icons/wi";
import { useNavigate } from "react-router-dom";

export const ListingDataContext = createContext();

function ListingContext({ children }) {
  let { serverUrl2 } = useContext(AuthDataContext);
  let navigate = useNavigate();
  let [adding, setAdding] = useState(false);
  let [listingData, setListingData] = useState([]);
  let [allListingData, setAllListingData] = useState([]);
  let [activeCategory, setActiveCategory] = useState("Trending");

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [ownerUserId, setOwnerUserId] = useState("");
  const [rent, setRent] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);

  const handleAddListing = async () => {
    setAdding(true);
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("ownerUserId", Number(ownerUserId));
      formData.append("rent", Number(rent));
      formData.append("city", city);
      formData.append("landmark", landmark);
      formData.append("category", category);

      // Append multiple images
      images.forEach((file) => {
        formData.append("images", file);
      });

      let result = await axios.post(serverUrl2 + "/listing", formData, {
        withCredentials: true,
      });
      setAdding(false);
      console.log(result);
      navigate("/");
      setTitle("");
      setDescription("");
      setOwnerUserId("");
      setRent("");
      setCity("");
      setLandmark("");
      setCategory("");
      setImages([]);
    } catch (error) {
      setAdding(false);
      console.log(error);
    }
  };

  const getListing = async () => {
    try {
      const result = await axios.get(serverUrl2 + "/listing", {
        withCredentials: true,
      });
      setListingData(result.data);
      setAllListingData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);

    if (category === "Trending") {
      setListingData(allListingData);
      return;
    }

    const filtered = allListingData.filter(
      (item) => item.category === category
    );

    setListingData(filtered);
  };

  useEffect(() => {
    getListing();
  }, [adding]);

  const value = {
    listingData,
    setListingData,
    allListingData,
    filterByCategory,
    activeCategory,

    // existing fields
    title,
    setTitle,
    description,
    setDescription,
    ownerUserId,
    setOwnerUserId,
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
  };

  return (
    <ListingDataContext.Provider value={value}>
      {children}
    </ListingDataContext.Provider>
  );
}

export default ListingContext;
