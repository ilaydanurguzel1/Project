const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const { redisCachingMiddleware } = require("../middleware/redis");

const router = express.Router();

const productController = require('../controllers/productController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');

router.get('/', redisCachingMiddleware(), productController.getAllProducts);
router.get('/details', authenticate, redisCachingMiddleware(), productController.getProductDetails);
router.post('/create', authenticate, productController.createNewProduct);
router.get('/:productId', productController.getProductById);
router.delete('/:productId', authenticate, productController.deleteProduct);
router.put('/:productId', authenticate, productController.updateProduct);

// commnets
router.post('/addComment/:productId', authenticate, commentController.addComment);
router.delete(
  '/deleteComment/:commentId',
  authenticate,
  commentController.deleteComment
);
router.put(
  '/updateComment/:commentId',
  authenticate,
  commentController.updateComment
);

// likes
router.post('/likeProduct/:productId',authenticate, likeController.likeProduct);
router.delete(
  '/removeLikeEvent/:productId',
  authenticate,
  likeController.removeLikeProduct
);
module.exports = router;
