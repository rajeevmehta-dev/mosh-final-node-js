const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Rental = require('../models/rental');
const Customer = require('../models/customer');
const Movie = require('../models/movies');
const fawn = require('fawn');
var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const auth=require('../middlewares/auth');
fawn.init(mongoose);
router.get('/', function (req, res, next) {

    Rental.find({})
        .then((result) => {
            res.status(200).send(result);
        }).catch((e) => {
            next(e);
        })

});

router.post('/',auth, function (req, res, next) {

    const { error } = validateRental(req.body);
    if (error) return next(error);

    Customer.findById(req.body.customer)
        .then((customer) => {

            if (!customer) res.status(400).send({ message: "Customer Not Valid!" });

            Movie.findById(req.body.movie)
                .then((movie) => {
                    if (!movie) res.status(400).send({ message: "Movie Not Valid!" });

                    if (movie.numberInStock === 0) res.status(400).send({ message: "Out of Stock" });

                    const rental = new Rental({
                        customer: {
                            _id: customer._id,
                            name: customer.name,
                            isGold: customer.isGold,
                            phone: customer.phone
                        },
                        movie: {
                            _id: movie._id,
                            title: movie.name,
                            genre: {
                                _id: movie.genre._id,
                                name: movie.genre.name
                            },
                            dailyRentalRate: movie.dailyRentalRate
                        }

                    });

                    try {
                        new fawn.Task()
                            .save('rentals', rental)
                            .update('movies', { _id: movie._id }, {
                                $inc: { numberInStock: -1 }
                            })
                            .run();
                        res.status(201).json({ message: "Operations Performed" })

                    } catch (e) {
                        next(e);
                    }

                }).catch((e) => {
                    next(e);
                })
        }).catch((e) => {
            next(e);
        })
});


function validateRental(rental) {

    const schema = ({
        customer: Joi.objectId().required(),

        movie: Joi.objectId().required()
    })
    return Joi.validate(rental, schema);

}

module.exports = router;