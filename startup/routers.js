const express=require('express');
const genre = require('../routes/genres_api');
const customers = require('../routes/customers_api');
const movies = require('../routes/movies_api');
const rentals = require('../routes/rental_api');
const user = require('../routes/users_api');
const error=require('../middlewares/errors');
const returns=require('../routes/returns_api');
module.exports = function (app) {

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use('/api/genre', genre);


    app.use('/api/customers', customers);


    app.use('/api/movies', movies);


    app.use('/api/rentals', rentals);

    app.use('/api/returns', returns);

    app.use('/api/users', user);

    app.use((req, res, next) => {
        const error = new Error('Route Not Found');
        error.status = 404;
        next(error);
    });

    // Using error middleware
    app.use(error);
}