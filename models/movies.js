const mongoose = require('mongoose');


const moviesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genre: {
        // type:mongoose.Schema.Types.ObjectId,
        // ref:'genres'
        _id: mongoose.Schema.Types.ObjectId,
        name: String
    },
    numberInStock: { type: Number, required: true },
    dailyRentalRate: { type: Number, required: true }
}, { versionKey: false });

module.exports = mongoose.model('movies', moviesSchema);