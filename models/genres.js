const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { versionKey: false })

module.exports=mongoose.model('genres',genreSchema);