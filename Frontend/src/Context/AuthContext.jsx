import React, { createContext, useState } from "react";
export const AuthDataContext = createContext(null);

function AuthContext({ children }) {
  let serverUrl = "https://api-gateway-5rab.onrender.com";

  let [loading, setLoading] = useState(false);

  const value = {
    serverUrl,
    loading,
    setLoading,
  };
  return (
    <div>
      <AuthDataContext.Provider value={value}>
        {children}
      </AuthDataContext.Provider>
    </div>
  );
}

export default AuthContext;
