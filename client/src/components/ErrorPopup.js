import React, { useEffect, useState } from "react";
import "../style/errorPopup.css"; 

const ErrorPopup = ({ message }) => {
    const [countdown, setCountdown] = useState(5); // Redirect in 5 seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        setTimeout(() => {
            window.location.href = "/"; // Redirect to login after countdown
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="error-popup">
            <div className="error-popup-content">
                <h2>Error</h2>
                <p>{message}</p>
                <p>Redirecting to login in {countdown} seconds...</p>
            </div>
        </div>
    );
};

export default ErrorPopup;
