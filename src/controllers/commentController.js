const Comment = require('../models/comments');
const db = require("../models");
const Product = db.product;
const User = db.user;


module.exports = {
    addComment: async (req, res) => {
      try {
        const { productId } = req.params;
        const userId = req.user.user_id;
        const { content } = req.body;
  
        const product = await Product.findByPk(productId);
  
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const comment = new Comment({
          user: userId,
          product: productId,
          content,
        });
  
        await comment.save();
  
        product.comments.push(comment._id);
        await product.save();

        return res
          .status(200)
          .json({ message: 'Comment added successfully', comment });
      } catch (error) {
        console.error('Error adding comment:', error);
        return res
          .status(500)
          .json({ error: 'Internal Server Error while adding comment' });
      }
    },
  
    deleteComment: async (req, res) => {
      try {
        const { commentId } = req.params;
        const userId = req.user.user_id;
  
        const comment = await Comment.findById(commentId);
        if (!comment) {
          return res.status(404).json({ error: 'Comment not found' });
        }
  
        if (comment.user.toString() !== userId) {
          return res
            .status(403)
            .json({ error: 'You are not authorized to delete this comment' });
        }
  
        await Comment.findByIdAndDelete(commentId);
  
        return res.status(200).json({ message: 'Comment deleted successfully' });
      } catch (error) {
        console.error('Error deleting comment:', error);
        return res
          .status(500)
          .json({ error: 'Internal Server Error while deleting comment' });
      }
    },
  
    updateComment: async (req, res) => {
      try {
        const { commentId } = req.params;
        const userId = req.user.user_id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
          return res.status(404).json({ error: 'Comment not found' });
        }
  
        if (comment.userId.toString() !== userId) {
          return res
            .status(403)
            .json({ error: 'You are not authorized to update this comment' });
        }
  
        const product = await Product.findById(comment.product);
        if (!product || !product.isPublished) {
          return res.status(403).json({
            error: 'Cannot update a comment for a canceled or non-existing product',
          });
        }
  
        comment.content = content;
        await comment.save();
  
        return res
          .status(200)
          .json({ message: 'Comment updated successfully', comment });
      } catch (error) {
        console.error('Error updating comment:', error);
        return res
          .status(500)
          .json({ error: 'Internal Server Error while updating comment' });
      }
    },
  };