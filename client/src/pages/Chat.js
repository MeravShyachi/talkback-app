import "../style/chat.css";
import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils/toast";
import notificationSound from "../assets/sounds/notification_sound.wav";
import { useState, useEffect, useRef } from "react";
import { socket } from "../utils/socket.js";
import authApi from "../api/authApi.js";
import userApi from "../api/userApi.js";
import messageApi from "../api/messageApi.js";
import { useNavigate } from "react-router-dom";
import ChatHeader from "../components/chat/ChatHeader.js";
import ChatMessages from "../components/chat/CahtMessages.js";
import ChatInput from "../components/chat/ChatInput.js";

const Chat = () => {
    const socketRef = useRef(null);
    const [socketReady, setSocketReady] = useState(false); // Track if socket is ready
    const [receiver, setReceiver] = useState(undefined);
    const [sender, setSender] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [room, setRoom] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const isMutedRef = useRef(isMuted);

    const navigate = useNavigate();

    // Initialize user and socket connection
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await authApi.protect();
                setSender(response.data);

                if (!socketRef.current) {
                    socketRef.current = socket.connect("/");

                    console.log("after connect, ", socketRef.current.id);

                    socketRef.current.on("connect", () => {
                        console.log("Socket connected:", socketRef.current.id);
                        setSocketReady(true);
                    });

                    socketRef.current.on("connect_error", (error) => {
                        console.error("Socket connection error:", error);
                    });

                    socketRef.current.on("disconnect", () => {
                        console.log("Socket disconnected");
                        setSocketReady(false);
                    });
                }
            } catch (err) {
                console.error("Token verification failed:", err);
                window.close();
            }
        };

        verifyUser();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    // Listen for messages only when socket is ready
    useEffect(() => {

        const playNotificationSound = () => {
            if (!isMutedRef.current) {
                const audio = new Audio(notificationSound);
                audio.play().catch((err) => console.error("Error playing sound:", err));
            }
        };

        if (!socketReady || !socketRef.current) return;

        socketRef.current.off("receive message").on("receive message", (msg) => {
            console.log("Received new message:", msg);
            setArrivalMessage(msg);

            playNotificationSound();
        });

        return () => {
            socketRef.current.off("receive message");
        };
    }, [socketReady]);

    // Handle logout across tabs
    useEffect(() => {
        const handleLogout = (event) => {
            if (event.key === "logout") {
                const logoutData = JSON.parse(event.newValue);
                if (sender?._id === logoutData.userId) {
                    socketRef.current?.disconnect();
                    toast.error("You've been logged out. Please log in again.", toastOptions);
                }
            }
        };

        window.addEventListener("storage", handleLogout);
        return () => window.removeEventListener("storage", handleLogout);
    }, [sender]);

    // Get room from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const roomId = queryParams.get("room");
        if (roomId) setRoom(roomId);
    }, []);

    // Fetch receiver details
    useEffect(() => {
        if (!room || !sender) return;

        const ids = room.split(" ");
        const receiverId = ids.find((id) => id !== sender._id);

        if (receiverId) {
            const fetchReceiver = async () => {
                try {
                    const response = await userApi.getUser(receiverId);
                    setReceiver(response.data);
                } catch (err) {
                    console.error("Couldn't get receiver details", err);
                }
            };
            fetchReceiver();
        }
    }, [room, sender]);

    // Join chat room when ready
    useEffect(() => {
        if (!room || !socketReady || !socketRef.current) return;

        console.log("Joining room:", room);
        socketRef.current.emit("join room", room);

        socketRef.current.on("connect", () => {
            console.log("Rejoining room after reconnect...");
            socketRef.current.emit("join room", room);
        });

        return () => {
            socketRef.current.off("connect");
        };
    }, [room, socketReady]);

    // Fetch messages
    useEffect(() => {
        if (!receiver) return;

        const fetchMessages = async () => {
            try {
                const response = await messageApi.getMessages(sender, receiver);
                if (response) setMessages(response.data);
            } catch (err) {
                console.error("Couldn't get messages", err);
            }
        };
        fetchMessages();
    }, [receiver]);

    // Add new messages
    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage]);

    const handleSendMessage = (msg) => {
        if (!socketRef.current) return;

        const tempId = Date.now();
        setMessages((prev) => [
            ...prev,
            { id: tempId, fromSelf: true, message: msg, status: "pending" },
        ]);

        socketRef.current.emit(
            "send message",
            { room, msg, receiver: receiver.username },
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
                {socketReady && (
                    <ChatHeader receiver={receiver} isMuted={isMuted} toggleMute={toggleMute} socketRef={socketRef} room={room} sender={sender} />
                )}
                <ChatMessages messages={messages} />
                <ChatInput handleSendMessage={handleSendMessage} />
                <ToastContainer />
            </div>
        </div>
    );
};

export default Chat;
