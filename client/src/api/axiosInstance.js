import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // Your server's base URL
  withCredentials: true, // To send cookies if needed
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async(config) => {

    let token = sessionStorage.getItem("authToken");

    if (token) {
      // Decode token expiry
      const tokenExp = JSON.parse(atob(token.split(".")[1])).exp * 1000; 

      if (Date.now() >= tokenExp - 60000) { // Refresh 1m before expiry
        try {
          const response = await axiosInstance.post("/refresh-token");
          token = response.data.accessToken;
          sessionStorage.setItem("authToken", token);
        } catch (err) {
          console.error("Failed to refresh token:", err);
          sessionStorage.removeItem("authToken"); // Clear token if refresh fails
          window.location.href = "/"; // Redirect to login
          throw err; // Reject the original request
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }, 
  (error) => Promise.reject(error)
);

export default axiosInstance;
