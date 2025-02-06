import { Link } from "react-router-dom";
import authApi from "../api/authApi";
import { socket } from "../utils/socket.js";

const Logout = () => {

    const handleLogout = async() => {
        try {
            const response = await authApi.logout();
            const userId = response.data.userId;
            sessionStorage.removeItem("authToken");
            localStorage.setItem("logout", JSON.stringify({ userId: userId, timestamp: Date.now() })); // Triggers event for other tabs
            socket.disconnect();
            console.log("Logged out successfully");    
        } catch (error) {
            
            console.error("Error during logout:", error);
        }
    }

    return(
        <Link to="/" onClick={handleLogout}>Logout</Link>
    )
};

export default Logout;





