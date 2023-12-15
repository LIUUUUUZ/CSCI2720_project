const mongoose = require('mongoose');

const venueSchema = mongoose.Schema(
    {
        ID: {type: Number, unique: true},
        events: [
            {
                ID: {type: Number, unique: true},
                time: [],
                description: String,
                presenter: String,
                price: Number
            }
        ],
        info: {
            locationName: String,
            latitude: Number,
            longitude: Number,
            eventNum: Number,
            rate: {type: Number, default: null},
            rateNum: {type: Number, default: 0},
        },
        comments:[{
            text: String,
            username: String,
            ID: {type: Number},
        }]
    },
)

module.exports = mongoose.model('Venue', venueSchema);
