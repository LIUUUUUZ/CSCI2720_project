const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
