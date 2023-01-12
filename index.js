const express = require("express");
const app = express();

// ==========put the routes==========
app.get("/test", (req, res) => {
    res.send("Hello");
});

app.listen(8080, () => {
    console.log("OK");
});
