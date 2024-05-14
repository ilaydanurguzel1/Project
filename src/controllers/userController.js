require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const db = require('../helper/mysql');
const { validateUser } = require('../utils/validation');
const db = require("../models");
const User = db.user;

module.exports = {
    getAllUsers: async (req, res) => {
      try {
        const users = await User.findAll();
        res.status(200).json(users);
      } catch (error) {
        return res
          .status(500)
          .json({ error: 'Internal Server Error while getting users' });
      }
    },
  
    signIn: async (req, res) => {
      try {
        const { username, password, rememberMe} = req.body;

        const user = await User.findOne({where: {username}});
  
        if (!user) {
          return res.status(401).json({ error: 'Wrong username or password' });
        };

  
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
          return res.status(401).json({ error: 'Wrong password' });
        }
  
        const expiresIn = rememberMe ? '7d' : '2h';
        const token = jwt.sign(
          { user_id: user.id },
          process.env.TOKEN_KEY,
          { expiresIn }
        );
  
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
        });
        res.status(200).json({
          message: `Hello ${user.firstname}, you have successfully logged in!`,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },
  
    signUp: async (req, res) => {
      try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({where: {username}});

        if(existingUser){
          return res.status(400).json({ error: 'Username already exists' });
        }else {
          const validateResult = validateUser(req.body);
          if (validateResult.error) {
            const errorMessages = validateResult.error.details.map((error) => error.message);
            return res.status(400).json({ errors: errorMessages });
          }
        }
        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password_hash });

        const token = jwt.sign(
          { user_id: newUser.id },
          process.env.TOKEN_KEY,
          { expiresIn: '2h' }
        );
  
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 2 * 60 * 60 * 1000,
        });
  
        res.status(201).json({ message: 'User created successfully' });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },
  
    signOut: async (req, res) => {
      try {
        // Clear the token from the cookie
        res.clearCookie('token');
  
        // Redirect the user to the home page
        res.redirect('/');
      } catch (err) {
        console.log(err);
      }
    },
  
    getProfile: async (req, res) => {
      try{
        const user = await User.finByPk(req.user.user_id);
        if(!user){
          return res.status(404).json({ error: 'User not found' });
        }
        const response = {username: user.username};
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json(error);
      }
    },
  
    getUserById: async (req, res) => {
      try {
        const user = await User.findByPk(req.params.id);
        if(!user){
          return res.status(404).json({ error: 'User not found' });
        }
        const response = {username: user.username};
        res.status(200).json(response);
      } catch (error) {
        res
          .status(500)
          .json({ error: 'Internal Server Error while getting user' });
      }
    },
  
    deleteUser: async (req, res) => {
      try {
        const userId = req.params.id;
        const deleteCount = await User.destroy({where: {id: userId}});
        if(deleteCount === 0){
          return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(`User deleted with ID ${userId}`);
      } catch (error) {
        res
          .status(500)
          .json({ error: 'Internal Server Error while deleting user' });
      }
    },

    updateProfile: async (req, res) => {
      try {
        const user = await User.findByPk(req.user.user_id);
        if(!user){
          return res.status(404).json({ error: 'User not found' });
        }

        const {username} = req.body;
        if(!username){
          return res.status(400).json({ error: 'No fields to update' });
        }

        user.username = username;
        await user.save();

        res.status(200).json(`User ${user.username} updated`);
      } catch (error) {
        res
          .status(500)
          .json({ error: 'Internal Server Error while updating user' });
      }
    },
  };