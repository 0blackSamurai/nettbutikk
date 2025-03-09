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
    // First make sure the user is authenticated
    const token = req.cookies.User;

    if (!token) {
        return res.redirect("/login");
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.Userid);
        
        if (!user) {
            return res.redirect("/login");
        }
        
        if (!user.isAdmin) {
            return res.status(403).render('error', { 
                message: 'Access denied. Admin privileges required.',
                title: 'Access Denied'
            });
        }
        
        req.user = user; // Store the full user object
        next();
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).send('Server error');
    }
}

module.exports = { isAuthenticated, isAdmin };