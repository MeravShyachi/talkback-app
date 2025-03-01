import axiosInstance from "../api/axiosInstance";


const authApi = {
    login: (user) => axiosInstance.post("/auth/login", {user}),
    signup: (user) => axiosInstance.post("/auth/signup", {user}),
    logout: () => axiosInstance.post("/auth/logout"),
    protect: () => axiosInstance.get("/auth/verify-token")
}

export default authApi;