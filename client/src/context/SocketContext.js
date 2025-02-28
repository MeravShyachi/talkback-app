import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import { socket as socketInstance } from "../utils/socket";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext(); 

export const useSocket = () => useContext(SocketContext); 

export const SocketProvider = ({ children, isAuthenticated }) => { 
    const socketRef = useRef(socketInstance);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        console.log("isAuthenticated: ", isAuthenticated);
        if (isAuthenticated) {
            if (!socketRef.current.connected) {
                const token = sessionStorage.getItem("authToken");
                socketRef.current.auth = { token };
                socketRef.current.connect();

                socketRef.current.on("connect", () => {
                    console.log("🚀 Connected, Socket ID: ", socketRef.current.id);
                    setIsConnected(true);
                });

                socketRef.current.on("disconnect", () => {
                    console.log("Socket disconnected");
                    setIsConnected(false);
                });
            }
        }

        return () => {
            if (socketRef.current.connected) {
                socketRef.current.disconnect();
            }
        };
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
