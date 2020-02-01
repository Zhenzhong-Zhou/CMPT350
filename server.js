const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");
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
const adminIndexRouter = require("./routes/admin/index");
const adminPageRouter = require("./routes/admin/pages");
const adminCategoryRouter = require("./routes/admin/categories");
const adminProductRouter = require("./routes/admin/products");

// View engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Static public folder
app.use(express.static("public"));

// Get page model
const Page = require("./models/admin/page");

// Get all pages
Page.find({}).sort({sorting: 1}).exec((err, pages) => {
    if (err) {
        console.log(err);
    }else {
        app.locals.pages = pages;
    }
});

// Body parser middleware
// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}));

// Express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Method Overrider Library
app.use(methodOverride("_method"));

// app use routers
app.use("/", indexRouter);
app.use("/admin", adminIndexRouter);
app.use("/admin/pages", adminPageRouter);
app.use("/admin/categories", adminCategoryRouter);
app.use("/admin/products", adminProductRouter);

let port = 3000;
app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port " + port + "...");
});