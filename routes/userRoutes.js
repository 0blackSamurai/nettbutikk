const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// router.get('/mineFlokker', isAuthenticated, eierController.mineFlokker);
// router.get('/internOverforing/:dyrId', isAuthenticated, eierController.renderInternOverforing);
// router.post('/internOverforing', isAuthenticated, eierController.internOverforing);

module.exports = router;