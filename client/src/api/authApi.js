import axiosInstance from "../api/axiosInstance";


const authApi = {
    login: (user) => axiosInstance.post("/login", {user}),
    signup: (user) => axiosInstance.post("/signup", {user}),
    logout: () => axiosInstance.post("/logout"),
    protect: () => axiosInstance.get("/verify-token")
}

export default authApi;