import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/loginSignup.css";
import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../utils/toast";
import authApi from "../api/authApi";
import { setSessionAuthToken } from "../utils/sessionToken";


const Login = () => {
  
  const [values, setValues] = useState({
    username: "",
    password: ""
  });
  
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () =>{
      const {username, password} = values;
      // validation for login page:
      if(username.length<3){
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
      }
      else if(password.length<8){
      toast.error(
        "Password should be equal or grater than 8 characters.",
        toastOptions
      );
      return false;
      }
      return true;
  }

  const handleSubmit = async(e) => {
    e.preventDefault(); //prevent reload of the page.
    if(!handleValidation()) return;
    
    const {data, error} = await authApi.login(values);

    if(error){
      toast.error(error.message, toastOptions);
      return;
    }

    console.log("Login successful:", data);
    setSessionAuthToken(data.accessToken, data.user._id);
    localStorage.setItem(
      "login",
      JSON.stringify({ userId: data.user._id, token: data.accessToken, timestamp: Date.now() })
    );

    navigate("/home", { replace: true }); 
  };
    
  return (
      <div className="loginSignup">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
              <label>Username:</label>
              <input 
                type="text" 
                name="username"
                required
                onChange={(e) => handleInputChange(e)}
              />
              <label>Password:</label>
              <input 
                type="password" 
                name="password"
                required
                onChange={(e) => handleInputChange(e)}
              />
              <button type="submit">Submit</button>
          </form>
          <ToastContainer/>
      </div>
  );
}
     
export default Login;
