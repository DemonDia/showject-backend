// ==================imports==================
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


// ==================configure a[p settings==================
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


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

app.use("/api/users",require("./Routes/UserRoutes"))
// projects
app.use("/api/projects",require("./Routes/ProjectRoutes"))

// ==================port listeneer==================

app.listen(8000, () => {
    console.log("OK");
});