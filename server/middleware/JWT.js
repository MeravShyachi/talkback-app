import jwt from 'jsonwebtoken';

export const createToken = (user) => {
    const accessToken = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2m' }
    );

    return accessToken;
};

