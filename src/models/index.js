require('dotenv').config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: "mysql"
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.product = require("./products")(sequelize, Sequelize);
db.user = require("./users")(sequelize, Sequelize);

module.exports = db;