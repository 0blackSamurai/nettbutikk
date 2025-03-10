const Product = require('../models/Product');
const Genre = require('../models/Category'); 
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Render the page to create a new product
exports.renderCreateProduct = async (req, res) => {
  
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
    // Fetch all genres/categories for the dropdown
    const genres = await Genre.find();
    
    res.render('createProduct', { 
      title: 'Create New Product',
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
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, genre } = req.body;
    
    // Validate all required fields
    if (!name || !description || !price || !genre) {
      const genres = await Genre.find();
      return res.render('createProduct', {
        title: 'Create New Product',
        genres,
        error: 'Alle feltene er obligatoriske',
        formData: req.body,
        isAdmin: true,
        isAuthenticated: true
      });
    }
    
    // Validate description length
    if (description.length > 100) {
      const genres = await Genre.find();
      return res.render('createProduct', {
        title: 'Create New Product',
        genres,
        error: 'Beskrivelsen kan ikke være over 100 tegn',
        formData: req.body,
        isAdmin: true,
        isAuthenticated: true
      });
    }
    
    // Check if the genre exists
    const genreExists = await Genre.findById(genre);
    if (!genreExists) {
      const genres = await Genre.find();
      return res.render('createProduct', {
        title: 'Create New Product',
        genres,
        error: 'Ugyldig kategori valgt',
        formData: req.body,
        isAdmin: true,
        isAuthenticated: true
      });
    }
    
    // Handle file uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push('/uploads/' + file.filename);
      });
    } else {
      const genres = await Genre.find();
      return res.render('createProduct', {
        title: 'Create New Product',
        genres,
        error: 'Du må laste opp minst ett bilde',
        formData: req.body,
        isAdmin: true,
        isAuthenticated: true
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
    
    // Redirect to the admin dashboard with success message
    return res.redirect('/dashboard?success=Produkt ble lagt til');
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Re-render the form with error message
    const genres = await Genre.find();
    
    return res.render('createProduct', {
      title: 'Create New Product',
      genres,
      error: 'Feil ved lagring av produkt: ' + error.message,
      formData: req.body,
      isAdmin: true,
      isAuthenticated: true
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('genre').sort({ createdAt: -1 });
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

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Genre.findById(categoryId);
    
    if (!category) {
      return res.status(404).send('Category not found');
    }
    
    const products = await Product.find({ genre: categoryId }).populate('genre');
    
    res.render('category', { 
      title: category.name,
      category,
      products,
      isAdmin: req.user && req.user.isAdmin,
      isAuthenticated: !!req.user
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).send('Server error');
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate('genre');
    
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
  exports.renderEditProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      const genres = await Genre.find();
      
      if (!product) {
        return res.status(404).send('Product not found');
      }
      
      res.render('editProduct', {
        title: 'Edit Product',
        product,
        genres,
        isAdmin: true,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Error fetching product for editing:', error);
      res.status(500).send('Server error');
    }
  };
  
  exports.updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const { name, description, price, genre } = req.body;
      
      // Validate all required fields
      if (!name || !description || !price || !genre) {
        const product = await Product.findById(productId);
        const genres = await Genre.find();
        return res.render('editProduct', {
          title: 'Edit Product',
          product,
          genres,
          error: 'Alle feltene er obligatoriske',
          isAdmin: true,
          isAuthenticated: true
        });
      }
      
      // Validate description length
      if (description.length > 100) {
        const product = await Product.findById(productId);
        const genres = await Genre.find();
        return res.render('editProduct', {
          title: 'Edit Product',
          product,
          genres,
          error: 'Beskrivelsen kan ikke være over 100 tegn',
          isAdmin: true,
          isAuthenticated: true
        });
      }
      
      // Get existing product
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      
      // Update fields
      product.name = name;
      product.description = description;
      product.price = parseFloat(price);
      product.genre = genre;
      
      // Handle new images if uploaded
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => '/uploads/' + file.filename);
        product.images = [...product.images, ...newImages];
      }
      
      // Save the updated product
      await product.save();
      
      return res.redirect(`/product/${productId}?success=Produkt oppdatert`);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Server error: ' + error.message);
    }
  };
  
  // Add method to delete images
  exports.deleteProductImage = async (req, res) => {
    try {
      const { productId, imageIndex } = req.params;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      if (imageIndex >= 0 && imageIndex < product.images.length) {
        // Get the image path to delete from filesystem
        const imagePath = product.images[imageIndex];
        const fullPath = path.join(__dirname, '../public', imagePath);
        
        // Remove from array
        product.images.splice(imageIndex, 1);
        
        // Save product without this image
        await product.save();
        
        // Try to delete file from filesystem (but don't fail if not possible)
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (fsError) {
          console.warn('Could not delete image file:', fsError);
          // Continue anyway, the image is removed from the database
        }
        
        return res.json({ success: true });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid image index' });
      }
    } catch (error) {
      console.error('Error deleting product image:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
};