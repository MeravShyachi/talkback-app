const chatSocket = (io, socket) => {
    socket.on("join room", (room) => {
        console.log("join room: ", room)
        socket.join(room);
        socket.to(room).emit("user has joined");
    });

    socket.on("send message", ({room, msg, receiver}, callback) => {
        console.log("in send massage, to: ", room);
        const roomSockets = io.sockets.adapter.rooms.get(room); // Get all sockets in the room

        // Check if room exists and has more than one user (excluding sender)
        if (roomSockets && roomSockets.size > 1) {
            socket.to(room).emit("receive message", { fromSelf: false, message: msg });

            // Acknowledge success
            callback({ status: "success", message: "Message delivered!" });
        } else {
            // Room has only one user (sender), so receiver is not in the room
            callback({ status: "failed", message: `${receiver} is not in the chat room.` });
        }
    });

    socket.on("disconnecting", () => {
        console.log("in disconnecting");
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            console.log("in if")
            socket.to(room).emit("user has left", socket.id);
          }
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected from chat");
    });
};

export default chatSocket;
