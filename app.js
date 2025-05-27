// node-js

// ! Node JS is a javascript run time enverionment
// ! This executes javascript in server instead of web browser

// ? To run JS on browser - the JS is compiled into machine code using V8 engine - which is developed by google
// ? And the same engine is used by Node JS to run the javascript on server or any machine
// ! V8 engine is wrtitten in c++
// ? Along with JS feature - it also add some additional features like handling file systems on the server or handling databases etc

// ? Along with Adding Server side code node js is capable of doing alot of thins

// 1. Server side coding
// 2. Creating Servers
// 3. Handling Requests to server
// 4. Bussiness Logic
// 5. Sending Responses to client - maybe a html page or file or json data etc
// 6. File or database handling and much more

// Node js is a single thread runtime program which uses concept of event loop to handle async code similar to js
// The callbacks are added to even queue and when event triggers the corresponding callback is executed
// ? Along with event queue it also has worker process to handle heavy lifting code like large file transfer complex business logic etc

// ! There are some core modules which node js uses
// ? http - This is used for creating server and handling request
// ? https - this is to create Server SSL server for handling encrypted data
// ? fs - for handling file
// ? require - for importing modules
// ? path  - handling file path as its different in each os like mac or windows etc
//  ? os - for os related queries
// ? console - for consoling messages to terminal

// Lets try to create first server

// we can use http to create server - via createServer function which takes a callback function having request and response param. And this returns the server instance created -
// We need to start the server by calling listen - and make it listen to port given as param

// ! This is the native way of writing node js
// ! where we can use core module http to create server and use listen to listen to a port and create our own request response handler - doing everything manually from setting headers to deducing buffer input etc with alot of event listeners

// ? const http = require("http");
// ? const handlers = require("./venillaNodeJs/handlers");

// ? const server = http.createServer(handlers.requestHandler);

// makes the server listens to the port
// ? server.listen("3000");
// process.exit(); // This will kill the server

// ! --------------------------- Vanilla node js end ----------------------------------

// ! To mitigate above manual work We have a framework called EXPRESS JS which provides us alot of utility functions for handling request

// ! ******************************* Express JS *******************************************

//  Core modules
const http = require("http");
const path = require("path");

// External libraries
const express = require("express");
const bodyParser = require("body-parser");

// Relative imports
const shopExports = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const cartRoutes = require("./routes/cart");
const errorControler = require("./controllers/error");

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

// ! Adding routes
app.use("/admin", adminRoutes);
app.use(shopExports);
app.use(cartRoutes);

// ! Handling Error page
app.use("/", errorControler.get404Page);

const server = http.createServer(app);
server.listen("3000");

// We can do this using app.listen which in tern execute both line for creating server and listening to the port
// app.listen("3000");
