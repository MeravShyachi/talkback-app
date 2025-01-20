import User from "../model/User.js";
import {createToken} from "../middleware/JWT.js";

export const signup = async (req, res)=>{

    console.log(req.body);
    
    let username = req.body.username;
    let password = req.body.password;
    
    const user = new User({
        username,
        password,
        isConnected: true
    })

    try {
        await user.save();
        const accessToken = createToken(user);

        res.cookie('userToken', accessToken, {
            maxAge: 3600000, // 1 hour
            httpOnly: true, // Prevent client-side access for security
            secure: false, // Set true for HTTPS-only
        });
        console.log(user)
        delete user.password;
        console.log(user)
        res.status(201).json({user}); // Send created user back with status 201
    } 
    catch (error) {
        //console.error('Error saving user:', error); // Log full error details
        if (error.code === 11000) {
            // Handle unique constraint violation (duplicate username)
            return res.status(409).json({ message: 'Username already exists.' });
        }
        // Handle other errors
        res.status(500).json({ message: 'An error occurred during registration.', error: error.message });
    }
    
}
