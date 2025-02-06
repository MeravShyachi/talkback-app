import userSocket from "./userSocket.js";
import chatSocket from "./chatSocket.js";
import gameSocket from "./gameSocket.js";

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

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
