import jwt from 'jsonwebtoken';
import User from "../models/User.js";


export const protect = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded user in protect: ", decoded.username);
    const username = decoded.username;
    const currentUser = await User.findOne({username}).select(["username", "_id", "refresh_token"]);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if(currentUser.refresh_token === ""){
        return res.status(401).json({ message: "Unauthorized - User not connected" });
    }
    req.user = decoded; // Add user data to request object
    next();
  } catch (error) {
    console.log("fail verify:", error)
    res.status(401).json({ message: "Invalid or expired token" });
  }
};





