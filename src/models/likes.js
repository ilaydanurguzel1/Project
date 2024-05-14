const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {
      type: Number,
      ref: 'User',
      required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    commitedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Like = mongoose.model('Like', likeSchema);
  
  module.exports = Like;