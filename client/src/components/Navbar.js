import { Link, useLocation, useNavigate } from "react-router-dom";
import Logout  from "./Logout.js";
import "../style/navbar.css";


const Navbar = () => {
    const location = useLocation(); // Get the current route
    const navigate = useNavigate();

    const handleHome = () => {
        window.dispatchEvent(new Event("leaveGame"));
        navigate("/home"); 
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
                    <Logout/>   
                )}
                {(location.pathname === "/chat") && (
                    <button onClick={handleExit} className="exitButton">
                        Exit
                    </button>
                )}
                {(location.pathname === "/game") && (
                    <button onClick={handleHome} className="homeButton">
                        Home
                    </button>
                )}    
            </div>    
        </nav>
    );
}
 
export default Navbar;
