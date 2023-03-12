const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
    projectId: {
        type: String,
        required: true,
    },
    commenterId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    commentDate: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
