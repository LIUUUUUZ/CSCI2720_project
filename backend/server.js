const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5555
app.use(express.static('app'));

const mongoose = require('mongoose');
app.use(cors());


// connect to database
mongoose.connect('mongodb+srv://LIUUUUU:3SWeBm4LVhhc30Fi@cluster0.grwtyog.mongodb.net/CSCI2720-project');
const db = mongoose.connection;
db.once('open', () => {
    console.log('DB connection successful');
    console.log('Server is online. ')
    
    // Schema
    //   const venueSchema = mongoose.Schema(
    //     {
    //         ID: Number,
    //         events: [
    //             {
    //                 ID: {type: Number, unique: true},
    //                 time: String,
    //                 description: String,
    //                 presenter: String,
    //                 price: Number
    //             }
    //         ],
    //         info: {
    //             locationName: String,
    //             latitude: Number,
    //             longitude: Number,
    //             eventNum: Number,
    //             rate: {type: Number, default: undefined},
    //             rateNum: {type: Number, default: 0},
    //         },
    //         comments:[{
    //             text: String,
    //             userName: String,
    //             ID
    //         }]
    //     },
    // )
    Venue = require('./venueSchema.js');

    //进入时加载主页的location列表  
    app.get('/location-list', (req, res) => {
      Venue.find({}).then(venues => {
          const modifiedList = venues.map(item => {return {ID: item.ID, info: item.info}});
          res.json(modifiedList);
        }
      ).catch(err => {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    });

    //进入某个地点页面时
    app.get('/location-page/:locationID', (req, res) => {
      const id = req.params.locationID;
      Venue.findOne({ID: id}).then(venue => {
        const data = {
          location: {
            ID: venue.ID,
            events: venue.events,
            info: venue.info
          },
          comments: venue.comments
        }
        res.json(data);
      }).catch(err => {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    });


    //发布评论
    app.post('/api/add-comment', (req, res) => {
      console.log(req.body);
      let MaxID = 0;
      Venue.find({}).then(venues => {
        for (let i = 0; i < venues.length; i++) {
          for (let j = 0; j < venues[i].comments.length; j++) {
            if (venues[i].comments[j].ID > MaxID) {
              MaxID = venues[i].comments[j].ID;
            }
          }
        }
        const id = MaxID + 1;
        const { locationID, userName, text } = req.body;
        Venue.findOne({ID: locationID}).then(venue => {
          venue.comments.push({text, userName, ID: id});
          venue.save();
          res.json(venue.comments);
        }).catch(err => {
          console.error('Error parsing JSON:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
      }).catch(err => {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    });


    // 存入测试数据 testVenueInfo.json
    app.get('/test-location-list', (req, res) => {
      /* Initialize the whole requested data */
      function readFileAsync(filePath) {
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(JSON.parse(data));
          });
        });
      }
      const venueInfoPath = './public/testVenueInfo.json';
      readFileAsync(venueInfoPath)
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          const venue = new Venue(data[i]);
          venue.save();
        }
        res.json(data);
      })
      .catch((err) => {
        console.error('Error reading venue file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    });














})

// start the server
// server = app.listen(5555);
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})







// app.use(bodyParser.json())
// app.use(cors())

// const port = process.env.PORT || 5555
// let LOCATION_LIST = []
// let USER_LIST = []
// let COMMENT_LIST = []

// /* Initialize the whole requested data */
// function readFileAsync(filePath) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(JSON.parse(data));
//     });
//   });
// }

// const venueInfoPath = './public/testVenueInfo.json';
// const userInfoPath = './public/testUserInfo.json';
// const commentListPath = './public/testCommentList.json';

// readFileAsync(venueInfoPath)
// .then((data) => {
//   LOCATION_LIST = data;
// })
// .catch((err) => {
//   console.error('Error reading venue file:', err);
// });

// readFileAsync(userInfoPath)
// .then((data) => {
//   USER_LIST = data;
// })
// .catch((err) => {
//   console.error('Error reading user file:', err);
// });

// readFileAsync(commentListPath)
// .then((data) => {
//   COMMENT_LIST = data;
// })
// .catch((err) => {
//   console.error('Error reading user file:', err);
// });

// /* Initialize the whole requested data */

// // Visit the home page
// app.get('/location-list', (req, res) => {
//   try {
//     const modifiedList = LOCATION_LIST.map(item => {return {ID: item.ID, info: item.info}});
//     res.json(modifiedList);
//   } catch (err) {
//     console.error('Error parsing JSON:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Visit any location page
// app.get('/location-page/:locationID', (req, res) => {
//   const id = req.params.locationID
//   const data = {
//     location: LOCATION_LIST[id],
//     comments: COMMENT_LIST[id].commentList
//   }
//   try {
//     res.json(data);
//   } catch (err) {
//     console.error('Error parsing JSON:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// })

// // Log in
// app.post('/api/login', async (req, res) => {
//   const { userName, password } = req.body;
//   // Authenticate user with email and password
//   for (let i = 0; i < USER_LIST.length; i++) {
//     const user = USER_LIST[i];
//     if (user.userName === userName) {
//       if (user.password === password) {
//         return res.status(200).json({user/*, idToken*/});
//       } else {
//         res.status(401).json({ message: 'Authentication failed. Please try again.' });
//         return;
//       }
//     } else {
//       continue;
//     }
//   }
//   res.status(401).json({ message: 'No user credential found. Please sign up.' });
// });

// // Sign up
// app.post('/api/signup', async (req, res) => {
//   // 往数据库里添加信息你们写吧
//   // 记得检测有无同名
// })

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`)
// })
