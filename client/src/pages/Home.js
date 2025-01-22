import { useState, useEffect, useRef } from "react";
import chatIcon from "../assets/images/chatIcon.jpg";
import diceIcon from "../assets/images/diceIcon.jpg";
import "../style/home.css";
import userApi from "../api/userApi.js";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket.js";


const Home = () => {

    const [users, setUsers] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([])
    const [currentUser, setCurrentUser] = useState();
    const navigate = useNavigate();
    const socketRef = useRef();

    

    useEffect(() => {
        const getUsers = async() =>{
            try{
                const response = await userApi.getAll();
                console.log("get all res: ",response)
                const username = response.data.username;
                setCurrentUser(username);
                console.log("curent user:", currentUser); 
                setUsers(response.data.users);
                console.log("all users:", users); 
                if(!socketRef.current){
                    socketRef.current = socket.connect("/");
                    socketRef.current.emit("join server", username)
                    socketRef.current.on("online users", (onlineUsers) => {
                        console.log("online users:", onlineUsers);
                        setConnectedUsers(onlineUsers);
                        console.log("online users:", connectedUsers);
                    });   
                }     
            }catch(error){
                console.error("Token verification failed:", error);
                navigate("/"); // Redirect to login if token is invalid
            }
        };

        getUsers();

    }, [navigate, connectedUsers])
    
      
    const handleChatButton = (e) => {
        e.preventDefault(); //prevent reload of the page.
        window.open("/chat", "_blank");
    };

    const handleGameButton = (e) => {
        e.preventDefault(); //prevent reload of the page.
        window.open("/game", "_blank");
    };

    // Filter out the current user and organize the users
    const filteredUsers = users.filter((user) => user.username !== currentUser);
    const onlineUsers = filteredUsers.filter((user) =>
        connectedUsers.includes(user.username)
    );
    const offlineUsers = filteredUsers.filter(
        (user) => !connectedUsers.includes(user.username)
    );

    return ( 
        <div className="home">
            <div className="contactContainer">
            <h2>Welcome {currentUser}!</h2>
                <div className="contacts">
                    {/* Render online Users */}
                    {onlineUsers.map((user) => (
                        <div className="onlineContacts" key={user.username}>
                            <ul>
                                <li className="contactItem">
                                    <span style={{ color: "#18a982" }}>{user.username}</span>
                                    <div className="contactActions">
                                        <button
                                            onClick={handleChatButton}
                                            className="actionButton"
                                        >
                                            <img
                                                src={chatIcon} // Path to your image
                                                alt="chat"
                                                className="actionImage"
                                            />
                                        </button>
                                        <button
                                            onClick={handleGameButton}
                                            className="actionButton"
                                        >
                                            <img
                                                src={diceIcon} // Path to your image
                                                alt="game"
                                                className="actionImage"
                                            />
                                        </button>
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
