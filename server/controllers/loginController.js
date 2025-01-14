const User = require('../model/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
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
        
        const accessToken = jwt.sign(
            { _id: user._id, username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '2m' }
        );

        res.cookie('userToken', accessToken, {
            maxAge: 3600000, // 1 hour
            httpOnly: true, // Prevent client-side access for security
            secure: false, // Set true for HTTPS-only
        });

        return res.status(200).json({ message: 'Login successful.', token: accessToken });
      
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports= {login}