const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const auth=require('../middlewares/auth');

router.post('/', function (req, res, next) {

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) return res.status(400).send({ message: "Email Already Exists" });

            bcrypt.hash(req.body.password, 10)
                .then((hashed_password) => {
                    var user = new User({
                        email: req.body.email,
                        password: hashed_password,
                        isAdmin: req.body.isAdmin
                    });
                    const token = user.createJWT();

                    user.save()
                        .then((result) => {
                            res.header('x-auth-token', token).send({ message: "User Created", result: result })
                        }).catch((e) => {
                            next(e);
                        })
                }).catch((e) => {
                    next(e);
                });
        });
});


router.get('/me', auth, function (req, res, next) {
    let id = req.userData._id;
    User.findById(id).select('-password')
        .then((user) => {
            res.status(200).send(user);
        }).catch((e) => {
            next(e)
        })

});
module.exports = router;