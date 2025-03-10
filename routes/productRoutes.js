const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'product-' + Date.now() + path.extname(file.originalname));
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

// Create product form route (admin only)
router.get('/create-product', isAdmin, productController.renderCreateProduct);

// Process product creation (admin only)
router.post('/product', isAdmin, upload.array('images', 5), productController.createProduct);

// Get all products
router.get('/products', productController.getAllProducts);

// Get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// Get a specific product
router.get('/product/:id', productController.getProductById);
router.get('/edit-product/:id', isAdmin, productController.renderEditProduct);

// Process product update (admin only)
router.post('/update-product/:id', isAdmin, upload.array('images', 5), productController.updateProduct);

// Delete product image (admin only, AJAX route)
router.delete('/product/:productId/image/:imageIndex', isAdmin, productController.deleteProductImage);

module.exports = router;