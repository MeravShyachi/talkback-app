import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";


import "../style/errorPopup.css"; 

const ErrorPopup = ({ message }) => {
    const [countdown, setCountdown] = useState(5); // Redirect in 5 seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            window.location.href = "/"; // Redirect to login after countdown
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        }
    }, []);

    return (
        <div className="error-popup">
            <div className="error-popup-content">
                <h2>Error</h2>
                <p>{message} in {countdown} seconds...</p>
                {/* <p>Redirecting to login in {countdown} seconds...</p> */}
            </div>
        </div>
    );
};

export const showErrorPopup = (message) => {
    const rootElement = document.createElement("div");
    document.body.appendChild(rootElement);

    createRoot(rootElement).render(<ErrorPopup message={message} />);
};

export default ErrorPopup;
