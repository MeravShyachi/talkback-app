import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/loginSignup.css";

const LoginSignup = ({ title, onFormSubmit }) => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); //prevent reload of the page.
    onFormSubmit(username); // Call onFormSubmit to set the action to "Logout"
    navigate("/home")
  };

  return (
    <div className="loginSignup">
        <h1>{title}</h1>
        <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password:</label>
            <input 
              type="text" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    </div>
  );
}
 
export default LoginSignup;

