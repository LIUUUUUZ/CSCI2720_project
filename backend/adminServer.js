const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://LIUUUUU:3SWeBm4LVhhc30Fi@cluster0.grwtyog.mongodb.net/'); 
// mongoose.connect('mongodb://localhost:27017/272pro')

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', async function () {
    console.log("Connection is open...");

    // creating a mongoose model
    const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: [true, "ID is required"],
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [6, 'Password must be at least 6 characters long'], 
            maxlength: [50, 'Password cannot exceed 50 characters']
        },
        isAdmin: {
          type: Boolean,
          required: true,
          default: false,
        },
        favoriteVenueID: {
          type: Array,
          required: true,
          default: []
        }
        });

    // FOR TESTING
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
                username: String,
                ID: {type: Number, unique: true},
            }]
        },
    )
    
    const Venue = mongoose.model('Venue', venueSchema, 'venues')        
    // END TESTING
        
    const User = mongoose.model("user", userSchema, "user");

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
            const venue = new Venue({ID: newVenueId,  events: [{ID: newid, time:'1970/01/01 00:00', description: 'PLEASE INITIATE THIS EVENT!', presenter: 'PLEASE INITIATE THIS EVENT!' , price: 0}], info: req.body, comments : [{text: `Greetings from admin. Welcome to ${req.body.locationName}`, username: 'ADMIN', ID: newcid}]});
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

})

// listen to port 5555
const server = app.listen(5555);
