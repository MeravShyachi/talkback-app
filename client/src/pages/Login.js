import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/loginSignup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authApi from "../api/authApi";


const Login = () => {
  
    const [values, setValues] = useState({
      username: "",
      password: ""
    });
  
    //toast styling:
    const toastOptions = {
      position: "bottom-center",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
    };
  
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
        if(handleValidation()){
          try{
            const user = {
              username: values.username,
              password: values.password
            }
            const res = await authApi.login(user);
            console.log('login successful:', res.data.accessToken);
            sessionStorage.setItem("authToken", res.data.accessToken);
            navigate("/home")
          }
          catch(error){
            if (error.response && error.response.data) {
              console.error('Error during login:', error.response.data.message);
              toast.error(error.response.data.message, toastOptions); // Display error message to the user
            } else {
                console.error('Unknown error:', error);
            }
          }
        }
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
