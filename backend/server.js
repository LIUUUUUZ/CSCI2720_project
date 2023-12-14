const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
// import adminServer from './adminServer.js'


// (testing) import the User model


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
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => {
    console.log('DB connection successful');
    console.log('Server is online. ')
    
    // Venue Schema
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
    User = require('./userSchema.js');


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

    //删评论
    app.delete('/api/delete-comment/:commentId', (req, res) => {
      const id = req.params.commentId;
      Venue.findOne({comments: {$elemMatch: {ID: id}}}).then(venue => {
        venue.comments = venue.comments.filter(comment => comment.ID != id);
        venue.save();
        res.json(venue.comments);
      }).catch(err => {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
    });

 // Sign-up
    app.post('/api/signup', async (req, res) => {
        try {
            console.log('Received Request Body:', req.body);
            const username = req.body.userName;
            const password = req.body.password;
            console.log('username:', username, 'password:', password);
            // Check if the username is already taken
            const existingUser = await User.findOne({username:username });
            if (existingUser) {
                return res.status(401).json({ message: 'The user already exists. Please log in.' });
            }

            // // Create a new user using testing data without hashing the password
            // const newUser = new User({
            //     username,
            //     password, // Store the password as plain text
            //     isAdmin: false,
            //     favoriteVenueID: []
              // }); //unique??????

            // Save the user to the database
            const user = new User({
              username: username,
              password: password,
              isAdmin: false,
              favoriteVenueID: []
            })
            await user.save();
            res.json({
              username: user.username,
              isAdmin: user.isAdmin,
              favoriteVenueID: user.favoriteVenueID
            })
            // await newUser.save();

            // Return the user information in the response
            // res.send({
            //     // username: newUser.username,
            //     // isAdmin: newUser.isAdmin,
            //     // favoriteVenueID: newUser.favoriteVenueID
            //     // username: user.username,
            //     // isAdmin: user.isAdmin,
            //     // favoriteVenueID: user.favoriteVenueID
            //     // test
            //     userName: 'test',
            //     isAdmin: false,
            //     favoriteVenueID: []
            // });
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
// Log-in
    app.post('/api/login', async (req, res) => {
        try {
            const username = req.body.userName;
            const password = req.body.password;
            console.log('Received Request Body:', req.body);
            // Check if the user exists by find the username in database
            User.findOne({username:username}).then(user => {
              if (!user) {
                return res.status(401).json({ message: 'The user does not exist. Please sign up.' });
              }
              else {
                // console.log('username:', username, 'password:', password)
                // Check if the password is correct
                const isPasswordValid = (password==user.password);
                if (!isPasswordValid) {
                  return res.status(401).json({ message: 'Wrong password. Please try again.' });
                }
                else {
                  // console.log({
                  //   username: user.username,
                  //   isAdmin: user.isAdmin,
                  //   favoriteVenueID: user.favoriteVenueID
                  //   });
                  // console.log(user);
                  return res.status(200).json({user/*, idToken*/});
                }
              }
            }).catch(err => {
              console.error('Error parsing JSON:', err);
              res.status(500).json({ error: 'Internal Server Error' });
            });

            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
// Favourite-list
     app.post('/api/add-favorite', async (req, res) => {
       try {
           const { username, locationID } = req.body;
           const user = await User.findOne({ username });

           // Check if the location is already in the favorite list, if existed, remove
           if (user.favoriteVenueID.includes(locationID)) {
               const index = user.favoriteVenueID.indexOf(locationID);
               if (index > -1) { // only splice when item is found
                   user.favoriteVenueID.splice(index, 1);
               }
           }
           //else add
           else user.favoriteVenueID.push(locationID);

           await user.save();

           // Return the updated favorite list in the response
           res.json({ favoriteVenueID: user.favoriteVenueID });
       } catch (error) {
           console.error(error);
           res.status(500).json({ error: 'Internal server error' });
       }
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
    // 存入测试数据 testUserInfo.json
    app.get('/test-user-list', (req, res) => {
        const filePath = './public/testUserInfo.json';

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

        readFileAsync(filePath)
            .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    // Create a new user instance and save it to the database
                    const user = new User(data[i]);
                    user.save();
                }
                res.json(data);
            })
            .catch((err) => {
                console.error('Error reading user file:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });



// COPIED FROM ADMINSERVER

    // create user
    app.post('/admin/users', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json({ message: `New user ${user.username} saved successfully!` });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }); // OK

    // read user
    app.get('/admin/users', async (req, res) => {
        
        try {
            const users = await User.find({}, '-_id -__v');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    }); // OK

    // update user
    app.patch('/admin/users/:username', async (req, res) => {
        try {
            const user = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true, runValidators: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: `User ${user.username} updated successfully!` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }); // OK No response

    // delete user
    app.delete('/admin/users/:username', async (req, res) => {
        try {
            const user = await User.findOneAndDelete({ username: req.params.username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: `User ${user.username} deleted successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }); // OK No response

    // EVENT
    // create event
    app.post('/admin/venues/:venueId/events', async (req, res) => {
        try {
            const venue = await Venue.findOne({ ID: req.params.venueId });
            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }
    
            // Generate a new unique ID for the event
            let maxEventId = 0;

      await Venue.find({}).then(venues => {
        for (let i = 0; i < venues.length; i++) {
          for (let j = 0; j < venues[i].events.length; j++) {
            if (venues[i].events[j].ID > maxEventId) {
                maxEventId = venues[i].events[j].ID;
            }
          }
        }})
            const newEventId = maxEventId + 1;
    
            const newEvent = {
                ID: newEventId,
                time: req.body.time,
                description: req.body.description,
                presenter: req.body.presenter,
                price: parseInt(req.body.price)
            };
    
            venue.events.push(newEvent);

            await venue.save();
    
            res.status(201).json({ message: `New event ${newEventId} saved successfully!` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }); // OK
    
    // read event from a venue
    // check if reading single event is necessary
    app.get('/admin/venues/:venueId/events', async (req, res) => {
        try {
            let venues = await Venue.find({});
        
        venues = venues.map(venue => {
            venue.info.eventNum = venue.events.length;
            return venue;
        });

            const venue = await Venue.findOne({ ID: req.params.venueId }, '-_id -__v');
            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }
    
            res.status(200).send(venue.events);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // read events from all venues
    app.get('/admin/venues', async (req, res) => {
        try {
            let venues = await Venue.find({});
        
        venues = venues.map(venue => {
            venue.info.eventNum = venue.events.length;
            return venue;
        });

            res.status(200).json(venues);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // update event
    app.patch('/admin/venues/:venueId/events/:eventId', async (req, res) => {
        try {
            const venue = await Venue.findOne({ ID: req.params.venueId });
            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }
    
            const eventIndex = venue.events.findIndex(e => e.ID === Number(req.params.eventId));
            if (eventIndex === -1) {
                return res.status(404).json({ message: 'Event not found' });
            }
    
            venue.events[eventIndex] = { ...venue.events[eventIndex], ...req.body };
            await venue.save();
            res.status(200).json({ message: `Event updated successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }); // OK
    

    // update venue
    app.patch('/admin/venues/:venueId', async (req, res) => {
        try {
            const venueInfo = req.body;
            const toBeUpdated = {info: venueInfo}
            const venue = await Venue.findOneAndUpdate({ ID: req.params.venueId }, toBeUpdated, { new: true, runValidators: true });
            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }
            res.status(200).json({ message: `Venue updated successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

        
    }); // OK
    
    
    // delete event
    app.delete('/admin/venues/:venueId/events/:eventId', async (req, res) => {
        try {
            const venue = await Venue.findOne({ ID: req.params.venueId });

            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }

            if (venue.events.length == 1) {
                return res.status(400).json({ message: 'Deletion failed. There is only one event left. Add more before delete it.' });
            }
    
            const eventIndex = await venue.events.findIndex(e => e.ID === Number(req.params.eventId));
            if (eventIndex === -1) {
                return res.status(404).json({ message: 'Event not found' });
            }

            await venue.events.splice(eventIndex, 1);
            
            await venue.save();
            await res.status(200).json({ message: `Event deleted successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }); // OK NO RESPONSE
    
    

    // WARNING: NOT RECOMMENDED TO USER
    // create / delete venue
    app.post('/admin/venues', async (req, res) => {
        try {
            const maxVenue = await Venue.findOne().sort({ ID: -1 });
            const newVenueId = maxVenue ? maxVenue.ID + 1 : 1;
            let maxEventId = 0; let maxCommentID = 0;

            await Venue.find({}).then(venues => {
        for (let i = 0; i < venues.length; i++) {
          for (let j = 0; j < venues[i].events.length; j++) {
            if (venues[i].events[j].ID > maxEventId) {
                maxEventId = venues[i].events[j].ID;
            }
          }
        }})

      await Venue.find({}).then(venues => {
        for (let i = 0; i < venues.length; i++) {
          for (let j = 0; j < venues[i].comments.length; j++) {
            if (venues[i].comments[j].ID > maxCommentID) {
                maxCommentID = venues[i].comments[j].ID;
            }
          }
        }})

        const newid = maxEventId + 1;
        const newcid = maxCommentID + 1;
            const venue = new Venue({ID: newVenueId,  events: [{ID: newid, time:'1970/01/01 00:00', description: 'PLEASE INITIATE THIS EVENT!', presenter: 'PLEASE INITIATE THIS EVENT!' , price: 0}], info: req.body, comments : [{text: `Greetings from admin. Welcome to ${req.body.locationName}`, userName: 'ADMIN', ID: newcid}]});
            venue.info.eventNum = 1;
            await venue.save();
            res.status(201).send(venue);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }); // OK

    app.delete('/admin/venues/:venueId', async (req, res) => {
        try {
            const venue = await Venue.findOneAndDelete({ ID: req.params.venueId });
            if (!venue) {
                return res.status(404).json({ message: 'Venue not found' });
            }
            res.status(200).json({message: `Venue ${venue} deleted successfully`});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }); // OK 
    
    

    // handle ALL requests
    app.all('/admin/*', (req, res) => {
        // send this to client
        res.send('Hello! Please check your request.');
    });

// END OF COPY




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
