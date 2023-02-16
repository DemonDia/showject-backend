const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    messages: {
        type: Array,
        required: true,
    },
});
module.exports = mongoose.model("Message", messageSchema);
