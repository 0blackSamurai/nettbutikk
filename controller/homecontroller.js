const { isAdmin } = require('../middleware/authMiddleware');
const Category = require('../models/Category');

const samiskeSprak = ['SØR', 'UME', 'PITE', 'LULE', 'NORD', 'ENARE', 'SKOLT', 'AKKALA', 'KILDIN', 'TER'];

exports.getHomePage = async (req, res) => {
    // Provide an empty array for categories until you have the database set up
    const categories = [];
    
    res.render("index", { 
        title: "Home", 
        samiskeSprak,
        isAdmin: false,
        categories 
    });
};