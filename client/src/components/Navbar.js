import { Link, useLocation } from "react-router-dom";
import Logout  from "./Logout.js";
import "../style/navbar.css";


const Navbar = () => {
    const location = useLocation(); // Get the current route
      
    const handleExit = () => {
        window.close(); // Close the current tab
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
                    <Logout/>   
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
