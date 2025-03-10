const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Render the page to create a new category
exports.renderCreateCategory = async (req, res) => {
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
    res.render('createApparel', { 
      title: 'Create New Apparel Category',
      isAdmin: true,
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Error rendering category creation page:', error);
    res.status(500).send('Server error');
  }
};

// Process the form submission and create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    
    // Validate all required fields
    if (!name || !description || !type) {
      return res.status(400).send('Alle feltene er obligatoriske');
    }
    
    // Validate description length
    if (description.length > 100) {
      return res.status(400).send('Beskrivelsen kan ikke være over 100 tegn');
    }
    
    // Handle file upload
    if (!req.file) {
      return res.status(400).send('Du må laste opp et bilde');
    }
    
    const image = '/uploads/' + req.file.filename;
    
    // Create a new category
    const newCategory = new Category({
      name,
      description,
      type,
      image
    });
    
    // Save the category to the database
    await newCategory.save();
    
    console.log('New category created:', newCategory);
    
    // Redirect to the admin dashboard with success message
    res.redirect('/dashboard?success=Kategori ble lagt til');
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).send('Error creating category: ' + error.message);
  }
};

// Display all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('categories', { 
      title: 'All Categories',
      categories,
      isAdmin: req.user && req.user.isAdmin,
      isAuthenticated: !!req.user
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Server error');
  }
};

// Display a single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    
    res.render('categoryDetail', { 
      title: category.name,
      category,
      isAdmin: req.user && req.user.isAdmin,
      isAuthenticated: !!req.user
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).send('Server error');
  }
};