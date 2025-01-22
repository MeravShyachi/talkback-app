import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state on app initialization

  useEffect(() => {
    const validateToken = async () => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axiosInstance.get("/validate-token");
          setUser(response.data.user); // Set the user if the token is valid
        } catch (err) {
          console.error("Token validation failed:", err);
          sessionStorage.removeItem("authToken"); // Clear invalid token
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
