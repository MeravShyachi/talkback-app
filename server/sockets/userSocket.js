const userSocket = (io, socket) => {
    
    const emitConnectedUsers = async () => {
        const sockets = await io.fetchSockets();
        const connectedUsers = sockets
            .map(s => s.data.userId)
            .filter(userId => userId); // Ensure no undefined values

        io.emit("connectedUsers", connectedUsers); // Emit to all clients
    };

    const getReceiverSocketId = async (receiverId) => {
        const sockets = await io.fetchSockets();
        const receiverSocket = sockets.find(socket => socket.data.userId === receiverId);
        return receiverSocket?.id || null;
    };

    socket.on("join server", async (user) => {
        console.log("User joined server:", user);
        
        socket.data.userId = user._id;
        await emitConnectedUsers();
    });

    socket.on("request chat", async ({ room, senderId, receiverId }) => {
        const receiverSocketId = await getReceiverSocketId(receiverId);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("open chat", { room, senderId });
        } else {
            console.log(`Receiver ${receiverId} is not online.`);
        }
    });

    socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);
        await emitConnectedUsers();
    });
};

export default userSocket;
