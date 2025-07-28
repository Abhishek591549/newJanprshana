// src/context/UserContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Custom hook to use UserContext easily
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUser(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
