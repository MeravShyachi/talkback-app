import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";



export const login = async (req, res) => {
    try {
        console.log("in login: ",req.body.user);
        let user = await User.findOne({username: req.body.user.username});

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.user.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password or username.' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refresh_token = refreshToken;
        await user.save();

        return res.status(200).json({ message: 'Login successful.', accessToken, user });
      
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const signup = async (req, res)=>{

    console.log("in signup: ",req.body.user);

    let username = req.body.user.username;
    let password = req.body.user.password;
    
    const user = new User({
        username,
        password
    })

    try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refresh_token = refreshToken;

        await user.save();

        res.status(201).json({message: 'Register successful.', accessToken, user});
    } 
    catch (error) {

        if (error.code === 11000) {
            // Handle unique constraint violation (duplicate username)
            return res.status(409).json({ message: 'Username already exists.' });
        }
        // Handle other errors
        res.status(500).json({ message: 'An error occurred during registration.', error: error.message });
    }
};

export const logout = async(req, res) => {
    try{
        console.log("in logout: ", req.user)
        let user = await User.findOne({username: req.user.username});

        user.refresh_token = "";

        await user.save();

        return res.status(200).json({ message: 'Logout successful.'});
    }
    catch(error){
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

export const verifyToken = (req, res) => {
    const username = req.user.username; // `req.user` comes from the middleware
    res.status(200).json(username);
};

export const refreshToken = async(req, res) => {
    try{
        let user = await User.findOne({username: req.user.username});

        const refreshToken = user.refresh_token;
        if( refreshToken === ""){
            res.status(401).json({ message: 'no refresh token in the db' });
        };

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken(user)
            res.json({ accessToken: accessToken })
        })
    }
    catch(error){
        res.status(403).json({ message: 'No user found' });
    }
};




