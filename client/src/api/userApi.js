import axiosInstance from "../api/axiosInstance";


const userApi = {
    getAll: () => axiosInstance.get("/get-all")
}

export default userApi;