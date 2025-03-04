import authApi from "../api/authApi";
import { removeSessionAuthToken } from "./sessionToken";

export const handleLogout = async() => {

    const {data, error} = await authApi.logout()

    removeSessionAuthToken();
    
    if(error){
        return;
    }

    localStorage.setItem("logout", JSON.stringify({ userId: data.userId, timestamp: Date.now() })); // Triggers event for other tabs

}








