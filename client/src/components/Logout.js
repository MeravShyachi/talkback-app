import authApi from "../api/authApi";
import { socket } from "../utils/socket.js";



export const logout = async () => {
    try {
        console.log("in logout")
        await authApi.logout();
        sessionStorage.removeItem("authToken");
        socket.disconnect();
        console.log("Logged out successfully");

    } catch (error) {
        
        console.error("Error during logout:", error);
    }
};





