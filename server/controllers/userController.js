import User from "../models/User.js";

export const getAll = async(req, res) => {
    try{
        const username = req.user.username;
        const currentUser = await User.findOne({username}).select(["username", "_id"]);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all users from the database without the current user and project only the username field
        const users = await User.find({username: {$ne: username}}).select(["username", "_id"]);
        console.log("in get all: ", users)
        res.status(200).json({users, currentUser});

    }catch(error){
        res.status(500).json({massage: "database query failed"});
    }
}

export const getUser = async(req, res) => {
    try{ 
        const userId = req.query.userId;
        const user = await User.findOne({_id: userId}).select(["username", "_id"]);
        console.log("get user: ",user);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);

    }catch(error){
        res.status(500).json({massage: "database query failed"});
    }
}