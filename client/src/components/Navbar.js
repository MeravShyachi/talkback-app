import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {handleLogout}  from "../utils/Logout.js";
import { removeSessionAuthToken } from "../utils/sessionToken";
import "../style/navbar.css";


const Navbar = () => {
    const location = useLocation(); // Get the current route
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();



    const handleHome = () => {
        window.dispatchEvent(new Event("leaveGame"));
        navigate("/home"); 
    };

    const handleBack = () => {
        const room = searchParams.get("room");
        console.log(room);
        window.dispatchEvent(new Event("leaveGame"));
        navigate(`/chat?room=${room}`); 
    };

    const handleExit = () => {
        window.close(); //close the page
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
                {(location.pathname === "/chat") && (
                    <button onClick={handleExit} className="exitButton">
                        Exit
                    </button>
                )}
                {(location.pathname === "/home/game") && (
                    <button onClick={handleHome} className="homeButton">
                        Home
                    </button>
                )}    
                {(location.pathname === "/chat/game") && (
                    <button onClick={handleBack} className="homeButton">
                        Back
                    </button>
                )} 
            </div>    
        </nav>
    );
}
 
export default Navbar;
