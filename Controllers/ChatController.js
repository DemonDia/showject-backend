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
                await Chat.create(
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
    const selectedChats = await Chat.find({
        users: { $in: [selectedUser._id] },
    });

    let otherUsers = []; //capture ID
    selectedChats.forEach((chat) => {
        // get the users of each chat
        // remove yourself
        const { users } = chat;
        otherUsers.push({
            _id: [
                users.filter((user) => {
                    return user != userId;
                })[0],
            ],
        });
    });

    let returnChats = [];
    await User.find({ _id: { $in: otherUsers } }).then((users) => {
        users.forEach((user, index) => {
            // in each instance, return the following:
            // chatId
            // userId (of user other than u)
            const { _id, name } = user;
            returnChats.push({
                chatId: selectedChats[index]._id,
                otherUser: {
                    _id,
                    name,
                },
            });
        });
    });
    return res.json(returnChats);
};

// 2) Get all chats of a said user
// get the messages of a specific chat by ID
const getChatById = async (req, res) => {
    const { chatId, userId } = req.params;
    const selectedUserPromise = await User.findById(userId);
    const selectedChatPromise = await Chat.findById(chatId);
    const selectedMessagePromise = await Message.findOne({ chatId: chatId });
    Promise.allSettled([
        selectedUserPromise,
        selectedChatPromise,
        selectedMessagePromise,
    ]).then(async (result) => {
        const [selectedUserResult, seletedChatResult, selectedMessagesResult] =
            result;
        const selectedUser = selectedUserResult.value;
        const selectedChat = seletedChatResult.value;
        const selectedMessages = selectedMessagesResult.value;
        const chatUsers = selectedChat.users;

        const otherUser = await User.findById(
            chatUsers.filter((user) => {
                return user != userId;
            })[0]
        );

        // check if user is inside chat
        if (!selectedUser || !otherUser) {
            return res.status(404).json({
                message: "Invalid Users",
            });
        }

        if (!selectedChat) {
            return res.status(404).json({
                message: "Invalid Chat",
            });
        }

        if (!chatUsers.includes(selectedUser._id)) {
            res.status(500).json({
                message: "Forbidden",
            });
        }
        // by right: name, id and profile pic
        const { name, _id } = otherUser;

        return res.json({
            messages: selectedMessages.messages,
            otherUser: {
                name,
                _id,
            },
        });
    });
};

// 3) Get chat by user
const getChatByUsers = async (req, res) => {
    const { userId1, userId2 } = req.params;
    console.log(userId1, userId2);
    const getFirstUserPromise = await User.findById(userId1);
    const getSecondUserPromise = await User.findById(userId2);
    try {
        Promise.allSettled([getFirstUserPromise, getSecondUserPromise]).then(
            async (promiseResults) => {
                const firstUserId = promiseResults[0].value._id;
                const secondUserId = promiseResults[1].value._id;
                if (firstUserId.toString() == secondUserId.toString()) {
                    return res.status(500).json({
                        message: "Users cannot be the same",
                    });
                }
                const usersChat = await Chat.findOne({
                    $or: [
                        { users: [firstUserId, secondUserId] },
                        { users: [secondUserId, firstUserId] },
                    ],
                });
                if (!usersChat) {
                    return res.status(404).json({ message: "Chat not found" });
                }
                return res.json(usersChat);
            }
        );
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};

// =========================Update=========================
// 1) Send a message
// check if user is valid
// check if chat is valid
const sendMessage = async (req, res) => {
    const { userId, chatId, message,sentDate } = req.body;
    try {
        const checkValidUserPromise = await User.findById(userId);
        const checkValidChatPromise = await Chat.findById(chatId);
        const checkMessagePromise = await Message.findOne({ chatId });
        Promise.allSettled([
            checkValidUserPromise,
            checkValidChatPromise,
            checkMessagePromise,
        ]).then((promiseResults) => {
            const [
                checkValidUserPromiseResult,
                checkValidChatPromiseResult,
                checkMessagePromiseResult,
            ] = promiseResults;
            const { value: userValue } = checkValidUserPromiseResult;
            const { value: chatValue } = checkValidChatPromiseResult;
            const { value: messageValue } = checkMessagePromiseResult;
            console.log("userValue", userValue);
            console.log("chatValue", chatValue);
            console.log("messageValue", messageValue);
            // check if all exist
            if (!userValue || !chatValue || !messageValue) {
                return res.status(500).json({
                    message: "Error",
                });
            }

            // check if user is inside chat
            const { users } = chatValue;
            if (!users.includes(userId)) {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }

            // add a message:
            // message
            const newMessage = {
                userId,
                message,
                sentDate
            };
            messageValue.messages.push(newMessage);
            messageValue.save();
            return res.json({
                message: "Message sent",
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err,
        });
    }
};

// =========================Delete=========================
// 1) Delete a chat
const deleteChat = async (req, res) => {};

// =======module exports=======
module.exports = {
    createChat,
    getUserChat,
    getChatById,
    getChatByUsers,
    sendMessage,
    deleteChat,
};
