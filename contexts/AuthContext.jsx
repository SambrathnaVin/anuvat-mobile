import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService"; // Import the service logic

const AuthContext = createContext(null); // Initialize with null

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check and set the current user state
  const checkUser = async () => {
    setLoading(true);
    try {
      // authService.getCurrentUser attempts to validate the token and returns user data
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      setUser(null);
      // Ensure the error is only logged, not crashing the app
      console.error("User check failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    // After successful login, set the user data
    await checkUser();
    return userData;
  };

  // Register function (assuming name is included)
  const register = async (email, password, name) => {
    const userData = await authService.register(email, password, name);
    // After successful registration, set the user data
    await checkUser();
    return userData;
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null); // Clear local user state
    setLoading(false);
  };

  // Check user on initial load
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, checkUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
