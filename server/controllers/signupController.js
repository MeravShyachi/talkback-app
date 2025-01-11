const User = require('../model/User');

const signup = async (req, res)=>{

    let username = req.body.username;
    let password = req.body.password;
    
    const user = new User({
        username,
        password
    })

    try {
        await user.save();
        res.status(201).json(user); // Send created user back with status 201
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

module.exports = {signup}