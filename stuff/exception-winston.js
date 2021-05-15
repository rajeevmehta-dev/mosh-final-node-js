const express = require('express');
const app = express();
const winston = require('winston');
const genre = require('../routes/genres_api');
const customers = require('../routes/customers_api');
const movies = require('../routes/movies_api');
const rentals = require('../routes/rental_api');
const user = require('../routes/users_api');
require('./startup/routers')(app);
/* Catching and logging Uncaught Exception, errors outside express's context.
We don;t need to define it if we are using winston.handleExceptions
process.on('uncaughtException', (ex) => {
    console.log("Uncaught Exception");
    winston.error(ex.message, ex);
}); */

/*
Catching Unhandled PROMISE REJECTIONS, again we don't need to define it 
if we are using winston.handleExceptions

process.on('unhandledRejection', (ex) => {
    console.log("Unhandled Promise Rejection");
    winston.error(ex.message, ex);
}); */

process.on('unhandledRejection', (ex) => {
    throw ex;     //we are throwing the error so that the winston.handleException will handle it.
});

winston.handleExceptions(
    // this method will automatically catch and log all the uncaught exceptions,
    // but by default will not catch unhandled Promises
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);
const p = Promise.reject(new Error('BIG Promise ERROR'));
p.then(() => {
    console.log('done')
})
const mongoose = require('mongoose');
var Joi = require('joi');
const err = require('./middlewares/errors');
Joi.objectId = require('joi-objectid')(Joi);

require('winston-mongodb')
const config = require('config');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(config.get('jwtPrivateKey'));
winston.add(winston.transports.File, { filename: 'logfile.log' });
// winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/Mosh' });

//connect to DB
mongoose.connect('mongodb://localhost/Mosh', { useNewUrlParser: true });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/genre', genre);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', user);

app.listen(3000);
app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error);
});

// Using error middleware
app.use(err);

console.log('Node Running for Movies API');

module.exports = app;