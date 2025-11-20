import React from "react";

export const TOKEN_KEY = "anuvat_id_token";
export const CLASS_ID_KEY = "anuvat_classroom_id";
export const BASE_URL = "https://anouvat.web.app/v1";

const AsyncStorage = {
  _data: {},
  setItem: async (key, value) => (AsyncStorage._data[key] = String(value)),
  getItem: async (key) => AsyncStorage._data[key] || null,
  removeItem: async (key) => delete AsyncStorage._data[key],
};

// --- STORAGE HELPERS ---
export const storeToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const removeToken = () => AsyncStorage.removeItem(TOKEN_KEY);
export const storeClassroomId = (classroomId) =>
  AsyncStorage.setItem(CLASS_ID_KEY, classroomId.toString());
export const getStoredClassroomId = () => AsyncStorage.getItem(CLASS_ID_KEY);
export const removeClassroomId = () => AsyncStorage.removeItem(CLASS_ID_KEY);

export const fetchClient = async (
  method,
  url,
  data = null,
  needsAuth = true
) => {
  const fullUrl = `${BASE_URL}${url}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if (needsAuth) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Handle case where auth is needed but token is missing
      throw new Error("Authentication required, but token is missing.");
    }
  }

  const config = {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(fullUrl, config); // Check for HTTP errors (e.g., 4xx or 5xx)

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        errorBody.message || `HTTP error! Status: ${response.status}`
      );
    } // Handle 204 No Content

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    throw error;
  }
};

export const CustomAlert = ({ title, message, onClose }) => {
  if (!title && !message) return null;

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const contentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "300px",
    textAlign: "center",
  };

  return (
    <div style={modalStyle}>
                 {" "}
      <div style={contentStyle}>
                       {" "}
        <h3 style={{ margin: "0 0 10px 0", color: "darkred" }}>
          {title || "Alert"}
        </h3>
                        <p style={{ margin: "0 0 20px 0" }}>{message}</p>       
               {" "}
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
                              OK                {" "}
        </button>
                   {" "}
      </div>
             {" "}
    </div>
  );
};
