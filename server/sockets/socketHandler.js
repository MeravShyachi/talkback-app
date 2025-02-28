import jwt from "jsonwebtoken";
import userSocket from "./userSocket.js";
import chatSocket from "./chatSocket.js";
import gameSocket from "./gameSocket.js";

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Extract token from `socket.auth`
        const token = socket.handshake.auth?.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify token
                console.log("decoded user: ",decoded._id)
                socket.data.userId = decoded._id; // Store userId in socket data
                console.log(`Stored userId for socket ${socket.id}: ${socket.data.userId}`);
            } catch (error) {
                console.log("Invalid token:", error.message);
            }
        }
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
