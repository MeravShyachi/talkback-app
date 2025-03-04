import jwt from 'jsonwebtoken';
import User from "../models/User.js";


export const protect = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access denied. No token provided." }); 
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;
    const currentUser = await User.findOne({username}).select(["username", "_id", "refresh_token"]);
    //return res.status(404).json({ message: "Unauthorize: User not found" });
    
    if (!currentUser) {
      console.log("user not found");
      return res.status(404).json({ message: "Unauthorize: User not found" });
    }

    if(currentUser.refresh_token === ""){
      return res.status(403).json({ message: "Access denied. User not logged in." });
    }
    
    req.user = decoded; // Add user data to request object
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Access token expired.");
      return res.status(401).json({ message: "Token expired" });
    } else {
      console.log("Invalid token:", error);
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};





