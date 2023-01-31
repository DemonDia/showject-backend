const mongoose = require("mongoose");
const projectSchema = mongoose.Schema({
    // name of project
    projectName: {
        type: String,
        required: true
    },

    // id of OP (Original Poster)
    userId:{
        type:String,
        required:true
    },

    // description of project (may or may not be in point form)
    projectDescription: {
        type: String,
        required: false
    },

    // picture/preview of the project, stored in bits
    projectPicture: {
        type: String,
        required: false
    },

    // user's project links (Object array)
    // projectLink:
        // linkName
        // url
    projectLinks: {
        type: Array,
        required: true
    },

    // statuses:
        // 1: get feedback/test
        // 2: finding manpower
        // 3: finding investor
    status: {
        type: Number,
        required: true
    },

    // likes: stores userId
    likes:{
        type: Array,
        required:true
    },

    // comments:
    // comment:
        // id (id of comment)
        // commenterId (userId of commenter)
        // commentDate (date which comment was made)
        // commentContent (what is the comment)
    comments:{
        type:Array,
        require:true
    }

});

module.exports = mongoose.model("Project", projectSchema);