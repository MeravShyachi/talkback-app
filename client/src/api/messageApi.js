import axiosInstance from "../api/axiosInstance";


const messageApi = {
    getMessages: (from, to) => axiosInstance.post("/get-messages", {from, to}),
    sendMessage: (from, to, message) => axiosInstance.post("/add-message", {from, to, message})
}

export default messageApi;