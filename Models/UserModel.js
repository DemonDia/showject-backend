const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    // name of user
    name: {
        type: String,
        required: true
    },

    // user's email
    email: {
        type: String,
        required: true
    },

    // user's password
    password: {
        type: String,
        required: true
    },

    // user's profile pic, stored inbits
    profilePic: {
        type: String,
        required: false
    },

    // user's account status (activated or not)
    activated: {
        type: Boolean,
        required: true
    },

    // user's contact info (Object array)
    // contactInfo:
        // contactInfoName
        // contactInfoLink
    // Default will be email
    contactInfo:{

    }
});

module.exports = mongoose.model("User", userSchema);