import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/loginSignup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const LoginSignup = ({ onFormSubmit }) => {
  
  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: ""
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
    const {username, password, confirmPassword} = values;
    // validation for signup page:

    if(password !== confirmPassword){
      toast.error(
        "Password and confirm password should be the same.",
        toastOptions
        );
        return false;
    }
    else if(username.length<3){
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

  const handleSubmit = (e) => {
    e.preventDefault(); //prevent reload of the page.
    if(handleValidation()){
      onFormSubmit(values.username); // Call onFormSubmit to set the action to "Logout"
      navigate("/home")
    }
  };

  return (
    <div className="loginSignup">
        <h1>Signup</h1>
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
            <div>
              <label>Confirm Password</label>
              <input              
              type="password" 
              name="confirmPassword"
              required
              onChange={(e) => handleInputChange(e)}/>
            </div>
            <button type="submit">Submit</button>
        </form>
        <ToastContainer/>
    </div>
  );
}
 
export default LoginSignup;

