const express = require('express');
const router = express.Router();
const { authenticate} = require('../middleware/authenticate');
const userController = require('../controllers/userController');
const { redisCachingMiddleware } = require("../middleware/redis");

router.get('/', authenticate, redisCachingMiddleware(), userController.getAllUsers);
router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.delete('/:id', authenticate, userController.deleteUser);
router.get('/signout', authenticate, userController.signOut);
router.get('/profile',authenticate, userController.getProfile);
router.get('/:id', redisCachingMiddleware(), userController.getUserById);
router.put('/profile',authenticate, userController.updateProfile);
module.exports = router;