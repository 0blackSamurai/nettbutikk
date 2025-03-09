const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Create apparel form route (admin only)
router.get('/createApparel', isAdmin, productController.renderCreateApparel);

// Process apparel creation (admin only)
router.post('/apparel', isAdmin, upload.array('images', 5), productController.createApparel);

// Get all products
router.get('/products', productController.getAllProducts);

// Get a specific product
router.get('/product/:id', productController.getProductById);

module.exports = router;