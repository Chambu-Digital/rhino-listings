// src/services/authService.js
import API, { setAuthToken } from "./api";

// 🔹 LOGIN
export const login = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  setAuthToken(token);

  // Notify navbar & other components
  window.dispatchEvent(new Event("userChanged"));
  return user;
};

// 🔹 REGISTER
export const register = async (formData) => {
  const res = await API.post("/auth/register", formData);
  const { token, user } = res.data;

  if (token && user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    window.dispatchEvent(new Event("userChanged"));
    return user;
  }

  return res.data;
};

// 🔹 LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setAuthToken(null);
  window.dispatchEvent(new Event("userChanged"));
};

// 🔹 GET CURRENT USER
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (!user || user === "undefined" || user === "null") {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return null;
  }
};

// 🔹 GET TOKEN
export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
};

// 🧠 NEW: Initialize Auth State on App Mount
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    setAuthToken(token);
  }
};