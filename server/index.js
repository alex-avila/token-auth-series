const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(bodyParser.json());

//connect to db
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/todo-auth-example",
    {useMongoClient: true},  // helps get rid of deprecation warnings
    (err) => {
        if (err) throw err;
        console.log("Connected to the database");
    }
);

// Make the app use the express-jwt authentication middleware on anything starting with "/api"
app.use("/api", expressJwt({secret: process.env.SECRET}));

// Add `/api` before your existing `app.use` of the todo routes.
// This way, it must go through the express-jwt middleware before accessing any todos
app.use("/api/todo", require("./routes/todo.js"));

app.use("/auth", require("./routes/auth.js"));

app.listen(PORT, () => {
    console.log(`[+] Starting server on port ${PORT}`);
});
