const mongoose = require('mongoose');

const customers = mongoose.Schema({
    name: {
        type: String, required: true
    },
    isGold: Boolean,
    phone: {
        type: Number, min : 1000000000,
        max : 9999999999
    }
}, { versionKey: false });

module.exports = mongoose.model('customers', customers);