const { isAdmin } = require('../middleware/authMiddleware');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const samiskeSprak = ['SØR', 'UME', 'PITE', 'LULE', 'NORD', 'ENARE', 'SKOLT', 'AKKALA', 'KILDIN', 'TER'];

exports.getHomePage = async (req, res) => {
    let categories = [];
    

    const token = req.cookies.User;
    let isAuthenticated = false;
    let isAdminUser = false;
    
    if (token) {
        try {
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            isAuthenticated = true;
            
            // Check if user is admin
            const user = await User.findById(decoded.Userid);
            if (user && user.isAdmin) {
                isAdminUser = true;
            }
        } catch (err) {
            console.error("Token verification error:", err);
            // Invalid token, user not authenticated
        }
    }
    
   
    try {
        categories = await Category.find();
    } catch (error) {
        console.error("Error fetching categories:", error);
        categories = []; // Fallback to empty array if error
    }
    
    res.render("index", { 
        title: "Home", 
        samiskeSprak,
        isAdmin: isAdminUser,
        isAuthenticated: isAuthenticated,
        categories 
    });
};