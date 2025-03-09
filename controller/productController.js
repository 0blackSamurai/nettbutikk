const Product = require('../models/Product');
const Genre = require('../models/Category'); // Using your existing model naming
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Render the page to create a new apparel
exports.renderCreateApparel = async (req, res) => {
  try {
    // Fetch all genres/categories for the dropdown
    const genres = await Genre.find();
    
    res.render('createApparel', { 
      title: 'Create New Apparel',
      genres,
      isAdmin: true,
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).send('Server error');
  }
};

// Process the form submission and create a new product
exports.createApparel = async (req, res) => {
  try {
    const { name, description, price, genre } = req.body;
    
    // Handle file uploads (you'll need multer middleware for this to work)
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push('/uploads/' + file.filename);
      });
    }
    
    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      genre, // This is the ID of the genre/category
      images,
      createdAt: new Date()
    });
    
    // Save the product to the database
    await newProduct.save();
    
    console.log('New product created:', newProduct);
    
    // Redirect to the admin dashboard or product listing
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product: ' + error.message);
  }
};

// Display all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('genre');
    res.render('products', { 
      title: 'All Products',
      products,
      isAdmin: req.user && req.user.isAdmin,
      isAuthenticated: !!req.user
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error');
  }
};

// Display a single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('genre');
    if (!product) {
      return res.status(404).send('Product not found');
    }
    
    res.render('productDetail', { 
      title: product.name,
      product,
      isAdmin: req.user && req.user.isAdmin,
      isAuthenticated: !!req.user
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Server error');
  }
};