import { useState, useEffect } from "react";
import chatIcon from "../assets/images/chatIcon.jpg";
import diceIcon from "../assets/images/diceIcon.png";
import "../style/home.css";
import userApi from "../api/userApi.js";
import { useNavigate } from "react-router-dom";
import {useSocket} from "../context/SocketContext.js";
import GameButton from "../components/game/GameButton.js";


const Home = () => {

    const [users, setUsers] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    
    const getUsers = async() =>{
        try{
            const response = await userApi.getAll();
            console.log("Headers sent with request:", response.config.headers); // Debug headers
            const user = response.data.currentUser;
            console.log("user: ",user);
            setCurrentUser(user); 
            setUsers(response.data.users);

        }catch(error){
            console.error("Token verification failed:", error);
            navigate("/"); // Redirect to login if token is invalid
        }
    };

    useEffect(() => {
        if(!sessionStorage.getItem("authToken")){
            navigate("/");
        }
    },[])

    useEffect(() => {
        const handleSignup = (event) => {
            if(event.key === "signup") {
                getUsers();
                return true;
            }
        }

        getUsers();

        window.addEventListener("storage", handleSignup);
        return () => window.removeEventListener("storage", handleSignup);

    }, [])

    useEffect(() => {
        console.log(isConnected)
        if(!isConnected || currentUser === undefined) return;

        console.log("current user: ",currentUser);

        socket.emit("join server", currentUser)

        socket.on("connected users", (userIds) => {
            console.log("userIds: ", userIds)
            setConnectedUsers(userIds);
        });
  
        socket.on("open chat", ({ room }) => {
            window.open(`/chat?room=${room}`, "_blank");
        });

        // Cleanup function
        return () => {
            socket.off("connected users");
            socket.off("open chat");
        }
          
    },[currentUser, socket, isConnected])

    

      
    const handleChatButton = (e, userId) => {
        e.preventDefault(); //prevent reload of the page.
        const room = `${userId} ${currentUser?._id}`;
        socket.emit("request chat", {room, receiverId: userId})
        window.open(`/chat?room=${room}`, "_blank");
    };

    const onlineUsers = users.filter((user) =>
        connectedUsers.includes(user._id)
    );
    
    const offlineUsers = users.filter(
        (user) => !connectedUsers.includes(user._id)
    );

    return ( 
        <div className="home">
            <div className="contactContainer">
            <h2>Welcome {currentUser?.username}!</h2>
                <div className="contacts">
                    {/* Render online Users */}
                    {onlineUsers.map((user) => (
                        <div className="onlineContacts" key={user.username}>
                            <ul>
                                <li className="contactItem">
                                    <span style={{ color: "#18a982" }}>{user.username}</span>
                                    <div className="contactActions">
                                        <button
                                            onClick={(e) => handleChatButton(e, user._id)}
                                            className="actionButton"
                                        >
                                            <img
                                                src={chatIcon} // Path to your image
                                                alt="chat"
                                                className="actionImage"
                                            />
                                        </button>
                                        <GameButton receiver={user} socket={socket} room={user} sender={currentUser}/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ))}

                    {/* Render Offline Users */}
                    {offlineUsers.map((user) => (
                        <div className="offlineContacts" key={user.username}>
                            <ul>
                                <li className="contactItem">
                                    <span>{user.username}</span>
                                    <span
                                        style={{
                                            color: "#f1356d",
                                            marginLeft: "auto",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Not Connected
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ))} 
                </div>
            </div>
        </div>
     );
}
 
export default Home;
