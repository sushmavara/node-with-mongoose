const express = require("express");
const path = require("path");

const rootDir = require("../utils/path");

const routes = express.Router();

routes.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = routes;
