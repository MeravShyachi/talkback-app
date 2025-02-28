import axiosInstance from "./axiosInstance";


const userApi = {
    getAll: () => axiosInstance.get("/get-all"),
    getUser: (userId) => axiosInstance.get("/get-user", {params: {userId}})
}

export default userApi;