
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const fs = require('fs');
const path = require('path');
const { isAuthenticated } = require('../middleware/authMiddleware');

exports.renderHome = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('home', { 
      title: 'T-skjorter og gensere', 
      categories,
      isAdmin: req.user && req.user.isAdmin 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Server error');
  }
};

exports.renderCategoryPage = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    const products = await Product.find({ category: categoryId });
    
    res.render('category', { 
      title: category.name, 
      category, 
      products,
      isAdmin: req.user && req.user.isAdmin 
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).send('Server error');
  }
};

exports.renderProductPage = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate('category');
    
    res.render('product', { 
      title: product.name, 
      product,
      isAdmin: req.user && req.user.isAdmin 
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Server error');
  }
};

// Admin functions
exports.Profile = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    const categories = await Category.find();
    
    res.render('/profile', { 
      title: 'Profile', 
      products, 
      categories,
      isAuthenticated,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server error');
  }
};

exports.renderAddProduct = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('admin/addProduct', { 
      title: 'Add New Product', 
      categories,
      isAdmin: true
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Server error');
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const images = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];
    
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images
    });
    
    await newProduct.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Server error');
  }
};

exports.renderAddCategory = (req, res) => {
  res.render('admin/addCategory', { 
    title: 'Add New Category',
    isAdmin: true
  });
};

exports.addCategory = async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    
    const newCategory = new Category({
      name,
      type,
      description,
      image
    });
    
    await newCategory.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).send('Server error');
  }
};