const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("./config/database");

// Connect to database
mongoose.connect(config.database, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB....");
});

// Initialize app
const app = express();

// Set up routes
const indexRouter = require("./routes/user/index");
const indexAdminRouter = require("./routes/admin/pages");

// View engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Static public folder
app.use(express.static("public"));

// Body parser middleware
// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}));

// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// app use routers
app.use("/", indexRouter);
app.use("/admin", indexAdminRouter);


let port = 3000;
app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port " + port + "...");
});