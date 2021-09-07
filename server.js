if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const config = require("./config/database");

// // Connect to database
// mongoose.connect(config.database, {useNewUrlParser: true});
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("Connected to MongoDB....");
// });

// Initialize app
const app = express();

// Set up admin routes
const adminIndexRouter = require("./routes/admin/index");
const adminPageRouter = require("./routes/admin/pages");
const adminCategoryRouter = require("./routes/admin/categories");
const adminProductRouter = require("./routes/admin/products");

// Set up user routes
const userPageRouter = require("./routes/user/pages");
const userProductRouter = require("./routes/user/products");

// View engine setup
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Static public folder
app.use(express.static("public"));

// Get page model
const Page = require("./models/page");

// Get all pages
Page.find({}).sort({sorting: 1}).exec((err, pages) => {
    if (err) {
        console.log(err);
    }else {
        app.locals.pages = pages;
    }
});

// Get category model
const Category = require("./models/category");

// Get all categories
Category.find((err, categories) => {
    if (err) {
        console.log(err);
    }else {
        app.locals.categories = categories;
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

// App use admin routers
app.use("/admin", adminIndexRouter);
app.use("/admin/pages", adminPageRouter);
app.use("/admin/categories", adminCategoryRouter);
app.use("/admin/products", adminProductRouter);

// App use user routers
app.use("/", userPageRouter);
app.use("/products", userProductRouter);

// use setting.js or .env may include sensitive info
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)))
    .catch((error) => console.log(error));

mongoose.set("useFindAndModify", false);