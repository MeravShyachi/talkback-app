import User from "../models/User.js";

export const getAll = async(req, res) => {
    try{
        const username = req.user.username;
        console.log("in get all: ", username);

        // Fetch all users from the database and project only the username field
        const users = await User.find({}, { username: 1, _id: 0 });
        console.log("in get all: ", users)
        res.status(200).json({users, username});

    }catch(error){
        res.status(500).json({massage: "database query failed"});
    }
}