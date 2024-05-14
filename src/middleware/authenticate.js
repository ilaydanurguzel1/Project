const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.user;

require('../app');

exports.authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
      jwt.verify(token, process.env.TOKEN_KEY, async (err, user) => {
        if(err){
          return res.status(403).json({error: 'Invalid token'});
        }
      const newUser = await User.findByPk(user.user_id);

      req.user = newUser;
      next();
    });
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// exports.isAdmin = async (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const user = await User.findByPk(req.user.user_id);

//   if (!user.isAdmin) {
//     return res.status(403).json({ error: 'Access Denied' });
//   }

//   next();
// };
