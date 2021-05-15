const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({

    customer: {
        type: new mongoose.Schema({


            name: {
                type: String,
                required: true,
                minLength: 5,
                maxLength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: Number,
                required: true,
                minLength: 5,
                maxLength: 10
            },
        }),

        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minLength: 4,
                maxLength: 200
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            },
            genre: {
                type: new mongoose.Schema({
                    _id: mongoose.Schema.Types.ObjectId,
                    name: String
                }),

            }
        }),
        required: true

    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        minLength: 0
    }
});
module.exports = mongoose.model('rentals', rentalSchema);