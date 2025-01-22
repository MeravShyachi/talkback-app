import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/connectDB.js";
import {Server} from "socket.io";



dotenv.config(); 
connectDB();


const server = http.createServer(app);

const io = new Server(server, {
    cors: '*' //let all the ports access
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    socket.on("join server", async (username) => {
        console.log(username);

        onlineUsers.set(socket.id, username);

        console.log("online users:", Array.from(onlineUsers.values()));

        // Sort and update users
        //const sortedUsers = await sortConnections(connectedUsers);
        //console.log("sorted:", sortedUsers); // Use or emit the sorted users as needed
        io.emit("online users", Array.from(onlineUsers.values())); // Convert Map to an array of usernames
        //io.emit("online users", onlineUsers);
    });

    socket.on("disconnect", async() => {
        onlineUsers.delete(socket.id);
        console.log("after delete:", Array.from(onlineUsers.values()));
        // const sortedUsers = await sortConnections(connectedUsers);
        //console.log("after disconnect:", sortedUsers);
        io.emit("online users", Array.from(onlineUsers.values()));
    })
     
})


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});


