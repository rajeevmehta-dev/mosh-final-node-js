const express = require('express');
const router = express.Router();
const Rentals = require('../models/rental');
const auth = require('../middlewares/auth');
const moment = require('moment');
const Movie = require('../models/movies');
// var backdate=moment().add(-7,'days').toDate();
// var d=moment().diff(rental.dateOut,'days');
router.post('/', auth, function (req, res, next) {
    if (!req.body.customer) return res.status(400).send("Corrupt Body! No Customer ID");
    if (!req.body.movie) return res.status(400).send("Corrupt Body! No Movie ID");

    Rentals.findOne({
        'customer._id': req.body.customer,
        'movie._id': req.body.movie
    }, function (err, result) {
        if (err) next(err);
        if (!result) return res.status(404).send("No Rental Found");    //no rental record-exit
        if (result.dateReturned) return res.status(400).send("Rental Already Set"); //rent out already set
        //Information Expert Principle
        result.dateReturned = new Date();   //today's date
        result.rentalFee = moment().diff(result.dateOut, 'days') * result.movie.dailyRentalRate; //calculate rent
        result.save().then((updated) => {       //save changes
            Movie.update({ _id: req.body.movie }, { $inc: { numberInStock: 1 } }).then(() => {

            }).catch((e) => {
                next(e);
            })
            return res.status(200).send(updated);
        }).catch((e) => {
            next(e);
        });
    })

});
module.exports = router;