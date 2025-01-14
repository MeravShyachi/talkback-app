export const logout = (req, res) => {
    // Clear the cookie
    res.clearCookie('userToken', {
        httpOnly: true, // Ensure it's the same config as when it was set
        secure: false 
    });
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

