const express = require('express');
const router = express.Router();
const homeController = require('../controller/homecontroller');

router.get('/', homeController.getHomePage);

module.exports = router;