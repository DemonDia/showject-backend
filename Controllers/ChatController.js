const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");

// =========================Helper functions=========================
// =========================Create=========================
// 1) Create a chat with another user
// takes in userIds[] --> 2 only
const createChat = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!userId || userId.length != 2) {
            return res.status(500).json({
                message: "Invalid users",
            });
        }
        const [firstUser, secondUser] = userIds;
        const getFirstUserPromise = await User.findById(firstUser);
        const getSecondUserPromise = await User.findById(secondUser);
        Promise.allSettled([getFirstUserPromise, getSecondUserPromise])
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                return res.status(500).json({
                    message: err,
                });
            });
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};
// =========================Read=========================
// 1) Get all chats of a said user
// for each chat, return the following:
// userProfile of the other user
// last message of the chat
const getUserChat = async (req, res) => {};

// =========================Delete=========================
// 1) Delete a chat
const deleteChat = async (req, res) => {};

// =======module exports=======
module.exports = {
    createChat,
    getUserChat,
    deleteChat,
};
