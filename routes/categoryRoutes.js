const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'category-' + Date.now() + path.extname(file.originalname));
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

// Create category form route (admin only)
router.get('/createApparel', isAdmin, categoryController.renderCreateCategory);

// Process category creation (admin only)
router.post('/category', isAdmin, upload.single('image'), categoryController.createCategory);

// Get all categories
router.get('/categories', categoryController.getAllCategories);

// Get a specific category
router.get('/category/:id', categoryController.getCategoryById);

module.exports = router;