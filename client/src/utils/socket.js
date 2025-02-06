import {io} from "socket.io-client";

export const socket = io("http://localhost:4000", {
    autoConnect: false, // Prevents auto-connection issues
    reconnection: true, // Enables auto-reconnect
    reconnectionAttempts: 5, // Retry 5 times before failing
    transports: ["websocket"], // Forces WebSocket (avoid polling issues)
});
