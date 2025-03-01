import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import userApi from "../api/userApi.js";
import authApi from "../api/authApi.js";
import { useSearchParams } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); 

export const AuthProvider = ({ children}) => {

    const [searchParams] = useSearchParams();
    const room = searchParams.get("room");
    const [currentUser, setCurrentUser] = useState(undefined);
    const [otherUser, setOtherUser] = useState(undefined);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        
        const verifyUser = async () => {
            try {
                const response = await authApi.protect();
                setCurrentUser(response.data);

            } catch (err) {
                console.error("Token verification failed:", err);
                window.close();
            }
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
                try {
                    const response = await userApi.getUser(otherUserId);

                    setOtherUser(response.data);
                } catch (err) {
                    console.error("Couldn't get receiver details", err);
                } finally {
                    setLoading(false);
                }
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