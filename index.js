// ==================imports==================
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ==================configure a[p settings==================
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

// ==================connect to mongoose==================
async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Connected");
    } catch (error) {
        console.log(error);
    }
}

connect();

// ==================use the routes==================
// =========test routes=========
app.get("/api", (req, res) => {
    res.send("Hello");
});

// =========main routes=========
// users
app.use("/api/users", require("./Routes/UserRoutes"));
// projects
app.use("/api/projects", require("./Routes/ProjectRoutes"));
// chats
app.use("/api/chats", require("./Routes/ChatRoutes"));
// comments
app.use("/api/comments", require("./Routes/CommentRoutes"));

// ==================port listeneer==================

const server = app.listen(8000, () => {
    console.log("OK");
});

// ==================sockets==================
const io = require("socket.io")(server, {
    cors: { origin: process.env.FRONTEND_URL },
});

let users = [];

const addUser = (userId, socketId) => {
    console.log("userId, socketId", userId, socketId);
    // only add unique
    if (
        userId &&
        !users.some((user) => user.Id == userId || user.socketId == socketId)
    ) {
        users.push({ userId, socketId });
    }
};

const removeUser = (socketId) => {
    users = users.filter((user) => {
        return user.socketId !== socketId;
    });
};

const getUser = (userId) => {
    return users.find((user) => user.userId == userId);
};

io.on("connection", (socket) => {
    console.log("user connected");
    console.log(socket.id);

    // connect new user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // remove user
    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    // send & get msg
    socket.on("sendMessage", (sentMessage) => {
        const { message, receiverId } = sentMessage;
        const user = getUser(receiverId);
        io.to(socket.id).emit("getMessage", message);
        io.to(user.socketId).emit("getMessage", message);
    });
});
