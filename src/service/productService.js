const Product = require('../models/products');
const Comment = require('../models/comments');
const Like = require('../models/likes');

async function details(productId) {
  const product = await Product.findByPk(productId);
  
  const comments = await Comment.find({ productId });
  const likes = await Like.find({ productId });

  return {
    product,
    comments,
    likes
  };
}

module.exports = {
  details
};