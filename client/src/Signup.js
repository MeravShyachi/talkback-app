import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/loginSignup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";



const Signup = ({ onFormSubmit }) => {
  
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
      axios.post("http://localhost:4000/signup",
      { username: values.username, password: values.password },
      { withCredentials: true // Send cookies with requests
      })
      .then(response => {
          console.log('Registration successful:', response.data);
          onFormSubmit(values.username)
          navigate("/home")
      })
      .catch(error => {
          if (error.response && error.response.data) {
              console.error('Error during registration:', error.response.data.message);
              toast.error(error.response.data.message, toastOptions); // Display error message to the user
          } else {
              console.error('Unknown error:', error);
          }
      });
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
 
export default Signup;

