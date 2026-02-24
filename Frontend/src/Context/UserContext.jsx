import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

export const UserDataContext = createContext();

function UserContext({ children }) {
  const { serverUrl } = useContext(AuthDataContext);
  const [userData, setUserData] = useState(null);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserData(null);
        return;
      }

      const result = await axios.get(`${serverUrl}/users/curr/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(result.data);
    } catch (error) {
      console.log("User fetch failed", error);
      setUserData(null);
    }
  };

  const signup = async (data) => {
    try {
      const result = await axios.post(`${serverUrl}/auth/signup`, data);
      // save jwt
      localStorage.setItem("token", result.data.jwt);
      // fetch user
      await getCurrentUser();
      toast.success("Signup successful 🎉");

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed ❌");
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await axios.post(`${serverUrl}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", result.data.jwt);

      await getCurrentUser();

      toast.success("Login successful 🎉");

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password ❌",
      );
      return false;
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
    signup,
    login,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
