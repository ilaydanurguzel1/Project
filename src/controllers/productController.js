const productService = require('../service/productService');
const db = require("../models");
const Product = db.product;

module.exports = {
    getAllProducts: async (req, res) => {
      try {
        const products = await Product.findAll();
        res.status(200).json(products);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    },
  
    getProductDetails: async (req, res) => {
      const productId = req.params.productId;

      try {
        const productDetails = await productService.getProductDetails(productId);
        res.json(productDetails);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  
    createNewProduct: async (req, res) => {
      const {name, price, description} = req.body;
      // const createdBy = req.user.user_id;
  
      try {
        const newProduct = new Product({name, price, description});
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error while creating product');
      }
    },

    getProductById: async (req, res) => {
      const productId = req.params.productId;
      try {
        const product = await Product.findByPk(productId);
        if(!product){
          return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    },
  
    deleteProduct: async (req, res) => {
      const productId = req.params.productId;
      // const userId = req.user.user_id;

      try {
        const product = await Product.findOne({where: {id: productId}});
        if(!product) {
          return res.status(403).json({ error: 'You are not allowed to cancel or delete this product' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res
          .status(500)
          .json({ error: 'Internal Server Error while deleting product' });
        }
    
    },
  
    updateProduct: async (req, res) => {
      const productId = req.params.productId;
      const { name, price, picturePath, description } = req.body;
      const userId = req.user.user_id;
  
      try {
        const product = await Product.findOne({ where: { id: productId, createdBy: userId } });
        if (!product) {
          return res.status(403).json({ error: 'You are not allowed to edit this product' });
        }
        product.name = name || product.name;
        product.price = price || product.price;
        product.picturePath = picturePath || product.picturePath;
        product.description = description || product.description;
        await product.save();
        res.status(200).json({ message: 'Product updated successfully' });
      } catch (error) {
        res
          .status(500)
          .json({ error: 'Internal Server Error while updating product' });
      }
    },
  };