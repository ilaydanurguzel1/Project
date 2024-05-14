const db = require("../models");
const Product = db.product;
const User = db.user;

module.exports = {
    likeProduct: async (req, res) => {
      try {
        const { productId } = req.params;
        const userId = req.user.user_id;
  
        const product = await Product.findByPk(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        const user = await User.findByPk(userId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        if (product.likes.includes(userId)) {
          return res
            .status(409)
            .json({ error: 'You have already liked this product' });
        }
  
        product.likes.push(userId);
  
        await product.save();
  
        return res.status(200).json({ message: 'Product liked successfully' });
      } catch (error) {
        console.error('Error liking product:', error);
        return res
          .status(500)
          .json({ error: 'Internal Server Error while liking product' });
      }
    },
  
    removeLikeProduct: async (req, res) => {
      try {
        const { productId } = req.params;
        const userId = req.user.user_id;
  
        // Check if the product exists
        const product = await Product.findByPk(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        if (!product.likes.includes(userId)) {
          return res.status(409).json({ error: 'You have not liked this product' });
        }
  
        product.likes = product.likes.filter((id) => id.toString() !== userId);
  
        await product.save();
  
        return res
          .status(200)
          .json({ message: 'Product like removed successfully' });
      } catch (error) {
        console.error('Error removing product like:', error);
        return res
          .status(500)
          .json({ error: 'Internal Server Error while removing product like' });
      }
    },
  };