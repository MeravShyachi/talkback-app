import User from "../model/User.js";
import bcrypt from "bcrypt";
import {createToken} from "../middleware/JWT.js";


export const login = async (req, res) => {
    try {
        // Find the user with the same username in the DB 
        let user = await User.findOne({username: req.body.username});

        // If the user has been found
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        // If the password incorrect
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password or username.' });
        }
        
        // Update the user's isConnected field to true
        user.isConnected = true;

        // Save the user with updated isConnected field
        await user.save();

        const accessToken = await createToken(user);
        //console.log(accessToken);

        res.cookie('userToken', accessToken, {
            maxAge: 3600000, // 1 hour
            httpOnly: true, // Prevent client-side access for security
            secure: false
        });
    


        return res.status(200).json({ message: 'Login successful.', user });
      
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


