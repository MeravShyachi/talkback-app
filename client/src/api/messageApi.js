import axiosInstance from "./axiosInstance";
import { apiRequest } from "./apiHelper";


const messageApi = {
    getMessages: (from, to) => apiRequest(axiosInstance.post("/get-messages", {from, to})),
    sendMessage: (from, to, message) => apiRequest(axiosInstance.post("/add-message", {from, to, message}))
}

export default messageApi;