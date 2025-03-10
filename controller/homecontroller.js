const { isAdmin } = require('../middleware/authMiddleware');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const samiskeSprak = ['SØR', 'UME', 'PITE', 'LULE', 'NORD', 'ENARE', 'SKOLT', 'AKKALA', 'KILDIN', 'TER'];
exports.getHomePage = async (req, res) => {
    let categories = [];
    
    try {
        categories = await Category.find();
    } catch (error) {
        console.error("Error fetching categories:", error);
        categories = []; // Fallback to empty array if error
    }
    
    res.render("index", { 
        title: "Home", 
        samiskeSprak,
        isAdmin: req.isAdmin,
        isAuthenticated: req.isAuthenticated,
        user: req.user,
        categories 
    });
};