const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

const { isAuthenticated } = require('../middleware/authMiddleware');
const { isAdmin} = require('../middleware/authMiddleware');

router.get('/register', authController.renderRegisterPage);
router.post('/register', authController.register);

router.get('/login', authController.renderLoginPage);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/dashboard', isAdmin, authController.renderDashboardPage);

router.get('/profile', isAuthenticated, authController.renderProfilePage);

// router.get('/Faq', authController.renderFaqPage);

// router.get('/diagram', authController.renderDiagramPage);

module.exports = router;