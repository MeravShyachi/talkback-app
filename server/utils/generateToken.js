import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign({ _id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

