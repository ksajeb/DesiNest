import React, { createContext, useState } from "react";
export const AuthDataContext = createContext(null);

function AuthContext({ children }) {
  let serverUrl = "http://localhost:8080";
  let serverUrl2 = "http://localhost:8097";
  let serverUrl3 = "http://localhost:8080";

  let [loading, setLoading] = useState(false);

  const value = {
    serverUrl,
    serverUrl2,
    serverUrl3,
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
