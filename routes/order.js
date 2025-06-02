const express = require("express");
const ordersController = require("../controllers/order");
const routes = express.Router();

routes.post("/create-order", ordersController.createOrder);

routes.get("/orders", ordersController.getOrdersPage);

module.exports = routes;
