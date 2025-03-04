import React, { createContext, useContext, useEffect, useState } from "react";
import userApi from "../api/userApi.js";
import authApi from "../api/authApi.js";
import { useSearchParams, useLocation } from "react-router-dom";
import { handleLogout } from "../utils/Logout.js";
import { showErrorPopup } from "../components/ErrorPopup";


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); 

export const AuthProvider = ({ children}) => {

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const room = searchParams.get("room");
    const [currentUser, setCurrentUser] = useState(undefined);
    const [otherUser, setOtherUser] = useState(undefined);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        const verifyUser = async () => {
            const {data, error} = await authApi.protect();
            if(error){
                if(location.pathname.includes("/chat")){
                    showErrorPopup(`${error.message}\nPlease try later, This window will be close`);
                    setTimeout(() => {
                        window.close();
                    }, 5000);
                } else {
                    handleLogout();
                    showErrorPopup(`${error.message}\nRedirecting to login`);
                }
                return;
            }

            setCurrentUser(data);

            // try {
            //     const response = await authApi.protect();
            //     setCurrentUser(response.data);

            // } catch (err) {
            //     console.error("Token verification failed:", err);
            //     window.close();
            // }
        };

        verifyUser();

    }, []);

    // Fetch receiver details
    useEffect(() => {
        if (!room || !currentUser) return;

        const ids = room.split(" ");
        const otherUserId = ids.find((id) => id !== currentUser._id);

        if (otherUserId) {
            const fetchReceiver = async () => {
                const { data, error } = await userApi.getUser(otherUserId);

                if (error) {
                    handleLogout();
                    showErrorPopup(`${error.message}\nRedirecting to login`);
                    return;
                }
    
                setOtherUser(data);
                setLoading(false);
            };
            fetchReceiver();
        } else {
            setLoading(true);
        }

    }, [room, currentUser]);

    if(loading || !currentUser || !otherUser || !room) {
        return <div>Loading...</div>
    }

    return(
        <AuthContext.Provider value={{currentUser, otherUser, room}}>
            {children}
        </AuthContext.Provider>
    );
};