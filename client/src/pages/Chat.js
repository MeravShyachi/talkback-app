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

        const fetchMessages = async () => {
            const {data, error} = await messageApi.getMessages(sender, receiver);

            if(error){
                toast.error(error.message);
            }

            setMessages(data);

            // try {
            //     const response = await messageApi.getMessages(sender, receiver);
            //     if (response) setMessages(response.data);
            // } catch (err) {
            //     console.error("Couldn't get messages", err);
            // }
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
            socket.off("user has joined");
            socket.off("user has left");
        }
    }, [receiver, sender]);

    
    // Join chat room when ready
    useEffect(() => {
        if (!room || !isConnected) return;

        socket.emit("join room", room);

    }, [room, isConnected]);

    // Listen for messages only when socket is ready
    useEffect(() => {
        if (!isConnected) return;

        const playNotificationSound = () => {
            if (!isMutedRef.current) {
                const audio = new Audio(notificationSound);
                audio.play().catch((err) => console.error("Error playing sound:", err));
            }
        };

        socket.on("receive message", (msg) => {
            setArrivalMessage(msg);

            playNotificationSound();
        });

        return () => {
            socket.off("receive message");
        };
    }, [socket, isConnected]);

    // Handle login/logout across tabs
    useEffect(() => {
        const handleLoginLogout = (event) => {
            if (event.key === "logout") {
                const logoutData = JSON.parse(event.newValue);
                if (sender?._id === logoutData.userId) {
                    removeSessionAuthToken();
                    toast.error("You've been logged out. Please log in again.", toastOptions);
                }
            }
            if (event.key === "login") {
                const loginData = JSON.parse(event.newValue);
                if (sender?._id === loginData.userId) {
                    setSessionAuthToken(loginData.token, loginData.userId);
                    toast.info("You've been logged in.", toastOptions)
                }
            }
        };

        window.addEventListener("storage", handleLoginLogout);
        return () => window.removeEventListener("storage", handleLoginLogout);
    }, [sender]);

    // Add new messages
    useEffect(() => {
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
                    const {data, error} = await messageApi.sendMessage(sender, receiver, msg);

                    if(error){
                        setMessages((prev) =>
                            prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
                        );
                        toast.error("Message failed to send. Check your connection.", toastOptions);
                        return;
                    }

                    setMessages((prev) =>
                        prev.map((m) => (m.id === tempId ? { ...m, status: "sent" } : m))
                    );
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
