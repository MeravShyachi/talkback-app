import axiosInstance from "./axiosInstance";
import { apiRequest } from "./apiHelper";

const userApi = {
    getAll: () => apiRequest(axiosInstance.get("/get-all")),
    getUser: (userId) => apiRequest(axiosInstance.get("/get-user", {params: {userId}}))
}

export default userApi;