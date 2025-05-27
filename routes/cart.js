const express = require("express");
const cartController = require("../controllers/cart");

const routes = express.Router();

routes.get("/cart", cartController.getCartPage);

routes.post("/add-to-cart", cartController.hanldeAddToCart);

routes.post("/delete-item-from-cart", cartController.handleDelete);

routes.post("/delete-item-from-cart", cartController.handleDelete);

module.exports = routes;
