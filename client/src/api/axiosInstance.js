import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // Your server's base URL
  withCredentials: true, // To send cookies if needed
});


//without refresh token:
axiosInstance.interceptors.request.use((config)=>{
  const token = sessionStorage.getItem("authToken");

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
  },
  (error) => Promise.reject(error)
)

export default axiosInstance;
