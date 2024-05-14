const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
var bodyParser = require('body-parser');
const amqp = require('amqplib');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const orderService = require('../server/rabbitmq');
const connectToMongo = require('./helper/mongodb');

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

const app = express();

app.set('trust proxy', 1);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);

const PORT = process.env.NODE_LOCAL_PORT || 3000;

//Database connections
connectToMongo();
const db = require("../src/models");
db.sequelize.sync();

//Redis connection
const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(
    session({
        store: new RedisStore({
            client: redisClient
        }),
        secret: "secret$123",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

//RabbitMQ connection
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'orders';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log("Waiting for orders...");

        // Process orders from RabbitMQ
        channel.consume(queue, function(msg) {
            const order = JSON.parse(msg.content.toString());

            console.log("Received order:", order);

            orderService.saveOrderToDatabase(order);

            orderService.decreaseStock(order);

            channel.ack(msg);
        }, {
            noAck: false
        });
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

module.exports = {app, server};