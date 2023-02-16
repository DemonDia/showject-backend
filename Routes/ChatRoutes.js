// ===========================express and router===========================
const express = require("express");
const router = express.Router();

// ===========================import routes===========================
const {
    createChat,
    getUserChat,
    getChatById,
    sendMessage,
    deleteChat,
} = require("../Controllers/ChatController");
const { protection } = require("../Middleware/protectionMiddleware");

// ===========================all routes===========================
// =========================Create=========================
// 1) Create a chat with another user
// takes in userIds[] --> 2 only
router.post("/", createChat);

// =========================Read=========================
// 1) Get all chats of a said user
// for each chat, return the following:
// userProfile of the other user
// last message of the chat
router.get("/user/:userId", protection, getUserChat);
// 2) get a specific chat of user
router.get("/c/:chatId/u/:userId", protection, getChatById);

// =========================Update=========================
// 1) Send a message 
router.put("/message/",protection,sendMessage)

// =========================Delete=========================
// 1) Delete a chat
router.delete("/", protection, deleteChat);

// ===========================routes===========================
module.exports = router;
