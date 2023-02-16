const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");
const Message = require("../Models/MessageModel");

// =========================Helper functions=========================
// =========================Create=========================
// 1) Create a chat with another user
// takes in userIds[] --> 2 only
const createChat = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!userIds || userIds.length != 2) {
            return res.status(500).json({
                message: "Invalid users",
            });
        }
        const [firstUser, secondUser] = userIds;
        const getFirstUserPromise = await User.findById(firstUser);
        const getSecondUserPromise = await User.findById(secondUser);
        Promise.allSettled([getFirstUserPromise, getSecondUserPromise])
            .then(async (result) => {
                console.log(result);
                const firstUserId = result[0].value._id;
                const secondUserId = result[1].value._id;

                if (firstUserId.toString() == secondUserId.toString()) {
                    return res.status(500).json({
                        message: "Users cannot be the same",
                    });
                }
                const duplicateChat = await Chat.findOne({
                    $or: [
                        { users: [firstUserId, secondUserId] },
                        { users: [secondUserId, firstUserId] },
                    ],
                });
                console.log(duplicateChat);
                if (duplicateChat) {
                    return res.status(500).json({
                        message: "Chat exists",
                    });
                }
                const newChatPromise = Chat.create(
                    new Chat({
                        users: [firstUserId, secondUserId],
                    })
                ).then(async (newChat) => {
                    await Message.create(
                        new Message({
                            chatId: newChat._id,
                            messages: [],
                        })
                    ).then(() => {
                        return res.json({
                            message: "Chat created",
                            chatId: newChat._id,
                        });
                    });
                });
            })
            .catch((err) => {
                console.log(err);
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
const getUserChat = async (req, res) => {
    const { userId } = req.params;
    const selectedUser = await User.findById(userId);
    if (!selectedUser) {
        return res.status(404).json({
            message: "Invalid user",
        });
    }
    console.log(selectedUser._id);
    const selectedChats = await Chat.find({
        users: { $in: [selectedUser._id] },
    });
    return res.json(selectedChats);
};

// =========================Delete=========================
// 1) Delete a chat
const deleteChat = async (req, res) => {};

// =======module exports=======
module.exports = {
    createChat,
    getUserChat,
    deleteChat,
};
