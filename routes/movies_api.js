const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Movie = require('../models/movies');
const Genre = require('../models/genres');
const auth = require('../middlewares/auth');
const Admin = require('../middlewares/admin');

// get all the movies list, with genre details stored in other collection
router.get('/', function (req, res, next) {
    Movie.find().populate("genre")
        .then((result) => {
            res.status(200).send(result);
        }).catch((e) => {
            next(e);
        });
});

// user token required for this endpoint
router.post('/', auth, function (req, res, next) {

    const { error } = validateData(req.body);
    if (error) return next(error);
    Genre.findById(req.body.genre)
        .then((genre) => {

            if (!genre) res.status(404).send({ message: "Genre Not Found" });

            else {

                const movie = new Movie({
                    name: req.body.name,
                    genre: {
                        _id: genre._id,
                        name: genre.name
                    },
                    numberInStock: req.body.numberInStock,
                    dailyRentalRate: req.body.dailyRentalRate
                });
                movie.save()
                    .then((result) => {
                        res.status(201).json({ message: "Movie Created", result: result });
                    }).catch((e) => {
                        next(e);
                    })
            }

        }).catch((e) => {
            next(e);
        })


});

function asyncMiddleware(handler) {
    return async (req, res, next) => {

        try {
            await handler(req, res);
         }
        catch (ex) {
            next(ex);
        }
    }

}


router.post('/v2', asyncMiddleware(async function (req, res) {

    // const { error } = validateData(req.body);
    // if (error) return res.status(400).send({error:error});
    Genre.findById(req.body.genre)
        .then((genre) => {
            if (!genre) res.status(404).send({ message: "Genre Not Found" });
            else {
                const movie = new Movie({
                    name: req.body.name,
                    genre: {
                        _id: genre._id,
                        name: genre.name
                    },
                    numberInStock: req.body.numberInStock,
                    dailyRentalRate: req.body.dailyRentalRate
                });
                movie.save()
                    .then((result) => {
                        res.status(201).json({ message: "Movie Created", result: result });
                    });
            }

        });


}));








router.patch('/:id', function (req, res, next) {

    const updateObject = req.body;

    Movie.update({ _id: req.params.id }, updateObject)
        .then((result) => {
            if (result.n > 0) res.status(201).json({ message: "Movie Updated", result: result });
            else res.status(400).json({ message: "Movie Not Updated", result: result });

        }).catch((e) => {
            next(e);
        });
});

// admin token will be required 
router.delete('/:id', [auth, Admin], function (req, res, next) {

    Movie.findById(req.params.id, function (err, movie) {
        if (err) next(err);
        if (!movie) return res.status(404).json({ message: "Movie Not Deleted !" });

        Movie.deleteOne({ _id: req.params.id })
            .then((result) => {
                return res.status(200).json({ message: "Movie Deleted", result: result });

            }).catch((e) => {
                next(e);
            });
    });
});

function validateData(movie) {
    const schema = ({
        name: Joi.string().min(5).required(),
        genre: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(1000),
        dailyRentalRate: Joi.number().min(0).max(250)
    })
    return Joi.validate(movie, schema);
}

module.exports = router;