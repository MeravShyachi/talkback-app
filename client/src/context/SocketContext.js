import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import { socket as socketInstance } from "../utils/socket";
import { setSessionAuthToken, removeSessionAuthToken } from "../utils/sessionToken";
import axiosInstance from "../api/axiosInstance"; // Import axios for refresh API

const SocketContext = createContext(); 

export const useSocket = () => useContext(SocketContext); 

export const SocketProvider = ({ children, isAuthenticated }) => { 
    const socketRef = useRef(socketInstance);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

        if (isAuthenticated) {
            if (!socketRef.current.connected) {
                connectSocket();
            }
        }

        return () => {
            if (socketRef.current.connected) {
                socketRef.current.disconnect();
            }
        };

    }, [isAuthenticated]);

    const connectSocket = () => {
        const userId = sessionStorage.getItem("userId"); // Get userId from sessionStorage
        if (!userId) return console.error("❌ No userId found in sessionStorage");

        socketRef.current.auth = { userId }; // 🔥 Send userId to the server
        socketRef.current.connect();

        socketRef.current.on("connect", () => {
            console.log("🚀 Connected, Socket ID:", socketRef.current.id);
            setIsConnected(true);
        });

        socketRef.current.on("disconnect", () => {
            console.log("⚠️ Socket disconnected");
            setIsConnected(false);
        });
    };

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
