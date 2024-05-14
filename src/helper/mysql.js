require('dotenv').config();
const mysql = require("mysql2");

const mysqlConnection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER ,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

mysqlConnection.getConnection((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
        throw err;
    }
    console.log("MySQL connected");
});


module.exports = {mysqlConnection};