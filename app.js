// ? Note: The above code is a basic setup for an Express application with MongoDB integration using Mongoose.

//  Core modules
const path = require("path");

// External libraries
const express = require("express");
const bodyParser = require("body-parser");

// Mongo DB Object Document Mapper
const mongoose = require("mongoose");

// Routes imports
const shopExports = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const errorControler = require("./controllers/error");

// User Model Import
const User = require("./modals/user");

// ! Initializing app
const app = express();

// ! Setting Template Engine
app.set("views", "./views");
app.set("view engine", "ejs");

// ! Adding body parser to the middlewre
// This body parser adds body to request object where the staturure is key value pair - while in node js we need to listen to data and end events on req to get the input
app.use(bodyParser.urlencoded({ extended: false }));

//! making static files available for node js - like css images files
// While using css we can use link tag in head of html use href of the path of file inside public folder
app.use(express.static(path.join(__dirname, "public")));

// Express itself is a function which provides us app with additional utilityies which is actually a request response handler

// On app we can have multiple utilities invoked, one such is use

// app.use takes optional path param followed by multiple req res handler - which takes 3 param - req, res, next
// the app.use is executed in the order they are defined from top to bottom
// by calling next - the control shifts to next app.use
// res.send is used as res.write in vanilla node js

// These are called middleware functions which transforms the request response

// Middleware is executed for incoming request not for server starting
app.use((req, res, next) => {
  User.findById(currentUser._id)
    .then((user) => {
      // This will help with all the class methods
      req.user = user; // user will be the mongoose object hence it can be assigned directly without any modification
      next();
    })
    .catch((err) => console.log(err));
});

// ! Adding routes
app.use("/admin", adminRoutes);
app.use(shopExports);
app.use(cartRoutes);
app.use(orderRoutes);

// ! Handling Error page
app.use("/", errorControler.get404Page);
let currentUser = null;

mongoose
  .connect(
    "mongodb+srv://sush_mongo:rlRxRyzJFe4BmWfr@cluster0.m6exljw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    return User.findOne();
  })
  .then((user) => {
    if (!user) {
      // create mongoose model instance for user
      // and call save method to save it in the database
      const user = new User({
        name: "Admin",
        email: "admin@email.com",
        phone: "1234567890",
        cart: { items: [] },
      });
      return user.save();
    } else {
      return user;
    }
  })
  .then((user) => {
    currentUser = user;
    app.listen("3000");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
