const express = require('express');
const router = express.Router();
const objectid = require('../middlewares/id_check');
const Genre = require('../models/genres');
const auth = require('../middlewares/auth');
const Joi = require('joi');

router.get('/', function (req, res, next) {
    Genre.find()
        .then((result) => {
            res.status(200).send(result);
        }).catch((e) => {
            next(e);
        });
});
router.get('/:id', objectid, function (req, res, next) {


    Genre.findById(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        }).catch((e) => {
            next(e);
        });
});

router.post('/', auth, function (req, res, next) {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send({success:false,message:"Invalid Body"});
    const genre = new Genre({
        name: req.body.name
    });
    genre.save()
        .then((result) => {
            res.status(201).send( result);
        }).catch((e) => {
            next(e);
        })
});

router.put('/:id',[auth,objectid], function (req, res, next) {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send({success:false,message:"Invalid Body"});
    const updateObject = req.body;

    Genre.update({ _id: req.params.id }, updateObject)
        .then((result) => {
            if (result.n > 0) res.status(201).send(result );
            else res.status(400).json({ message: "Genre Not Updated", result: result });

        }).catch((e) => {
            next(e);
        });
});


router.delete('/:id',[auth,objectid], function (req, res, next) {

    Genre.deleteOne({ _id: req.params.id })
        .then((result) => {
            if (result.result.n > 0) res.status(200).send(result);
            else res.status(404).json( result);
        }).catch((e) => {
            next(e);
        });

});

function validateGenre(genre) {
    const schema = ({
        name: Joi.string().min(5).max(10)
    });
    return Joi.validate(genre, schema);
}

module.exports = router;