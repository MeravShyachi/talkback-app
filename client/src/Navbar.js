import { Link, useLocation } from "react-router-dom";
//import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style/navbar.css";

const Navbar = () => {
    const location = useLocation(); // Get the current route
    const navigate = useNavigate();
      
    const handleExit = () => {
        window.close(); // Close the current tab
    };

    const handleLogout = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("current-user"));
            console.log("user:", user)
            await axios.post(
                "http://localhost:4000/logout", 
                { user },
                { withCredentials: true }
            );

            console.log("Logged out successfully");

            // Navigate to the home page after logout
            navigate("/");

        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    
    return (
        <nav className="navbar">
            <h1>Sela TalkBack</h1>           
            <div className="links">
                {(location.pathname === "/" || location.pathname === "/signup") && (
                    <>
                        <Link className={location.pathname === "/" ? "selectedLink" : ""} to="/">Login</Link>
                        <Link className={location.pathname === "/signup" ? "selectedLink" : ""} to="/signup">Signup</Link>
                    </>
                )}
                {location.pathname === "/home" && (      
                    <Link to="/" onClick={handleLogout}>Logout</Link>   
                )}
                {(location.pathname === "/chat" || location.pathname === "/game") && (
                    <button onClick={handleExit} className="exitButton">
                        Exit
                    </button>
                )}    
            </div>    
        </nav>
    );
}
 
export default Navbar;
