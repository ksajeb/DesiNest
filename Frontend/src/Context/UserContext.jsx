import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";
import axios from "axios";

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
      setUserData(null);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);


  return (
    <UserDataContext.Provider value={{ userData, setUserData, getCurrentUser }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
