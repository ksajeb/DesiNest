import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./UserContext";
import { toast } from "react-toastify";

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
  const [cardDetails, setCardDetails] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [maxGuests, setMaxGuests] = useState("");

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
      formData.append("maxGuests", Number(maxGuests));

      images.forEach((file) => formData.append("images", file));

      await axios.post(`${serverUrl2}/listings`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Listing added successfully 🎉");
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
      setMaxGuests("");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to add listing ❌");
    } finally {
      setAdding(false);
    }
  };

  // Fetch all listings
  const getListing = async () => {
    try {
      const result = await axios.get(`${serverUrl2}/listings`, {
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
        `${serverUrl2}/listings/user/${userData.id}`,
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

  const getListingById = async (id) => {
    if (!id) return;

    try {
      const result = await axios.get(`${serverUrl2}/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCardDetails(result.data);
      navigate(`/viewcard/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const updateListing = async (listingId, onSuccess) => {
    if (!userData?.id) {
      navigate("/login");
      return;
    }

    setAdding(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("rent", Number(rent));
      formData.append("city", city);
      formData.append("landmark", landmark);
      formData.append("category", category);
      formData.append("maxGuests", Number(maxGuests));

      images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      await axios.put(`${serverUrl2}/listings/${listingId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Listing updated successfully 🎉");
      await getListing();
      navigate(`/viewcard/${listingId}`);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Update failed", error);
      toast.error(
        error?.response?.data?.message || "Failed to update listing ❌",
      );
    } finally {
      setAdding(false);
    }
  };

  //delete listing
  const deleteListing = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${serverUrl2}/listings/${cardDetails.id}`, {
        withCredentials: true,
      });
      toast.success("Listing deleted successfully 🗑️");
      setDeleting(false);
      await getListing();
      navigate("/");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete listing ❌",
      );
      setDeleting(false);
    }
  };

  useEffect(() => {
    getListing();
  }, [deleting]);

  const searchListingsByDates = async (startDate, endDate) => {
    try {
      const result = await axios.get(
        `${serverUrl2}/listings/between-dates?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setListingData(result.data);
    } catch (error) {
      console.error("Date search failed", error);
      toast.error("No listings found for selected dates ❌");
      setListingData([]);
    }
  };

  const searchListings = async ({ city, startDate, endDate, guests }) => {
    try {
      const params = new URLSearchParams();

      if (city) params.append("city", city);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (guests) params.append("guests", guests);

      const result = await axios.get(
        `${serverUrl2}/listings/search?${params.toString()}`,
      );

      setListingData(result.data);
    } catch (error) {
      console.error("Search failed", error);
      setListingData([]);
    }
  };

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
    getListingById,
    cardDetails,
    setCardDetails,
    updateListing,
    deleteListing,
    deleting,
    setDeleting,
    searchListingsByDates,
    searchListings,
    getListing,
    maxGuests,
    setMaxGuests,
  };

  return (
    <ListingDataContext.Provider value={value}>
      {children}
    </ListingDataContext.Provider>
  );
}

export default ListingContext;
