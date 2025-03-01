import jwt from "jsonwebtoken";
import userSocket from "./userSocket.js";
import chatSocket from "./chatSocket.js";
import gameSocket from "./gameSocket.js";

const socketHandler = (io) => {
    io.on("connection", (socket) => {

        const userId = socket.handshake.auth?.userId; // Get userId from auth data

        if (!userId) {
            console.log("❌ No userId provided. Disconnecting socket...");
            socket.disconnect();
            return;
        }

        // 🔥 Store userId in socket data
        socket.data.userId = userId;
        console.log(`🔓 User connected: ${userId}, Socket ID: ${socket.id}`);


        // Handle user events
        userSocket(io, socket);

        // Handle message events
        chatSocket(io, socket);

        //Handle game events
        gameSocket(io, socket);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default socketHandler;
