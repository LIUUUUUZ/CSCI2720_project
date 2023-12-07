const mongoose = require('mongoose');
// [
//     {
//       "ID": 0,
//       "events": [
//         {
//           "ID": 0,
//           "time": "2023/12/31 00:00",
//           "description": "This is event 0-0.",
//           "presenter": "Niu mo de zang li si yi",
//           "price": 150
//         },
//         {
//           "ID": 1,
//           "time": "2023/12/31 00:01",
//           "description": "This is event 0-1.",
//           "presenter": "Niu mo de zang li si yi",
//           "price": 150
//         },
//         {
//           "ID": 2,
//           "time": "2023/12/31 00:02",
//           "description": "This is event 0-2.",
//           "presenter": "Niu mo de zang li si yi",
//           "price": 150
//         }
//       ],
//       "info": {
//         "locationName": "Hong Kong Cultural Centre (Exhibition Gallery)",
//         "latitude": 22.2222222,
//         "longitude": 114.4444444,
//         "eventNum": 3
//       }
//     },
//     {
//       "ID": 1,
//       "events": [
//         {
//           "ID": 0,
//           "time": "2023/12/31 01:00",
//           "description": "This is event 1-0.",
//           "presenter": "Niu mo de zang li si yi",
//           "price": 150
//         },
//         {
//           "ID": 1,
//           "time": "2023/12/31 01:01",
//           "description": "This is event 1-1.",
//           "presenter": "Niu mo de zang li si yi",
//           "price": 150
//         }
//       ],
//       "info": {
//         "locationName": "Aberdeen Public Library",
//         "latitude": 23.2222222,
//         "longitude": 115.4444444,
//         "eventNum": 2
//       }
//     },
//     {
//       "ID": 2,
//       "events": [
//         {
//           "ID": 0,
//           "time": "2023/12/31 02:00",
//           "description": "This is event 2-0.",
//           "presenter": "Niu mo de zang li si yi",
//           "price": 150
//         }
//       ],
//       "info": {
//         "locationName": "City Hall Public Library",
//         "latitude": 24.2222222,
//         "longitude": 116.4444444,
//         "eventNum": 1
//       }
//     }
//   ]
const venueSchema = mongoose.Schema(
    {
        ID: {type: Number, unique: true},
        events: [
            {
                ID: {type: Number, unique: true},
                time: String,
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
            userName: String,
        }]
    },
)

module.exports = mongoose.model('Venue', venueSchema);
