import jwt from 'jsonwebtoken';

export const createToken = (user) => {
    const maxAge = 3 * 24 * 60 * 60;
    const accessToken = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: maxAge }
    );

    return accessToken;
};

export const verifyToken = (req, res) => {

    const token = req.cookies.userToken;
    
    if(!token){
        return res.status(403).json({massage: "no token in the cookie"});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.status(403).json({massage: "token nod valid"});
        } 
        res.status(201).json({username: user.username});
    } )

}

