import axios from "axios";

export const logout = async (setUsername, navigate) => {
    try {
        await axios.get("http://localhost:4000/logout", { withCredentials: true });
        console.log("Logged out successfully");
        setUsername(null);
        navigate("/");
    } catch (error) {
        console.error("Error during logout:", error);
    }
};