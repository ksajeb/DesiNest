import React, { createContext, useState } from "react";
export const AuthDataContext = createContext(null);

function AuthContext({ children }) {
  let serverUrl = "http://localhost:8096";
  let serverUrl2 = "http://localhost:8097";
  let [loading, setLoading] = useState(false);

  const value = {
    serverUrl,
    serverUrl2,
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
