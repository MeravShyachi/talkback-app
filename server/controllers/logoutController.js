import User from "../model/User.js";


export const logout = async(req, res) => {

    try{
        let user = await User.findOne({username: req.body.user.username});

        if(!user){
            return tes.status(404).json({message: 'user not found.'});
        }

        user.isConnected = false;

        await user.save();

        res.clearCookie('userToken', {
            httpOnly: true, // Ensure it's the same config as when it was set
            secure: false 
        });
        
        return res.status(200).json({ message: 'Logout successful.'});
    }
    catch(error){
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

