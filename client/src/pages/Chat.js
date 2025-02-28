import "../style/chat.css";
import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils/toast";
import notificationSound from "../assets/sounds/notification_sound.wav";
import { useState, useEffect, useRef } from "react";
import {useSocket} from "../context/SocketContext.js";
import { useAuth } from "../context/AuthContext.js";
import messageApi from "../api/messageApi.js";
import ChatHeader from "../components/chat/ChatHeader.js";
import ChatMessages from "../components/chat/CahtMessages.js";
import ChatInput from "../components/chat/ChatInput.js";
import { setSessionAuthToken, removeSessionAuthToken } from "../utils/sessionToken.js";

const Chat = () => {
    const { socket, isConnected } = useSocket();
    const {currentUser: sender, otherUser: receiver, room} = useAuth();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const isMutedRef = useRef(isMuted);

    // Fetch messages
    useEffect(() => {
        if (!receiver || !sender) return;
        console.log(`useEffect 4, receiver: ${receiver}, sender: ${sender}`);

        const fetchMessages = async () => {
            try {
                const response = await messageApi.getMessages(sender, receiver);
                if (response) setMessages(response.data);
            } catch (err) {
                console.error("Couldn't get messages", err);
            }
        };
        fetchMessages();

        socket.on("user has joined", ()=>{
            const msg = {system: true, message: `${receiver.username} has join the chat`};
            setArrivalMessage(msg);

        })

        socket.on("user has left", ()=> {
            const msg = {system: true, message: `${receiver.username} has left the chat`};
            setArrivalMessage(msg);
        })

        return () => {
            socket.off("user has left");
        }
    }, [receiver, sender]);

    
    // Join chat room when ready
    useEffect(() => {
        console.log(`useEffect 5, join room: ${room}`);

        if (!room || !isConnected) return;

        console.log("Joining room:", room);
        socket.emit("join room", room);

    }, [room, isConnected]);

    // Listen for messages only when socket is ready
    useEffect(() => {
        console.log(`useEffect 6, isConnected: ${isConnected}`);
        if (!isConnected) return;

        const playNotificationSound = () => {
            if (!isMutedRef.current) {
                const audio = new Audio(notificationSound);
                audio.play().catch((err) => console.error("Error playing sound:", err));
            }
        };

        socket.on("receive message", (msg) => {
            console.log("Received new message:", msg);
            setArrivalMessage(msg);

            playNotificationSound();
        });

        return () => {
            socket.off("receive message");
        };
    }, [socket, isConnected]);

    // Handle login/logout across tabs
    useEffect(() => {
        console.log(`useEffect 7`);

        const handleLoginLogout = (event) => {
            if (event.key === "logout") {
                const logoutData = JSON.parse(event.newValue);
                console.log("logout data", logoutData)
                if (sender?._id === logoutData.userId) {
                    //socket.disconnect();
                    removeSessionAuthToken();
                    toast.error("You've been logged out. Please log in again.", toastOptions);
                }
            }
            if (event.key === "login") {
                const loginData = JSON.parse(event.newValue);
                console.log("login data", loginData)
                if (sender?._id === loginData.userId) {
                    //socket.disconnect();
                    console.log(loginData.token);
                    setSessionAuthToken(loginData.token);
                    toast.info("You've been logged in.", toastOptions)
                }
            }
        };

        window.addEventListener("storage", handleLoginLogout);
        return () => window.removeEventListener("storage", handleLoginLogout);
    }, [sender]);

    // Add new messages
    useEffect(() => {
        console.log(`useEffect 8, arrivalMessage ${arrivalMessage}`);

        if (arrivalMessage) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage]);

    const handleSendMessage = (msg) => {
        if (!isConnected) {
            toast.error("You've been logged out. Please log in again.", toastOptions);
            return;
        };

        const tempId = Date.now();
        setMessages((prev) => [
            ...prev,
            { id: tempId, fromSelf: true, message: msg, status: "pending" },
        ]);

        socket.emit(
            "send message",
            { room, msg, receiver: receiver?.username },
            async (response) => {
                if (response.status === "success") {
                    try {
                        await messageApi.sendMessage(sender, receiver, msg);
                        setMessages((prev) =>
                            prev.map((m) => (m.id === tempId ? { ...m, status: "sent" } : m))
                        );
                    } catch (err) {
                        console.error("Message sending failed:", err);
                        setMessages((prev) =>
                            prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
                        );
                        toast.error("Message failed to send. Check your connection.", toastOptions);
                    }
                } else {
                    setMessages((prev) =>
                        prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
                    );
                    toast.error(response.message, toastOptions);
                }
            }
        );
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const newMuteState = !prev;
            isMutedRef.current = newMuteState;
            return newMuteState;
        });
    };

    return (
        <div className="chat">
            <div className="chatContainer">
                <ChatHeader receiver={receiver} isMuted={isMuted} toggleMute={toggleMute} socket={socket} room={room} sender={sender} />
                <ChatMessages messages={messages} />
                <ChatInput handleSendMessage={handleSendMessage} />
                <ToastContainer />
            </div>
        </div>
    );
};

export default Chat;
