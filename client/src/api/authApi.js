import axiosInstance from "../api/axiosInstance";
import { apiRequest } from "./apiHelper";

const authApi = {
    login: (user) => apiRequest(axiosInstance.post("/auth/login", {user})),
    signup: (user) => apiRequest(axiosInstance.post("/auth/signup", {user})),
    logout: () => apiRequest(axiosInstance.post("/auth/logout")),
    protect: () => apiRequest(axiosInstance.get("/auth/verify-token"))
}

export default authApi;
