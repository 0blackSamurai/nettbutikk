const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function isAuthenticated(req, res, next) {
    const token = req.cookies.User;

    if (!token) {
        return res.redirect("/login");
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT Error:", err);
            return res.redirect("/login");
        }
        req.user = decoded;
        next();
    });
}

async function isAdmin(req, res, next) {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).send('Unauthorized: Admin access required');
        }
        next();
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).send('Server error');
    }
}

module.exports = { isAuthenticated, isAdmin };