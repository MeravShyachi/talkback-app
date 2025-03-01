import axios from "axios";
import {setSessionAuthToken, removeSessionAuthToken} from "../utils/sessionToken";
import { createRoot } from "react-dom/client";
import ErrorPopup from "../components/ErrorPopup";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // Your server's base URL
  withCredentials: true, 
});


//Attach access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to show error popup and redirect
const showErrorPopup = (message) => {
  const rootElement = document.createElement("div");
  document.body.appendChild(rootElement);
  createRoot(rootElement).render(<ErrorPopup message={message} />);
};

// Handle token expiration and refresh it
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401 Unauthorized)
    if (error.response?.status === 401 && error.response.data?.message === "Token expired" && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop

      try {
        console.log("Access token expired. Fetching new token...");
        const refreshResponse = await axios.post(
          "http://localhost:4000/auth/refresh-token",
          {
            userId: sessionStorage.getItem("userId"), // Send userId to identify user
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        const userId = refreshResponse.data.userId;

        setSessionAuthToken(newAccessToken, userId); // Save new access token and userId in sessionStorage

        // Retry the original request with the new token
        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        if (refreshError.response?.status === 403 || refreshError.response?.status === 404) {
          //removeSessionAuthToken();
          //showErrorPopup("Session expired. Redirecting to login...");
        }
      }
    }

    if (error.response?.status === 500) {
      console.error("🚨 Server error:", error.response.data.message);
      showErrorPopup("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
