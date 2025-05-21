const express = require("express");
const path = require("path");

const rootDir = require("../utils/path");

const routes = express.Router(); // This routes acts like mini express hence we can use get, post , use and other methods on it

// To parse the data express support body parser library which can be installed
routes.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

routes.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/"); // Redirection is easy in express than venilla node js - where we need to set statusCode = 302 and set location in header for redirection
});

module.exports = routes;
