const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile/:id', authMiddleware, userController.updateProfile);

module.exports = router;
